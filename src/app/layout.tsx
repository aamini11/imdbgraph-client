import { NextUIProvider } from "@nextui-org/system";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Metadata } from "next";
import React from "react";
import { inter } from "@/components/assets/fonts";
import { ThemeButton } from "@/components/theme/theme-button";
import { ThemedPage } from "@/components/theme/themed-page";
import { Footer } from "@/components/ui/footer";
import { cn } from "@/lib/utils";
import "./global.css";

export const metadata: Metadata = {
    title: "IMDB Graph",
    keywords: [
        "imdbgraph.org",
        "imdbgraph.com",
        "IMDB",
        "Graph",
        "IMDB Graph",
        "IMDB Chart",
        "imdbgraph",
        "Visualize",
        "Episode ratings",
        "chart",
        "season",
        "episode",
    ],
    description: "Website to visualize IMDB TV show ratings as a graph",
    icons: "/favicon.ico",
};

export default async function RootLayout(props: { children: React.ReactNode }) {
    return (
        // SuppressHydrationWarning is necessary because it is impossible for the server to know what the default
        // theme is. So it will complain about mismatching class="dark" attribute. This only suppresses warnings for
        // the html element and not children. (Only 1 level deep)
        <html lang="en" suppressHydrationWarning>
            <body className={cn("min-h-dvh min-w-80 bg-background antialiased", inter.variable)}>
                <NextUIProvider>
                    <ThemedPage>
                        <div className="flex flex-col min-h-[100dvh]">
                            <div className="ml-auto p-3">
                                <ThemeButton />
                            </div>
                            <div className="w-full flex flex-col flex-1">{props.children}</div>
                            <Footer />
                        </div>
                    </ThemedPage>
                </NextUIProvider>
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
