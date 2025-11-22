import prisma from "../app/lib/prisma";

export class PersonService {
    // Fetch all persons with their associated group
    static async getAllPersonsWithGroups() {
        return await prisma.person.findMany({
            include: {
                groups: true,
            },
            orderBy: {
                name: "asc",
            },
        });
    }
}

