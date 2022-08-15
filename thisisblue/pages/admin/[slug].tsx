
import Metatags from "../../components/Metatags";
import AuthCheck from "../../components/AuthCheck";
import {useState} from "react";
import {useRouter} from "next/router";
import {collection, getFirestore, serverTimestamp} from "@firebase/firestore";
import {auth} from "../../lib/firebase1";
import {doc, getDoc} from "firebase/firestore";
import {useDocumentData, useDocumentDataOnce} from "react-firebase-hooks/firestore";
import {inspect} from "util";
import styles from "../../styles/Admin.module.css"
import {useForm} from "react-hook-form";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";

export default function AdminPostEdit(props) {
    return (
        <AuthCheck>
            <PostManager />
        </AuthCheck>
    )
}

function PostManager() {
    const [preview, setPreview] = useState(false);

    const router = useRouter();
    const { slug } = router.query;

    //TODO fix this, in /admin/index.tsx this works, but for some reason this does not. Think it has something to do
    // with slug being string || string[]. No sure tho
    const postRef = doc(collection(doc(collection(getFirestore(), 'users'), auth.currentUser.uid), 'posts'), slug);

    const [post] = useDocumentDataOnce(postRef);

    return (
        <main className = {styles.container}>
            {post && (
                <>
                    <section>
                        <h1>{post.title}</h1>
                        <p>ID: {post.slug}</p>

                        <PostForm postRef={postRef} defaultValues={post} preview={preview} />
                    </section>
                </>
            )}

        </main>

    );
}

function PostForm({defaultValues, postRef, preview}){
    const { register, handleSubmit, reset, watch } = useForm({defaultValues, mode: 'onChange'});

    const updatePost = async ({content, published}) => {
        await postRef.update({
            content,
            published,
            updatedAt: serverTimestamp(),
        });

        reset({content, published})

        toast.success('Post updated successfully!')
    }


    return (
        <form onSubmit={handleSubmit(updatePost)}>
            {preview && (
                <div className="card">
                    <ReactMarkdown>{watch('content')}</ReactMarkdown>
                </div>
            )}
            <div className={preview ? styles.hidden : styles.controls}>
                <textarea name="content" ref={register}></textarea>
                 <fieldset>
                     <input className={styles.checkbox} name="published" type="checkbox" ref={register}/>
                     <label>Published</label>
                 </fieldset>

                <button type="submit" className="btn-green">
                    Save Changes
                </button>
            </div>
        </form>

    );
}