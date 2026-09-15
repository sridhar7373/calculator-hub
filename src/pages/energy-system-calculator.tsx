import { useMemo, useState } from "react";
import {
    Battery,
    CheckCircle2,
    Plus,
    Sun,
    Trash2,
    TriangleAlert,
    Zap,
} from "lucide-react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

type LoadItem = {
    id: number;
    name: string;
    quantity: string;
    watts: string;
    hours: string;
};

const defaultLoads: LoadItem[] = [
    {
        id: 1,
        name: "Fan",
        quantity: "3",
        watts: "70",
        hours: "8",
    },
    {
        id: 2,
        name: "LED Light",
        quantity: "5",
        watts: "10",
        hours: "6",
    },
    {
        id: 3,
        name: "TV",
        quantity: "1",
        watts: "100",
        hours: "4",
    },
];

function getNumber(value: string) {
    const number = Number(value);

    return Number.isFinite(number) && number > 0
        ? number
        : 0;
}

function formatWatts(value: number) {
    if (value >= 1000) {
        return `${(value / 1000).toFixed(2)} kW`;
    }

    return `${Math.round(value)} W`;
}

function formatEnergy(value: number) {
    if (value >= 1000) {
        return `${(value / 1000).toFixed(2)} kWh`;
    }

    return `${Math.round(value)} Wh`;
}

function formatTime(value: number) {
    if (!Number.isFinite(value) || value <= 0) {
        return "0 min";
    }

    const hours = Math.floor(value);
    const minutes = Math.round(
        (value - hours) * 60
    );

    if (hours === 0) {
        return `${minutes} min`;
    }

    if (minutes === 0) {
        return `${hours}h`;
    }

    return `${hours}h ${minutes}m`;
}

export default function EnergySystemCalculator() {
    const [loads, setLoads] =
        useState<LoadItem[]>(defaultLoads);

    // Existing system
    const [batteryVoltage, setBatteryVoltage] =
        useState("24");

    const [batteryAh, setBatteryAh] =
        useState("100");

    const [batteryType, setBatteryType] =
        useState("lifepo4");

    const [inverterWatts, setInverterWatts] =
        useState("1000");

    const [inverterEfficiency, setInverterEfficiency] =
        useState("90");

    const [solarWatts, setSolarWatts] =
        useState("500");

    const [sunHours, setSunHours] =
        useState("5");

    const result = useMemo(() => {
        /*
         * Total power required if all appliances
         * are running at the same time.
         */
        const currentLoad = loads.reduce(
            (total, load) => {
                return (
                    total +
                    getNumber(load.quantity) *
                    getNumber(load.watts)
                );
            },
            0
        );

        /*
         * Estimated daily energy consumption.
         */
        const dailyEnergy = loads.reduce(
            (total, load) => {
                return (
                    total +
                    getNumber(load.quantity) *
                    getNumber(load.watts) *
                    getNumber(load.hours)
                );
            },
            0
        );

        const voltage =
            getNumber(batteryVoltage);

        const capacityAh =
            getNumber(batteryAh);

        const efficiency =
            Math.max(
                1,
                Math.min(
                    100,
                    getNumber(
                        inverterEfficiency
                    )
                )
            ) / 100;

        /*
         * Battery nominal energy.
         *
         * Example:
         * 24V × 100Ah = 2400Wh
         */
        const batteryEnergy =
            voltage * capacityAh;

        /*
         * Approximate usable battery capacity.
         */
        const depthOfDischarge =
            batteryType === "lifepo4"
                ? 0.9
                : 0.5;

        const usableBatteryEnergy =
            batteryEnergy *
            depthOfDischarge;

        /*
         * Energy available to AC appliances
         * after inverter losses.
         */
        const usableAcEnergy =
            usableBatteryEnergy *
            efficiency;

        /*
         * Estimated backup time at current load.
         */
        const backupTime =
            currentLoad > 0
                ? usableAcEnergy /
                currentLoad
                : 0;

        /*
         * Inverter utilization.
         */
        const inverterCapacity =
            getNumber(inverterWatts);

        const inverterUsage =
            inverterCapacity > 0
                ? (currentLoad /
                    inverterCapacity) *
                100
                : 0;

        /*
         * Remaining inverter capacity.
         */
        const remainingInverterCapacity =
            Math.max(
                0,
                inverterCapacity -
                currentLoad
            );

        /*
         * Estimated solar generation per day.
         */
        const panelCapacity =
            getNumber(solarWatts);

        const peakSunHours =
            getNumber(sunHours);

        const solarGeneration =
            panelCapacity *
            peakSunHours *
            0.8;

        /*
         * Solar generation minus daily usage.
         */
        const solarBalance =
            solarGeneration -
            dailyEnergy;

        /*
         * Can the inverter handle the
         * selected appliances?
         */
        const inverterCanHandle =
            currentLoad <=
            inverterCapacity;

        return {
            currentLoad,
            dailyEnergy,
            batteryEnergy,
            usableBatteryEnergy,
            usableAcEnergy,
            backupTime,
            inverterCapacity,
            inverterUsage,
            remainingInverterCapacity,
            solarGeneration,
            solarBalance,
            inverterCanHandle,
        };
    }, [
        loads,
        batteryVoltage,
        batteryAh,
        batteryType,
        inverterWatts,
        inverterEfficiency,
        solarWatts,
        sunHours,
    ]);

    function updateLoad(
        id: number,
        field: keyof LoadItem,
        value: string
    ) {
        setLoads((current) =>
            current.map((load) =>
                load.id === id
                    ? {
                        ...load,
                        [field]: value,
                    }
                    : load
            )
        );
    }

    function addLoad() {
        setLoads((current) => [
            ...current,
            {
                id: Date.now(),
                name: "New Device",
                quantity: "1",
                watts: "100",
                hours: "1",
            },
        ]);
    }

    function removeLoad(id: number) {
        setLoads((current) =>
            current.filter(
                (load) => load.id !== id
            )
        );
    }

    return (
        <main className="min-h-screen">
            <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
                {/* Page Header */}
                <div className="mb-8 sm:mb-10">
                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                        Energy System Calculator
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
                        See what your battery, inverter and
                        solar system can actually run.
                    </p>
                </div>

                <div className="space-y-5 sm:space-y-6">
                    {/* Your System */}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                1. Your System
                            </CardTitle>

                            <CardDescription>
                                Enter the equipment you already
                                have.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                {/* Battery Voltage */}
                                <div>
                                    <Label htmlFor="battery-voltage">
                                        Battery voltage
                                    </Label>

                                    <Select
                                        value={
                                            batteryVoltage
                                        }
                                        onValueChange={(
                                            value
                                        ) => {
                                            if (
                                                value !==
                                                null
                                            ) {
                                                setBatteryVoltage(
                                                    value
                                                );
                                            }
                                        }}
                                    >
                                        <SelectTrigger
                                            id="battery-voltage"
                                            className="mt-2 w-full"
                                        >
                                            <SelectValue />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectItem value="12">
                                                12V
                                            </SelectItem>

                                            <SelectItem value="24">
                                                24V
                                            </SelectItem>

                                            <SelectItem value="48">
                                                48V
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Battery Capacity */}
                                <div>
                                    <Label htmlFor="battery-ah">
                                        Battery capacity
                                    </Label>

                                    <div className="mt-2 flex items-center gap-2">
                                        <Input
                                            id="battery-ah"
                                            type="number"
                                            min="0"
                                            step="1"
                                            value={
                                                batteryAh
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setBatteryAh(
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                        />

                                        <span className="text-sm font-medium text-muted-foreground">
                                            Ah
                                        </span>
                                    </div>
                                </div>

                                {/* Battery Type */}
                                <div>
                                    <Label htmlFor="battery-type">
                                        Battery type
                                    </Label>

                                    <Select
                                        value={
                                            batteryType
                                        }
                                        onValueChange={(
                                            value
                                        ) => {
                                            if (
                                                value !==
                                                null
                                            ) {
                                                setBatteryType(
                                                    value
                                                );
                                            }
                                        }}
                                    >
                                        <SelectTrigger
                                            id="battery-type"
                                            className="mt-2 w-full"
                                        >
                                            <SelectValue />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectItem value="lifepo4">
                                                LiFePO4
                                            </SelectItem>

                                            <SelectItem value="lead-acid">
                                                Lead-acid
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Inverter */}
                                <div>
                                    <Label htmlFor="inverter-watts">
                                        Inverter capacity
                                    </Label>

                                    <div className="mt-2 flex items-center gap-2">
                                        <Input
                                            id="inverter-watts"
                                            type="number"
                                            min="0"
                                            step="50"
                                            value={
                                                inverterWatts
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setInverterWatts(
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                        />

                                        <span className="text-sm font-medium text-muted-foreground">
                                            W
                                        </span>
                                    </div>
                                </div>

                                {/* Inverter Efficiency */}
                                <div>
                                    <Label htmlFor="inverter-efficiency">
                                        Inverter efficiency
                                    </Label>

                                    <div className="mt-2 flex items-center gap-2">
                                        <Input
                                            id="inverter-efficiency"
                                            type="number"
                                            min="1"
                                            max="100"
                                            value={
                                                inverterEfficiency
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setInverterEfficiency(
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                        />

                                        <span className="text-sm font-medium text-muted-foreground">
                                            %
                                        </span>
                                    </div>
                                </div>

                                {/* Solar */}
                                <div>
                                    <Label htmlFor="solar-watts">
                                        Solar capacity
                                    </Label>

                                    <div className="mt-2 flex items-center gap-2">
                                        <Input
                                            id="solar-watts"
                                            type="number"
                                            min="0"
                                            step="50"
                                            value={
                                                solarWatts
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setSolarWatts(
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                        />

                                        <span className="text-sm font-medium text-muted-foreground">
                                            W
                                        </span>
                                    </div>
                                </div>

                                {/* Peak Sun Hours */}
                                <div>
                                    <Label htmlFor="sun-hours">
                                        Peak sun hours
                                    </Label>

                                    <div className="mt-2 flex items-center gap-2">
                                        <Input
                                            id="sun-hours"
                                            type="number"
                                            min="0"
                                            step="0.5"
                                            value={sunHours}
                                            onChange={(
                                                event
                                            ) =>
                                                setSunHours(
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                        />

                                        <span className="text-sm font-medium text-muted-foreground">
                                            h/day
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Appliances */}
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="min-w-0">
                                    <CardTitle>
                                        2. What Do You Want
                                        to Run?
                                    </CardTitle>

                                    <CardDescription>
                                        Add the appliances you
                                        want to use with your
                                        system.
                                    </CardDescription>
                                </div>

                                <button
                                    type="button"
                                    onClick={addLoad}
                                    className="inline-flex h-10 w-full shrink-0 items-center justify-center gap-2 rounded-md border px-3 text-sm font-medium hover:bg-muted sm:w-auto"
                                >
                                    <Plus className="size-4" />
                                    Add device
                                </button>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <div className="space-y-4">
                                {loads.map((load) => {
                                    const loadWatts =
                                        getNumber(
                                            load.quantity
                                        ) *
                                        getNumber(
                                            load.watts
                                        );

                                    const dailyEnergy =
                                        loadWatts *
                                        getNumber(
                                            load.hours
                                        );

                                    return (
                                        <div
                                            key={load.id}
                                            className="rounded-xl border p-4"
                                        >
                                            {/* Main fields */}
                                            <div className="grid gap-4 sm:grid-cols-[2fr_1fr_1fr_auto]">
                                                {/* Device */}
                                                <div>
                                                    <Label>
                                                        Device
                                                    </Label>

                                                    <Input
                                                        className="mt-2"
                                                        value={
                                                            load.name
                                                        }
                                                        onChange={(
                                                            event
                                                        ) =>
                                                            updateLoad(
                                                                load.id,
                                                                "name",
                                                                event
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                    />
                                                </div>

                                                {/* Quantity */}
                                                <div>
                                                    <Label>
                                                        Quantity
                                                    </Label>

                                                    <Input
                                                        className="mt-2"
                                                        type="number"
                                                        min="1"
                                                        step="1"
                                                        value={
                                                            load.quantity
                                                        }
                                                        onChange={(
                                                            event
                                                        ) =>
                                                            updateLoad(
                                                                load.id,
                                                                "quantity",
                                                                event
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                    />
                                                </div>

                                                {/* Watts */}
                                                <div>
                                                    <Label>
                                                        Watts
                                                    </Label>

                                                    <Input
                                                        className="mt-2"
                                                        type="number"
                                                        min="0"
                                                        step="1"
                                                        value={
                                                            load.watts
                                                        }
                                                        onChange={(
                                                            event
                                                        ) =>
                                                            updateLoad(
                                                                load.id,
                                                                "watts",
                                                                event
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                    />
                                                </div>

                                                {/* Delete */}
                                                <div className="flex items-end">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeLoad(
                                                                load.id
                                                            )
                                                        }
                                                        className="inline-flex size-10 items-center justify-center rounded-md border text-muted-foreground hover:bg-muted hover:text-destructive"
                                                        aria-label={`Remove ${load.name}`}
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Hours + calculated values */}
                                            <div className="mt-4 grid gap-4 border-t pt-4 sm:grid-cols-3">
                                                {/* Hours */}
                                                <div>
                                                    <Label>
                                                        Hours/day
                                                    </Label>

                                                    <Input
                                                        className="mt-2"
                                                        type="number"
                                                        min="0"
                                                        max="24"
                                                        step="0.5"
                                                        value={
                                                            load.hours
                                                        }
                                                        onChange={(
                                                            event
                                                        ) =>
                                                            updateLoad(
                                                                load.id,
                                                                "hours",
                                                                event
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                    />
                                                </div>

                                                {/* Load */}
                                                <div className="rounded-lg bg-muted/40 p-3">
                                                    <p className="text-xs text-muted-foreground">
                                                        Load
                                                    </p>

                                                    <p className="mt-1 font-medium">
                                                        {formatWatts(
                                                            loadWatts
                                                        )}
                                                    </p>
                                                </div>

                                                {/* Energy */}
                                                <div className="rounded-lg bg-muted/40 p-3">
                                                    <p className="text-xs text-muted-foreground">
                                                        Energy/day
                                                    </p>

                                                    <p className="mt-1 font-medium">
                                                        {formatEnergy(
                                                            dailyEnergy
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Results */}
                    <Card className="overflow-hidden border-emerald-500/30 p-0">
                        <CardHeader className="bg-emerald-500/5 px-5 py-5 sm:px-6">
                            <CardTitle>
                                3. What You Get
                            </CardTitle>

                            <CardDescription>
                                See how your existing system
                                handles these appliances.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="p-4 sm:p-6">
                            {/* Inverter status */}
                            {result.inverterCanHandle ? (
                                <div className="mb-5 flex items-start gap-3 rounded-xl bg-emerald-500/10 p-4">
                                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />

                                    <div className="min-w-0">
                                        <p className="font-semibold text-emerald-700 dark:text-emerald-300">
                                            Your inverter can
                                            handle this load
                                        </p>

                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {formatWatts(
                                                result.currentLoad
                                            )}{" "}
                                            used out of{" "}
                                            {formatWatts(
                                                result.inverterCapacity
                                            )}
                                            .
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="mb-5 flex items-start gap-3 rounded-xl bg-destructive/10 p-4">
                                    <TriangleAlert className="mt-0.5 size-5 shrink-0 text-destructive" />

                                    <div className="min-w-0">
                                        <p className="font-semibold text-destructive">
                                            Your inverter is
                                            overloaded
                                        </p>

                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Your appliances require{" "}
                                            {formatWatts(
                                                result.currentLoad
                                            )}{" "}
                                            but your inverter is
                                            only{" "}
                                            {formatWatts(
                                                result.inverterCapacity
                                            )}
                                            .
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Main results */}
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {/* Backup */}
                                <div className="rounded-xl bg-violet-500/10 p-4 sm:p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/15">
                                            <Battery className="size-5 text-violet-600 dark:text-violet-400" />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="text-sm text-muted-foreground">
                                                Battery backup
                                            </p>

                                            <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                                                {formatTime(
                                                    result.backupTime
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="mt-3 text-xs text-muted-foreground">
                                        At the current{" "}
                                        {formatWatts(
                                            result.currentLoad
                                        )}{" "}
                                        load
                                    </p>
                                </div>

                                {/* Inverter */}
                                <div className="rounded-xl bg-amber-500/10 p-4 sm:p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/15">
                                            <Zap className="size-5 text-amber-600 dark:text-amber-400" />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="text-sm text-muted-foreground">
                                                Inverter usage
                                            </p>

                                            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                                                {Math.round(
                                                    result.inverterUsage
                                                )}
                                                %
                                            </p>
                                        </div>
                                    </div>

                                    <p className="mt-3 text-xs text-muted-foreground">
                                        {formatWatts(
                                            result.remainingInverterCapacity
                                        )}{" "}
                                        capacity remaining
                                    </p>
                                </div>

                                {/* Solar */}
                                <div className="rounded-xl bg-blue-500/10 p-4 sm:p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/15">
                                            <Sun className="size-5 text-blue-600 dark:text-blue-400" />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="text-sm text-muted-foreground">
                                                Solar generation
                                            </p>

                                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                                {formatEnergy(
                                                    result.solarGeneration
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="mt-3 text-xs text-muted-foreground">
                                        Estimated per day
                                    </p>
                                </div>
                            </div>

                            <Separator className="my-5 sm:my-6" />

                            {/* System Summary */}
                            <div>
                                <p className="mb-3 text-sm font-medium">
                                    System summary
                                </p>

                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                    <div className="rounded-lg border bg-muted/30 p-3">
                                        <p className="text-xs text-muted-foreground">
                                            Battery
                                        </p>

                                        <p className="mt-1 font-semibold">
                                            {
                                                batteryVoltage
                                            }
                                            V{" "}
                                            {batteryAh}
                                            Ah
                                        </p>
                                    </div>

                                    <div className="rounded-lg border bg-muted/30 p-3">
                                        <p className="text-xs text-muted-foreground">
                                            Current load
                                        </p>

                                        <p className="mt-1 font-semibold">
                                            {formatWatts(
                                                result.currentLoad
                                            )}
                                        </p>
                                    </div>

                                    <div className="rounded-lg border bg-muted/30 p-3">
                                        <p className="text-xs text-muted-foreground">
                                            Daily energy
                                        </p>

                                        <p className="mt-1 font-semibold">
                                            {formatEnergy(
                                                result.dailyEnergy
                                            )}
                                        </p>
                                    </div>

                                    <div className="rounded-lg border bg-muted/30 p-3">
                                        <p className="text-xs text-muted-foreground">
                                            Solar
                                        </p>

                                        <p className="mt-1 font-semibold">
                                            {formatWatts(
                                                getNumber(
                                                    solarWatts
                                                )
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Solar Balance */}
                            <div className="mt-4 rounded-lg border bg-muted/30 p-4">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex min-w-0 items-start gap-3">
                                        <Sun className="mt-0.5 size-5 shrink-0 text-blue-600 dark:text-blue-400" />

                                        <div className="min-w-0">
                                            <p className="text-sm font-medium">
                                                Daily solar balance
                                            </p>

                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Estimated solar
                                                generation versus
                                                daily consumption
                                            </p>
                                        </div>
                                    </div>

                                    <p
                                        className={
                                            result.solarBalance >=
                                                0
                                                ? "font-semibold text-emerald-600 dark:text-emerald-400"
                                                : "font-semibold text-amber-600 dark:text-amber-400"
                                        }
                                    >
                                        {result.solarBalance >=
                                            0
                                            ? "+"
                                            : ""}
                                        {formatEnergy(
                                            result.solarBalance
                                        )}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}