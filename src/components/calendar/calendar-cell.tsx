import * as actions from '@/components/calendar/calendar-utils'

interface CalendarSellProps {
    day: Date,
    selectedDate: Date,
    setSelectedDate: React.Dispatch<React.SetStateAction<Date>>
}

export default function CalendarSell({ day, selectedDate, setSelectedDate }: CalendarSellProps) {
    return (<>
        <button
            onClick={() => setSelectedDate(day)}
            className={`relative aspect-square w-full rounded cursor-pointer
                        transition-colors duration-200
                        border
                        hover:bg-gray-200 hover:text-black 
                        dark:hover:bg-gray-700 dark:hover:text-white
                        ${actions.isSameDate(day, selectedDate)
                    ? 'border-gray-800 dark:border-gray-200 font-semibold'
                    : 'border-transparent'}
                        ${actions.isSameDate(day, new Date())
                    ? 'bg-gray-300 text-black dark:bg-gray-800 dark:text-white'
                    : ''}
            `}>
            <span className={`absolute -top-2 right-2 px-1 text-sm font-medium
                              bg-white dark:bg-black text-gray-900 dark:text-gray-100 rounded
                            `}>
                {day.getDate()}
            </span>
        </button>

    </>)
}