// Allows user to heart or like a post
import {auth, firestore} from "../lib/firebase1";
import {doc, increment, writeBatch} from "firebase/firestore";
import {useDocument} from "react-firebase-hooks/firestore";
import {collection} from "@firebase/firestore";

export default function Heart({postRef}){
    // Listen to heart document for currently logged in user
    const heartRef = doc(collection(postRef, 'hearts'), auth.currentUser.uid);
    const[heartDoc] = useDocument(heartRef);

    // Create a user-to-post releationshoip
    const addheart = async () => {
        const uid = auth.currentUser.uid;
        const batch = writeBatch(firestore);

        batch.update(postRef, { heartCount: increment(1)});
        batch.set(heartRef, { uid })

        await batch.commit();
    }

    const removeHeart = async () => {
        const batch = writeBatch(firestore);

        batch.update(postRef, { heartCount: increment(-1) });
        batch.delete(heartRef);

        await batch.commit();
    }


    return heartDoc?.exists() ? (
        <button onClick={removeHeart}>💔 Unheart</button>
    ) : (
        <button onClick={addheart}>💗 Heart</button>
    );
}