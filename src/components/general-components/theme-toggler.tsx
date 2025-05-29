'use client'
import { useState, useEffect } from "react"

export default function ThemeToggler() {
    const [darkTheme, setDarkTheme] = useState(false)

    useEffect(() => {
        const stored = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (stored === 'dark' || (!stored && prefersDark)) {
            document.documentElement.classList.add('dark');
            setDarkTheme(true);
        }
    }, []);

    useEffect(() => {
        if (darkTheme === true) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('darkTheme', 'dark');
        } if (darkTheme === false) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('darkTheme', 'light');
        }
    }, [darkTheme])

    return (<>
        <label className="flex items-center gap-3 cursor-pointer">
            <span>🌞</span>
            <div className="relative">
                <input
                    type="checkbox"
                    checked={darkTheme}
                    onChange={(e) => setDarkTheme(e.target.checked)}
                    className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 rounded-full peer-checked:bg-navy-600 transition-colors"></div>
                <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-full"></div>
            </div>
            <span>🌑</span>
        </label>

    </>)
}