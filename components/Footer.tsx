import Image from "next/image";

export default function Footer() {
    return (
        <footer className="py-5 px-0 border-t border-solid border-t-[#eaeaea]">
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
    );
}
