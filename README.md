<div align="center">

# 🔐 PassMate - Secure Password Manager

**SCREENSHOTS**
</div>
<img width="1920" height="982" alt="loginpg" src="https://github.com/user-attachments/assets/405507eb-d25f-404f-a990-bdb886c9403a" />
<img width="1920" height="1146" alt="darkmode" src="https://github.com/user-attachments/assets/cd8b6fd0-c424-466e-a877-0a5769525a0f" />
<img width="1920" height="1217" alt="day mode" src="https://github.com/user-attachments/assets/203b2f03-5f62-4174-9b32-121f35711797" />

---

## 🖥️ Demo

**Live Link:** https://passmate-b6bf0.web.app

---

## 🌟 Features

- **🛡️ Zero-Knowledge Vault:** All credentials are kept secure with client-side AES encryption.
- **🔑 Master Key Access:** Session-based access ensures your vault is only decrypted by you.
- **💪 Password Strength Indicator:** Real-time feedback on password strength using `zxcvbn`.
- **📧 Multi-Factor Authentication:** Supports both Google Sign-In and traditional Email/Password.
- **📲 TOTP 2FA Generator:** Includes a built-in QR code and secret key generator for your 2FA needs.
- **📥 Secure Vault Export:** Export your entire encrypted vault to a JSON file for backup.
- **🎤 Voice Search:** Search through your credentials hands-free using voice commands.
- **🎮 Gamified Security:** Earn points and unlock badges for practicing good security habits.
- **🎨 Theme Toggle:** Switch between a sleek dark mode and a clean light mode.

---

## 🛠️ Tech Stack

-   **Frontend:** React, Styled-Components, React-Icons
-   **Backend:** Firebase Authentication, Firestore
-   **Security:** AES encryption (CryptoJS), TOTP 2FA (otplib)
-   **Deployment:** Firebase Hosting

---

## 📂 Project Structure

-   **passmate/**
    -   `.firebaserc`
    -   `.gitignore`
    -   `firebase.json`
    -   `package-lock.json`
    -   `package.json`
    -   `README.md`
    -   **public/**
        -   `index.html`
    -   **src/**
        -   `App.css`
        -   `App.js`
        -   `App.test.js`
        -   `Login.js`
        -   `MainApp.js`
        -   `firebase.js`
        -   `index.css`
        -   `index.js`
        -   `reportWebVitals.js`
        -   `setupTests.js`
        -   `theme.js`
        -   **utils/**
            -   `crypto.js`

## 🚀 Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AnujG-05/PassMate-Secure-Password-Manager.git
   cd passmate

2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Add your Firebase config** to `src/firebase.js`.

4.  **Run the application:**
    ```bash
    npm start
    ```
