import { NextRequest, NextResponse } from 'next/server'
import { DefectsService } from '@/services/defects.service'
import { RollData } from '@/app/models/roll-data'

/**
 * Unified API endpoint that returns all roll data in a single request
 * Includes roll info, aggregated stats, and individual defects
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

    // Get aggregated stats (includes roll info)
    const aggregatedResponse = await DefectsService.getAggregatedDefectsByRollId(rollIdNum)

    // Get individual defects for map visualization
    const individualDefectsRaw = await DefectsService.getDefectsByRollId(rollIdNum)

    // Convert Decimal to number for JSON serialization
    const individualDefects = individualDefectsRaw.map(defect => ({
      ...defect,
      position_m: Number(defect.position_m)
    }))

    // Build unified response
    const response: RollData = {
      roll: {
        id: aggregatedResponse.rollId,
        rollCode: aggregatedResponse.rollCode,
        material: aggregatedResponse.material,
        lengthM: aggregatedResponse.lengthM,
      },
      aggregatedStats: {
        totalDefects: aggregatedResponse.totalDefects,
        defectsByType: aggregatedResponse.defectsByType,
      },
      individualDefects,
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error('Error in unified roll endpoint:', error)

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

    return NextResponse.json(
      {
        error: 'Internal server error while fetching roll data.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

