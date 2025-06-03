'use client'
import { useEffect, useRef, useState } from 'react'
import * as actions from '@/lib/actions'
import { planSchema } from '@/lib/schemas'
import { useSelectedDate } from '@/lib/store/selectedData'
import Link from 'next/link'
import EmojiSelector from './emoji-picker'
import LocationInput from '../general-components/location-input'

interface Plan {
    _id: string
    title: string
    note?: string
    startDate: string
    endDate?: string
    startTime?: string
    endTime?: string
    eventType?: 'indoor' | 'outdoor'
    location?: string
    icon: string,
    repeatType?: string,
    repeatOn?: string[]
}

export default function PlansEditForm({ plan }: { plan: Plan }) {
    const formRef = useRef<HTMLFormElement>(null)
    const { selectedDate, setSelectedDate } = useSelectedDate()
    const [icon, setIcon] = useState(plan.icon || '⭐')
    const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({})

    const [showTime, setShowTime] = useState(!!(plan.startTime || plan.endTime))
    const [showEndDate, setShowEndDate] = useState(!!plan.endDate)
    const [showEventLocation, setShowEventLocation] = useState(!!plan.eventType || !!plan.location)
    const [showRepeat, setShowRepeat] = useState(!!(plan.repeatType || (plan.repeatOn && plan.repeatOn.length)))

    const [repeatType, setRepeatType] = useState<string>('custom');

    const [formData, setFormData] = useState({
        title: plan.title || '',
        note: plan.note || '',
        endDate: plan.endDate || '',
        startTime: plan.startTime || '',
        endTime: plan.endTime || '',
        eventType: plan.eventType || '',
        location: plan.location || '',
        icon: plan.icon || '',
        repeatType: plan.repeatType || '',
        repeatOn: plan.repeatOn || []
    })

    const [weatherPreview, setWeatherPreview] = useState<null | { temp: number; rain: number }>(null)

    useEffect(() => {
        if (plan.startDate) {
            setSelectedDate(new Date(plan.startDate))
        }
    }, [plan.startDate, setSelectedDate])

    useEffect(() => {
        const timeout = setTimeout(async () => {
            if (!formData.location || !selectedDate) return
            try {
                const geo = await actions.getCoordsForLocation(formData.location)
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
    }, [formData.location, selectedDate])

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleCheckboxChange = (day: string) => {
        setFormData((prev) => {
            const updated = prev.repeatOn.includes(day)
                ? prev.repeatOn.filter((d) => d !== day)
                : [...prev.repeatOn, day];
            return { ...prev, repeatOn: updated };
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const raw = {
            title: formData.title,
            note: formData.note,
            startDate: selectedDate.toISOString().split('T')[0],
            endDate: formData.endDate || undefined,
            startTime: formData.startTime || undefined,
            endTime: formData.endTime || undefined,
            eventType: formData.eventType || undefined,
            location: formData.location || undefined,
            icon: icon,
            repeatType: formData.repeatType || undefined,
            repeatOn: formData.repeatType === 'custom' ? formData.repeatOn : [],
          };
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
                eventType: fieldErrors.eventType?.[0],
                location: fieldErrors.location?.[0],
                icon: fieldErrors.icon?.[0],
                repeatType: fieldErrors.icon?.[0],
                repeatOn: fieldErrors.icon?.[0]
            })
            return
        }
        const data = new FormData()
        Object.entries(raw).forEach(([key, val]) => {
            if (!val) return;

            if (Array.isArray(val)) {
                val.forEach((item) => data.append(key, item));
            } else {
                data.append(key, val);
            }
        });
        try {
            await actions.updateUserPlan(data, plan._id)
        } catch (err) {
            console.error('Failed to update plan:', err)
        }
    }

    return (<>
        <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Edit Plan</h1>
            <Link href="/calendar"
                className="px-4 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                Go Back
            </Link>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <section className="flex items-center gap-3 mb-4">
                <div className="flex-1">
                    <label htmlFor="title" className="block text-sm font-medium mb-1">
                        Title
                    </label>
                    <input type="text" id="title" name="title" value={formData.title}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-md border dark:bg-gray-800" />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>
                <EmojiSelector icon={icon} onChange={setIcon} />
                <input type="hidden" name="icon" value={icon} />
            </section>
            <section>
                <label htmlFor="note" className="block text-sm font-medium mb-1">
                    Notes
                </label>
                <textarea id="note" name="note" value={formData.note}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-md border dark:bg-gray-800 resize-none" />
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
            </section>
            <section>
                <p onClick={() => setShowEndDate((prev) => !prev)}
                    className="text-sm text-gray-400 hover:underline cursor-pointer mb-2">
                    {showEndDate ? '− Remove End Date' : '+ Set End Date'}
                </p>
                <div className={`transition-all duration-300 overflow-hidden 
                    ${showEndDate ? 'max-h-40 opacity-100 scale-100' : 'max-h-0 opacity-0 scale-95'
                    }`} >
                    <input type="date" name="endDate" value={formData.endDate}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-md border dark:bg-gray-800" />
                </div>
                {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
            </section>
            <section>
                <p onClick={() => setShowTime((prev) => !prev)}
                    className="text-sm text-gray-400 hover:underline cursor-pointer mb-2">
                    {showTime ? '− Remove Time Range' : '+ Set Time Range'}
                </p>
                <div className={`transition-all duration-300 overflow-hidden 
                    ${showTime ? 'max-h-40 opacity-100 scale-100' : 'max-h-0 opacity-0 scale-95'
                    }`} >
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                            <label htmlFor="startTime" className="block text-sm mb-1">Start Time</label>
                            <input type="time" id="startTime" name="startTime" value={formData.startTime}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-md border dark:bg-gray-800" />
                        </div>
                        <div>
                            <label htmlFor="endTime" className="block text-sm mb-1">End Time</label>
                            <input type="time" id="endTime" name="endTime" value={formData.endTime}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-md border dark:bg-gray-800" />
                        </div>
                    </div>
                </div>
            </section>
            <section>
                <p onClick={() => setShowRepeat((prev) => !prev)}
                    className="text-sm text-gray-400 hover:underline cursor-pointer mb-2">
                    {showRepeat ? '− Remove On Repeat' : '+ Select On Repeat'}
                </p>
                <div className={`transition-all duration-300 overflow-hidden ${showRepeat ? 'max-h-[400px] opacity-100 scale-100' : 'max-h-0 opacity-0 scale-95'
                    }`} >
                    <div className="m-4 space-y-4">
                        <div className="grid grid-cols-2 gap-4 mb-3"> {[
                            { label: 'Every Day', value: 'every-day' },
                            { label: 'Every Week', value: 'every-week' },
                            { label: 'Every Month', value: 'every-month' },
                            { label: 'Every Year', value: 'every-year' },
                            { label: 'Custom Days', value: 'custom' },
                        ].map((opt) => (
                            <label key={opt.value} className="flex items-center gap-2 text-sm">
                                <input type="radio" name="repeatType"
                                    value={opt.value} checked={formData.repeatType === opt.value}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            repeatType: e.target.value,
                                        }))
                                    }
                                    className="accent-blue-600" />
                                {opt.label}
                            </label>
                        ))}
                        </div>
                        <div className={`grid grid-cols-7 border rounded-md overflow-hidden max-w-full text-center 
                        ${formData.repeatType !== 'custom' ? 'opacity-50 pointer-events-none' : ''
                            }`} >
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                <label key={day}
                                    className="cursor-pointer text-xs font-medium hover:bg-gray-700 transition-colors dark:bg-gray-800">
                                    <input type="checkbox" name="repeatOn" value={day}
                                        disabled={formData.repeatType !== 'custom'} checked={formData.repeatOn.includes(day)}
                                        onChange={() => handleCheckboxChange(day)}
                                        className="sr-only peer" />
                                    <span className="peer-checked:bg-gray-400 peer-checked:text-white px-2 py-2 block">
                                        {day}
                                    </span>
                                </label>
                            ))}
                            {errors.repeatOn && (
                                <p className="text-red-500 text-sm mt-1">{errors.repeatOn}</p>
                            )}

                        </div>
                    </div>
                </div>
            </section>
            <section>
                <p onClick={() => setShowEventLocation((prev) => !prev)}
                    className="text-sm text-gray-400 hover:underline cursor-pointer mb-2">
                    {showEventLocation ? '− Remove Event Location' : '+ Select Event Location'}
                </p>
                <div className={`transition-all duration-300 overflow-hidden 
                    ${showEventLocation ? 'max-h-40 opacity-100 scale-100' : 'max-h-0 opacity-0 scale-95'
                    }`} >
                    <div className="grid grid-cols-2 gap-4 mb-3">
                        <label className="flex items-center gap-2 text-sm">
                            <input type="radio" name="eventType" value="indoor"
                                checked={formData.eventType === 'indoor'}
                                onChange={handleChange} className="accent-blue-600" />
                            Indoor
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                            <input type="radio" name="eventType" value="outdoor"
                                checked={formData.eventType === 'outdoor'}
                                onChange={handleChange} className="accent-blue-600" />
                            Outdoor
                        </label>
                    </div>
                    <LocationInput prevLocation={formData.location}
                        onSelect={(location) => {
                            console.log('Selected:', location)
                            setFormData((prev) => ({ ...prev, location }))
                        }}
                    />
                    <div className="text-sm mt-4 text-gray-400">
                        🌤 Forecast for {selectedDate.toISOString().split('T')[0]}:{' '}
                        <br />
                        {weatherPreview ? (
                            <>
                                <strong>{weatherPreview.temp}°C</strong>,{' '}
                                {weatherPreview.rain > 0 ? `🌧 ${weatherPreview.rain}mm rain` : 'no rain expected'}
                            </>
                        ) : (
                            <div className="h-5 w-48 mt-2 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
                        )}
                    </div>
                </div>
            </section>
            <button type="submit"
                className="p-2 rounded-md border bg-blue-600 text-white hover:bg-blue-700 transition">
                Update
            </button>
        </form>
    </>
    )
}
