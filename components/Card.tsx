import styles from "./Card.module.css";

export default function Card() {
    return (
        <div className={styles.grid}>
            <a href="https://nextjs.org/docs" className={styles.card}>
                <h2>Source code &rarr;</h2>
                <p>IMDB Graph is 100% open source. Click here to see the GitLab page</p>
            </a>
        </div>
    )
}
