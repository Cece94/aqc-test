import { DefectStats, AggregatedDefectsResponse } from "@/app/models/defect-stats.types"
import { DefectsRepository } from "@/repositories/defects.repository"

/**
 * Service layer for defects business logic
 * Validates input, orchestrates repository calls, and converts to DTOs
 */
export class DefectsService {
    /**
     * Validates roll ID input
     * @throws Error if rollId is invalid
     */
    private static validateRollId(rollId: number): void {
        if (!Number.isInteger(rollId) || rollId <= 0) {
            throw new Error("Invalid roll ID. Must be a positive integer.")
        }
    }

    /**
     * Converts raw database aggregation results to DefectStats DTOs
     */
    private static mapToDefectStatsDTO(dbResult: Array<{
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
    }>): DefectStats[] {
        return dbResult.map((row) => ({
            defectTypeId: row.defect_type_id,
            defectTypeCode: row.defect_type_code,
            defectTypeDescription: row.defect_type_description,
            count: Number(row.defect_count),
            avgSeverity: row.avg_severity,
            minSeverity: row.min_severity,
            maxSeverity: row.max_severity,
            avgPositionM: row.avg_position_m,
            minPositionM: row.min_position_m,
            maxPositionM: row.max_position_m,
        }))
    }

    /**
     * Gets aggregated defect statistics for a specific roll
     * @param rollId - The roll identifier
     * @returns Aggregated defects response DTO
     * @throws Error if roll not found or rollId is invalid
     */
    static async getAggregatedDefectsByRollId(rollId: number): Promise<AggregatedDefectsResponse> {
        // Validate input
        this.validateRollId(rollId)

        // Check if roll exists
        const roll = await DefectsRepository.findRollById(rollId)

        if (!roll) {
            throw new Error(`Roll with ID ${rollId} not found.`)
        }

        // Get aggregated defects from repository
        const aggregatedData = await DefectsRepository.aggregateDefectsByType(rollId)

        // Convert to DTOs
        const defectsByType = this.mapToDefectStatsDTO(aggregatedData)

        // Build response DTO
        return {
            rollId: roll.id,
            rollCode: roll.roll_code,
            material: roll.material,
            lengthM: roll.length_m,
            totalDefects: defectsByType.reduce((sum, d) => sum + d.count, 0),
            defectsByType,
        }
    }

    /**
     * Gets all defects for a specific roll (useful for visualization)
     */
    static async getDefectsByRollId(rollId: number) {
        this.validateRollId(rollId)
        return await DefectsRepository.findDefectsByRollId(rollId)
    }
}

