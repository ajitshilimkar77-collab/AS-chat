import { auth, db } from "./firebase.js";

console.log("✅ chat.js Loaded");
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// ===============================
// Chat Elements
// ===============================

const chat = document.getElementById("chat");
const msg = document.getElementById("msg");
const sendBtn = document.getElementById("sendBtn");

// ===============================
// Send Message Function
// ===============================

sendBtn.addEventListener("click", async () => {

    if (!auth.currentUser) {
        alert("Please login first");
        return;
    }

    if (msg.value.trim() === "") return;

    await addDoc(collection(db, "messages"), {

        sender: auth.currentUser.email,

        senderEmail: auth.currentUser.email,

        text: msg.value,

        time: serverTimestamp()

    });

    msg.value = "";

});

// ===============================
// Show Messages
// ===============================

const q = query(
    collection(db, "messages"),
    orderBy("time")
);

onSnapshot(q, (snapshot) => {

    chat.innerHTML = "";

    snapshot.forEach((doc) => {

        const data = doc.data();

        const div = document.createElement("div");

        div.className =
            data.senderEmail === auth.currentUser?.email
                ? "message myMessage"
                : "message otherMessage";

        div.innerHTML = `
            <b>${data.sender || data.senderEmail}</b><br>
            ${data.text}
        `;

        chat.appendChild(div);

    });

    chat.scrollTop = chat.scrollHeight;

});

console.log("✅ Chat System Ready");
