import CryptoJS from 'crypto-js';

export const encrypt = (secretKey: string, text: string): string => {
    const ciphertext = CryptoJS.AES.encrypt(text, secretKey);
    return ciphertext.toString();
}

export const decrypt = (secretKey: string, ciphertext: string): string => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
}