
export const getDaysInMonth = (date: Date): Date[] => {
    const year = date.getFullYear()
    const month = date.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    const days = [];
    for (let day = 1; day <= lastDay.getDate(); day++) {
        days.push(new Date(year, month, day))
    }
    return days
}

export const getStartPadding = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
}

export const getMonthLabel = (date: Date) => {
    return date.toLocaleString('default', { month: 'long' })
}

export const getYearLabel = (date: Date) => {
    return date.getFullYear()
}

export const isSameDate = (date1: Date, date2: Date): boolean => {
    return (date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear())
}
