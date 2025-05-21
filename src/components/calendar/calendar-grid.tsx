import CalendarSell from "./calendar-cell";

interface CalendarGridProps {
    days: Date[],
    padding: number,
    selectedDate: Date, 
    setSelectedDate: React.Dispatch<React.SetStateAction<Date>>
}
const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarGrid({ days, padding, selectedDate, setSelectedDate }: CalendarGridProps) {
    return (
        <>
            <div className="grid grid-cols-7 auto-rows-fr text-center text-sm font-medium text-gray-500 mb-2">
                {weekdayLabels.map((label, i) => (
                    <div key={i}>{label}</div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: padding }).map((_, i) => (
                    <div key={`pad-${i}`} />
                ))}
                {days.map((day, i) => (
                    <CalendarSell day={day} key={i} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
                ))}
            </div>
        </>
    )
}