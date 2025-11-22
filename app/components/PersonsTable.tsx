type Person = {
    id: number;
    name: string | null;
    age: number | null;
    group_id: number | null;
    groups: {
        id: number;
        name: string | null;
    } | null;
};

type PersonsTableProps = {
    persons: Person[];
};

export default function PersonsTable({ persons }: PersonsTableProps) {
    return (
        <div className="w-full overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            Age
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            Group
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {persons.map((person) => (
                        <tr key={person.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {person.name || "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {person.age ?? "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {person.groups?.name || "-"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

