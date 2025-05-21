import { create } from 'zustand'

type DateStore = {
    selectedDate: Date,
    setSelectedDate: (date: Date) => void
}

export const useSelectedDate = create<DateStore>((set) => ({
    selectedDate: new Date(),
    setSelectedDate: (date) => set({ selectedDate: date })
}))