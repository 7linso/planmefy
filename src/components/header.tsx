'use client'

import Link from "next/link"
import { signIn, signOut, useSession } from "next-auth/react";
import ThemeToggler from "./general-components/theme-toggler";

export default function Header() {
    const { data: session } = useSession();

    return (<>
        <nav className="flex justify-between items-center px-6 py-4 mx-10">
            <Link href='/' className="text-2xl font-bold">
                Planmefy
            </Link>
            <ThemeToggler />
            <div className="flex items-center gap-5">
                <div className="flex items-center gap-2">
                    {session ? (
                        <button
                            onClick={() => signOut()}
                            className="flex items-center text-sm font-medium text-blue-300 dark:hover:text-blue-100 hover:text-blue-400 transition duration-200"
                        >
                            <span className="material-symbols-outlined text-3xl ml-2">
                                account_circle_off
                            </span>
                        </button>
                    ) : (
                        <button
                            onClick={() => signIn('google')}
                                className="flex items-center text-sm font-medium text-blue-300 dark:hover:text-blue-100 hover:text-blue-400 transition duration-200"
                        >
                            <span className="material-symbols-outlined text-3xl ml-1">
                                person
                            </span>
                        </button>
                    )}
                </div>
                <Link replace={false} href="/feedback"
                    className="material-symbols-outlined text-3xl text-gray-400 dark:hover:text-white hover:text-gray-700 transition duration-200">
                    help
                </Link>
            </div>
        </nav>

    </>)
}