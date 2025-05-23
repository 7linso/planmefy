import { getUserPlansById } from '@/lib/actions'
import { notFound } from 'next/navigation'
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth"
import PlansDetailsModal from '@/components/plans/plans-details-modal'

export default async function PlanDetailedPage({ params }: { params: { planId: string } }) {
    const session = await getServerSession(authOptions)
    if (!session) redirect('/')
        
    const { planId } = await params
    const userPlan = await getUserPlansById(planId, session.user.id)
    if (!userPlan) return notFound()

    return <PlansDetailsModal userPlan={userPlan} />
}

