import { DefectStats } from './defect-stats'

export interface AggregatedDefectsResponse {
    rollId: number
    rollCode: string
    material: string
    lengthM: number
    totalDefects: number
    defectsByType: DefectStats[]
}

