import PlansForm from "@/components/plans/plans-form"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth"

export default async function CreatePlan() {
    const session = await getServerSession(authOptions)
    if (!session) redirect('/')

    return <PlansForm />
}