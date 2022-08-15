import toast from "react-hot-toast";
import {signInWithPopup, signOut} from "firebase/auth";
import {auth, firestore, googleAuthProvider} from "../lib/firebase1";
import {useCallback, useContext, useEffect, useState} from 'react';
import { UserContext} from "../lib/context";
import {doc, getDoc, writeBatch} from "firebase/firestore";
import debounce from 'lodash.debounce';
import {getFirestore} from "@firebase/firestore";
import Metatags from "../components/Metatags";


export default function EnterPage() {
    const {user, username } = useContext(UserContext);

    // 1. user signed out < SignInButton />
    // 2. user signed in, but missing username <UsernameForm />
    // 3. user signed in, has username <SignOutButton />
        return (
        <main>
            <Metatags title="Enter" description="Sign up for this amazing app!" />
            {user ? !username ? <UsernameForm /> : <SignOutButton /> : <SignInButton />}
        </main>
    )
}

// Sign in with Google button
function SignInButton() {
    const signInWithGoogle = async () => {
        await signInWithPopup(auth, googleAuthProvider);
        ///TODO add catch block
            // .then((result) => {
            //     //This gives you a Google Access Token. You can use it to access the Google API
            //
            // })
            // .catch((e) => {
            //     //Handle Errors here
            //     const errorCode = e.code;
            //     const errorMessgage = e.message;
            //     // The email of the user's account used.
            //     const email = e.email;
            //     // The AutCredential type that was used.
            //     const credential = GoogleAuthProvider.credentialFromError(e);
            //     console.log(errorCode + errorMessgage + email + credential)
            //     toast.error('You did not sign in')
            // })
    };
    return(
        <button className="btn-google" onClick={signInWithGoogle}>
            <img src={'/google.png'} width="30px"/> Sign in with Google
        </button>
    )
}

// Sign out
function SignOutButton() {
    return <button onClick={() => signOut(auth)}>Sign Out</button>
}

//UsernameForm
function UsernameForm() {
    const [formValue, setFormValue] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [loading, setLoading] = useState(false);
    const {user, username} = useContext(UserContext);

    const onSubmit = async (e) => {
        ///TODO add try catch block
        // try {
        e.preventDefault();

        // Create refs for both documents
        const userDoc = doc(getFirestore(), `users`, user.uid)
        const usernameDoc = doc(getFirestore(), `usernames`, formValue);

        // Commit both docs together as a batch write.
        const batch = writeBatch(getFirestore());
        batch.set(userDoc, { username: formValue, photoURL: user.photoURL, displayName: user.displayName });
        batch.set(usernameDoc, { uid: user.uid });

        await batch.commit();
        // } catch (e) {
        //     console.log(`On Submit Error: ${e}`)
        // }
    };

    const onChange = (e) => {
        // Force form value typed in form to match correct format.
        const val = e.target.value.toLowerCase();
        const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

        // Only set form value if length is < 3 OR it passes regex
        if (val.length < 3) {
            setFormValue(val);
            setLoading(false);
            setIsValid(false);
        }

        if (re.test(val)) {
            setFormValue(val);
            setLoading(true);
            setIsValid(false);
        }
    };

    useEffect(() => {
        checkUsername(formValue);
    }, [formValue]);


    const checkUsername = useCallback(
        debounce(async (username) => {
            if (username.length >= 3) {
                const ref = doc(getFirestore(), `usernames`, username);
                const snap = await getDoc(ref);
                console.log(`Firestore read executed!`, snap.exists());
                setIsValid(!snap.exists());
                setLoading(false)
            }
        }, 500),
        []
    );



    //Hit the database for username match after each debounced change
    // useCallback is required for debounce to work

    return (
        !username && (
            <section>
                <h3>Choose Username</h3>
                <form onSubmit={onSubmit}>
                    <input name="username" placeholder="FrenchiestFry" value={formValue} onChange={onChange}/>
                    <UsernameMessage username={formValue} isValid={isValid} loading={loading}/>
                    <button type ="submit" className="btn-green" disabled={!isValid}>
                        Choose
                    </button>

                    <h3>Debug State</h3>
                    <div>
                        Username: {formValue}
                        <br />
                        Loading: {loading.toString()}
                        <br />
                        Username Valid: {isValid.toString()}
                    </div>

                </form>
            </section>
        )
    );
}

function UsernameMessage({username, isValid, loading}) {
    if(loading) {
        return <p>Checking...</p>
    } else if (isValid) {
        return <p className="text-success">{username} is available!</p>
    } else if (username && !isValid) {
        return <p className="text-danger">That username is taken!</p>
    } else {
        return <p></p>;
    }
}