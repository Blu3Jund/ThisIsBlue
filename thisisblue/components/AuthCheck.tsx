//Component's children only show to logged-in users

import {useContext} from "react";
import {UserContext} from "../lib/context";
import Link from "next/link";

export default function AuthCheck(props){
    const { username } = useContext(UserContext);

    return username ?
        props.children :
        props.fallback || <Link href="/enter">You must be signed in</Link>;
}