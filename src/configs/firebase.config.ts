import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBYpmMaDGU9yggKYPAoVH7ZrqLkCrl8-u8',
  authDomain: 'biocan-ai.firebaseapp.com',
  projectId: 'biocan-ai',
  storageBucket: 'biocan-ai.firebasestorage.app',
  messagingSenderId: '909292250793',
  appId: '1:909292250793:web:938e7a4c832d4875372bb8'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const storage = getStorage(app);
