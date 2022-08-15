import Head from "next/head";

export default function Metatags({ title = 'This is Blu3',
                                    description = 'A website using modern features',
                                    image = "https://twitter.com/Blu3Jund/photo",
                                 }) {
    return(
        <Head>
            <title>{title}</title>
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:site" content="@blu3jund" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
        </Head>
    )
}
