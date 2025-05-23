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
                <h2 className="text-xl font-bold">{userPlan.title}</h2>
                <p className="text-sm text-gray-600 mt-2">{userPlan.note}</p>
                <p className="text-xs mt-1 text-gray-500">Start: {userPlan.startDate}</p>
                <CloseButton />
            </div>
        </div>
    )
}
