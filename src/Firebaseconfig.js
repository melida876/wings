// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyArdJkXt358umAu3vyin1Ak6tdXcl-CoQI",
  authDomain: "wings-cafe-21540.firebaseapp.com",
  databaseURL: "https://wings-cafe-21540-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "wings-cafe-21540",
  storageBucket: "wings-cafe-21540.firebasestorage.app",
  messagingSenderId: "585058982895",
  appId: "1:585058982895:web:f06b4f65a71b390689b41a",
  measurementId: "G-9PZ4GK9RRY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);