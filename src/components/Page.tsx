import Image from "next/image";
import React from "react";
import { ThemedPage } from "./ThemeButton";

export default function Page(props: { children: React.ReactNode }) {
    return (
        <ThemedPage>
            <div className="flex flex-col min-h-screen min-w-fit items-center">
                <div className="w-full flex-1">{props.children}</div>
                <footer className="flex justify-center w-[calc(100%-4rem)] py-5 border-t">
                    <a
                        href="https://www.linkedin.com/in/aria-amini/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex justify-center content-center hover:text-blue-600 dark:hover:text-neutral-300 transition hover:ease-in duration-100"
                    >
                        <span className="mr-[0.3rem] inline-block h-full align-middle">Developed by Aria Amini</span>
                        <Image
                            className="align-middle"
                            src="/linkedin.svg"
                            alt="LinkedIn Logo"
                            width={24}
                            height={24}
                        />
                    </a>
                </footer>
            </div>
        </ThemedPage>
    );
}
