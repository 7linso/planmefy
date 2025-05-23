import { getUserPlansById } from '@/lib/actions'
import { notFound } from 'next/navigation'
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth"

interface PlanDetailedPageProps {
    params: {
        id: string
    }
}

export default async function PlanDetailedPage({ params }: PlanDetailedPageProps) {
    const session = await getServerSession(authOptions)
    if (!session) redirect('/')

    const userPlan = await getUserPlansById(params.id)
    if (!userPlan) return notFound()

    return (<>
        <h1>{userPlan.title}</h1>
    </>)
}