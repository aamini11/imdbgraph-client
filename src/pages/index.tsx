import Head from "next/head";
import Card from "../components/Card";
import Header from "../components/Header";
import Page from "../components/Page";
import Searchbar from "../components/Searchbar";
import { ThemeButton } from "../components/ThemeButton";

export default function Home() {
    return (
        <div>
            <Head>
                <title>IMDB Graph</title>
                <meta name="description" content="Website to visualize IMDB TV show ratings as a graph" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Page>
                <div className="flex flex-col items-center">
                    <div className="ml-auto p-3">
                      <ThemeButton/>
                    </div>
                    <Header text="Welcome to IMDB Graph" />
                    <div className="max-w-md w-full my-16 mx-0">
                        <Searchbar />
                    </div>

                    <Card
                        title="Source Code &rarr;"
                        body="IMDB Graph is 100% open source. Click here to see the GitLab page"
                    />
                </div>
            </Page>
        </div>
    );
}
