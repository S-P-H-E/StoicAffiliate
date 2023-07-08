import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB4YILAa0VqHGK6071mnq-HyExeXukqRvg",
  authDomain: "stoic-affiliate.firebaseapp.com",
  projectId: "stoic-affiliate",
  storageBucket: "stoic-affiliate.appspot.com",
  messagingSenderId: "317439243769",
  appId: "1:317439243769:web:5a2458b75027df179f3928",
  measurementId: "G-XRQWTELNVW"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };