import Image from "next/image";
import React from "react";

export default function Page(props: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen min-w-fit items-center">
            <div className="w-full flex-1">{props.children}</div>
            <footer className="w-[calc(100%-4rem)] py-5 border-t">
                <a
                    href="https://www.linkedin.com/in/aria-amini/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex justify-center content-center"
                >
                    <span className="mr-[0.3rem] inline-block h-full align-middle">Developed by Aria Amini</span>
                    <Image className="align-middle" src="/linkedin.svg" alt="LinkedIn Logo" width={24} height={24} />
                </a>
            </footer>
        </div>
    );
}
