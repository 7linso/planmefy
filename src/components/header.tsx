'use client'
import Link from "next/link"
import { signIn, signOut, useSession } from "next-auth/react";
import ThemeToggler from "./general-components/theme-toggler";
import { useRouter } from 'next/navigation'

export default function Header() {
    const { data: session } = useSession();
    const router = useRouter()

    return (<>
        <nav className="flex justify-between items-center px-6 py-4 mx-10 sticky top-0">
            <Link href='/' className="text-2xl font-bold">
                Planmefy
            </Link>
            <ThemeToggler />
            <div className="flex items-center gap-5">
                <div className="flex items-center gap-2">
                    {session ? (
                        <div className="relative group inline-block">
                            <button
                                onClick={() =>
                                    signOut({ redirect: false }).then(() => {
                                        router.push('/home')
                                    })
                                }
                                className="flex items-center text-sm font-medium text-blue-300 dark:hover:text-blue-100 hover:text-blue-400 transition duration-200"
                            >
                                <span className="material-symbols-outlined text-3xl ml-2">
                                    account_circle_off
                                </span>
                            </button>
                            <div className="absolute right-0 mt-2 w-40 text-sm text-gray-500 bg-white border border-gray-200 rounded-lg shadow dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800 z-50 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200">
                                <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                        Sign Out
                                    </h3>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="relative group inline-block">
                            <button
                                onClick={() => signIn('google', { callbackUrl: '/' })}
                                className="flex items-center text-sm font-medium text-blue-300 dark:hover:text-blue-100 hover:text-blue-400 transition duration-200"
                            >
                                <span className="material-symbols-outlined text-3xl ml-1">
                                    person
                                </span>
                            </button>
                            <div className="absolute right-0 mt-2 w-40 text-sm text-gray-500 bg-white border border-gray-200 rounded-lg shadow dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800 z-50 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200">
                                <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                        Sign In
                                    </h3>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <Link href="/feedback"
                    className="material-symbols-outlined text-3xl text-gray-400 dark:hover:text-white hover:text-gray-700 transition duration-200">
                    help
                </Link>
            </div>
        </nav>

    </>)
}