'use client'

import { signIn } from 'next-auth/react'
import Image from 'next/image'

export default function LoginPage() {
    return (
        <div className="flex items-center justify-center text-center min-h-[calc(100vh-4rem)]">
            <div className="p-10 rounded-lg shadow-md text-center max-w-sm w-full">
                <h1 className="text-2xl font-bold mb-4">Welcome to Planmefy</h1>
                <div className="mt-6">
                    <h2 className="font-semibold mb-1 text-2xl">We value your privacy</h2>
                    <p>
                        To keep your data safe and secure, we use Google for authentication.
                        Your information is never shared without consent.
                    </p>
                    <p className="mt-2">
                        Additional login options will be available soon. Stay tuned!
                    </p>
                </div>
                <p className="mb-6 text-gray-500">Sign in to continue</p>

                <button
                    onClick={() => signIn('google', {callbackUrl: '/calendar'})}
                    className="flex items-center justify-center gap-3 w-full px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md shadow"
                >
                    <Image
                        src="/google-icon.svg"
                        alt="Google"
                        width={20}
                        height={20}
                        className="rounded-full"
                    />
                    Continue with Google
                </button>
            </div>
        </div>
    )
}
