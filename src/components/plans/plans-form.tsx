'use client'
import { useRef, useState } from 'react';
import * as actions from '@/lib/actions'
import { planSchema } from '@/lib/schemas';

export default function PlansForm() {
    const formRef = useRef<HTMLFormElement>(null)
    const [errors, setErrors] = useState<{ title?: string; note?: string }>({})

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const raw = {
            title: formData.get('title') as string,
            note: formData.get('note') as string,
        }
        const result = planSchema.safeParse(raw)

        if(!result.success){
            const fieldErrors = result.error.flatten().fieldErrors
            setErrors({
                title: fieldErrors.title?.[0],
                note: fieldErrors.note?.[0]
            })
            return
        }
        setErrors({})
        formRef.current?.submit()
    }

    return (
        <form className="m-10" 
        action={actions.postUserPlans} ref={formRef} onSubmit={handleSubmit}>
            <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium mb-1">
                    Title
                </label>
                <input type="text" id="title" name='title' placeholder="Walk the dog"
                    className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-800 transition"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>
            <div className="mb-4">
                <label htmlFor="note" className="block text-sm font-medium mb-1">
                    Notes
                </label>
                <textarea id="note" name='note' placeholder="It's gonna be hella hot so take water"
                    className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-800 transition resize-none"
                />
                {errors.note && <p className="text-red-500 text-sm mt-1">{errors.note}</p>}
            </div>
            <button type="submit" className="p-2 rounded-md border">
                Submit
            </button>
        </form>
    );
}
