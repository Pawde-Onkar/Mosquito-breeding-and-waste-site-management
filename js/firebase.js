// js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyC_YaGTyQbCkRbdLlKBiyw8lHyxPTa9G9o",
  authDomain: "eco-clean-7bd6d.firebaseapp.com",
  projectId: "eco-clean-7bd6d",
  storageBucket: "eco-clean-7bd6d.appspot.com",
  messagingSenderId: "31293808247",
  appId: "1:31293808247:web:3eb83b37ff745007b2b072",
  measurementId: "G-P76NB77KVS"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// 🧩 Convert File → Base64
function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

// 🧩 Save report (with Base64 images)
export async function saveReport(reportData, files, onProgress) {
  try {
    const base64Images = [];
    for (let i = 0; i < files.length; i++) {
      const base64 = await convertToBase64(files[i]);
      base64Images.push(base64);
      if (onProgress) onProgress(i, 100);
    }

    const docRef = await addDoc(collection(db, "reports"), {
      ...reportData,
      images: base64Images,
      createdAt: serverTimestamp()
    });

    console.log("✅ Report saved with ID:", docRef.id);
    return docRef;
  } catch (error) {
    console.error("❌ Error saving report:", error);
    throw error;
  }
}
