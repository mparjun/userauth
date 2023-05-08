const crypto = require("crypto");
const algorithm = "aes-256-cbc";
const key = crypto.randomBytes(32);
exports.encrypt = (text) => {
  const iv = crypto.randomBytes(16); // generate random initialization vector
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return {
    iv: iv.toString("hex"),
    data: encrypted.toString("hex"),
  };
};

// function to decrypt data
exports.decrypt = (text, iv) => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(iv, "hex")
  );
  let decrypted = decipher.update(Buffer.from(text, "hex"));
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

// // example usage
// const iv = encryptedData.iv;
// const encryptedText = encryptedData.data;
// const decryptedText = decrypt(encryptedText, iv);
// console.log(decryptedText);
