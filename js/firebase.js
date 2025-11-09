
// ✅ firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, addDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyC_YaGTyQbCkRbdLlKBiyw8lHyxPTa9G9o",
  authDomain: "eco-clean-7bd6d.firebaseapp.com",
  projectId: "eco-clean-7bd6d",
  storageBucket: "eco-clean-7bd6d.firebasestorage.app",
  messagingSenderId: "31293808247",
  appId: "1:31293808247:web:3eb83b37ff745007b2b072",
  measurementId: "G-P76NB77KVS"
};


// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// ✅ Function to save report
async function saveReport(reportData, imageFile) {
  try {
    let imageUrl = "";
    if (imageFile) {
      const storageRef = ref(storage, `reports/${Date.now()}_${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      imageUrl = await getDownloadURL(storageRef);
    }

    await addDoc(collection(db, "reports"), {
      ...reportData,
      images: imageUrl ? [imageUrl] : [],
      createdAt: new Date().toISOString(),
    });

    alert("Report submitted successfully!");
  } catch (error) {
    console.error("Error saving report:", error);
    alert("Failed to submit report.");
  }
}

// ✅ Export what’s needed
export { app, db, saveReport };
