import styles from '../../styles/Admin.module.css'
import AuthCheck from "../../components/AuthCheck";
import {collection, orderBy, query, serverTimestamp, setDoc} from "@firebase/firestore";
import {auth, firestore} from "../../lib/firebase1";
import {doc} from "firebase/firestore";
import {useCollection} from "react-firebase-hooks/firestore";
import PostFeed from "../../components/PostFeed";
import {useRouter} from "next/router";
import {useContext, useState} from "react";
import {UserContext} from "../../lib/context";
import kebabCase from 'lodash.kebabcase';
import toast from "react-hot-toast";

export default function AdminPostsPage(props) {
    return (
        <main>
            <AuthCheck>
                <PostList />
                <CreateNewPost />

            </AuthCheck>
            <h1>Admin Post Page</h1>
        </main>
    )
}

function PostList() {

    const ref = collection(doc(collection(firestore, 'users'), auth.currentUser.uid), 'posts');
    const queryPostlist = query(ref, orderBy('createdAt'))
    const [querySnapshot]  = useCollection(queryPostlist);

    //Also see useCollectionData() and use the full querySnaphsot for additional controls like deleting posts

    const posts = querySnapshot?.docs.map((doc) => doc.data());

    return (
        <>
            <h1>Manage your posts</h1>
            <PostFeed posts={posts} admin />
        </>
    )

}

function CreateNewPost() {
    const router = useRouter();
    const { username } = useContext(UserContext);
    const [title, setTitle] = useState('');

    // Ensure slug is URL safe
    const slug = encodeURI(kebabCase(title));

    // Validate Length
    const isValid = title.length > 3 && title.length < 100;

    // Create a new post in firestore
    const createPost = async (e) => {
        e.preventDefault();
        const uid = auth.currentUser.uid;
        const ref = doc(collection(doc(collection(firestore, 'users'), uid), 'posts'), slug);

        // TODO give all fields a default value here
        const data = {
            title,
            slug,
            uid,
            username,
            published: false,
            content: '# hello world!',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            hearthCount: 0,
        };

        await setDoc(ref, data);

        toast.success('Post created!');

        // Imperative navigation after doc is set
        router.push(`/admin/${slug}`);
    }

    return(
        <form onSubmit={createPost}>
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={"My awesome Article!"}
                className={styles.input}
            />
            <p>
                <strong>Slug:</strong> {slug}
            </p>
            <button type="submit" disabled={!isValid} className={"btn-green"}>
                Create New Post
            </button>
        </form>
    )


}