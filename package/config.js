import { initializeApp } from "firebase/app";

// TODO: Replace the following with your app's Firebase project configuration

let firebaseConfig = {
  apiKey: null,
  authDomain: null,
  projectId: null,
  storageBucket: null,
  messagingSenderId: null,
  appId: null,
};

/**
 * Sets the Firebase configuration object.
 * @param {Object} config - The Firebase configuration object.
 * @returns {void}
 */
export const setFirebaseConfig = (config) => {
  firebaseConfig = config;
};

export const app = initializeApp(firebaseConfig);
