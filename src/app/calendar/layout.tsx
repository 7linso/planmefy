import CalendarMainPage from "./calendar-main-page"

export default function CalendarLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>
        <CalendarMainPage />
        {children}
    </>
}
