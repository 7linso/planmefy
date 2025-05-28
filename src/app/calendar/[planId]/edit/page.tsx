import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth"
import PlansEditForm from "@/components/plans/plans-edit-form"
import { notFound } from 'next/navigation'
import { getUserPlansById } from '@/lib/actions'

type EditPlanProps = {
    params: {
        planId: string
    }
}

export default async function EditPlan({ params }: EditPlanProps) {
    const session = await getServerSession(authOptions)
    if (!session) redirect('/')
        
    const { planId } = await params
    const plan = await getUserPlansById(planId, session.user.id)
    if (!plan) return notFound()

    return <PlansEditForm plan={plan} />
}