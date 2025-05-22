import { cookies } from 'next/headers'
import { getUserPlansByDate } from '@/lib/actions'
import PlansList from './plans.list'

export default async function PlansDisplay() {
    const cookieStore = await cookies()
    const cookie = cookieStore.get('selectedDate')?.value

    const selectedDate = cookie ? new Date(cookie) : new Date()
    const userPlans = await getUserPlansByDate(selectedDate)

    return (<>
        <PlansList userPlans={userPlans} />
    </>)
}

