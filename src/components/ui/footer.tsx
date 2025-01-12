export function Footer() {
    return (
        <footer className="py-6">
            <div className="container flex flex-col items-center justify-between gap-4">
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
    );
}
