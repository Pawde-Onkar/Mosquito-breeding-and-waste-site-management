// ✅ firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_YaGTyQbCkRbdLlKBiyw8lHyxPTa9G9o",
  authDomain: "eco-clean-7bd6d.firebaseapp.com",
  projectId: "eco-clean-7bd6d",
  storageBucket: "eco-clean-7bd6d.appspot.com",
  messagingSenderId: "31293808247",
  appId: "1:31293808247:web:3eb83b37ff745007b2b072",
  measurementId: "G-P76NB77KVS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🧠 Optional: Compress image before upload
function compressImage(file, maxWidth = 800, maxHeight = 800, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = e => { img.src = e.target.result; };
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // resize while maintaining aspect ratio
      if (width > height && width > maxWidth) {
        height = height * (maxWidth / width);
        width = maxWidth;
      } else if (height > maxHeight) {
        width = width * (maxHeight / height);
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(blob => {
        resolve(new File([blob], file.name, { type: "image/jpeg" }));
      }, "image/jpeg", quality);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// 📝 Save report to Firestore
export async function saveReport(reportData, files, onProgress) {
  try {
    const imageBlobs = [];

    // Compress each image (local, not uploaded)
    for (let i = 0; i < files.length; i++) {
      const compressed = await compressImage(files[i]);
      const reader = new FileReader();
      const base64 = await new Promise(res => {
        reader.onload = e => res(e.target.result);
        reader.readAsDataURL(compressed);
      });
      imageBlobs.push(base64);
    }

    // Save everything in Firestore
    const docRef = await addDoc(collection(db, "reports"), {
      ...reportData,
      images: imageBlobs,
      createdAt: serverTimestamp()
    });

    return { id: docRef.id };
  } catch (error) {
    console.error("Error saving report:", error);
    throw error;
  }
}
