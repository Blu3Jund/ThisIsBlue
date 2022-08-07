import {useAuthState} from "react-firebase-hooks/auth";
import {auth, firestore} from "./firebase1";
import {useEffect, useState} from "react";
import {doc, onSnapshot} from "firebase/firestore";
import {getFirestore} from "@firebase/firestore";

export function useUserData() {
    const [user] = useAuthState(auth);
    const [username, setUsername] = useState(null);

    useEffect(() => {
        //turn off realtime subscription
        let unsubscribe;

        if (user) {
            const ref = doc(getFirestore(), "users", user.uid);
            unsubscribe = onSnapshot(ref, (doc) => {
                setUsername(doc.data()?.username);
            });
        } else {
            setUsername(null);
        }

        return unsubscribe;
    }, [user]);

    return{ user, username };
}