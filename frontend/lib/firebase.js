// frontend/lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';  // Import du stockage Firebase

const firebaseConfig = {
  apiKey: "AIzaSyAANubUHdbuD2xsQIfrZWQ7q1kRRWB4uCo",
  authDomain: "quickhire-11133.firebaseapp.com",
  projectId: "quickhire-11133",
  storageBucket: "quickhire-11133.appspot.com",
  messagingSenderId: "709688055789",
  appId: "1:709688055789:web:709688055789"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);  // Ajoutez le stockage

export { auth, storage };  // Exporter le stockage
