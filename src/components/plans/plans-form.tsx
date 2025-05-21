'use client'
import { useRef, useState } from 'react'
import * as actions from '@/lib/actions'
import { planSchema } from '@/lib/schemas'
import { useSelectedDate } from '@/lib/store/selectedData'

// interface PlansFormProps{
//     selectedDate: Date,
//     setSelectedDate: (date: Date) => void
// }

export default function PlansForm() {
    const {selectedDate, setSelectedDate} = useSelectedDate()
    const formRef = useRef<HTMLFormElement>(null)
    const [errors, setErrors] = useState<{
        title?: string
        note?: string
        startDate?: string
        endDate?: string
        startTime?: string
        endTime?: string
    }>({})

    const [showTime, setShowTime] = useState(false)
    const [showEndDate, setShowEndDate] = useState(false)

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const raw = {
            title: formData.get('title') as string,
            note: formData.get('note') as string,
            startDate: formData.get('startDate') as string,
            endDate: formData.get('endDate') as string,
            startTime: formData.get('startTime') as string,
            endTime: formData.get('endTime') as string,
        }
        const result = planSchema.safeParse(raw)
        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors
            setErrors({
                title: fieldErrors.title?.[0],
                note: fieldErrors.note?.[0],
                startDate: fieldErrors.startDate?.[0],
                endDate: fieldErrors.endDate?.[0],
                startTime: fieldErrors.startTime?.[0],
                endTime: fieldErrors.endTime?.[0],
            })
            return
        }
        setErrors({})
        formRef.current?.submit()
    }

    return (
        <form className="m-10 space-y-6" action={actions.postUserPlans}
            ref={formRef} onSubmit={handleSubmit}>
            <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">
                    Title
                </label>
                <input type="text" id="title" name="title" placeholder="Walk the dog"
                    className="w-full px-4 py-2 rounded-md border dark:bg-gray-800 transition" />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>
            <div>
                <label htmlFor="note" className="block text-sm font-medium mb-1">
                    Notes
                </label>
                <textarea id="note" name="note" placeholder="It's gonna be hot, take water"
                    className="w-full px-4 py-2 rounded-md border dark:bg-gray-800 transition resize-none" />
                {errors.note && <p className="text-red-500 text-sm mt-1">{errors.note}</p>}
            </div>
            <div>
                <label htmlFor="startDate" className="block text-sm font-medium mb-1">
                    Start Date
                </label>
                <input type="date" id="startDate" name="startDate" defaultValue={selectedDate.toISOString().split('T')[0]}
                    className="w-full px-4 py-2 rounded-md border dark:bg-gray-800" />
                {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
            </div>
            <div>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={showEndDate}
                        onChange={() => setShowEndDate(!showEndDate)} />
                    Add End Date
                </label>
                {showEndDate && (
                    <>
                        <input type="date" name="endDate" defaultValue={selectedDate.toISOString().split('T')[0]}
                            className="mt-2 w-full px-4 py-2 rounded-md border dark:bg-gray-800" />
                        {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
                    </>
                )}
            </div>
            <div>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={showTime}
                        onChange={() => setShowTime(!showTime)} />
                    Add Time Range
                </label>
                {showTime && (
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                            <label htmlFor="startTime" className="block text-sm mb-1">Start Time</label>
                            <input type="time" id="startTime" name="startTime" defaultValue={selectedDate.toTimeString().slice(0, 5)}
                                className="w-full px-4 py-2 rounded-md border dark:bg-gray-800" />
                            {errors.startTime && <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>}
                        </div>
                        <div>
                            <label htmlFor="endTime" className="block text-sm mb-1">End Time</label>
                            <input type="time" id="endTime" name="endTime"
                                className="w-full px-4 py-2 rounded-md border dark:bg-gray-800" />
                            {errors.endTime && <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>}
                        </div>
                    </div>
                )}
            </div>
            <button type="submit" className="p-2 rounded-md border bg-blue-600 text-white hover:bg-blue-700 transition">
                Submit
            </button>
        </form>
    )
}
