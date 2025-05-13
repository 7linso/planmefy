import * as actions from '@/components/calendar/calendar-utils'

interface CalendarSellProps {
    day: Date
}

export default function CalendarSell({ day }: CalendarSellProps) {
    return (<>
        <div className={`p-2 rounded hover:bg-white hover:text-black text-center
                cursor-pointer 
                ${actions.isSameDate(day, new Date())
                &&
                'bg-gray-300 text-black font-semibold'}`}
        >
            {day.getDate()}
        </div>

    </>)
}