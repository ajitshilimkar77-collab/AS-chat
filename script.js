import { auth, db } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const loginPage = document.getElementById("loginPage");
const chatPage = document.getElementById("chatPage");

const name = document.getElementById("name");
const email = document.getElementById("email");
const password = document.getElementById("password");

const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const logoutBtn = document.getElementById("logoutBtn");

const chat = document.getElementById("chat");
const msg = document.getElementById("msg");
const sendBtn = document.getElementById("sendBtn");

let currentUserName = "";

// Create Account
signupBtn.onclick = async () => {

  if(name.value=="" || email.value=="" || password.value==""){
      alert("Fill all fields");
      return;
  }

  try{

      const user = await createUserWithEmailAndPassword(
          auth,
          email.value,
          password.value
      );

      await addDoc(collection(db,"users"),{
          uid:user.user.uid,
          name:name.value,
          email:email.value
      });

      currentUserName=name.value;

      alert("Account Created Successfully");

  }catch(err){

      alert(err.message);

  }

};

// Login
loginBtn.onclick = async ()=>{

    try{

        await signInWithEmailAndPassword(
            auth,
            email.value,
            password.value
        );

    }catch(err){

        alert(err.message);

    }

};

// Logout
logoutBtn.onclick=async()=>{

    await signOut(auth);

};

// Login State
onAuthStateChanged(auth,async(user)=>{

    if(user){

        loginPage.style.display="none";
        chatPage.style.display="block";

        const q=query(
            collection(db,"users"),
            where("uid","==",user.uid)
        );

        const snap=await getDocs(q);

        snap.forEach((doc)=>{

            currentUserName=doc.data().name;

        });

    }else{

        loginPage.style.display="block";
        chatPage.style.display="none";

    }

});
// ----------------------------
// Send Message
// ----------------------------

sendBtn.onclick = async () => {

    if (msg.value.trim() == "") return;

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

};

// ----------------------------
// Show Messages
// ----------------------------

const q = query(
    collection(db, "messages"),
    orderBy("time")
);

const q = query(
    collection(db, "messages"),
    orderBy("time")
);

onSnapshot(q, (snapshot) => {

    chat.innerHTML = "";

    snapshot.forEach((doc) => {

        const data = doc.data();

        const div = document.createElement("div");

        if (auth.currentUser && data.senderEmail === auth.currentUser.email) {
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
// ----------------------------
// WhatsApp Style Chat Bubble
// ----------------------------

onSnapshot(q, (snapshot) => {

    chat.innerHTML = "";

    snapshot.forEach((doc) => {

        const data = doc.data();

        const div = document.createElement("div");

        if (data.senderEmail === auth.currentUser.email) {
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
