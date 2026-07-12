import { auth, db } from "./firebase.js";
alert("Script Loaded");

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Pages
const loginPage = document.getElementById("loginPage");
const chatPage = document.getElementById("chatPage");

// Inputs
const name = document.getElementById("name");
const email = document.getElementById("email");
const password = document.getElementById("password");

const msg = document.getElementById("msg");

// Buttons
const signupBtn = document.getElementById("signupBtn");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const sendBtn = document.getElementById("sendBtn");

// Chat
const chat = document.getElementById("chat");

let currentUserName = "";
// ===========================
// SIGN UP
// ===========================

signupBtn.onclick = async () => {

    if (
        name.value.trim() === "" ||
        email.value.trim() === "" ||
        password.value.trim() === ""
    ) {
        alert("Please fill all fields");
        return;
    }

    try {

        const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                email.value,
                password.value
            );

        await addDoc(collection(db, "users"), {

            uid: userCredential.user.uid,
            name: name.value,
            email: email.value

        });

        alert("Account Created Successfully");

    } catch (e) {

        alert(e.message);

    }

};

// ===========================
// LOGIN
// ===========================

loginBtn.onclick = async () => {
    alert("Login Clicked");

    try {
        await signInWithEmailAndPassword(
            auth,
            email.value,
            password.value
        );

        alert("Login Success");

    } catch (e) {
        alert(e.code + "\n" + e.message);
    }
};

// ===========================
// LOGOUT
// ===========================

logoutBtn.onclick = async () => {

    await signOut(auth);

};

// ===========================
// AUTH STATE
// ===========================

onAuthStateChanged(auth, async (user) => {

    if (user) {

        loginPage.style.display = "none";
        chatPage.style.display = "block";

        const qUser = query(
            collection(db, "users"),
            where("uid", "==", user.uid)
        );

        const snap = await getDocs(qUser);

        snap.forEach((doc) => {

            currentUserName = doc.data().name;

        });

    } else {

        loginPage.style.display = "block";
        chatPage.style.display = "none";

    }

});
// ===========================
// SEND MESSAGE
// ===========================

sendBtn.onclick = async () => {

    if (msg.value.trim() === "") return;

    try {

        await addDoc(collection(db, "messages"), {

            sender: currentUserName,
            senderEmail: auth.currentUser.email,
            text: msg.value,

            time: serverTimestamp(),

            createdAt: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            })

        });

        msg.value = "";

    } catch (e) {

        alert(e.message);

    }

};

// ===========================
// SHOW MESSAGES
// ===========================

const q = query(
    collection(db, "messages"),
    orderBy("time")
);

onSnapshot(q, (snapshot) => {

    chat.innerHTML = "";

    snapshot.forEach((doc) => {

        const data = doc.data();

        const div = document.createElement("div");

        if (
            auth.currentUser &&
            data.senderEmail === auth.currentUser.email
        ) {
            div.className = "message myMessage";
        } else {
            div.className = "message otherMessage";
        }

        div.innerHTML = `
            <b>${data.sender}</b><br>
            ${data.text}
            <br>
            <small>${data.createdAt || ""}</small>
        `;

        chat.appendChild(div);

    });

    chat.scrollTop = chat.scrollHeight;

});
