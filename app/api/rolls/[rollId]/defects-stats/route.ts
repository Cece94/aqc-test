import { NextRequest, NextResponse } from 'next/server'
import { DefectsService } from '@/services/defects.service'

/**
 * API Route Controller for defects statistics
 * Handles HTTP request/response and delegates business logic to service layer
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ rollId: string }> }
) {
    try {
        const { rollId } = await params
        const rollIdNum = parseInt(rollId, 10)

        // Basic input parsing validation
        if (isNaN(rollIdNum)) {
            return NextResponse.json(
                { error: 'Invalid roll ID format. Must be a number.' },
                { status: 400 }
            )
        }

        // Delegate to service layer (handles validation, orchestration, and DTO conversion)
        const response = await DefectsService.getAggregatedDefectsByRollId(rollIdNum)

        return NextResponse.json(response, { status: 200 })
    } catch (error) {
        console.error('Error in defects-stats endpoint:', error)

        // Handle business logic errors (from service layer)
        if (error instanceof Error) {
            if (error.message.includes('not found')) {
                return NextResponse.json(
                    { error: error.message },
                    { status: 404 }
                )
            }

            if (error.message.includes('Invalid roll ID')) {
                return NextResponse.json(
                    { error: error.message },
                    { status: 400 }
                )
            }
        }

        // Handle unexpected errors
        return NextResponse.json(
            {
                error: 'Internal server error while processing defect statistics.',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}

