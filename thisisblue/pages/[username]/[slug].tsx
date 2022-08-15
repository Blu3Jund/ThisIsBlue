import styles from '@styles/Post.module.css';
import {getUserWithUsername, postToJSON} from "../../lib/firebase1";
import {collection, collectionGroup, getDocs, getFirestore} from "@firebase/firestore";
import {doc, getDoc} from "firebase/firestore";
import {useDocumentData} from "react-firebase-hooks/firestore";
import PostContent from "../../components/PostContent";
import Metatags from "../../components/Metatags";

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


export default function PostPage(props) {
    const postRef = doc(getFirestore(), props.path);
    const [realtimePost] = useDocumentData(postRef);

    const post = realtimePost || props.post;

    return (
        <main className={styles.container}>
            <Metatags title={post.title} description={post.title} />
            <section>
                <PostContent post={post} />
            </section>

            <aside className="card">
                <p>
                    <strong>{post.heartCount || 0} 💗</strong>
                </p>
            </aside>
        </main>
    )
}