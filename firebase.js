// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, getDocs } from 'firebase/firestore';// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBBVuMYqtxjgdA7NgEhFmIoYWI0ZYJHh1M",
  authDomain: "pantry-track-a6784.firebaseapp.com",
  projectId: "pantry-track-a6784",
  storageBucket: "pantry-track-a6784.appspot.com",
  messagingSenderId: "749369800469",
  appId: "1:749369800469:web:0627d17fbbaab0fefa5b1c",
  measurementId: "G-QSWCBB5SB0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)
