'use client'
import * as actions from '@/lib/actions'

export default function DeleteButton({id}: {id: string}) {
    return (<>
        <button
            type="button"
            className="text-red-500 hover:text-red-700 transition-colors"
            onClick={() => {
                if (confirm("Are you sure you want to delete this plan?")) {
                    actions.deleteUserPlan(id);
                }
              }}
        >
            <span className="material-symbols-outlined">delete</span>
        </button>

    </>)
}