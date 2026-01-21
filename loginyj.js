import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* 🔥 CONFIGURACIÓN REAL */
const firebaseConfig = {
  apiKey: "AIzaSyDPdkgLmWXj_otCW-mkLh9xdgxLYlBcg80",
  authDomain: "yjjuegodemo.firebaseapp.com",
  projectId: "yjjuegodemo",
  storageBucket: "yjjuegodemo.firebasestorage.app",
  messagingSenderId: "539810260626",
  appId: "1:539810260626:web:108f1a06f54c5416e2e84b"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* ========= VISTAS ========= */
const loginView = document.getElementById("loginView");
const registerView = document.getElementById("registerView");

/* ========= INPUTS LOGIN ========= */
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginError = document.getElementById("loginError");

/* ========= INPUTS REGISTRO ========= */
const registerEmail = document.getElementById("registerEmail");
const registerPassword = document.getElementById("registerPassword");
const registerError = document.getElementById("registerError");

/* ========= CAMBIO DE VISTAS ========= */
document.getElementById("goRegister").onclick = () => {
  loginView.style.display = "none";
  registerView.style.display = "block";
};

document.getElementById("backLogin").onclick = () => {
  registerView.style.display = "none";
  loginView.style.display = "block";
};

/* ========= LOGIN ========= */
document.getElementById("loginBtn").onclick = () => {
  loginError.textContent = "";
  loginError.className = "";

  signInWithEmailAndPassword(
    auth,
    loginEmail.value,
    loginPassword.value
  )
    .then(() => {
      window.location.href = "YJGAME.html";
    })
    .catch(err => {
      loginError.textContent = err.message;
      loginError.className = "error";
    });
};

/* ========= REGISTRO ========= */
document.getElementById("registerBtn").onclick = () => {
  registerError.textContent = "";
  registerError.className = "";

  createUserWithEmailAndPassword(
    auth,
    registerEmail.value,
    registerPassword.value
  )
    .then(async (cred) => {
      const user = cred.user;

      // 🎲 Crear User-XXXX
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const username = `User-${randomNum}`;

      // 💾 Guardar en Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        username: username,
        photoURL: "",
        createdAt: new Date()
      });

      // ✅ MENSAJE EN VERDE
      registerError.textContent = "Cuenta creada";
      registerError.className = "success";

      setTimeout(() => {
        registerView.style.display = "none";
        loginView.style.display = "block";
        registerError.textContent = "";
      }, 1500);
    })
    .catch(err => {
      registerError.textContent = err.message;
      registerError.className = "error";
    });
};
