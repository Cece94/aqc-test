import { PersonService } from "../services/person.service";
import PersonsTable from "./components/PersonsTable";

export default async function Home() {
  const persons = await PersonService.getAllPersonsWithGroups();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <main className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Persons List
        </h1>
        <PersonsTable persons={persons} />
      </main>
    </div>
  );
}
