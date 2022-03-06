import styles from "./Card.module.css";

export default function Card(props: {
    title: string,
    body: string
}) {
    return (
        <div className="flex items-center justify-center flex-wrap max-w-[800px]">
            <a href="https://gitlab.com/users/aamini11/projects"
               className={`${styles.card} m-4 p-6 text-left text-inherit no-underline border-2 border-solid border-[#eaeaea] rounded-[10px] transition max-w-[300px]`}
            >
                <h2 className="mt-0 mr-0 mb-4 ml-0 text-2xl">{props.title}</h2>
                <p className="m-0 text-lg">{props.body}</p>
            </a>
        </div>
    );
}
