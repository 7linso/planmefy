'use client'

import * as actions from '@/lib/actions'

type Props = {
    id: string
    isRecurring?: boolean
    deleteAll?: boolean
}

export default function DeleteButton({ id, isRecurring = false, deleteAll = false }: Props) {
    const handleDelete = async () => {
        const confirmed = confirm(
            isRecurring && deleteAll
                ? 'Are you sure you want to delete all recurring instances?'
                : 'Are you sure you want to delete this plan?'
        )
        if (!confirmed) return

        try {
            await actions.deleteUserPlan(id, isRecurring && deleteAll ? 'recurring' : 'instance')
            window.location.href = '/calendar'
        } catch (err) {
            console.error('Failed to delete plan:', err)
            alert('Failed to delete plan.')
        }
    }

    return (
        <button
            type="button"
            className="text-red-500 hover:text-red-700 transition-colors flex items-center gap-2 pb-3"
            onClick={handleDelete}
        >
            <span className="material-symbols-outlined">delete</span>
            {isRecurring && deleteAll && (
                <span className="text-sm font-medium">Delete All Instances</span>
            )}
        </button>
    )
}
