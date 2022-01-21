import styles from "./Card.module.css";

export default function Card(props: {
    title: String,
    body: String
}) {
    return (
        <div className={styles.grid}>
            <a href="https://gitlab.com/aamini11/imdbgraph" className={styles.card}>
                <h2>{props.title}</h2>
                <p>{props.body}</p>
            </a>
        </div>
    )
}
