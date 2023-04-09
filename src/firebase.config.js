import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCFfyk7y8hluCcQW3g51Y9l0TnYQtGAVLI",
  authDomain: "restaurantapp-2a620.firebaseapp.com",
  databaseURL: "https://restaurantapp-2a620-default-rtdb.firebaseio.com",
  projectId: "restaurantapp-2a620",
  storageBucket: "restaurantapp-2a620.appspot.com",
  messagingSenderId: "112935662505",
  appId: "1:112935662505:web:7366a5a5270df0860dcab8"
};


const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);

const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, firestore, storage };
