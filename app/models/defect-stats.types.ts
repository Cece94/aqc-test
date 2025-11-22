export interface DefectStats {
  defectTypeId: number
  defectTypeCode: string
  defectTypeDescription: string
  count: number
  avgSeverity: number
  minSeverity: number
  maxSeverity: number
  avgPositionM: number
  minPositionM: number
  maxPositionM: number
}

export interface AggregatedDefectsResponse {
  rollId: number
  rollCode: string
  material: string
  lengthM: number
  totalDefects: number
  defectsByType: DefectStats[]
}

