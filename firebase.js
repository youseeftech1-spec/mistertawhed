import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBmYEDEglrGIaJHly8fejCimiudpXJVLjc",
    authDomain: "mister-tawhid.firebaseapp.com",
    projectId: "mister-tawhid",
    storageBucket: "mister-tawhid.firebasestorage.app",
    messagingSenderId: "1016041074577",
    appId: "1:1016041074577:web:14e60d5056ba5ad4beb430",
    measurementId: "G-B158WZ0JTS"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);