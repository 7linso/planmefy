import { getServerSession } from "next-auth"
import Link from "next/link"
import { authOptions } from "../api/auth/[...nextauth]/route"

export default async function LandingPage() {
    const session = await getServerSession(authOptions)
    const href = (session) ? '/' : 'signin'

    return (<>
        <div className="flex items-center justify-center text-center min-h-[calc(100vh-4rem)]">
            <div className="flex flex-col w-full h-full p-6 mx-auto max-w-4xl">
                <main className="flex-1 flex flex-col justify-center items-center px-3">
                    <h1 className="text-5xl font-bold mb-6">Planmefy</h1>
                    <p className="text-lg md:text-xl mb-6 max-w-xl leading-relaxed">
                        Welcome to Planmefy! <br />
                        Plan your life, organize your thoughts, and stay productive. <br />
                        Create, manage, and share your personal plans with ease.
                    </p>
                    <Link
                        href={href}
                        className="btn bg-white text-gray-900 px-6 py-3 text-lg font-semibold rounded shadow hover:bg-gray-200 transition"
                    >
                        Get Started
                    </Link>
                </main>
            </div>
        </div>
    </>)
}