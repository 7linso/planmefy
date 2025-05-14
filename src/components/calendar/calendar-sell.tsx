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
            className={`p-2 rounded hover:bg-white hover:text-black text-center
                cursor-pointer 
                ${actions.isSameDate(day, new Date())
                &&
                'bg-gray-300 text-black font-semibold'}
                ${actions.isSameDate(day, selectedDate)
                &&
                    'border border-white'}
                `}
        >
            {day.getDate()}
        </button>

    </>)
}