
import styles from "../../styles/Admin.module.css"
import AuthCheck from "../../components/AuthCheck";
import {auth, firestore} from "../../lib/firebase1";

import {useState} from "react";
import {useRouter} from "next/router";
import {collection, serverTimestamp, updateDoc} from "@firebase/firestore";
import {doc} from "firebase/firestore";
import {useDocumentData} from "react-firebase-hooks/firestore";
import {useForm} from "react-hook-form";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";
import Link from "next/link";
import ImageUploader from "../../components/ImageUploader";

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


    const postRef = doc(collection(doc(collection(firestore, 'users'), auth.currentUser.uid), 'posts'), slug.toString());

    const [post] = useDocumentData(postRef);

    return (
        <main className = {styles.container}>
            {post && (
                <>
                    <section>
                        <h1>{post.title}</h1>
                        <p>ID: {post.slug}</p>

                        <PostForm postRef={postRef} defaultValues={post} preview={preview} />
                    </section>
                    <aside>
                        <h3>Tools</h3>
                        <button onClick={() => setPreview(!preview)}>{preview ? 'Edit' : 'Preview'}</button>
                        <Link href={`/${post.username}/${post.slug}`}>
                            <button className={'btn-blue'}>Live view</button>
                        </Link>
                    </aside>
                </>
            )}
        </main>
    );
}

function PostForm({defaultValues, postRef, preview}){
    const { register, handleSubmit, reset, watch, formState, formState: { errors } } = useForm({defaultValues, mode: 'onChange'});

    const { isValid, isDirty } = formState;

    const updatePost = async ({content, published}) => {
        await updateDoc(postRef, {
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

                <ImageUploader />

                <textarea name='content' {...register('content', {
                    maxLength: { value: 20000, message: 'content is too long' },
                    minLength: { value: 10, message: 'content is too short' },
                    required: { value: true, message: 'content is required' },
                })}></textarea>

                {/*Typescript error probably, instead of ReactNode REactElement or smthing see
                https://github.com/DefinitelyTyped/DefinitelyTyped/issues/18051*/}
                {errors.content && <p className="text-danger">{errors.content.message}</p>}

                 <fieldset>
                     <input className={styles.checkbox} name="published" type="checkbox" {...register('published')}/>
                     <label>Published</label>
                 </fieldset>

                <button type="submit" className="btn-green" disabled={!isDirty || !isValid}>
                    Save Changes
                </button>
            </div>
        </form>

    );
}