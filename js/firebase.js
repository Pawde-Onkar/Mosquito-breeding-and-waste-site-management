// ✅ Firebase core imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC_YaGTyQbCkRbdLlKBiyw8lHyxPTa9G9o",
  authDomain: "eco-clean-7bd6d.firebaseapp.com",
  projectId: "eco-clean-7bd6d",
  storageBucket: "eco-clean-7bd6d.firebasestorage.app",
  messagingSenderId: "31293808247",
  appId: "1:31293808247:web:3eb83b37ff745007b2b072",
  measurementId: "G-P76NB77KVS"
};

// ✅ Initialize Firebase and export for others to use
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
