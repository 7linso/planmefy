// src/components/plans/PlansList.tsx
"use client";

import { useEffect, useState } from "react";

type Plan = {
    _id: string;
    title: string;
    note?: string;
    created_at: string;
};

export default function PlansDisplay() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const res = await fetch("/api/post-plan", {
                    method: "GET",
                });

                if (!res.ok) throw new Error("Failed to fetch plans");

                const data = await res.json();
                setPlans(data.plans);
            } catch (err) {
                console.error("❌ Error loading plans:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, []);

    if (loading) return <p>Loading plans...</p>;
    if (!plans.length) return <p>No plans yet.</p>;

    return (
        <ul>
            {plans.map((plan) => (
                <li key={plan._id}>
                    <strong>{plan.title}</strong>
                    <p>{plan.note}</p>
                    <small>{new Date(plan.created_at).toLocaleString()}</small>
                </li>
            ))}
        </ul>
    );
}
