import * as actions from '@/lib/actions'
import Link from 'next/link';

export default async function PlansDisplay() {
    const userPlans = await actions.getUserPlans()
    return (<>
        <div className='p-5'>
            <h1 className='mb-3 font-semibold text-xl'>My Plans: </h1>
            <ul className='text-sm'>
                {userPlans.map((userPlans) => (
                    <li key={userPlans._id.toString()}>
                        <strong>{userPlans.title}</strong>
                        <p>{userPlans.note}</p>
                        <small>{new Date(userPlans.created_at).toLocaleString()}</small>
                    </li>
                ))}
            </ul>
            <Link href='/create-plan'>Add Plan</Link>
        </div>
    </>);
}
