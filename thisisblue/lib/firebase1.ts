import {getApps, initializeApp} from 'firebase/app';
import {getAuth, onAuthStateChanged } from "firebase/auth";
import {getFirestore} from "@firebase/firestore";
import {getStorage} from "@firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCF-MVXnzDMFGTbp9Q4XNjvYKeXD71D16I",
    authDomain: "thisisblue.firebaseapp.com",
    projectId: "thisisblue",
    storageBucket: "thisisblue.appspot.com",
    messagingSenderId: "40898048667",
    appId: "1:40898048667:web:010430ecf60b63c59f4c3e",
    measurementId: "G-1VMRH36C6Y"
}

if (!getApps().length) {
    initializeApp(firebaseConfig);
    // Initialize other firebase products here
}

const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp)

onAuthStateChanged(auth, user => {
    // Check for user status
});
// console.log('The firebase object: ' + firebase.getApps())