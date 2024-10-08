import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA-xcwZgsETcHTSljpH8YuqwSFn5Ligtag",
  authDomain: "webcarros-43954.firebaseapp.com",
  projectId: "webcarros-43954",
  storageBucket: "webcarros-43954.appspot.com",
  messagingSenderId: "80109245844",
  appId: "1:80109245844:web:8009b39f5c0e6a443f2b81",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };