import UserProfile from "../../components/UserProfile";
import PostFeed from "../../components/PostFeed";
import {getUserWithUsername, postToJSON} from "../../lib/firebase1";
import {collection, getDocs, getFirestore, limit, orderBy, where} from "@firebase/firestore";
import {query as fireQuery} from "@firebase/firestore";

export async function getServerSideProps({ query }) {

    const { username } = query;

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
        user = userDoc; ///TODO This was user = userDoc.data() in Firestore v8, but not sure what to do for v9
        const postQuery = fireQuery(
            collection(getFirestore(), 'posts'),
            where('published', '==', true),
            orderBy('createdAt', "desc"),
            limit(5));
        const querySnapshot = await getDocs(postQuery)
        posts = querySnapshot.docs.map(postToJSON)
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