import { getActivityLogs } from "@/lib/db/queries";
import MockExam from "@/components/ui/mockExam";

export default async function SimulationPage() {
  const logs = await getActivityLogs();

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-base lg:text-base font-medium text-gray-900 mb-6">
        Simulate Cloud Practitioner Exam
      </h1>
      <MockExam />
    </section>
  );
}
