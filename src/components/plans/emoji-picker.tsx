'use client'
import { useState, useRef, useEffect } from 'react'
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react'

interface Props {
    icon: string
    onChange: (value: string) => void
}

export default function EmojiSelector({ icon, onChange }: Props) {
    const [showPicker, setShowPicker] = useState(false)
    const pickerRef = useRef<HTMLDivElement>(null)

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        console.log('Selected emoji:', emojiData.emoji)
        onChange(emojiData.emoji)
        setShowPicker(false)
    }
      

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                setShowPicker(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    return (
        <div className="relative" ref={pickerRef}>
            <button type="button" onClick={() => setShowPicker((prev) => !prev)}
                className="text-xl px-2 py-2 mt-5 border rounded-md dark:bg-gray-800">
                {icon || '⭐'}
            </button>
            {showPicker && (
                <div className="absolute z-50 mt-2">
                    <EmojiPicker onEmojiClick={handleEmojiClick} theme={Theme.AUTO}/>
                </div>
            )}
        </div>
    )
}
