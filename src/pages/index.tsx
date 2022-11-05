import Head from "next/head";
import Card from "../components/Card";
import Page from "../components/Page";
import Searchbar from "../components/Searchbar";
import Title from "../components/Title";

export default function Home() {
    return (
        <div>
            <Head>
                <title>IMDB Graph</title>
                <meta name="description" content="Website to visualize IMDB TV show ratings as a graph" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Page>
              <div className="pt-16 px-8 flex flex-col items-center">
                <Title text="Welcome to IMDB Graph" />
                <div className="max-w-[600px] w-full my-16 mx-0">
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
