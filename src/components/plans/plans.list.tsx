import Link from 'next/link'
import DeleteButton from '../general-components/delete-button'
import EditButton from '../general-components/edit-button'

interface Plan {
    _id: string
    title: string
    note?: string
    startDate: string
    endDate?: string
    startTime?: string,
    endTime?: string,
    location?: string,
    icon: string
}

export default function PlansList({ userPlans }: { userPlans: Plan[] }) {
    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">My Plans</h1>
                <Link
                    href="/calendar/create-plan"
                    className="px-4 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                    + Add Plan
                </Link>
            </div>

            <ul className="space-y-4">
                {userPlans.map((plan) => (
                    <li key={plan._id}
                        className="flex flex-col gap-2 p-4 rounded-xl border dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900 transition-all duration-300 hover:shadow-md">
                        <div className="flex justify-between items-start">
                            <strong className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                {plan.icon} {plan.title}
                            </strong>
                            <div className="flex gap-2 ml-auto">
                                <EditButton id={plan._id} />
                                <DeleteButton id={plan._id} />
                            </div>
                        </div>
                        <Link href={`/calendar/${plan._id}`} scroll={false}>
                            <div className="text-gray-500 dark:text-gray-400 space-y-1">
                                <div>
                                    📅 {plan.startDate}
                                    {plan.endDate && plan.endDate !== plan.startDate ? ` → ${plan.endDate}` : ''}
                                </div>
                                {plan.startTime && (
                                    <div>
                                        🕒 {plan.startTime}
                                        {plan.endTime ? ` → ${plan.endTime}` : ''}
                                    </div>
                                )}
                            </div>

                            {plan.note && (
                                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                    {plan.note}
                                </p>
                            )}
                            {plan.location && (
                                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                    {plan.location}
                                </p>
                            )}
                        </Link>
                    </li>
                ))}
            </ul>
        </>
    )
}
