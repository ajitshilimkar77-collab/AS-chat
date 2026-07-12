import { auth, db } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

import {
  collection,
  addDoc,
  onSnapshot,
  query,
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

const chat = document.getElementById("chat");
const msg = document.getElementById("msg");
const sendBtn = document.getElementById("sendBtn");

let currentUserName = "";

// Create Account
signupBtn.onclick = async () => {
  try {

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );

    currentUserName = name.value;

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

// Login
loginBtn.onclick = async () => {
  try {

    await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );

    currentUserName = name.value;

  } catch (e) {
    alert(e.message);
  }
};

// Auth State
onAuthStateChanged(auth, (user) => {

  if(user){
    loginPage.style.display = "none";
    chatPage.style.display = "block";
  }else{
    loginPage.style.display = "block";
    chatPage.style.display = "none";
  }

});

// Send Message
sendBtn.onclick = async () => {

  if(msg.value.trim()=="") return;

  await addDoc(collection(db,"messages"),{

    text:msg.value,
    sender: currentUserName || email.value,
    senderEmail: auth.currentUser.email,
    time:serverTimestamp()

  });

  msg.value="";

};

// Show Messages
const q=query(collection(db,"messages"),orderBy("time"));

onSnapshot(q,(snapshot)=>{

chat.innerHTML="";

snapshot.forEach((doc)=>{

const data=doc.data();

const div=document.createElement("div");

div.className="message";

div.innerHTML=`
<b>${data.sender}</b><br>
${data.text}
`;

chat.appendChild(div);

});

});
