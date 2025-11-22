import { DefectStats } from './defect-stats'
import { Defect } from './defect'

export interface RollData {
    roll: {
        id: number
        rollCode: string
        material: string
        lengthM: number
    }
    aggregatedStats: {
        totalDefects: number
        defectsByType: DefectStats[]
    }
    individualDefects: Defect[]
}

