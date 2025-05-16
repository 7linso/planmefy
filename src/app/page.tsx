import Calendar from "@/components/calendar/calendar";
import PlansDisplay from "@/components/plans/plans-display";
import PlansForm from "@/components/plans/plans-form";

export default function Home() {
  return (<>
    <div className="flex grid grid-cols-2 gap-5">
      <PlansDisplay />
      <Calendar />
    </div>
  </>
  );
}
