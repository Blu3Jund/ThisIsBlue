import {getUserWithUsername, postToJSON} from "../../lib/firebase1";
import {collection, collectionGroup, getDocs, getFirestore} from "@firebase/firestore";
import {doc, getDoc} from "firebase/firestore";

export async function getStaticProps({ params }){
    const { username, slug} = params;
    const userDoc = await getUserWithUsername(username);

    let post;
    let path;

    if (userDoc) {
        const postRef = doc(collection(userDoc.ref, 'posts'), slug)
        post = postToJSON(await getDoc(postRef));

        path = postRef.path;
    }

    return {
        props: { post, path },
        revalidate: 5000
    }
}

export async function getStaticPaths() {
    const snapshot = await getDocs(collectionGroup(getFirestore(), 'posts'))
    const paths = snapshot.docs.map((doc) => {
        const { slug, username } = doc.data();
        return {
            params: { username, slug }
        };
    });

    return {
        paths,
        fallback: 'blocking',
    };
}


export default function PostPage({}) {
    return (
        <main>
        </main>
    )
}