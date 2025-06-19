'use client'
import * as actions from '@/lib/actions'

type Props = {
    id: string
    targetType: 'instance' | 'recurring'
}

export default function DeleteButton({ id, targetType }: Props) {
    return (
        <button
            type="button"
            className="text-red-500 hover:text-red-700 transition-colors"
            onClick={async () => {
                const confirmed = confirm("Are you sure you want to delete this plan?")
                if (confirmed) {
                    try {
                        await actions.deleteUserPlan(id, targetType)
                    } catch (err) {
                        console.error("Failed to delete plan:", err)
                    }
                }
            }}>
            <span className="material-symbols-outlined">delete</span>
        </button>
    )
}
