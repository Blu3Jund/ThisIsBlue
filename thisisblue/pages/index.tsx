import styles from '../styles/Home.module.css'

import Loader from '../components/loader'
import toast from "react-hot-toast";
import {collectionGroup, getDocs, getFirestore, limit, orderBy, query, startAfter, where} from "@firebase/firestore";
import {firestore, fromMillis, postToJSON} from "../lib/firebase1";
import {useState} from "react";
import PostFeed from "../components/PostFeed";
import Metatags from "../components/Metatags";

//Max post to query per page
const LIMIT = 1;

export async function getServerSideProps(context) {

    const postQuery = query(
        collectionGroup(firestore, 'posts'),
        where('published', '==', true),
        orderBy('createdAt', "desc"),
        limit(LIMIT));

    const posts = (await getDocs(postQuery)).docs.map(postToJSON)

    return {
         props: { posts },
    };
}

export default function Home(props) {
    //Taking props and set them as states on the compontent.
    // This might be used for fetching additional posts in the future
    const [posts, setPosts] = useState(props.posts);
    const [loading, setLoading] = useState(false);
    const [postsEnd, setPostsEnd] = useState(false);

    const getMorePosts = async () => {
        setLoading(true);
        const last = posts[posts.length - 1];

        const cursor = typeof last.createdAt === 'number' ? fromMillis(last.createdAt) : last.createdAt;
        const morePostsQuery = query(
            collectionGroup(firestore, 'posts'),
            where('published', '==', true),
            orderBy('createdAt', "desc"),
            startAfter(cursor),
            limit(LIMIT));

        const newPosts = (await getDocs(morePostsQuery)).docs.map((doc => doc.data()))

        setPosts(posts.concat(newPosts));
        setLoading(false);

        if (newPosts.length < LIMIT) {
            setPostsEnd(true);
        }
    };



  return (
      <main>
          <Metatags title="Home Page" description="Get the latest posts on our site" />
          <PostFeed posts={posts}/>

          {!loading && !postsEnd && <button onClick={getMorePosts}>Load more</button> }

          <Loader show={loading}/>

          {postsEnd && 'You have reached the end!'}
      </main>

      // <div>
      //
      //
      //     <button onClick={() => toast.success('hello toast!')}>
      //         Toast me
      //     </button>
      //   {/*<Loader show />*/}
      // </div>
    // <div className={styles.container}>
    //
    // </div>
  )
}
