import { getActivityLogs } from "@/lib/db/queries";
import Flashcards from "@/components/ui/flashcards";

export default async function HistoryPage() {
  const logs = await getActivityLogs();

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-base lg:text-base font-medium text-gray-900 mb-6">
        Flashcards
      </h1>
      <Flashcards />
    </section>
  );
}
