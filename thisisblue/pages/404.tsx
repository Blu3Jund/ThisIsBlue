import Link from "next/link";

export default function Custom404(){
    return (
        <main>
            <h1>404 - That page does not seem to exist...</h1>
            <iframe src="https://giphy.com/embed/S8rEAbtG4WA2ULH7CH"
                    width="480"
                    height="480"
                    frameBorder="0"
                    className="giphy-embed"
                    allowFullScreen
            ></iframe>
            <Link href ="/">
                <button className="btn-blue">Go home</button>
            </Link>

        </main>
    )
}