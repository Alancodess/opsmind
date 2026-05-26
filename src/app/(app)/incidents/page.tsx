"use client";

import { useEffect, useState } from "react";

export default function IncidentsPage() {
    useEffect(() => {
        fetchIncidents();
    }, []);

    async function fetchIncidents() {
        try {
            const res = await fetch("/api/incidents");
            const data = await res.json();

            setIncidents(data);
        } catch (error) {
            console.log(error);
        }
    }
    const [title, setTitle] = useState("");
    const [severity, setSeverity] = useState("medium");
    const [status, setStatus] = useState("open");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [incidents, setIncidents] = useState([]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        setLoading(true);
        setMessage("");

        try {
            const response = await fetch("/api/incidents", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    severity,
                    status,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to create incident");
            }

            setMessage("Incident created successfully");
            await fetchIncidents();

            setTitle("");
            setSeverity("medium");
            setStatus("open");
        } catch (err) {
            setMessage("Something went wrong");
        }

        setLoading(false);
    }

    return (
        <main className="min-h-screen bg-black px-6 py-16 text-white">
            <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-white/5 p-8">
                <h1 className="mb-6 text-3xl font-semibold">
                    Create Incident
                </h1>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="mb-2 block text-sm text-neutral-300">
                            Incident Title
                        </label>

                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 outline-none"
                            placeholder="Database outage..."
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-neutral-300">
                            Severity
                        </label>

                        <select
                            value={severity}
                            onChange={(e) => setSeverity(e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 outline-none"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="critical">Critical</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-white py-3 text-black transition hover:opacity-80"
                    >
                        {loading ? "Creating..." : "Create Incident"}
                    </button>
                </form>

                {message && (
                    <p className="mt-6 text-center text-sm text-neutral-300">
                        {message}
                    </p>
                )}

                <div className="mt-10 space-y-4">
                    <h2 className="text-xl font-semibold">
                        Recent Incidents
                    </h2>

                    {incidents.map((incident: any) => (
                        <div
                            key={incident.id}
                            className="rounded-lg border border-white/10 bg-white/5 p-4"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium">
                                    {incident.title}
                                </h3>

                                <span className="text-sm text-neutral-400">
                                    {incident.severity}
                                </span>
                            </div>

                            <p className="mt-2 text-sm text-neutral-500">
                                Status: {incident.status}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}