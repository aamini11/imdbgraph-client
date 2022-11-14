import { Inter } from "@next/font/google";
import { AppProps } from "next/app";
import "../../styles/globals.css";

// If loading a variable font, you don't need to specify the font weight
// https://nextjs.org/docs/basic-features/font-optimization
const inter = Inter({ subsets: ['latin'] });

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
      <main className={inter.className}>
          <Component {...pageProps} />
      </main>
    );
}