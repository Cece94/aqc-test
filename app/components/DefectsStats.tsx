'use client'

import { useEffect, useState, useRef } from 'react'
import { AggregatedDefectsResponse } from '@/app/models/defect-stats.types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { DefectsChart, DEFECT_COLORS } from './DefectsChart'
import { DefectsMap } from './DefectsMap'
import { DefectsProvider, useDefects } from '@/app/contexts/DefectsContext'

interface DefectsStatsProps {
    rollId: number
}

function DefectsStatsContent({ rollId }: DefectsStatsProps) {
    const [data, setData] = useState<AggregatedDefectsResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { selectedDefectTypeId } = useDefects()

    // Refs for each defect card to enable scrolling
    const defectRefs = useRef<Map<number, HTMLDivElement>>(new Map())

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true)
                setError(null)

                const response = await fetch(`/api/rolls/${rollId}/defects-stats`)

                if (!response.ok) {
                    const errorData = await response.json()
                    throw new Error(errorData.error || 'Failed to fetch data')
                }

                const result = await response.json()
                setData(result)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [rollId])

    // Scroll to selected defect card
    useEffect(() => {
        if (selectedDefectTypeId !== null) {
            const element = defectRefs.current.get(selectedDefectTypeId)
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }
        }
    }, [selectedDefectTypeId])

    if (loading) {
        return (
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-64" />
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (error) {
        return (
            <Card className="border-destructive">
                <CardHeader>
                    <CardTitle className="text-destructive">Error</CardTitle>
                    <CardDescription>{error}</CardDescription>
                </CardHeader>
            </Card>
        )
    }

    if (!data) {
        return null
    }

    return (
        <div className="space-y-6">
            {/* Roll Info */}
            <Card>
                <CardHeader>
                    <CardTitle>Roll: {data.rollCode}</CardTitle>
                    <CardDescription>
                        <div className="flex gap-6 mt-2">
                            <span>Material: <span className="text-foreground font-medium">{data.material}</span></span>
                            <span>Total Defects: <Badge variant="secondary">{data.totalDefects}</Badge></span>
                        </div>
                    </CardDescription>
                </CardHeader>
            </Card>

            {/* Defects Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Defects Overview</CardTitle>
                    <CardDescription>Visual distribution of defects by type</CardDescription>
                </CardHeader>
                <CardContent>
                    {data.defectsByType.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">No defects to display</p>
                    ) : (
                        <DefectsChart data={data.defectsByType} />
                    )}
                </CardContent>
            </Card>

            {/* Defects Position Map */}
            <Card>
                <CardHeader>
                    <CardTitle>Defects Position Map</CardTitle>
                    <CardDescription>Location of defects along the roll length</CardDescription>
                </CardHeader>
                <CardContent>
                    <DefectsMap rollId={rollId} rollLengthM={data.lengthM} />
                </CardContent>
            </Card>

            {/* Defects List */}
            <Card>
                <CardHeader>
                    <CardTitle>Defects Details</CardTitle>
                    <CardDescription>Detailed statistics for each defect type</CardDescription>
                </CardHeader>
                <CardContent>
                    {data.defectsByType.length === 0 ? (
                        <p className="text-muted-foreground">No defects found for this roll.</p>
                    ) : (
                        <div className="space-y-3">
                            {data.defectsByType.map((defect, index) => (
                                <Card
                                    key={defect.defectTypeId}
                                    ref={(el) => {
                                        if (el) {
                                            defectRefs.current.set(defect.defectTypeId, el)
                                        }
                                    }}
                                    className={`hover:bg-accent/50 transition-all ${selectedDefectTypeId === defect.defectTypeId ? 'ring-2 ring-primary' : ''
                                        }`}
                                    style={{ borderLeft: `4px solid ${DEFECT_COLORS[index % DEFECT_COLORS.length]}` }}
                                >
                                    <CardContent className="pt-6">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <Badge
                                                    variant="outline"
                                                    className="font-mono"
                                                    style={{
                                                        borderColor: DEFECT_COLORS[index % DEFECT_COLORS.length],
                                                        color: DEFECT_COLORS[index % DEFECT_COLORS.length]
                                                    }}
                                                >
                                                    {defect.defectTypeCode}
                                                </Badge>
                                                <span className="text-sm text-muted-foreground">
                                                    {defect.defectTypeDescription}
                                                </span>
                                            </div>
                                            <Badge className="text-lg px-4 py-1">
                                                {defect.count}
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-muted-foreground">Severity:</span>
                                                <div className="text-foreground mt-1">
                                                    Avg: {defect.avgSeverity} | Min: {defect.minSeverity} | Max: {defect.maxSeverity}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Position (m):</span>
                                                <div className="text-foreground mt-1">
                                                    Avg: {defect.avgPositionM}m | Range: {defect.minPositionM}m - {defect.maxPositionM}m
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

// Wrapper component with Context Provider
export function DefectsStats({ rollId }: DefectsStatsProps) {
    return (
        <DefectsProvider>
            <DefectsStatsContent rollId={rollId} />
        </DefectsProvider>
    )
}

