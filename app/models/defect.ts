export interface Defect {
    id: number
    roll_id: number
    defect_type_id: number
    position_m: number
    severity: number
    notes: string | null
    defect_types: {
        id: number
        code: string
        description: string
    }
}

