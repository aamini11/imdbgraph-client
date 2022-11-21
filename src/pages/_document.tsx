import { Head, Html, Main, NextScript } from "next/document";

/**
 * To prevent flashing/flickering when loading the dark theme, this no flash
 * script is necessary. Because it's run in the script tag in head, it's run
 * before anything has rendered. This is essentially the only way to solve the
 * problem. If you look on Google all sources will lead to a similar solution.
 *
 * https://github.com/vercel/next.js/discussions/12533
 */
export default function Document() {
    return (
        <Html>
            <Head>
                <script dangerouslySetInnerHTML={{
                  __html: `
                  (function () {
                        const storageKey = "theme";
                        const defaultTheme = "light";
                        const coalesceTheme = (theme) => theme === "dark" ? "dark" : defaultTheme;
                      
                        function setClassOnDocumentBody(theme) {
                          document.documentElement.classList.add(theme);
                          document.documentElement.classList.remove(theme === "dark" ? "light" : "dark");
                        }
                      
                        function getTheme() {
                          const localTheme = localStorage.getItem(storageKey);
                          if (localTheme === undefined) {
                            return defaultTheme;
                          } else {
                            return coalesceTheme(localTheme);
                          }
                        }
                      
                        const theme = getTheme();
                        setClassOnDocumentBody(coalesceTheme(theme));
                  })();
                `
                }}/>
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}