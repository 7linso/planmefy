import Calendar from "@/components/calendar/calendar";
import PlansDisplay from "@/components/plans/plans-display";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth";

export default async function CalendarMainPage() {
  const session = await getServerSession(authOptions)

  if (!session) redirect('/')

  return (<>
    <div className="flex flex-col lg:flex-row gap-4 px-4 py-6">
      <div className="w-full lg:w-1/3">
        <PlansDisplay />
      </div>
      <div className="w-full lg:w-2/3">
        <Calendar />
      </div>
    </div>
  </>
  );
}
