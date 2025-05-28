'use client'
import { useRef, useState, useEffect } from 'react'
import * as actions from '@/lib/actions'
import { planSchema } from '@/lib/schemas'
import { useSelectedDate } from '@/lib/store/selectedData'
import Link from 'next/link'
import EmojiSelector from './emoji-picker'

export default function PlansForm() {
    const { selectedDate, setSelectedDate } = useSelectedDate()
    const formRef = useRef<HTMLFormElement>(null)
    const [errors, setErrors] = useState<{
        title?: string
        note?: string
        startDate?: string
        endDate?: string
        startTime?: string
        endTime?: string,
        eventType?: string
        location?: string,
        icon?: string
    }>({})

    const [showTime, setShowTime] = useState(false)
    const [showEndDate, setShowEndDate] = useState(false)
    const [showEventLocation, setShowEventLocation] = useState(false)

    const [icon, setIcon] = useState('⭐')

    const [formState, setFormState] = useState({
        location: '',
        eventType: '',
    })
    const [weatherPreview, setWeatherPreview] = useState<null | { temp: number; rain: number }>(null)
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = formRef.current
        if (!form) return
        const formData = new FormData(form)
        formData.set('icon', icon)

        const safeString = (v: FormDataEntryValue | null) =>
            typeof v === 'string' && v.trim() !== '' ? v : undefined

        const raw = {
            title: formData.get('title') as string,
            note: safeString(formData.get('note')),
            startDate: selectedDate.toISOString().split('T')[0],
            endDate: safeString(formData.get('endDate')),
            startTime: safeString(formData.get('startTime')),
            endTime: safeString(formData.get('endTime')),
            eventType: safeString(formData.get('eventType')),
            location: safeString(formData.get('location')),
            icon: formData.get('icon'),
        }
        const result = planSchema.safeParse(raw)
        console.log('Parsed result:', result)
        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors
            setErrors({
                title: fieldErrors.title?.[0],
                note: fieldErrors.note?.[0],
                startDate: fieldErrors.startDate?.[0],
                endDate: fieldErrors.endDate?.[0],
                startTime: fieldErrors.startTime?.[0],
                endTime: fieldErrors.endTime?.[0],
                eventType: fieldErrors.eventType?.[0],
                location: fieldErrors.location?.[0],
                icon: fieldErrors.icon?.[0],
            })
            return
        }
        setErrors({})
        try {
            await actions.postUserPlans(formData)
        } catch (err) {
            console.error('Server error:', err)
        }
    }

    useEffect(() => {
        const timeout = setTimeout(async () => {
            if (!formState.location || !selectedDate) return
            try {
                const geo = await actions.getCoordsForLocation(formState.location)
                if (!geo) return

                const weather = await actions.getWeatherForecast({
                    date: selectedDate.toISOString().split('T')[0],
                    lat: geo.lat,
                    lon: geo.lon,
                })

                setWeatherPreview(weather)
            } catch (err) {
                console.error('Failed to fetch weather:', err)
                setWeatherPreview(null)
            }
        }, 600)

        return () => clearTimeout(timeout)
    }, [formState.location, selectedDate])


    return (<>
        <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Add Plan</h1>
            <Link
                href="/calendar"
                className="px-4 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                Go Back
            </Link>
        </div>
        <form className="m-2 space-y-6"
            ref={formRef} onSubmit={handleSubmit}>
            <section className="flex items-center gap-3 mb-4">
                <div className="flex-1">
                    <label htmlFor="title" className="block text-sm font-medium mb-1">
                        Title
                    </label>
                    <input type="text" id="title" name="title" placeholder="Walk the dog"
                        className="w-full px-4 py-2 rounded-md border dark:bg-gray-800 transition" />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>
                <EmojiSelector icon={icon} onChange={setIcon} />
                <input type="hidden" name="icon" value={icon || ''} />
            </section>
            <section>
                <label htmlFor="note" className="block text-sm font-medium mb-1">
                    Notes
                </label>
                <textarea id="note" name="note" placeholder="It's gonna be hot, take water"
                    className="w-full px-4 py-2 rounded-md border dark:bg-gray-800 transition resize-none" />
                {errors.note && <p className="text-red-500 text-sm mt-1">{errors.note}</p>}
            </section>
            <section>
                <label htmlFor="startDate" className="block text-sm font-medium mb-1">
                    Start Date
                </label>
                <input type="date" id="startDate" name="startDate"
                    value={selectedDate.toISOString().split('T')[0]}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                    className="w-full px-4 py-2 rounded-md border dark:bg-gray-800" />
                {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
            </section>
            <section>
                <p onClick={() => setShowEndDate((prev) => !prev)}
                    className="text-sm text-gray-400 hover:underline cursor-pointer mb-2">
                    {showEndDate ? '− Remove End Date' : '+ Set End Date'}
                </p>
                {showEndDate && (<>
                    <input type="date" name="endDate"
                        className="mt-2 w-full px-4 py-2 rounded-md border dark:bg-gray-800" />
                    {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
                </>
                )}
            </section>
            <section>
                <p onClick={() => setShowTime((prev) => !prev)}
                    className="text-sm text-gray-400 hover:underline cursor-pointer mb-2">
                    {showTime ? '− Remove Time Range' : '+ Set Time Range'}
                </p>
                {showTime && (
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                            <label htmlFor="startTime" className="block text-sm mb-1">Start Time</label>
                            <input type="time" id="startTime" name="startTime"
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
            </section>
            <section>
                <p onClick={() => setShowEventLocation((prev) => !prev)}
                    className="text-sm text-gray-400 hover:underline cursor-pointer mb-2">
                    {showEventLocation ? '− Remove Event Location' : '+ Select Event Location'}
                </p>
                {showEventLocation && (
                    <>
                        <div className="grid grid-cols-2 gap-4 mb-3">
                            <label className="flex items-center gap-2 text-sm">
                                <input type="radio" id="indoor" name="eventType"
                                    value="indoor" className="accent-blue-600"
                                    onChange={(e) => setFormState((prev) => ({ ...prev, eventType: e.target.value }))} />
                                Indoor
                            </label>
                            <label className="flex items-center gap-2 text-sm">
                                <input type="radio" id="outdoor" name="eventType"
                                    value="outdoor" className="accent-blue-600"
                                    onChange={(e) => setFormState((prev) => ({ ...prev, eventType: e.target.value }))} />
                                Outdoor
                            </label>
                        </div>

                        <label htmlFor="location" className="block text-sm font-medium mb-1">
                            Where will it take place?
                        </label>
                        <input type='text' id="location" name="location" placeholder="123 Bean St."
                            className="w-full px-4 py-2 rounded-md border dark:bg-gray-800 transition"
                            onChange={(e) =>
                                setFormState((prev) => ({ ...prev, location: e.target.value }))
                            } />
                        <div className="text-sm mt-4 text-gray-400">
                            🌤 Forecast for that location on {selectedDate.toISOString().split('T')[0]}:{' '}
                            <br />
                            {weatherPreview ? (<>
                                <strong>{weatherPreview.temp}°C</strong>, {' '}
                                {weatherPreview.rain > 0 ? `🌧 ${weatherPreview.rain}mm rain` : 'no rain expected'}
                            </>)
                                :
                                (<div className="h-5 w-48 mt-2 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />)}
                        </div>
                    </>
                )}
            </section>
            <button type="submit" className="p-2 rounded-md border bg-blue-600 text-white hover:bg-blue-700 transition">
                Submit
            </button>
        </form>
    </>
    )
}
