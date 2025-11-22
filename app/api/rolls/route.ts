import { NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'

export async function GET() {
    try {
        const rolls = await prisma.rolls.findMany({
            orderBy: {
                produced_at: 'desc',
            },
            include: {
                _count: {
                    select: { defects: true }
                }
            }
        })

        // Format response to include defect count
        const rollsWithDefectCount = rolls.map(roll => ({
            ...roll,
            defect_count: roll._count.defects
        }))

        return NextResponse.json(rollsWithDefectCount, { status: 200 })
    } catch (error) {
        console.error('Error fetching rolls:', error)

        return NextResponse.json(
            {
                error: 'Internal server error while fetching rolls.',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}

