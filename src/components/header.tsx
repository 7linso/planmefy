'use client'

import Link from "next/link"
import { signIn, signOut, useSession } from "next-auth/react";

export default function Header() {
    const { data: session } = useSession();

    return (<>
        <nav className="flex justify-between items-center px-6 py-4 mx-10">
            <Link href='/' className="text-2xl font-bold">
                Planmefy
            </Link>
            <div className="flex items-center gap-5">
                <div className="flex items-center gap-2">
                    {session ? (
                        <button
                            onClick={() => signOut()}
                            className="flex items-center text-sm font-medium text-blue-300 hover:text-blue-100 transition duration-200"
                        >
                            <span className="material-symbols-outlined text-3xl ml-2">
                                account_circle_off
                            </span>
                        </button>
                    ) : (
                        <button
                            onClick={() => signIn('google')}
                            className="flex items-center text-sm font-medium text-blue-300 hover:text-blue-100 transition duration-200"
                        >
                            <span className="material-symbols-outlined text-3xl ml-1">
                                person
                            </span>
                        </button>
                    )}
                </div>

                <Link replace={false} href="/feedback" className="material-symbols-outlined text-3xl text-gray-300 hover:text-white transition duration-200">
                    help
                </Link>
            </div>
        </nav>

    </>)
}