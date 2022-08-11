import {getApp, initializeApp} from 'firebase/app';
import {getAuth, GoogleAuthProvider } from "firebase/auth";
import {collection, getDocs, getFirestore, limit, query, Timestamp, where} from "@firebase/firestore";
import {getStorage} from "@firebase/storage";
import {getDoc} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCF-MVXnzDMFGTbp9Q4XNjvYKeXD71D16I",
    authDomain: "thisisblue.firebaseapp.com",
    projectId: "thisisblue",
    storageBucket: "thisisblue.appspot.com",
    messagingSenderId: "40898048667",
    appId: "1:40898048667:web:010430ecf60b63c59f4c3e",
    // measurementId: "G-1VMRH36C6Y"
}


function createFirebaseApp(config) {
    try {
        return getApp();
    } catch {
        return initializeApp(config);
    }
}

const firebaseApp = createFirebaseApp(firebaseConfig);

//Auth exports
export const auth = getAuth(firebaseApp);
export const googleAuthProvider = new GoogleAuthProvider();

export const firestore = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
export const fromMillis = Timestamp.fromMillis;


//Helper functions

/**`
 * Gets a users/{uid} document with username
 * @param  {string} username
 */
export async function getUserWithUsername(username) {

    let userDoc;
    const usersRef = collection(firestore, 'users');
    const queryUserWithUsername = query(usersRef, where('username', '==', username), limit(1));

    const querySnapshot = await getDocs(queryUserWithUsername);
    querySnapshot.forEach((doc) => {
        // console.log(doc.id, " => ", doc.data());
        userDoc = doc;
    })
    return userDoc;
}

/**
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
export function postToJSON(doc) {
    const data = doc.data();
    return {
        ...data,
        // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
        createdAt: data?.createdAt.toMillis(),
        updatedAt: data?.updatedAt.toMillis(),
    };
}
