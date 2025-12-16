// src/config/firebase.js
// Firebase initialization and Auth export
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyC8xK6pmw8rGaD5aHpKGXlfov57nBacFAg',
  authDomain: 'indshow-f1057.firebaseapp.com',
  projectId: 'indshow-f1057',
  storageBucket: 'indshow-f1057.firebasestorage.app',
  messagingSenderId: '899893533840',
  appId: '1:899893533840:web:4177b9f278c27c958ccc15',
  measurementId: 'G-D08PP7JLD4',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

export default app;
