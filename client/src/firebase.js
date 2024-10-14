// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-4f84e.firebaseapp.com",
  projectId: "mern-blog-4f84e",
  storageBucket: "mern-blog-4f84e.appspot.com",
  messagingSenderId: "88614578098",
  appId: "1:88614578098:web:c5527d0339e69f1db1a6ab"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);