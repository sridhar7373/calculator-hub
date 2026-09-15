import { Link } from "react-router-dom";

import {
    ArrowRight,
    Cpu,
    MemoryStick,
    Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardTitle,
} from "@/components/ui/card";

const categories = [
    {
        title: "AI & Computing",
        description:
            "Calculate hardware requirements for AI and computing workloads.",
        icon: Cpu,
        calculators: [
            {
                name: "AI Memory Calculator",
                description:
                    "Estimate RAM required to run local AI models.",
                href: "/calculators/ai-memory",
                icon: MemoryStick,
            },
        ],
    },
    {
        title: "Energy",
        description:
            "Plan power, battery, inverter and solar systems.",
        icon: Zap,
        calculators: [
            {
                name: "Energy System Calculator",
                description:
                    "Calculate load, battery, inverter and solar requirements.",
                href: "/calculators/energy-system",
                icon: Zap,
            },
        ],
    },
];

export default function Home() {
    return (
        <main className="min-h-screen bg-background">
            <div className="mx-auto max-w-6xl px-6 py-16">
                {/* Hero */}
                <section className="max-w-3xl">
                    <Badge variant="secondary" className="mb-4">
                        Calculator Hub
                    </Badge>

                    <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                        Calculate things
                        <br />
                        that actually matter.
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
                        A collection of practical calculators for AI,
                        computing, energy, electrical systems and more.
                    </p>
                </section>

                {/* Categories */}
                <section className="mt-16 space-y-12">
                    {categories.map((category) => {
                        const CategoryIcon = category.icon;

                        return (
                            <div key={category.title}>
                                {/* Category Header */}
                                <div className="mb-6 flex items-start gap-4">
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-muted">
                                        <CategoryIcon className="size-5" />
                                    </div>

                                    <div>
                                        <h2 className="text-2xl font-semibold">
                                            {category.title}
                                        </h2>

                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {category.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Calculators */}
                                <div className="grid gap-4">
                                    {category.calculators.map(
                                        (calculator) => {
                                            const CalculatorIcon =
                                                calculator.icon;

                                            return (
                                                <Link
                                                    key={calculator.name}
                                                    to={calculator.href}
                                                    className="block"
                                                >
                                                    <Card className="transition-colors hover:bg-muted/50">
                                                        <CardContent className="flex items-center gap-4 p-5">
                                                            <div className="flex size-11 shrink-0 items-center justify-center rounded-lg border bg-muted">
                                                                <CalculatorIcon className="size-5" />
                                                            </div>

                                                            <div className="min-w-0 flex-1">
                                                                <div className="flex flex-wrap items-center gap-2">
                                                                    <CardTitle className="text-base">
                                                                        {
                                                                            calculator.name
                                                                        }
                                                                    </CardTitle>

                                                                    <Badge variant="secondary">
                                                                        Available
                                                                    </Badge>
                                                                </div>

                                                                <p className="mt-1 text-sm text-muted-foreground">
                                                                    {
                                                                        calculator.description
                                                                    }
                                                                </p>
                                                            </div>

                                                            <ArrowRight className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
                                                        </CardContent>
                                                    </Card>
                                                </Link>
                                            );
                                        },
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </section>
            </div>
        </main>
    );
}