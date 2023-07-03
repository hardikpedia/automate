// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDk0Lkq4PGBdoJ4qKUr5qc4kbed86jIRwg",
  authDomain: "test2-3e18b.firebaseapp.com",
  projectId: "test2-3e18b",
  storageBucket: "test2-3e18b.appspot.com",
  messagingSenderId: "995254643243",
  appId: "1:995254643243:web:11784a6ef838b4132f586e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);