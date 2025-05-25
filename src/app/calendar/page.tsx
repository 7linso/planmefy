import PlansDisplay from '@/components/plans/plans-display'
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth"

export default async function Page() {
    const session = await getServerSession(authOptions)
    if (!session) redirect('/')
    return (
        <PlansDisplay />
    )
}
