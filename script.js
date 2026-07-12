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
