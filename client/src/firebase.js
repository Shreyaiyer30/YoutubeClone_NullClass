import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC5lPaW5eRGoxI3GbEbtlJ5R8A7PxB970Y",
  authDomain: "clone-9f8ce.firebaseapp.com",
  projectId: "clone-9f8ce",
  storageBucket: "clone-9f8ce.firebasestorage.app",
  messagingSenderId: "956084081165",
  appId: "1:956084081165:web:1edd03b26c5186783d7b44"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
