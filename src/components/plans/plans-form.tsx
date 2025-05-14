export default function PlansForm() {
    return (
        <form>
            <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium mb-1"
                    style={{ color: 'var(--foreground)' }}>
                    Title
                </label>
                <input type="text" id="title" placeholder="Walk the dog"
                    className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                    style={{
                        backgroundColor: 'var(--background)',
                        color: 'var(--foreground)',
                        borderColor: 'var(--foreground)',
                    }}
                />
            </div>
            <div className="mb-4">
                <label htmlFor="notes" className="block text-sm font-medium mb-1"
                    style={{ color: 'var(--foreground)' }}>
                    Notes
                </label>
                <textarea id="notes" placeholder="It's gonna be hella hot so take water"
                    className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-teal-500 transition resize-none"
                    style={{
                        backgroundColor: 'var(--background)',
                        color: 'var(--foreground)',
                        borderColor: 'var(--foreground)',
                    }}
                />
            </div>
        </form>
    );
}
