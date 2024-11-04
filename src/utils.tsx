import crypto from "crypto-js";

export function generateEncryptedKeyBody(body: any) {
  const iv = "D904363DB8DACEB8".slice(0, 16);
  try {
    const key = crypto.lib.WordArray.random(32);
    let dataPayload = JSON.stringify(body);

    const encrypted = crypto.AES.encrypt(dataPayload, key, {
      iv: crypto.enc.Utf8.parse(iv),
      mode: crypto.mode.CBC,
    });
    const encryptedHex = encrypted.ciphertext.toString();
    const keyHash = key.toString();

    return {
      hash: keyHash,
      sek: encryptedHex,
    };
  } catch (error) {
    console.error("", error);
    return null;
  }
}

export function decryptKeyBody(encryptedHex: any, keyHash: any) {
    const iv = "D904363DB8DACEB8".slice(0, 16);
    try {
        const key = crypto.enc.Hex.parse(keyHash);
        const encryptedWordArray = crypto.enc.Hex.parse(encryptedHex);
  
      const decrypted = crypto.AES.decrypt(
        { ciphertext: encryptedWordArray },
        key,
        {
          iv: crypto.enc.Utf8.parse(iv),
          mode: crypto.mode.CBC,
        }
      );
      
      const decryptedData = decrypted.toString(crypto.enc.Utf8);
      return JSON.parse(decryptedData);
    } catch (error) {
      console.error("Decryption error:", error);
      return null;
    }
  }