import CalendarSell from "./calendar-sell";

interface CalendarGridProps {
    days: Date[],
    padding: number
}
const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarGrid({ days, padding }: CalendarGridProps) {
    return (
        <>
            <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-600 mb-2">
                {weekdayLabels.map((label, i) => (
                    <div key={i}>{label}</div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: padding }).map((_, i) => (
                    <div key={`pad-${i}`} />
                ))}
                {days.map((day, i) => (
                    <CalendarSell day={day} key={i}/>
                ))}
            </div>
        </>

    )
}