export default function Card(props: { title: string; body: string }) {
    return (
        <div className="flex items-center justify-center max-w-md">
            <a
                href="https://gitlab.com/users/aamini11/projects"
                className="max-w-[300px] p-6 rounded-[10px]
                           dark:bg-neutral-900
                           border-2 border-[#eaeaea]
                           transition hover:text-blue-600 hover:border-blue-600 hover:ease-in duration-200"
            >
                <h2 className="mt-0 mr-0 mb-4 ml-0 text-2xl whitespace-nowrap">{props.title}</h2>
                <p className="m-0 text-lg">{props.body}</p>
            </a>
        </div>
    );
}
