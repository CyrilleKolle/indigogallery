// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAkIfQjddOs-ia0E8Y51s4BoU1BQSTImIY",
  authDomain: "indigo-dfab9.firebaseapp.com",
  projectId: "indigo-dfab9",
  storageBucket: "indigo-dfab9.firebasestorage.app",
  messagingSenderId: "735500358933",
  appId: "1:735500358933:web:2f6d73a9d17ebdcc9a851c",
  measurementId: "G-8YWFN29S96"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);