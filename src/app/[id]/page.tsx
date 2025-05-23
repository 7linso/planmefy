import { getUserPlansById } from '@/lib/actions'
import { notFound } from 'next/navigation'

interface PlanDetailedPageProps{
    params: {
        id: string
    }
}

export default async function PlanDetailedPage({ params }: PlanDetailedPageProps) {
    const userPlan = await getUserPlansById(params.id)
    if (!userPlan) return notFound()

    return (<>
        <h1>{userPlan.title}</h1>
    </>)
}