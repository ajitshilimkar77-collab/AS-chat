import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDFtphUxT-IJCz5v7RZxVTiYKylGa4LZpY",
  authDomain: "as-chat-56731.firebaseapp.com",
  projectId: "as-chat-56731",
  storageBucket: "as-chat-56731.firebasestorage.app",
  messagingSenderId: "627595214522",
  appId: "1:627595214522:web:2d8cadf10b70c367138c83",
  measurementId: "G-7JM5R3W4YG"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);