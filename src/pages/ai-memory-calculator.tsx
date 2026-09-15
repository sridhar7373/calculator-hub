import { useMemo, useState } from "react";
import { MemoryStick } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

type MemoryResult = {
    weights: number;
    contextMemory: number;
    total: number;
};

const contextOptions = [
    { label: "4K", value: 4096 },
    { label: "8K", value: 8192 },
    { label: "16K", value: 16384 },
    { label: "32K", value: 32768 },
    { label: "64K", value: 65536 },
    { label: "128K", value: 131072 },
    { label: "256K", value: 262144 },
];

const modelPresets = [3, 7, 14, 27, 32, 70];

function calculateRequiredRAM(parameters: number, bits: number, context: number, osOverhead: number): MemoryResult {
    const weights = (parameters * bits) / 8;
    const contextMemory = (context * 0.5) / 1000;
    const total = weights + contextMemory + osOverhead;

    return { weights, contextMemory, total };
}

function formatGB(value: number): string {
    if (!Number.isFinite(value)) {
        return "0 GB";
    }

    if (value < 10) {
        return `${value.toFixed(1)} GB`;
    }

    return `${Math.ceil(value)} GB`;
}

function formatContext(context: number): string {
    if (context >= 1_000_000) {
        return `${(context / 1_000_000).toFixed(1)}M`;
    }

    if (context >= 1_000) {
        return `${Math.round(context / 1_000)}K`;
    }

    return `${context}`;
}

export default function AiMemoryCalculator() {
    const [modelSize, setModelSize] = useState("7");
    const [quantization, setQuantization] = useState("4");
    const [context, setContext] = useState(4096);
    const [osOverhead, setOsOverhead] = useState("2");
    const [showAdvanced, setShowAdvanced] = useState(false);

    const parameters = Math.max(0, Number.parseFloat(modelSize) || 0);
    const bits = Number.parseFloat(quantization) || 4;
    const overhead = Math.max(
        0,
        Number.parseFloat(osOverhead) || 0,
    );

    const result = useMemo(() => {
        if (parameters <= 0) {
            return null;
        }

        const memory = calculateRequiredRAM(
            parameters,
            bits,
            context,
            overhead,
        );

        return {
            ...memory,
            required: Math.ceil(memory.total * 10) / 10,
        };
    }, [parameters, bits, context, overhead]);

    return (
        <main className="min-h-screen bg-background px-4 py-10 sm:px-6">
            <div className="mx-auto w-full max-w-3xl space-y-6">

                {/* Header */}
                <header className="space-y-3">
                    <Badge variant="secondary">
                        Local AI
                    </Badge>

                    <div className="flex items-start gap-3">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border bg-muted">
                            <MemoryStick className="size-5" />
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                AI Memory Calculator
                            </h1>

                            <p className="mt-1 text-muted-foreground">
                                Find out how much RAM an AI model needs.
                            </p>
                        </div>
                    </div>
                </header>

                {/* Result */}
                <Card className="overflow-hidden border-emerald-500/30">
                    <CardContent className="pt-6">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Estimated RAM Required
                                </p>

                                <div className="mt-2 text-5xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                                    {result ? formatGB(result.required) : "—"}
                                </div>

                                <p className="mt-2 text-sm text-muted-foreground">
                                    {result
                                        ? `${parameters}B model · ${bits}-bit · ${formatContext(context)} context`
                                        : "Enter a valid model size."}
                                </p>
                            </div>

                            {result && (
                                <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                    Estimated
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Model Parameters */}
                <Card>
                    <CardHeader>
                        <CardTitle>1. Model Parameters</CardTitle>

                        <CardDescription>
                            Configure the AI model and its quantization.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <div className="grid gap-6 sm:grid-cols-2">
                            {/* Model Size */}
                            <div>
                                <Label htmlFor="model-size">
                                    Model size
                                </Label>

                                <div className="mt-2 flex items-center gap-2">
                                    <Input
                                        id="model-size"
                                        type="number"
                                        min="0.1"
                                        step="0.1"
                                        value={modelSize}
                                        onChange={(event) =>
                                            setModelSize(event.target.value)
                                        }
                                    />

                                    <span className="text-sm font-medium text-muted-foreground">
                                        B
                                    </span>
                                </div>

                                <p className="mt-2 text-xs text-muted-foreground">
                                    Number of model parameters.
                                </p>
                            </div>

                            {/* Quantization */}
                            <div>
                                <Label htmlFor="quantization">
                                    Quantization
                                </Label>

                                <Select
                                    value={quantization}
                                    onValueChange={(value) => {
                                        if (value !== null) {
                                            setQuantization(value);
                                        }
                                    }}
                                >
                                    <SelectTrigger
                                        id="quantization"
                                        className="mt-2 w-full"
                                    >
                                        <SelectValue />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="1">1-bit</SelectItem>
                                        <SelectItem value="2">2-bit</SelectItem>
                                        <SelectItem value="3">3-bit</SelectItem>
                                        <SelectItem value="4">4-bit</SelectItem>
                                        <SelectItem value="5">5-bit</SelectItem>
                                        <SelectItem value="6">6-bit</SelectItem>
                                        <SelectItem value="8">8-bit</SelectItem>
                                    </SelectContent>
                                </Select>

                                <p className="mt-2 text-xs text-muted-foreground">
                                    Lower-bit quantization requires less memory.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Context */}
                <Card>
                    <CardHeader>
                        <CardTitle>3. Context Length</CardTitle>

                        <CardDescription>
                            Larger context windows require more memory.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                            {contextOptions.map((option) => (
                                <Button
                                    key={option.value}
                                    type="button"
                                    variant={
                                        context === option.value
                                            ? "default"
                                            : "outline"
                                    }
                                    onClick={() => setContext(option.value)}
                                >
                                    {option.label}
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Advanced Settings */}
                {/* Advanced Settings */}
                <Card>
                    <button
                        type="button"
                        onClick={() => setShowAdvanced((value) => !value)}
                        className="flex w-full items-center justify-between px-6 py-4 text-left"
                    >
                        <div>
                            <p className="font-medium">Advanced settings</p>
                            <p className="text-sm text-muted-foreground">
                                Configure additional memory overhead
                            </p>
                        </div>

                        <span className="text-sm text-muted-foreground">
                            {showAdvanced ? "Hide" : "Show"}
                        </span>
                    </button>

                    {showAdvanced && (
                        <>
                            <Separator />

                            <CardContent className="pt-5">
                                <div className="max-w-md">
                                    <Label htmlFor="os-overhead">
                                        OS overhead
                                    </Label>

                                    <div className="mt-2 flex items-center gap-2">
                                        <Input
                                            id="os-overhead"
                                            type="number"
                                            min="0"
                                            max="32"
                                            step="0.5"
                                            value={osOverhead}
                                            onChange={(event) =>
                                                setOsOverhead(event.target.value)
                                            }
                                        />

                                        <span className="text-sm font-medium text-muted-foreground">
                                            GB
                                        </span>
                                    </div>

                                    <p className="mt-2 text-xs text-muted-foreground">
                                        Memory reserved for the operating system and other
                                        applications.
                                    </p>
                                </div>
                            </CardContent>
                        </>
                    )}
                </Card>

                {/* Quick Model Sizes */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Model Sizes</CardTitle>

                        <CardDescription>
                            Select a common model size.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                            {modelPresets.map((size) => (
                                <Button
                                    key={size}
                                    type="button"
                                    variant={
                                        parameters === size
                                            ? "default"
                                            : "outline"
                                    }
                                    onClick={() => setModelSize(String(size))}
                                >
                                    {size}B
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Memory Breakdown */}
                {result && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Memory Breakdown</CardTitle>

                            <CardDescription>
                                Estimated components of the required memory.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-3">
                            {/* Model weights */}
                            <div className="flex items-center justify-between rounded-lg bg-blue-500/10 px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <div className="size-2.5 rounded-full bg-blue-500" />

                                    <span className="text-sm font-medium">
                                        Model weights
                                    </span>
                                </div>

                                <span className="font-semibold text-blue-600 dark:text-blue-400">
                                    {formatGB(result.weights)}
                                </span>
                            </div>

                            {/* Context memory */}
                            <div className="flex items-center justify-between rounded-lg bg-amber-500/10 px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <div className="size-2.5 rounded-full bg-amber-500" />

                                    <span className="text-sm font-medium">
                                        Context memory
                                    </span>
                                </div>

                                <span className="font-semibold text-amber-600 dark:text-amber-400">
                                    {formatGB(result.contextMemory)}
                                </span>
                            </div>

                            {/* OS overhead */}
                            <div className="flex items-center justify-between rounded-lg bg-violet-500/10 px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <div className="size-2.5 rounded-full bg-violet-500" />

                                    <span className="text-sm font-medium">
                                        OS overhead
                                    </span>
                                </div>

                                <span className="font-semibold text-violet-600 dark:text-violet-400">
                                    {formatGB(overhead)}
                                </span>
                            </div>

                            <Separator className="my-4" />

                            {/* Total */}
                            <div className="flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-4">
                                <div>
                                    <p className="font-semibold">
                                        Total estimated RAM
                                    </p>

                                    <p className="text-xs text-muted-foreground">
                                        Recommended minimum
                                    </p>
                                </div>

                                <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                                    {formatGB(result.required)}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <p className="text-center text-xs leading-5 text-muted-foreground">
                    Estimates are approximate. Actual requirements depend on
                    model architecture, runtime, quantization and hardware.
                </p>
            </div>
        </main>
    );
}