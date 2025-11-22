import { DefectsService } from '@/services/defects.service'
import { DefectsRepository } from '@/repositories/defects.repository'

// Mock the repository
jest.mock('@/repositories/defects.repository')

describe('DefectsService', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('getAggregatedDefectsByRollId', () => {
        describe('Success cases', () => {
            it('should return aggregated defects with statistics', async () => {
                const mockRoll = {
                    id: 1,
                    roll_code: 'ROLL-A1',
                    material: 'PET Film',
                    width_mm: 1200,
                    length_m: 500,
                    produced_at: new Date(),
                }

                const mockAggregatedData = [
                    {
                        defect_type_id: 1,
                        defect_type_code: 'SCR',
                        defect_type_description: 'Surface scratch',
                        defect_count: BigInt(3),
                        avg_severity: 2.5,
                        min_severity: 1,
                        max_severity: 4,
                        avg_position_m: 100.5,
                        min_position_m: 50.0,
                        max_position_m: 150.0,
                    },
                    {
                        defect_type_id: 2,
                        defect_type_code: 'BLB',
                        defect_type_description: 'Air bubble',
                        defect_count: BigInt(2),
                        avg_severity: 3.0,
                        min_severity: 2,
                        max_severity: 4,
                        avg_position_m: 200.0,
                        min_position_m: 180.0,
                        max_position_m: 220.0,
                    },
                ]

                    ; (DefectsRepository.findRollById as jest.Mock).mockResolvedValue(mockRoll)
                    ; (DefectsRepository.aggregateDefectsByType as jest.Mock).mockResolvedValue(
                        mockAggregatedData
                    )

                const result = await DefectsService.getAggregatedDefectsByRollId(1)

                expect(result).toEqual({
                    rollId: 1,
                    rollCode: 'ROLL-A1',
                    material: 'PET Film',
                    lengthM: 500,
                    totalDefects: 5,
                    defectsByType: [
                        {
                            defectTypeId: 1,
                            defectTypeCode: 'SCR',
                            defectTypeDescription: 'Surface scratch',
                            count: 3,
                            avgSeverity: 2.5,
                            minSeverity: 1,
                            maxSeverity: 4,
                            avgPositionM: 100.5,
                            minPositionM: 50.0,
                            maxPositionM: 150.0,
                        },
                        {
                            defectTypeId: 2,
                            defectTypeCode: 'BLB',
                            defectTypeDescription: 'Air bubble',
                            count: 2,
                            avgSeverity: 3.0,
                            minSeverity: 2,
                            maxSeverity: 4,
                            avgPositionM: 200.0,
                            minPositionM: 180.0,
                            maxPositionM: 220.0,
                        },
                    ],
                })

                expect(DefectsRepository.findRollById).toHaveBeenCalledWith(1)
                expect(DefectsRepository.aggregateDefectsByType).toHaveBeenCalledWith(1)
            })

            it('should handle roll with no defects', async () => {
                const mockRoll = {
                    id: 3,
                    roll_code: 'ROLL-C3',
                    material: 'Carbon Fiber',
                    width_mm: 1000,
                    length_m: 420,
                    produced_at: new Date(),
                }

                    ; (DefectsRepository.findRollById as jest.Mock).mockResolvedValue(mockRoll)
                    ; (DefectsRepository.aggregateDefectsByType as jest.Mock).mockResolvedValue([])

                const result = await DefectsService.getAggregatedDefectsByRollId(3)

                expect(result.totalDefects).toBe(0)
                expect(result.defectsByType).toEqual([])
                expect(result.lengthM).toBe(420)
            })

            it('should correctly calculate total defects', async () => {
                const mockRoll = {
                    id: 1,
                    roll_code: 'ROLL-A1',
                    material: 'PET Film',
                    width_mm: 1200,
                    length_m: 500,
                    produced_at: new Date(),
                }

                const mockAggregatedData = [
                    {
                        defect_type_id: 1,
                        defect_type_code: 'SCR',
                        defect_type_description: 'Surface scratch',
                        defect_count: BigInt(10),
                        avg_severity: 2.0,
                        min_severity: 1,
                        max_severity: 3,
                        avg_position_m: 100.0,
                        min_position_m: 10.0,
                        max_position_m: 200.0,
                    },
                    {
                        defect_type_id: 2,
                        defect_type_code: 'BLB',
                        defect_type_description: 'Air bubble',
                        defect_count: BigInt(15),
                        avg_severity: 3.0,
                        min_severity: 2,
                        max_severity: 4,
                        avg_position_m: 150.0,
                        min_position_m: 50.0,
                        max_position_m: 250.0,
                    },
                ]

                    ; (DefectsRepository.findRollById as jest.Mock).mockResolvedValue(mockRoll)
                    ; (DefectsRepository.aggregateDefectsByType as jest.Mock).mockResolvedValue(
                        mockAggregatedData
                    )

                const result = await DefectsService.getAggregatedDefectsByRollId(1)

                expect(result.totalDefects).toBe(25)
            })

            it('should correctly convert BigInt to number', async () => {
                const mockRoll = {
                    id: 1,
                    roll_code: 'ROLL-A1',
                    material: 'PET Film',
                    width_mm: 1200,
                    length_m: 500,
                    produced_at: new Date(),
                }

                const mockAggregatedData = [
                    {
                        defect_type_id: 1,
                        defect_type_code: 'SCR',
                        defect_type_description: 'Surface scratch',
                        defect_count: BigInt(999),
                        avg_severity: 2.5,
                        min_severity: 1,
                        max_severity: 5,
                        avg_position_m: 100.0,
                        min_position_m: 10.0,
                        max_position_m: 400.0,
                    },
                ]

                    ; (DefectsRepository.findRollById as jest.Mock).mockResolvedValue(mockRoll)
                    ; (DefectsRepository.aggregateDefectsByType as jest.Mock).mockResolvedValue(
                        mockAggregatedData
                    )

                const result = await DefectsService.getAggregatedDefectsByRollId(1)

                expect(result.defectsByType[0].count).toBe(999)
                expect(typeof result.defectsByType[0].count).toBe('number')
            })
        })

        describe('Validation - rollId', () => {
            it('should throw error for negative rollId', async () => {
                await expect(
                    DefectsService.getAggregatedDefectsByRollId(-1)
                ).rejects.toThrow('Invalid roll ID. Must be a positive integer.')

                expect(DefectsRepository.findRollById).not.toHaveBeenCalled()
            })

            it('should throw error for zero rollId', async () => {
                await expect(
                    DefectsService.getAggregatedDefectsByRollId(0)
                ).rejects.toThrow('Invalid roll ID. Must be a positive integer.')

                expect(DefectsRepository.findRollById).not.toHaveBeenCalled()
            })

            it('should throw error for decimal rollId', async () => {
                await expect(
                    DefectsService.getAggregatedDefectsByRollId(1.5)
                ).rejects.toThrow('Invalid roll ID. Must be a positive integer.')

                expect(DefectsRepository.findRollById).not.toHaveBeenCalled()
            })

            it('should accept valid positive integer rollId', async () => {
                const mockRoll = {
                    id: 100,
                    roll_code: 'ROLL-X',
                    material: 'Test Material',
                    width_mm: 1000,
                    length_m: 500,
                    produced_at: new Date(),
                }

                    ; (DefectsRepository.findRollById as jest.Mock).mockResolvedValue(mockRoll)
                    ; (DefectsRepository.aggregateDefectsByType as jest.Mock).mockResolvedValue([])

                await DefectsService.getAggregatedDefectsByRollId(100)

                expect(DefectsRepository.findRollById).toHaveBeenCalledWith(100)
            })
        })

        describe('Error cases - Roll not found', () => {
            it('should throw error when roll does not exist', async () => {
                ; (DefectsRepository.findRollById as jest.Mock).mockResolvedValue(null)

                await expect(
                    DefectsService.getAggregatedDefectsByRollId(999)
                ).rejects.toThrow('Roll with ID 999 not found.')

                expect(DefectsRepository.findRollById).toHaveBeenCalledWith(999)
                expect(DefectsRepository.aggregateDefectsByType).not.toHaveBeenCalled()
            })

            it('should not call aggregation when roll is not found', async () => {
                ; (DefectsRepository.findRollById as jest.Mock).mockResolvedValue(null)

                try {
                    await DefectsService.getAggregatedDefectsByRollId(999)
                } catch (error) {
                    // Expected to throw
                }

                expect(DefectsRepository.aggregateDefectsByType).not.toHaveBeenCalled()
            })
        })

        describe('Error cases - Repository errors', () => {
            it('should propagate repository errors', async () => {
                const dbError = new Error('Database connection failed')
                    ; (DefectsRepository.findRollById as jest.Mock).mockRejectedValue(dbError)

                await expect(
                    DefectsService.getAggregatedDefectsByRollId(1)
                ).rejects.toThrow('Database connection failed')
            })

            it('should propagate aggregation errors', async () => {
                const mockRoll = {
                    id: 1,
                    roll_code: 'ROLL-A1',
                    material: 'PET Film',
                    width_mm: 1200,
                    length_m: 500,
                    produced_at: new Date(),
                }

                const sqlError = new Error('SQL query timeout')
                    ; (DefectsRepository.findRollById as jest.Mock).mockResolvedValue(mockRoll)
                    ; (DefectsRepository.aggregateDefectsByType as jest.Mock).mockRejectedValue(
                        sqlError
                    )

                await expect(
                    DefectsService.getAggregatedDefectsByRollId(1)
                ).rejects.toThrow('SQL query timeout')
            })
        })
    })

    describe('getDefectsByRollId', () => {
        it('should return all defects for a roll', async () => {
            const mockDefects = [
                {
                    id: 1,
                    roll_id: 1,
                    defect_type_id: 1,
                    position_m: 12.4,
                    severity: 2,
                    notes: 'Minor scratch',
                    defect_types: {
                        id: 1,
                        code: 'SCR',
                        description: 'Surface scratch',
                    },
                },
            ]

                ; (DefectsRepository.findDefectsByRollId as jest.Mock).mockResolvedValue(
                    mockDefects
                )

            const result = await DefectsService.getDefectsByRollId(1)

            expect(result).toEqual(mockDefects)
            expect(DefectsRepository.findDefectsByRollId).toHaveBeenCalledWith(1)
        })

        it('should validate rollId before calling repository', async () => {
            await expect(DefectsService.getDefectsByRollId(-1)).rejects.toThrow(
                'Invalid roll ID. Must be a positive integer.'
            )

            expect(DefectsRepository.findDefectsByRollId).not.toHaveBeenCalled()
        })

        it('should propagate repository errors', async () => {
            const dbError = new Error('Database error')
                ; (DefectsRepository.findDefectsByRollId as jest.Mock).mockRejectedValue(
                    dbError
                )

            await expect(DefectsService.getDefectsByRollId(1)).rejects.toThrow(
                'Database error'
            )
        })
    })
})

