'use client'
import CloseButton from '@/components/general-components/close-button'

type Plan = {
    _id: string
    title: string
    note?: string
    startDate: string
    endDate?: string
    startTime?: string
    endTime?: string
}

export default function PlansDetailsModal({ userPlan }: { userPlan: Plan }) {
    return (
        <div className="fixed inset-0 z-50 bg-black/5 backdrop-blur-sm flex items-center justify-center">
            <div
                className="bg-white dark:bg-gray-900 max-w-md w-full p-6 rounded-lg shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between gap-4">
                    <h2 className="text-xl font-bold">{userPlan.title}</h2>
                    <CloseButton />
                </div>
                <div className="mt-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    {userPlan.note && (
                        <p>
                            <span className="font-medium text-gray-800 dark:text-white">Note:</span>{' '}
                            {userPlan.note}
                        </p>
                    )}

                    <p>
                        <span className="font-medium text-gray-800 dark:text-white">Start Date:</span>{' '}
                        {userPlan.startDate}
                    </p>

                    {userPlan.endDate && (
                        <p>
                            <span className="font-medium text-gray-800 dark:text-white">End Date:</span>{' '}
                            {userPlan.endDate}
                        </p>
                    )}

                    {(userPlan.startTime || userPlan.endTime) && (
                        <p>
                            <span className="font-medium text-gray-800 dark:text-white">Time:</span>{' '}
                            {userPlan.startTime ?? '--'} — {userPlan.endTime ?? '--'}
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}
