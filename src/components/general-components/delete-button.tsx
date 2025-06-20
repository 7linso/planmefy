'use client'

import { useState } from 'react'
import * as actions from '@/lib/actions'

type Props = {
    id: string
    isRecurring?: boolean
}

export default function DeleteButton({ id, isRecurring = false }: Props) {
    const [deleteAll, setDeleteAll] = useState(false)

    const handleDelete = async () => {
        const confirmed = confirm('Are you sure you want to delete this plan?')
        if (!confirmed) return

        try {
            await actions.deleteUserPlan(id, deleteAll && isRecurring ? 'recurring' : 'instance')
            window.location.href = '/calendar'
        } catch (err) {
            console.error('Failed to delete plan:', err)
            alert('Failed to delete plan.')
        }
    }

    return (
        <div className="flex items-center gap-3">
            {isRecurring && (
                <>
                    <input
                        type="checkbox"
                        checked={deleteAll}
                        onChange={(e) => setDeleteAll(e.target.checked)}
                        className="accent-red-500"
                    />
                    <span className="text-sm text-red-500">Delete all instances</span>
                </>
            )}

            <button
                type="button"
                className="text-red-500 hover:text-red-700 transition-colors"
                onClick={handleDelete}
            >
                <span className="material-symbols-outlined">delete</span>
            </button>
        </div>
    )
}
