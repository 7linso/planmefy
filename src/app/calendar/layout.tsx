import CustomCalendar from "@/components/calendar/calendar"

export default function CalendarLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col-reverse lg:flex-row gap-4 px-4 py-6">
            <div className="w-full lg:w-1/3">
                {children}
            </div>
            <div className="w-full lg:w-2/3 relative">
                <CustomCalendar />
            </div>
        </div>
    )
}
