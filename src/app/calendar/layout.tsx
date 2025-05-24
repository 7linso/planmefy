import Calendar from '@/components/calendar/calendar'
import PlansForm from '@/components/plans/plans-form'
import PlansDisplay from '@/components/plans/plans-display' 

export default function CalendarLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: { planId?: string; slug?: string }
}) {
    const isCreate = params?.slug === 'create-plan'

    return (
        <div className="flex flex-col lg:flex-row gap-4 px-4 py-6">
            <div className="w-full lg:w-1/3">
                {isCreate ? <PlansForm /> : <PlansDisplay />}
            </div>
            <div className="w-full lg:w-2/3 relative">
                <Calendar />
                {children}
            </div>
        </div>
    )
}
