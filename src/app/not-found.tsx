import Link from "next/link"

export default function NotFound(){
    return(<>
        <div className="flex items-center justify-center text-center min-h-[calc(100vh-4rem)]">
            <div className="flex flex-col w-full h-full p-6 mx-auto max-w-4xl">
                <main className="flex-1 flex flex-col justify-center items-center px-3">
                    <h1 className="text-5xl font-bold mb-6">Planmefy</h1>
                    <p className="text-lg md:text-xl mb-6 max-w-xl leading-relaxed">
                        Unfortunately, you don't have permission to visit this page
                         or it just doesn't exist. Sorry for that :)
                    </p>
                    <Link
                        href='/'
                        className="btn bg-white text-gray-900 px-6 py-3 text-lg font-semibold rounded shadow hover:bg-gray-200 transition"
                    >
                        Back to Home page
                    </Link>
                </main>
            </div>
        </div>
    </>)
}