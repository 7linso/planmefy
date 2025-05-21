import PlansForm from "@/components/plans/plans-form";
import CustomCalendar from "@/components/calendar/calendar";

export default function CreatePlan() {
    return (
        <div className="flex flex-col lg:flex-row gap-4 px-4 py-6">
            <div className="w-full lg:w-1/3">
                <PlansForm />
            </div>
            <div className="w-full lg:w-2/3">
                <CustomCalendar />
            </div>
        </div>
    )
}