export default function PlansForm() {
    return (
        <form className="m-10">
            <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium mb-1">
                    Title
                </label>
                <input type="text" id="title" placeholder="Walk the dog"
                    className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-800 transition"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="notes" className="block text-sm font-medium mb-1">
                    Notes
                </label>
                <textarea id="notes" placeholder="It's gonna be hella hot so take water"
                    className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-800 transition resize-none"/>
            </div>
        </form>
    );
}
