import "./global.css";
import { ThemeButton } from "@/components/theme/theme-button";
import { ThemedPage } from "@/components/theme/themed-page";
import { cn } from "@/lib/utils";
import { HeroUIProvider } from "@heroui/system";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import React from "react";

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

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    // SuppressHydrationWarning is necessary because it is impossible for the server to know what the default
    // theme is. So it will complain about mismatching class="dark" attribute. This only suppresses warnings for
    // the html element and not children. (Only 1 level deep)
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-dvh min-w-80 bg-background antialiased", inter.variable)}>
        <HeroUIProvider>
          <ThemedPage>
            <div className="flex flex-col min-h-dvh">
              {/* Header */}
              <div className="ml-auto p-3">
                <ThemeButton />
              </div>
              {/* Main content */}
              <div className="w-full flex flex-col flex-1">{props.children}</div>
              {/* Footer */}
              <footer className="py-6 px-6 w-full">
                <div className="flex flex-col items-center justify-between gap-4">
                  <p className="text-balance text-center text-sm leading-loose text-muted-foreground">
                    Built by{" "}
                    <a
                      href="https://www.linkedin.com/in/aria-amini/"
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium underline underline-offset-4"
                    >
                      Aria
                    </a>
                    . The source code is available on{" "}
                    <a
                      href="https://github.com/aamini11?tab=repositories"
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium underline underline-offset-4"
                    >
                      GitHub
                    </a>
                    .
                  </p>
                </div>
              </footer>
            </div>
          </ThemedPage>
        </HeroUIProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
