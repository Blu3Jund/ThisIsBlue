import {useAuthState} from "react-firebase-hooks/auth";
import {auth, firestore} from "./firebase1";
import {useEffect, useState} from "react";
import {doc, onSnapshot} from "firebase/firestore";

export function useUserData() {
    const [user] = useAuthState(auth);
    const [username, setusername] = useState(null);

    useEffect(() => {
        //turn off realtime subscription
        let unsubscribe;

        if (user) {
            const docRef = doc(firestore, "user", user.uid);
            unsubscribe = onSnapshot(docRef, (doc) => {
                setusername(doc.data()?.username)
            });
        } else {
            setusername(null);
        }

        return unsubscribe;
    }, [user])

    return{user, username}
}