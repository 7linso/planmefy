import { useState, useEffect } from 'react'

interface LocationInputProps {
    onSelect: (value: string) => void,
    prevLocation?: string
}

interface Place {
    display_name: string
}

export default function LocationInput({ onSelect, prevLocation }: LocationInputProps) {
    const [query, setQuery] = useState(prevLocation || '')
    const [results, setResults] = useState<Place[]>([])

    useEffect(() => {
        if (prevLocation) {
            setQuery(prevLocation)
        }
    }, [prevLocation])

    useEffect(() => {
        if (!query) return
        const timeout = setTimeout(() => {
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
                .then(res => res.json())
                .then(data => setResults(data))
        }, 500)
        return () => clearTimeout(timeout)
    }, [query])

    return (<>
        <input type="text" name='location' value={query} placeholder="123 John St..."
            onChange={e => setQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-md border dark:bg-gray-800 transition"
        />
        <ul className="border mt-1 rounded-md">
            {results.map((place, id) => (
                <li key={id} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => {
                        onSelect(place.display_name)
                        setQuery(place.display_name)
                        setResults([])
                    }}>
                    {place.display_name}
                </li>
            ))}
        </ul>
    </>)
}
