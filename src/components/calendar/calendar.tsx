'use client';
import React, { useState } from 'react';
import * as actions from '@/components/calendar/calendar-utils'
import CalendarGrid from './calendar-grid';

export default function CustomCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());

    const goToPrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const days = actions.getDaysInMonth(currentDate);
    const padding = actions.getStartPadding(currentDate)
    const monthLabel = actions.getMonthLabel(currentDate)
    const yearLabel = actions.getYearLabel(currentDate)

    return (
        <div className="border rounded-xl shadow p-4 m-10">
            <div className="flex justify-between items-center mb-4">
                <button onClick={goToPrevMonth} className="text-lg">{'←'}</button>
                <h2 className="text-xl font-bold">{monthLabel} {yearLabel}</h2>
                <button onClick={goToNextMonth} className="text-lg">{'→'}</button>
            </div>
            
            <CalendarGrid days={days} padding={padding}/>
        </div>
    );
}
