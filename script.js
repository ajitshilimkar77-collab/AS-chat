import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const chat = document.getElementById("chat");
const msg = document.getElementById("msg");
const sendBtn = document.getElementById("sendBtn");

sendBtn.addEventListener("click", async () => {
  if (msg.value.trim() === "") return;

  await addDoc(collection(db, "messages"), {
    text: msg.value,
    time: serverTimestamp()
  });

  msg.value = "";
});

const q = query(collection(db, "messages"), orderBy("time"));

onSnapshot(q, (snapshot) => {
  chat.innerHTML = "";

  snapshot.forEach((doc) => {
    const div = document.createElement("div");
    div.innerText = doc.data().text;
    chat.appendChild(div);
  });
});
