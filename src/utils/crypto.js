import CryptoJS from "crypto-js";

/**
 * Encrypts a payload object using AES.
 */
export function encryptData(payloadObj, masterPassword) {
  const json = JSON.stringify(payloadObj);
  return CryptoJS.AES.encrypt(json, masterPassword).toString();
}

/**
 * Decrypts AES-encrypted ciphertext.
 */
export function decryptData(cipherText, masterPassword) {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, masterPassword);
    const plain = bytes.toString(CryptoJS.enc.Utf8);
    if (plain && plain.startsWith('{')) return JSON.parse(plain);
    return null;
  } catch (e) {
    console.error("Decryption failed:", e);
    return null;
  }
}
