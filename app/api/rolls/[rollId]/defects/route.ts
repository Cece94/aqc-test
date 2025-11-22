import { NextRequest, NextResponse } from 'next/server'
import { DefectsService } from '@/services/defects.service'

/**
 * API endpoint to get all individual defects for a roll
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ rollId: string }> }
) {
    try {
        const { rollId } = await params
        const rollIdNum = parseInt(rollId, 10)

        if (isNaN(rollIdNum)) {
            return NextResponse.json(
                { error: 'Invalid roll ID format. Must be a number.' },
                { status: 400 }
            )
        }

        const defects = await DefectsService.getDefectsByRollId(rollIdNum)

        return NextResponse.json(defects, { status: 200 })
    } catch (error) {
        console.error('Error in defects endpoint:', error)

        if (error instanceof Error) {
            if (error.message.includes('Invalid roll ID')) {
                return NextResponse.json(
                    { error: error.message },
                    { status: 400 }
                )
            }
        }

        return NextResponse.json(
            {
                error: 'Internal server error while fetching defects.',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}

