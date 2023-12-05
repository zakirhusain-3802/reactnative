// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCPJfu9-MegrNJi3AHd_gl3IDp-w4l8te8",
  authDomain: "yasma-74ad1.firebaseapp.com",
  projectId: "yasma-74ad1",
  storageBucket: "yasma-74ad1.appspot.com",
  messagingSenderId: "936340748758",
  appId: "1:936340748758:web:da231d1fe9e5725f7b4c77",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
