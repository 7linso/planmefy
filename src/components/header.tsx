'use client'

import Link from "next/link"
import { signIn, signOut, useSession } from "next-auth/react";

export default function Header() {
    const { data: session } = useSession();

    return (<>
        <nav className="flex justify-between items-center px-6 py-4 mx-10">
            <div className="text-2xl font-bold">
                Planmefy
            </div>
            <div className="flex gap-5">
                <div>
                    {session ? (
                        <div className="flex gap-2">
                            <p>Welcome, {session.user?.name}</p>
                            <button onClick={() => signOut()} className="material-symbols-outlined text-3xl">
                                account_circle_off
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => signIn('google')} className="material-symbols-outlined text-3xl">
                            person
                        </button>)}
                </div>

                <Link href="" className="material-symbols-outlined text-3xl">
                    help
                </Link>
            </div>
        </nav>
    </>)
}