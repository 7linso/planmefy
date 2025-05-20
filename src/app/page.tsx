import Calendar from "@/components/calendar/calendar";
import PlansDisplay from "@/components/plans/plans-display";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession(authOptions)
  
  if (!session) redirect('home')

  return (<>
    <div className="flex grid grid-cols-2 gap-5">
      <PlansDisplay />
      <Calendar />
    </div>
  </>
  );
}
