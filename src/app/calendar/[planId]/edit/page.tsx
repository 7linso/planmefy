import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth"
import PlansEditForm from "@/components/plans/plans-edit-form"
import { notFound } from 'next/navigation'
import { getUserPlansById } from '@/lib/actions'
import * as actions from '@/lib/actions'

type EditPlanProps = {
    params: {
        planId: string
    }
}

export default async function EditPlan({ params }: EditPlanProps) {
    const session = await getServerSession(authOptions)
    if (!session) redirect('/')

    const { planId } = await params
    const plan = await getUserPlansById(planId)
    if (!plan) return notFound()

    if (plan.recurringId) {
        const parentRepeatInfo = await actions.getUseRrecurringPlanById(plan.recurringId)
        if (parentRepeatInfo) {
            plan.repeatType = parentRepeatInfo.repeatType
            plan.repeatOn = parentRepeatInfo.repeatOn
        }
    }

    const safePlan = {
        ...plan,
        _id: plan._id.toString(),
        recurringId: plan.recurringId?.toString() || null,
    }

    return <PlansEditForm plan={safePlan} targetType="instance" />
}
