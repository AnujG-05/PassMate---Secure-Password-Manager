import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBTJzqBU6UWDGN3D-jVaGSOECDfur4d_SI",
  authDomain: "passmate-b6bf0.firebaseapp.com",
  projectId: "passmate-b6bf0",
  storageBucket: "passmate-b6bf0.appspot.com",
  messagingSenderId: "459573470267",
  appId: "1:459573470267:android:d938091f8d1ec0a8bd281e",
  databaseURL: "https://passmate-b6bf0-default-rtdb.asia-southeast1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
