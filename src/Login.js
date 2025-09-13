import React, { useState } from "react";
import { auth, googleProvider } from "./firebase";
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import styled, { keyframes } from "styled-components";
import { FaGoogle } from "react-icons/fa";

const fadeIn = keyframes`from { opacity:0; transform:translateY(10px);} to {opacity:1; transform:translateY(0);}`;
const Wrapper = styled.div`display:flex; flex-direction:column; justify-content:center; align-items:center; min-height:100vh; background:linear-gradient(135deg, #0f172a 0%, #0b1220 100%); color:white; font-family:'Inter', sans-serif; padding:20px;`;
const Card = styled.div`background:rgba(15,23,42,0.7); backdrop-filter:blur(10px); padding:2.5rem; border-radius:16px; border:1px solid rgba(255,255,255,0.1); box-shadow:0px 8px 32px rgba(0,0,0,0.5); width:100%; max-width:420px; text-align:center; animation:${fadeIn} 0.6s ease-out;`;
const Logo = styled.h1`font-size:2.5rem; margin-bottom:0.5rem; font-weight:800; background: linear-gradient(90deg,#22d3ee,#7c3aed); -webkit-background-clip:text; -webkit-text-fill-color:transparent;`;
const Subtitle = styled.p`color:#9aa4b2; margin-bottom:2rem;`;
const Input = styled.input`width:100%; margin:0.5rem 0; padding:14px; border:1px solid rgba(255,255,255,0.1); border-radius:8px; outline:none; font-size:1rem; background:rgba(15,23,42,0.5); color:white; transition:border-color 0.3s ease; &:focus{border-color:#7c3aed;}`;
const Button = styled.button`width:100%; margin:0.5rem 0; padding:14px; border:none; border-radius:8px; font-weight:bold; font-size:1rem; background:linear-gradient(90deg,#22d3ee,#7c3aed); color:white; cursor:pointer; transition:transform 0.2s ease, box-shadow 0.2s ease; &:hover{transform:scale(1.03); box-shadow:0 4px 20px rgba(124,58,237,0.5);}`;
const GoogleButton = styled(Button)`background:#fff; color:#0b1220; display:flex; align-items:center; justify-content:center; gap:10px; &:hover{box-shadow:0 4px 20px rgba(255,255,255,0.3);}`;
const ToggleText = styled.p`margin-top:1.5rem; color:#9aa4b2; cursor:pointer; text-decoration:underline;`;

export default function Login() {
  const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [isRegistering,setIsRegistering]=useState(false);

  const handleAuthAction=async()=>{
    try{
      if(isRegistering) await createUserWithEmailAndPassword(auth,email,password);
      else await signInWithEmailAndPassword(auth,email,password);
    }catch(err){ alert(err.message); }
  }

  const googleLogin=async()=>{
    try{ await signInWithPopup(auth,googleProvider);}catch(err){alert(err.message);}
  }

  return (
    <Wrapper>
      <Card>
        <Logo>🔐 PassMate</Logo>
        <Subtitle>Your Secure Digital Vault</Subtitle>
        <Input type="email" placeholder="Email Address" value={email} onChange={e=>setEmail(e.target.value)}/>
        <Input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)}/>
        <Button onClick={handleAuthAction}>{isRegistering ? "Register":"Login"}</Button>
        <GoogleButton onClick={googleLogin}><FaGoogle /> Sign in with Google</GoogleButton>
        <ToggleText onClick={()=>setIsRegistering(!isRegistering)}>
          {isRegistering?"Already have an account? Login":"Need an account? Register"}
        </ToggleText>
      </Card>
    </Wrapper>
  );
}
