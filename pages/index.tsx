import Head from "next/head";
import Card from "../components/Card";
import Footer from "../components/Footer";
import Searchbar from "../components/Searchbar";
import Title from "../components/Title";

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>IMDB Graph</title>
                <meta name="description" content="Website to visualize IMDB TV show ratings as a graph"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>
                    Welcome to IMDB Graph
                </h1>

                <div className={styles.description}>
                    <Searchbar/>
                </div>

                <Card title="Source Code &rarr;"
                      body="IMDB Graph is 100% open source. Click here to see the GitLab page"/>
            </main>
            <Footer/>
        </div>
    );
}
