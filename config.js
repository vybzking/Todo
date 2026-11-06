// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBhrDPEZcE21LWH1PDI1jCLxna_E1I3r4I",
  authDomain: "todo-dab6d.firebaseapp.com",
  projectId: "todo-dab6d",
  storageBucket: "todo-dab6d.firebasestorage.app",
  messagingSenderId: "61389664860",
  appId: "1:61389664860:web:1cdc1f4289e3fe0dbfec99",
  measurementId: "G-RFSKT9QB9P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
