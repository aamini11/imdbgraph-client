import Head from "next/head";
import Card from "../components/Card";
import Footer from "../components/Footer";
import Searchbar from "../components/Searchbar";
import Title from "../components/Title";

export default function Home() {
    return (
        <div className="px-8 py-0">
            <Head>
                <title>IMDB Graph</title>
                <meta name="description" content="Website to visualize IMDB TV show ratings as a graph"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <main className="min-h-screen py-16 px-0 flex flex-grow flex-col justify-center items-center">
                <Title text="Welcome to IMDB Graph"/>
                <div className="max-w-[600px] w-full my-16 mx-0">
                    <Searchbar/>
                </div>

                <Card title="Source Code &rarr;"
                      body="IMDB Graph is 100% open source. Click here to see the GitLab page"/>
            </main>
            <Footer/>
        </div>
    );
}
