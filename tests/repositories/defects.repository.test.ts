import { DefectsRepository } from '@/repositories/defects.repository'
import prisma from '@/app/lib/prisma'

// Mock Prisma client
jest.mock('@/app/lib/prisma', () => ({
    __esModule: true,
    default: {
        rolls: {
            findUnique: jest.fn(),
        },
        defects: {
            findMany: jest.fn(),
        },
        $queryRaw: jest.fn(),
    },
}))

describe('DefectsRepository', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('findRollById', () => {
        it('should return roll when it exists', async () => {
            const mockRoll = {
                id: 1,
                roll_code: 'ROLL-A1',
                material: 'PET Film',
                width_mm: 1200,
                length_m: 500,
                produced_at: new Date('2024-01-01'),
            }

                ; (prisma.rolls.findUnique as jest.Mock).mockResolvedValue(mockRoll)

            const result = await DefectsRepository.findRollById(1)

            expect(result).toEqual(mockRoll)
            expect(prisma.rolls.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
            })
            expect(prisma.rolls.findUnique).toHaveBeenCalledTimes(1)
        })

        it('should return null when roll does not exist', async () => {
            ; (prisma.rolls.findUnique as jest.Mock).mockResolvedValue(null)

            const result = await DefectsRepository.findRollById(999)

            expect(result).toBeNull()
            expect(prisma.rolls.findUnique).toHaveBeenCalledWith({
                where: { id: 999 },
            })
        })

        it('should propagate database errors', async () => {
            const dbError = new Error('Database connection failed')
                ; (prisma.rolls.findUnique as jest.Mock).mockRejectedValue(dbError)

            await expect(DefectsRepository.findRollById(1)).rejects.toThrow(
                'Database connection failed'
            )
        })
    })

    describe('aggregateDefectsByType', () => {
        it('should return aggregated defect statistics', async () => {
            const mockAggregatedData = [
                {
                    defect_type_id: 1,
                    defect_type_code: 'SCR',
                    defect_type_description: 'Surface scratch',
                    defect_count: BigInt(5),
                    avg_severity: 2.8,
                    min_severity: 1,
                    max_severity: 4,
                    avg_position_m: 150.5,
                    min_position_m: 50.0,
                    max_position_m: 250.0,
                },
                {
                    defect_type_id: 2,
                    defect_type_code: 'BLB',
                    defect_type_description: 'Air bubble',
                    defect_count: BigInt(3),
                    avg_severity: 3.33,
                    min_severity: 2,
                    max_severity: 5,
                    avg_position_m: 200.0,
                    min_position_m: 150.0,
                    max_position_m: 300.0,
                },
            ]

                ; (prisma.$queryRaw as jest.Mock).mockResolvedValue(mockAggregatedData)

            const result = await DefectsRepository.aggregateDefectsByType(1)

            expect(result).toEqual(mockAggregatedData)
            expect(prisma.$queryRaw).toHaveBeenCalledTimes(1)
            // Verify the SQL query structure is called
            expect(prisma.$queryRaw).toHaveBeenCalled()
        })

        it('should return empty array when roll has no defects', async () => {
            ; (prisma.$queryRaw as jest.Mock).mockResolvedValue([])

            const result = await DefectsRepository.aggregateDefectsByType(1)

            expect(result).toEqual([])
        })

        it('should handle single defect type', async () => {
            const mockSingleDefect = [
                {
                    defect_type_id: 1,
                    defect_type_code: 'SCR',
                    defect_type_description: 'Surface scratch',
                    defect_count: BigInt(1),
                    avg_severity: 3.0,
                    min_severity: 3,
                    max_severity: 3,
                    avg_position_m: 100.0,
                    min_position_m: 100.0,
                    max_position_m: 100.0,
                },
            ]

                ; (prisma.$queryRaw as jest.Mock).mockResolvedValue(mockSingleDefect)

            const result = await DefectsRepository.aggregateDefectsByType(2)

            expect(result).toHaveLength(1)
            expect(result[0].defect_count).toBe(BigInt(1))
        })

        it('should propagate SQL query errors', async () => {
            const sqlError = new Error('SQL syntax error')
                ; (prisma.$queryRaw as jest.Mock).mockRejectedValue(sqlError)

            await expect(
                DefectsRepository.aggregateDefectsByType(1)
            ).rejects.toThrow('SQL syntax error')
        })
    })

    describe('findDefectsByRollId', () => {
        it('should return defects with their types', async () => {
            const mockDefects = [
                {
                    id: 1,
                    roll_id: 1,
                    defect_type_id: 1,
                    position_m: 12.4,
                    severity: 2,
                    notes: 'Minor scratch near leading edge',
                    defect_types: {
                        id: 1,
                        code: 'SCR',
                        description: 'Surface scratch',
                    },
                },
                {
                    id: 2,
                    roll_id: 1,
                    defect_type_id: 3,
                    position_m: 78.9,
                    severity: 4,
                    notes: 'Wrinkle spans full width',
                    defect_types: {
                        id: 3,
                        code: 'WRK',
                        description: 'Wrinkle',
                    },
                },
            ]

                ; (prisma.defects.findMany as jest.Mock).mockResolvedValue(mockDefects)

            const result = await DefectsRepository.findDefectsByRollId(1)

            expect(result).toEqual(mockDefects)
            expect(prisma.defects.findMany).toHaveBeenCalledWith({
                where: { roll_id: 1 },
                include: {
                    defect_types: true,
                },
                orderBy: {
                    position_m: 'asc',
                },
            })
        })

        it('should return empty array when no defects found', async () => {
            ; (prisma.defects.findMany as jest.Mock).mockResolvedValue([])

            const result = await DefectsRepository.findDefectsByRollId(3)

            expect(result).toEqual([])
        })

        it('should order defects by position ascending', async () => {
            const mockDefects = [
                {
                    id: 2,
                    roll_id: 1,
                    defect_type_id: 1,
                    position_m: 200.0,
                    severity: 3,
                    notes: null,
                    defect_types: { id: 1, code: 'SCR', description: 'Surface scratch' },
                },
                {
                    id: 1,
                    roll_id: 1,
                    defect_type_id: 1,
                    position_m: 50.0,
                    severity: 2,
                    notes: null,
                    defect_types: { id: 1, code: 'SCR', description: 'Surface scratch' },
                },
            ]

                ; (prisma.defects.findMany as jest.Mock).mockResolvedValue(mockDefects)

            const result = await DefectsRepository.findDefectsByRollId(1)

            expect(result).toEqual(mockDefects)
            expect(prisma.defects.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    orderBy: { position_m: 'asc' },
                })
            )
        })

        it('should propagate database errors', async () => {
            const dbError = new Error('Database timeout')
                ; (prisma.defects.findMany as jest.Mock).mockRejectedValue(dbError)

            await expect(DefectsRepository.findDefectsByRollId(1)).rejects.toThrow(
                'Database timeout'
            )
        })
    })
})

