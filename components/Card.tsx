import styles from "./Card.module.css";

export default function Card(props: {
    title: string,
    body: string
}) {
    return (
        <div className={styles.grid}>
            <a href="https://gitlab.com/users/aamini11/projects" className={styles.card}>
                <h2>{props.title}</h2>
                <p>{props.body}</p>
            </a>
        </div>
    );
}
