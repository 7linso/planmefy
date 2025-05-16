'use client'
import { useState } from "react";

export default function PlansForm() {
    const [form, setForm] = useState({ title: '', note: '' })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const res = await fetch("/api/post-plan", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...form, userId: '1' })
        })
        const data = await res.text();
        console.log("Raw response:", data);
    }

    return (
        <form className="m-10" onSubmit={handleSubmit}>
            <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium mb-1">
                    Title
                </label>
                <input type="text" id="title" name='title' placeholder="Walk the dog"
                    className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-800 transition"
                    onChange={handleChange}
                />

            </div>
            <div className="mb-4">
                <label htmlFor="note" className="block text-sm font-medium mb-1">
                    Notes
                </label>
                <textarea id="note" name='note' placeholder="It's gonna be hella hot so take water"
                    className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-800 transition resize-none"
                    onChange={handleChange}
                />
            </div>
            <button type="submit" className="p-2 rounded-md border">
                Submit
            </button>
        </form>
    );
}
