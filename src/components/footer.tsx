export default function Footer() {
    return (
        <footer className="border-t">
            <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                <p>
                    © {new Date().getFullYear()} Calculator Hub
                </p>

                <div className="flex items-center gap-5">
                    <p>
                        Simple calculators for things that matter.
                    </p>

                    <a
                        href="https://github.com/sridhar7373/calculator-hub"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="View Calculator Hub on GitHub"
                        className="inline-flex size-9 items-center justify-center rounded-lg border text-foreground transition-colors hover:bg-muted"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="size-4"
                            aria-hidden="true"
                        >
                            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.419 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.604-3.369-1.342-3.369-1.342-.455-1.157-1.11-1.465-1.11-1.465-.908-.621.069-.608.069-.608 1.004.071 1.532 1.03 1.532 1.03.892 1.529 2.341 1.087 2.91.832.091-.647.349-1.087.635-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.6 9.6 0 0 1 2.504.337c1.909-1.294 2.748-1.025 2.748-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.744 0 .267.18.579.688.481A10.001 10.001 0 0 0 22 12C22 6.477 17.523 2 12 2Z" />
                        </svg>
                    </a>
                </div>
            </div>
        </footer>
    );
}