import toast from "react-hot-toast";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { auth } from "../lib/firebase1";


export default function EnterPage({}) {
    const user = null;
    const username = null;

    // 1. user signed out < SignInButton />
    // 2. user signed in, but missing username <UsernameForm />
    // 3. user signed in, has username <SignOutButton />
        return (
        <main>
            {user ?
                !username ? <UsernameFrom /> : <SignOutButton />
                :
                <SignInButton />
            }

        </main>
    )
}

// Sign in with Google button
function SignInButton() {

    const googleAuthProvider = new GoogleAuthProvider();
    const signInWithGoogle = async () => {
        await signInWithPopup(auth, googleAuthProvider)
            .then((result) => {
                //This gives you a Google Access Token. You can use it to access the Google API

            })
            .catch((e) => {
                //Handle Errors here
                const errorCode = e.code;
                const errorMessgage = e.message;
                // The email of the user's account used.
                const email = e.email;
                // The AutCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(e);
                console.log(errorCode + errorMessgage + email + credential)
                toast.error('You did not sign in')
            })
    }
    return(
        <button className="btn-google" onClick={signInWithGoogle}>
            <img src={'/google.png'} /> Sign in with Google
        </button>
    )
}

// Sign out
function SignOutButton() {
    return <button onClick={() => auth.signOut()}>Sign Out</button>
}

function UsernameFrom() {

}