import { Link, NextUIProvider } from "@nextui-org/react";
import { clsx } from "@nextui-org/shared-utils";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Metadata } from "next";
import React from "react";
import { minify } from "terser";
import { inter } from "@/components/assets/Fonts";
import { initializeTheme } from "@/components/theme/anti-flashbang";
import { ThemedPage } from "@/components/theme/ThemedPage";
import { ThemeSelector } from "@/components/theme/ThemeSelector";
import "./global.css";

export const metadata: Metadata = {
    title: "IMDB Graph",
    keywords: ["imdbgraph.org", "imdbgraph.com", "IMDB", "Graph", "IMDB Graph", "Visualize", "Episode ratings"],
    description: "Website to visualize IMDB TV show ratings as a graph",
    icons: "/favicon.ico",
};

async function minifyCode(func: { name: string; toString: () => string }) {
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
            <body className={clsx("min-h-screen min-w-80 bg-background antialiased", inter.variable)}>
                <script dangerouslySetInnerHTML={{ __html: await minifyCode(initializeTheme) }} />
                <NextUIProvider>
                    <ThemedPage>
                        <div className="flex flex-col min-h-[100dvh] items-center">
                            <div className="ml-auto p-3">
                                <ThemeSelector />
                            </div>
                            <div className="w-full flex flex-col flex-1">{props.children}</div>
                            <footer className="w-full flex items-center justify-center py-3">
                                <Link
                                    isExternal
                                    className="flex items-center gap-1 text-current"
                                    href="https://www.linkedin.com/in/aria-amini/"
                                    title="Aria Amini LinkedIn"
                                >
                                    <span className="text-default-600">Developed by</span>
                                    <p className="text-blue-600">Aria Amini</p>
                                </Link>
                            </footer>
                        </div>
                    </ThemedPage>
                </NextUIProvider>
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
