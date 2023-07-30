import { ThemedPage } from "components/theme/ThemedPage";
import { ThemeSelector } from "components/theme/ThemeSelector";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import React from "react";
import { minify } from "terser";
import { initializeTheme } from "utils/anti-flashbang";
import "./global.css";

export const metadata: Metadata = {
    title: "IMDB Graph",
    keywords: ["imdbgraph.org", "imdbgraph.com", "IMDB", "Graph", "IMDB Graph", "Visualize", "Episode ratings"],
    description: "Website to visualize IMDB TV show ratings as a graph",
    icons: "/favicon.ico",
};

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
});

async function minifyCode(func: { name: string, toString: () => string }) {
    const minifyOutput = await minify(func.toString() + `\n ${func.name}()`);

    if (!minifyOutput.code) {
        throw new Error("Minified code is empty");
    }

    return minifyOutput.code;
}

export default async function RootLayout(props: { children: React.ReactNode }) {
    return (
        // SuppressHydrationWarning is necessary because it is impossible for the server to know what the default
        // theme is. So it will complain about mismatching class="dark" attribute. This only suppresses warnings for
        // the html element and not children. (Only 1 level deep)
        <html suppressHydrationWarning>
            <body>
                <script dangerouslySetInnerHTML={{ __html: await minifyCode(initializeTheme) }} />
                <ThemedPage interClassName={inter.className}>
                    <div className="flex flex-col min-h-[100dvh] items-center">
                        <div className="ml-auto p-3">
                            <ThemeSelector />
                        </div>
                        <div className="w-full flex-1">{props.children}</div>
                        <footer className="flex justify-center w-[calc(100%-4rem)] py-5 border-t">
                            <a
                                href="https://www.linkedin.com/in/aria-amini/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex justify-center content-center hover:text-blue-600 dark:hover:text-neutral-300 transition hover:ease-in duration-100"
                            >
                                <span className="mr-[0.3rem] inline-block h-full align-middle">
                                    Developed by Aria Amini
                                </span>
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
            </body>
        </html>
    );
}