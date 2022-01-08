import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Searchbar from "../components/Searchbar";
import Card from "../components/Card";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
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

        <Card/>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://www.linkedin.com/in/aria-amini/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by Spruce Technologies
          <span className={styles.logo}>
            <Image src="/linkedin.svg" alt="LinkedIn Logo" width={24} height={24}/>
          </span>
        </a>
      </footer>
    </div>
  )
}
