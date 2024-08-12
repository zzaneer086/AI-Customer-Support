import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // If you need authentication

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB382gYf40YrAEb3uHW2uS-zZg99kVvsVQ",
  authDomain: "ai-customer-support-f14be.firebaseapp.com",
  projectId: "ai-customer-support-f14be",
  storageBucket: "ai-customer-support-f14be.appspot.com",
  messagingSenderId: "653057328307",
  appId: "1:653057328307:web:541d7dbdc09777c8c89cc6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // If you need authentication

export { app, auth };
