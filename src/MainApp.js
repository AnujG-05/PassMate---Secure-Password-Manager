import React, { useEffect, useMemo, useState } from "react";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import { FaMoon, FaSun, FaTrashAlt, FaCopy, FaPlus, FaDownload, FaKey, FaTools, FaVault, FaMicrophone, FaSignOutAlt } from "react-icons/fa";
import { encryptData, decryptData } from "./utils/crypto";
import { auth, db } from "./firebase";
import { signOut } from "firebase/auth";
import { collection, addDoc, onSnapshot, deleteDoc, doc, query as firestoreQuery, where, getDoc, setDoc } from "firebase/firestore";
import zxcvbn from "zxcvbn";
import { authenticator } from "otplib";
import { QRCodeSVG } from "qrcode.react";
import sha1 from 'crypto-js/sha1';

// ---------- Global Styles ----------
const GlobalStyle = createGlobalStyle`
  body { 
    margin: 0; 
    font-family: 'Inter', sans-serif;
    transition: background .45s ease;
    background: ${p => p.theme.bg};
    color: ${p => p.theme.text};
  }
  * { box-sizing: border-box; }
`;

// ---------- Styled Components ----------
const Shell = styled.div`padding: 28px;`;
const TopBar = styled.div`display:flex; gap:16px; align-items:center; justify-content:space-between; max-width:1200px; margin: 0 auto 30px;`;
const Brand = styled.div`display:flex; gap:12px; align-items:center; h1{margin:0;font-size:clamp(22px,3vw,30px);font-weight:800;}.logo{font-size:32px; animation: floaty 4s ease-in-out infinite;}`;
const Card = styled.div`
  background:${p => p.theme.cardBg};
  border-radius:16px;
  padding:20px;
  border:1px solid ${p => p.theme.cardBorder};
  box-shadow:${p => p.theme.shadow};
`;
const Input = styled.input`
  padding:12px 16px; border-radius:10px; border:1px solid ${p => p.theme.cardBorder}; width:100%;
  background:${p => p.theme.inputBg}; color:inherit; outline:none; font-size:1rem;
  &:focus{border-color:${p=>p.theme.accent};}
`;
const Button = styled.button`
  padding:11px 18px; border-radius:10px; border:0; cursor:pointer; font-weight:700;
  color:${p=>p.theme.buttonText}; background:${p=>p.theme.buttonBg};
  display:flex; align-items:center; justify-content:center; gap:8px;
  &:hover{transform:scale(1.05);}
`;
const MainLayout = styled.div`
  max-width:1200px; margin:12px auto 40px; display:grid; grid-template-columns:280px 1fr; gap:24px;
  @media(max-width:920px){ grid-template-columns:1fr;}
`;
const VaultGrid = styled.div`display:grid; gap:16px; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));`;
const SmallText = styled.div`font-size:13px; color:${p=>p.theme.subText};`;

// ---------- Main Component ----------
export default function MainApp({ user, toggleTheme, isDark }) {
  const [masterPassword, setMasterPassword] = useState("");
  const [vaultItems, setVaultItems] = useState([]);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState({ title: "", username: "", password: "" });
  const [points, setPoints] = useState(() => Number(localStorage.getItem("pm_points") || 0));

  // 2FA state
  const [secret, setSecret] = useState("");
  const [token, setToken] = useState("");

  // Breach alerts
  const [breaches, setBreaches] = useState([]);

  // Save points
  useEffect(() => { localStorage.setItem("pm_points", String(points)); }, [points]);

  // Firestore listener
  useEffect(() => {
    if (!user?.uid) return;
    const q = firestoreQuery(collection(db, "vault"), where("userId","==",user.uid));
    const unsubscribe = onSnapshot(q, snapshot => setVaultItems(snapshot.docs.map(doc => ({id:doc.id,...doc.data()}))));
    return unsubscribe;
  }, [user]);

  // Load 2FA secret from Firestore
  useEffect(() => {
    if (!user) return;
    const loadSecret = async () => {
      const userRef = doc(db,'users',user.uid);
      const docSnap = await getDoc(userRef);
      if(docSnap.exists() && docSnap.data().totpSecret){
        setSecret(docSnap.data().totpSecret);
      } else {
        const newSecret = authenticator.generateSecret();
        await setDoc(userRef,{totpSecret:newSecret},{merge:true});
        setSecret(newSecret);
      }
    }
    loadSecret();
  },[user]);

  // TOTP token updater
  useEffect(() => {
    if(!secret) return;
    setToken(authenticator.generate(secret));
    const interval = setInterval(()=>setToken(authenticator.generate(secret)),30000);
    return ()=>clearInterval(interval);
  },[secret]);

  // Derived filtered items
  const filteredItems = useMemo(()=>vaultItems.filter(i=>{
    const decrypted = decryptData(i.data, masterPassword);
    return decrypted && decrypted.title.toLowerCase().includes(query.toLowerCase());
  }),[vaultItems, query, masterPassword]);

  const pwStrength = useMemo(()=>zxcvbn(form.password||""),[form.password]);
  const badge = useMemo(()=>{
    if(points>=100)return"🏆 Master Protector";
    if(points>=50)return"⚡ Cyber Ninja";
    if(points>=20)return"🛡️ Strong Guardian";
    return"🔰 Beginner";
  },[points]);

  // ----- Core Functions -----
  const handleAddItem = async()=>{
    if(!form.title || !form.password || !masterPassword) return alert("Fill Title, Password, Master Password.");
    const encryptedData = encryptData({title:form.title, username:form.username, password:form.password}, masterPassword);
    await addDoc(collection(db,"vault"),{data:encryptedData,userId:user.uid});
    if(pwStrength.score>=3) setPoints(p=>p+10);
    setForm({title:"",username:"",password:""});
  };

  const handleDeleteItem = async(id)=>{if(window.confirm("Delete this item?")) await deleteDoc(doc(db,"vault",id));};

  const generatePassword = ()=>{const chars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";let pwd="";for(let i=0;i<16;i++)pwd+=chars.charAt(Math.floor(Math.random()*chars.length));setForm(f=>({...f,password:pwd})); setPoints(p=>p+2);};

  const copyToClipboard = text=>{navigator.clipboard.writeText(text); alert("Copied!"); setPoints(p=>p+1);};

  const exportVault = ()=>{
    if(!masterPassword)return alert("Enter master password");
    const decryptedVault = vaultItems.map(i=>decryptData(i.data, masterPassword)).filter(Boolean);
    const blob = new Blob([JSON.stringify(decryptedVault,null,2)],{type:"application/json"});
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="passmate_vault.json";a.click();
  };

  const startListening = ()=>{
    const SpeechRecognition = window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SpeechRecognition)return alert("Speech recognition not supported.");
    const r=new SpeechRecognition();
    r.onresult=e=>setQuery(e.results[0][0].transcript);
    r.start();
  };

  // ----- Breach Detection -----
  useEffect(()=>{
    if(!masterPassword) return;
    const alerts = vaultItems.map(item=>{
      const decrypted = decryptData(item.data, masterPassword);
      if(!decrypted) return null;
      const hash = sha1(decrypted.password).toString().toUpperCase();
      const prefix = hash.slice(0,5);
      const suffix = hash.slice(5);
      return fetch(`https://api.pwnedpasswords.com/range/${prefix}`)
        .then(res=>res.text())
        .then(data=>data.split('\n').some(line=>line.startsWith(suffix)) ? decrypted.title : null);
    });
    Promise.all(alerts).then(results=>setBreaches(results.filter(Boolean)));
  },[vaultItems, masterPassword]);

  // ----- Render -----
  return (
    <>
      <GlobalStyle />
      <Shell>
        <TopBar>
          <Brand>
            <div className="logo">🔐</div>
            <h1>PassMate</h1>
          </Brand>
          <div style={{display:'flex', gap:'16px',alignItems:'center'}}>
            <SmallText>Welcome, {user.displayName||user.email}</SmallText>
            <Button onClick={toggleTheme}>{isDark?<FaSun/>:<FaMoon/>}</Button>
            <Button onClick={()=>signOut(auth)}><FaSignOutAlt/> Logout</Button>
          </div>
        </TopBar>

        <MainLayout>
          {/* SIDEBAR */}
          <div style={{display:'flex', flexDirection:'column', gap:'20px'}}>
            <Card style={{borderLeft:'6px solid #22d3ee'}}>
              <h3><FaKey/> Master Key</h3>
              <SmallText>Enter this key to unlock your vault.</SmallText>
              <Input type="password" placeholder="Master Password" value={masterPassword} onChange={e=>setMasterPassword(e.target.value)} />
            </Card>

            <Card style={{borderLeft:'6px solid #facc15'}}>
              <h3><FaTools/> Vault Tools</h3>
              <div style={{position:'relative'}}>
                <Input placeholder="Search vault..." value={query} onChange={e=>setQuery(e.target.value)} disabled={!masterPassword}/>
                <FaMicrophone onClick={startListening} style={{cursor:'pointer',position:'absolute',right:'12px',top:'12px',color:'#9aa4b2'}}/>
              </div>
              <Button onClick={exportVault} disabled={!masterPassword} style={{marginTop:'12px'}}><FaDownload/> Export Vault</Button>
            </Card>

            <Card style={{borderLeft:'6px solid #f87171'}}>
              <h3>Security Dashboard</h3>
              <SmallText>Your Points: <strong>{points}</strong></SmallText>
              <SmallText>Badge: <strong>{badge}</strong></SmallText>
              <hr style={{border:'none',borderTop:`1px solid ${isDark?'#334155':'#e2e8f0'}`,margin:'12px 0'}}/>
              <h4>Breach Alerts</h4>
              {breaches.length>0 ? breaches.map(title=><SmallText style={{color:'#f87171'}} key={title}>⚠️ Password leaked for "{title}"</SmallText>) : <SmallText>No breaches detected ✅</SmallText>}
            </Card>
          </div>

          {/* MAIN CONTENT */}
          <div>
            <Card>
              <h3>Add New Credential</h3>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px'}}>
                <Input placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/>
                <Input placeholder="Username / Email" value={form.username} onChange={e=>setForm({...form,username:e.target.value})}/>
                <div style={{gridColumn:'1/-1', display:'flex', gap:'12px'}}>
                  <Input placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
                  <Button onClick={generatePassword}><FaKey/> Generate</Button>
                </div>
              </div>
              {form.password && <SmallText>Strength: {pwStrength.score}/4 {pwStrength.feedback.warning}</SmallText>}
              <Button onClick={handleAddItem} style={{marginTop:'12px'}}><FaPlus/> Add to Vault</Button>
            </Card>

            <h2>Your Vault</h2>
            {!masterPassword ? <Card><SmallText>Enter master password to view vault.</SmallText></Card> :
              filteredItems.length===0 ? <Card><SmallText>No items found.</SmallText></Card> :
              <VaultGrid>
                {filteredItems.map(item=>{
                  const decrypted = decryptData(item.data, masterPassword);
                  if(!decrypted) return null;
                  return (
                    <Card key={item.id}>
                      <div style={{display:'flex',justifyContent:'space-between'}}>
                        <strong>{decrypted.title}</strong>
                        <FaTrashAlt style={{cursor:'pointer',color:'#f87171'}} onClick={()=>handleDeleteItem(item.id)}/>
                      </div>
                      <SmallText>{decrypted.username}</SmallText>
                      <Button onClick={()=>copyToClipboard(decrypted.password)}><FaCopy/> Copy Password</Button>
                    </Card>
                  );
                })}
              </VaultGrid>
            }

            {/* 2FA TOTP */}
            <Card style={{marginTop:'24px'}}>
              <h3>2FA Token Generator</h3>
              <SmallText>Scan QR or enter secret key manually.</SmallText>
              <div style={{display:'flex',gap:'20px',alignItems:'center',marginTop:'16px'}}>
                {secret && <QRCodeSVG value={authenticator.keyuri("user@passmate.com","PassMate",secret)} size={128}/>}
                <div>
                  <SmallText>Secret Key:</SmallText>
                  <code style={{background:'#1e293b',padding:'4px 8px',borderRadius:'6px',color:'#e6eef8',display:'block',margin:'4px 0 12px'}}>{secret}</code>
                  <h2 style={{fontSize:'2.5rem',color:'#22d3ee'}}>{token}</h2>
                </div>
              </div>
              <Button onClick={async()=>{
                const newSecret = authenticator.generateSecret();
                await setDoc(doc(db,'users',user.uid),{totpSecret:newSecret},{merge:true});
                setSecret(newSecret);
              }} style={{marginTop:'16px'}}>Generate New Secret</Button>
            </Card>

          </div>
        </MainLayout>
      </Shell>
    </>
  );
}
