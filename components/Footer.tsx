import styles from "./Footer.module.css";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className={styles.footer}>
                <a href="https://www.linkedin.com/in/aria-amini/"
                   target="_blank"
                   rel="noopener noreferrer"
                >
                    <span className={styles.footerText}>Powered by Spruce Technologies</span>
                    <Image className={styles.logo} src="/linkedin.svg" alt="LinkedIn Logo" width={24} height={24}/>
                </a>
        </footer>
    );
}