import { initializeApp } from "firebase/app";

// TODO: Replace the following with your app's Firebase project configuration

export let firebaseConfig = {
  apiKey: null,
  authDomain: null,
  projectId: null,
  storageBucket: null,
  messagingSenderId: null,
  appId: null,
};

export const app = initializeApp(firebaseConfig);
