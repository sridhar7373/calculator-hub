import { Calculator } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header() {
    return (
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link
                    to="/"
                    className="group flex items-center gap-2.5"
                >
                    <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
                        <Calculator className="size-5" />
                    </div>

                    <div className="leading-none">
                        <div className="text-base font-bold tracking-tight">
                            Calculator Hub
                        </div>

                        <div className="mt-1 hidden text-[11px] text-muted-foreground sm:block">
                            Calculate things that matter.
                        </div>
                    </div>
                </Link>

                {/* Navigation */}
                <nav>
                    <Link
                        to="/"
                        className="group inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-foreground transition-all hover:bg-muted hover:text-foreground"
                    >
                        <Calculator className="size-4 transition-transform group-hover:scale-110" />

                        <span>All Calculators</span>
                    </Link>
                </nav>
            </div>
        </header>
    );
}