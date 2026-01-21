// 🔥 Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔑 CONFIGURACIÓN FIREBASE (REAL)
const firebaseConfig = {
  apiKey: "AIzaSyDPdkgLmWXj_otCW-mkLh9xdgxLYlBcg80",
  authDomain: "yjjuegodemo.firebaseapp.com",
  projectId: "yjjuegodemo",
  storageBucket: "yjjuegodemo.appspot.com",
  messagingSenderId: "539810260626",
  appId: "1:539810260626:web:108f1a06f54c5416e2e84b"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ================= DOM =================
const usernameEl = document.getElementById("username");
const avatarEl = document.getElementById("profilePhoto");
const logoutBtn = document.getElementById("logoutBtn");

const profilePanel = document.getElementById("profilePanel");
const openProfile = document.getElementById("openProfile");
const closeProfile = document.getElementById("closeProfile");

const newNameInput = document.getElementById("newUsername");
const saveNameBtn = document.getElementById("saveUsername");

const photoInput = document.getElementById("photoURL");
const savePhotoBtn = document.getElementById("savePhoto");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// ================= AUTH + PERFIL =================
onAuthStateChanged(auth, async user => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  const userRef = doc(db, "players", user.uid);

  try {
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      // 🎲 Nombre automático
      const randomName = "User-" + Math.floor(1000 + Math.random() * 9000);

      await setDoc(userRef, {
        name: randomName,
        email: user.email,
        avatar: "",
        createdAt: Date.now()
      });

      usernameEl.textContent = randomName;
    } else {
      const data = snap.data();
      usernameEl.textContent = data.name;

      if (data.avatar) {
        avatarEl.src = data.avatar;
      }
    }

    iniciarJuego();
  } catch (err) {
    console.error("🔥 Error Firestore:", err);
  }
});

// ================= PANEL PERFIL =================
openProfile.onclick = () => {
  profilePanel.style.display =
    profilePanel.style.display === "block" ? "none" : "block";
};

closeProfile.onclick = () => {
  profilePanel.style.display = "none";
};

// ✏️ Guardar nuevo nombre
saveNameBtn.onclick = async () => {
  const user = auth.currentUser;
  const newName = newNameInput.value.trim();
  if (!user || newName === "") return;

  await updateDoc(doc(db, "players", user.uid), {
    name: newName
  });

  usernameEl.textContent = newName;
  newNameInput.value = "";
};

// 🖼️ Guardar avatar
savePhotoBtn.onclick = async () => {
  const user = auth.currentUser;
  const url = photoInput.value.trim();
  if (!user || url === "") return;

  await updateDoc(doc(db, "players", user.uid), {
    avatar: url
  });

  avatarEl.src = url;
  photoInput.value = "";
};

// 🚪 Logout
logoutBtn.onclick = () => {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
};

// ================= JUEGO BASE =================
let x = 50;
let dx = 2;

function iniciarJuego() {
  requestAnimationFrame(loop);
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#22c55e";
  ctx.fillRect(x, 175, 50, 50);

  x += dx;
  if (x <= 0 || x >= canvas.width - 50) dx *= -1;

  requestAnimationFrame(loop);
}
