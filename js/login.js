// js/login.js
import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const email = document.getElementById("email");
const password = document.getElementById("password");
const roleSelect = document.getElementById("role");
const submitBtn = document.getElementById("submitBtn");
const toggleText = document.getElementById("toggleText");
const formTitle = document.getElementById("formTitle");

let isRegister = true;

toggleText.onclick = () => {
  isRegister = !isRegister;
  formTitle.textContent = isRegister ? "Register" : "Login";
  submitBtn.textContent = isRegister ? "Register" : "Login";
  roleSelect.style.display = isRegister ? "block" : "none";
  toggleText.textContent = isRegister
    ? "Already have an account? Login"
    : "Don't have an account? Register";
};

submitBtn.onclick = async () => {
  const emailVal = email.value.trim();
  const passVal = password.value.trim();
  const roleVal = roleSelect.value;

  if (!emailVal || !passVal) return alert("Please fill all fields!");

  try {
    if (isRegister) {
      const userCredential = await createUserWithEmailAndPassword(auth, emailVal, passVal);
      const user = userCredential.user;

      // ✅ Save role in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: emailVal,
        role: roleVal,
      });

      alert("Registration successful!");
      redirectBasedOnRole(roleVal);
    } else {
      const userCredential = await signInWithEmailAndPassword(auth, emailVal, passVal);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        redirectBasedOnRole(userDoc.data().role);
      } else {
        alert("No role found. Contact admin.");
      }
    }
  } catch (error) {
    alert("Error: " + error.message);
  }
};

function redirectBasedOnRole(role) {
  if (role === "admin") {
    window.location.href = "admin.html";
  } else {
    window.location.href = "index.html";
  }
}
