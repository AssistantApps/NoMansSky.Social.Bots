import crypto from 'crypto';

export const encrypt = (key: string, value: string): string => {
    const algorithm = 'aes256';

    const cipher = crypto.createCipher(algorithm, key);
    const encrypted = cipher.update(value, 'utf8', 'hex') + cipher.final('hex');

    return encrypted;
}

export const decrypt = (key: string, encrypted: string): string => {
    const algorithm = 'aes256';
    const decipher = crypto.createDecipher(algorithm, key);
    const decrypted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');

    return decrypted;
}