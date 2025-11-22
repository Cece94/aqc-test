import prisma from "@/app/lib/prisma"

/**
 * Repository layer for defects data access
 * Handles all database operations related to defects
 */
export class DefectsRepository {
    /**
     * Get roll by ID from database
     */
    static async findRollById(rollId: number) {
        return await prisma.rolls.findUnique({
            where: { id: rollId },
        })
    }

    /**
     * Aggregate defects by type for a specific roll using optimized SQL query
     */
    static async aggregateDefectsByType(rollId: number) {
        return await prisma.$queryRaw<
            Array<{
                defect_type_id: number
                defect_type_code: string
                defect_type_description: string
                defect_count: bigint
                avg_severity: number
                min_severity: number
                max_severity: number
                avg_position_m: number
                min_position_m: number
                max_position_m: number
            }>
        >`
      SELECT 
        dt.id AS defect_type_id,
        dt.code AS defect_type_code,
        dt.description AS defect_type_description,
        COUNT(d.id) AS defect_count,
        ROUND(AVG(d.severity)::numeric, 2)::float AS avg_severity,
        MIN(d.severity) AS min_severity,
        MAX(d.severity) AS max_severity,
        ROUND(AVG(d.position_m)::numeric, 2)::float AS avg_position_m,
        MIN(d.position_m)::float AS min_position_m,
        MAX(d.position_m)::float AS max_position_m
      FROM defects d
      INNER JOIN defect_types dt ON dt.id = d.defect_type_id
      WHERE d.roll_id = ${rollId}
      GROUP BY dt.id, dt.code, dt.description
      ORDER BY defect_count DESC
    `
    }

    /**
     * Get all defects for a specific roll with their types
     */
    static async findDefectsByRollId(rollId: number) {
        return await prisma.defects.findMany({
            where: { roll_id: rollId },
            include: {
                defect_types: true,
            },
            orderBy: {
                position_m: "asc",
            },
        })
    }
}

