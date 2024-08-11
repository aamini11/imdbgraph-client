import { tv } from "tailwind-variants";
import { SearchBar } from "@/components/search-bar";
import "./global.css";

const title = tv({
    base: "tracking-tight inline font-semibold text-center",
    variants: {
        color: {
            violet: "from-[#FF1CF7] to-[#b249f8]",
            yellow: "from-[#FF705B] to-[#FFB457]",
            blue: "from-[#5EA2EF] to-[#0072F5]",
            cyan: "from-[#00b7fa] to-[#01cfea]",
            green: "from-[#6FEE8D] to-[#17c964]",
            pink: "from-[#FF72E1] to-[#F54C7A]",
            foreground: "dark:from-[#FFFFFF] dark:to-[#4B4B4B]",
        },
        size: {
            sm: "text-3xl lg:text-4xl",
            md: "text-[2.3rem] lg:text-5xl leading-9",
            lg: "text-6xl lg:text-6xl",
        },
        fullWidth: {
            true: "w-full block",
        },
    },
    defaultVariants: {
        size: "md",
    },
    compoundVariants: [
        {
            color: ["violet", "yellow", "blue", "cyan", "green", "pink", "foreground"],
            class: "bg-clip-text text-transparent bg-gradient-to-b",
        },
    ],
});

export default function Home() {
    return (
        <div>
            <div className="flex flex-col items-center gap-8 pb-10 px-10">
                <h1 className={title({ size: "lg" })}>Welcome to IMDB Graph</h1>
                <div className="min-w-80 max-w-lg w-full px-4">
                    <SearchBar />
                </div>

                <div className="px-10">
                    <Card
                        title="Source Code &rarr;"
                        body="IMDB Graph is 100% open source. Click here to see the GitLab page"
                    />
                </div>
            </div>
        </div>
    );
}

function Card(props: { title: string; body: string }) {
    return (
        <div className="flex items-center justify-center max-w-md">
            <a
                href="https://gitlab.com/users/aamini11/projects"
                className="max-w-[300px] p-6 rounded-[10px]
                           border-2
                           border-neutral-300 hover:border-blue-300 hover:text-blue-400
                           dark:border-neutral-700 dark:hover:border-blue-400 dark:hover:text-blue-400
                           transition hover:ease-in duration-200"
            >
                <h2 className="mt-0 mr-0 mb-4 ml-0 text-2xl whitespace-nowrap">{props.title}</h2>
                <p className="m-0 text-lg">{props.body}</p>
            </a>
        </div>
    );
}
