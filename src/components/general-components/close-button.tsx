'use client'
import { useRouter } from "next/navigation"

export default function CloseButton() {
    const router = useRouter()
    return (
        <button
            onClick={() => router.back()}>
            <span className="material-symbols-outlined hover:text-gray-500 transition">
                close
            </span>
        </button>
    )
}