import UserProfile from "../../components/UserProfile";
import PostFeed from "../../components/PostFeed";
import {getUserWithUsername, postToJSON} from "../../lib/firebase1";
import {collection, getDocs, getFirestore, limit, orderBy, where} from "@firebase/firestore";
import {query} from "@firebase/firestore";

export async function getServerSideProps({ query: nextQuery }) {

    const { username } = nextQuery;

    const userDoc = await getUserWithUsername(username);

    // If no user, short circuit to 404 page
    if (!userDoc) {
        return {
            notFound: true,
        };
    }

    //Json serializable data
    let user = null;
    let posts = null;

    if (userDoc) {
        user = userDoc.data(); ///TODO This was user = userDoc.data() in Firestore v8, but not sure what to do for v9

        const postQuery = query(
            collection(userDoc.ref, 'posts'),
            where('published', '==', true),
            orderBy('createdAt', "desc"),
            limit(5));
        posts = (await getDocs(postQuery)).docs.map(postToJSON)
        // posts = querySnapshot
    }

    return {
        props: { user, posts }, // will be passed to the page component as props
    };
}

export default function UserProfilePage({ user, posts }) {
    return (
        <main>
            <UserProfile user={user}/>
            <PostFeed posts={posts}/>
        </main>
    )
}