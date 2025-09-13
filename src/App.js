import React, { useEffect, useState } from "react";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./theme";
import Login from "./Login";
import MainApp from "./MainApp";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(() => localStorage.getItem("theme")==="dark");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser)=>{
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    localStorage.setItem("theme", !isDark ? "dark":"light");
  }

  if (loading) return <div>Loading...</div>;

  return (
    <ThemeProvider theme={isDark?darkTheme:lightTheme}>
      {user ? <MainApp user={user} toggleTheme={toggleTheme} isDark={isDark} /> : <Login />}
    </ThemeProvider>
  );
}
