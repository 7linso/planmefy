import Link from 'next/link'

export default function EditButton({id}: {id: string}) {
    return (<>
        <Link href={`/calendar/${id}/edit`}>
            <span className="material-symbols-outlined">edit</span>
        </Link>
    </>)
}