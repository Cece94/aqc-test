'use client'

import { useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { DefectsChart, DEFECT_COLORS } from './DefectsChart'
import { DefectsMap } from './DefectsMap'
import { useRoll } from '@/app/contexts/DefectsContext'

export function DefectsStats() {
    const { rollData, loading, error, selectedDefectTypeId } = useRoll()

    // Refs for each defect card to enable scrolling
    const defectRefs = useRef<Map<number, HTMLDivElement>>(new Map())

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

    if (!rollData) {
        return null
    }

    return (
        <div className="space-y-6">
            {/* Roll Info */}
            <Card>
                <CardHeader>
                    <CardTitle>Roll: {rollData.roll.rollCode}</CardTitle>
                    <CardDescription>
                        <div className="flex gap-6 mt-2">
                            <span>Material: <span className="text-foreground font-medium">{rollData.roll.material}</span></span>
                            <span>Total Defects: <Badge variant="secondary">{rollData.aggregatedStats.totalDefects}</Badge></span>
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
                    {rollData.aggregatedStats.defectsByType.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">No defects to display</p>
                    ) : (
                        <DefectsChart />
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
                    <DefectsMap />
                </CardContent>
            </Card>

            {/* Defects List */}
            <Card>
                <CardHeader>
                    <CardTitle>Defects Details</CardTitle>
                    <CardDescription>Detailed statistics for each defect type</CardDescription>
                </CardHeader>
                <CardContent>
                    {rollData.aggregatedStats.defectsByType.length === 0 ? (
                        <p className="text-muted-foreground">No defects found for this roll.</p>
                    ) : (
                        <div className="space-y-3">
                            {rollData.aggregatedStats.defectsByType.map((defect, index) => (
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

