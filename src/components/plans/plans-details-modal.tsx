'use client'
import { useState, useEffect } from 'react'
import CloseButton from '@/components/general-components/close-button'
import * as actions from '@/lib/actions'
import { useSelectedDate } from '@/lib/store/selectedData'
import DeleteButton from '../general-components/delete-button'
import EditButton from '../general-components/edit-button'

type Plan = {
    _id: string
    title: string
    note?: string
    startDate: string
    endDate?: string
    startTime?: string
    endTime?: string
    eventType?: string
    location?: string
    icon: string
}

export default function PlansDetailsModal({ userPlan }: { userPlan: Plan }) {
    const [weatherPreview, setWeatherPreview] = useState<null | { temp: number; rain: number }>(null)
    const { selectedDate, setSelectedDate } = useSelectedDate()

    useEffect(() => {
        const timeout = setTimeout(async () => {
            if (!userPlan.location || !selectedDate) return
            try {
                const geo = await actions.getCoordsForLocation(userPlan.location)
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
    }, [userPlan.location, selectedDate])

    return (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
            <div onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-900 max-w-md w-full p-6 rounded-2xl shadow-2xl relative">
                <div className="absolute top-4 right-4 flex gap-2 ml-auto">
                    <EditButton id={userPlan._id}/>
                    <DeleteButton id={userPlan._id} />
                    <CloseButton />
                </div>
                <div className="flex flex-col items-start gap-4">
                    <h2 className="text-2xl font-semibold flex items-center gap-2">
                        <span>{userPlan.icon}</span>
                        <span>{userPlan.title}</span>
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {userPlan.eventType && (
                            <span className="px-2 py-1 bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-200 text-xs rounded-full">
                                🏷️ {userPlan.eventType}
                            </span>
                        )}
                        {userPlan.location && (<>
                            <span className="px-2 py-1 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 text-xs rounded-full">
                                📍 {userPlan.location}
                            </span>
                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 text-xs rounded-full min-w-[1rem] flex items-center justify-center">
                                {weatherPreview ? (
                                    <>
                                        {weatherPreview.rain > 0 ? `🌧 ` : '☀️'}
                                        {' '}<span>{weatherPreview.temp}°C</span>
                                    </>
                                ) : (
                                    <span className="h-3 w-12 bg-blue-200 dark:bg-blue-700 rounded animate-pulse inline-block" />
                                )}
                            </span>
                        </>)}
                    </div>
                    <div className="grid grid-cols-2 gap-4 w-full text-sm text-gray-700 dark:text-gray-300">
                        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                            <p className="text-xs text-gray-500 dark:text-gray-400">Start Date</p>
                            <p className="font-medium">📅 {userPlan.startDate}</p>
                        </div>
                        {userPlan.endDate && (
                            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                                <p className="text-xs text-gray-500 dark:text-gray-400">End Date</p>
                                <p className="font-medium">📅 {userPlan.endDate}</p>
                            </div>
                        )}
                        {(userPlan.startTime || userPlan.endTime) && (
                            <div className="col-span-2 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                                <p className="text-xs text-gray-500 dark:text-gray-400">Time</p>
                                <p className="font-medium">⏰ {userPlan.startTime ?? '--'} — {userPlan.endTime ?? '--'}</p>
                            </div>
                        )}
                    </div>
                    {userPlan.note && (
                        <div className="w-full bg-yellow-50 dark:bg-yellow-900/20 text-yellow-900 dark:text-yellow-100 text-sm p-4 rounded-lg border border-yellow-200 dark:border-yellow-700 mt-2">
                            <p className="text-xs uppercase font-semibold text-yellow-600 dark:text-yellow-300 mb-1">📝 Note</p>
                            <p>{userPlan.note}</p>
                        </div>
                    )}
                </div>
            </div>
        </div >
    )
}
