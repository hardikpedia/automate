import Cryptr from "cryptr";
require("dotenv").config();

// Create a Cryptr instance with the secret key from the environment variables
const cryptr = new Cryptr("Harrypotter");
// Function to encrypt a cookie value
export const encryptCookie = (text) => {
  if (!text) return;

  // Encrypt the text using the Cryptr instance
  const encrypted = cryptr.encrypt(text);
  return encrypted;
};

// Function to decrypt a cookie value
export const decryptCookie = (text) => {
  if (!text) return;

  // Decrypt the text using the Cryptr instance
  const decrypted = cryptr.decrypt(text);
  return decrypted;
};
