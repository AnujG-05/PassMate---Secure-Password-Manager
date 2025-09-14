# 🔐 PassMate – Secure Password Manager

PassMate is a **secure, user-friendly password manager** built with **React** and **Firebase**. It allows users to store, manage, and generate passwords, with AES encryption, 2FA TOTP support, and real-time vault synchronization.

---

## 🚀 Features

- **AES-Encrypted Vault**: All credentials are encrypted using your Master Password.  
- **Master Key Session Control**: Unlock your vault per session.  
- **2FA TOTP Generator**: Generate time-based one-time passwords for extra security.  
- **Password Strength Meter**: Encourages strong password creation using `zxcvbn`.  
- **Google & Email Login**: Secure authentication via Firebase Auth.  
- **Export Vault**: Export all credentials in JSON (decrypted) for backup.  
- **Gamification**: Earn points and badges for secure behavior.  
- **Voice Search**: Search vault items via speech recognition.  
- **Dark/Light Theme**: Toggle for user preference.  

---

## 💻 Tech Stack

- **Frontend**: React, Styled-Components  
- **Backend**: Firebase (Auth + Firestore + Hosting)  
- **Security**: AES Encryption (`crypto-js`), TOTP (`otplib`)  
- **Other Libraries**: `zxcvbn` for password strength, `qrcode.react` for TOTP QR  

---

## ⚙️ Setup Instructions

1. **Clone the repository**

``bash
git clone https://github.com/AnujG-05/PassMate-Secure-Password-Manage.git


📂 Project Structure

passmate/
 ├── public/                 # Static assets
 ├── src/                    # React components & utils
 │    ├── App.js
 │    ├── firebase.js
 │    ├── MainApp.js
 │    └── utils/
 ├── .gitignore
 ├── firebase.json            # Firebase Hosting config
 ├── .firebaserc             # Firebase project alias
 ├── package.json
 ├── package-lock.json
 └── README.md

