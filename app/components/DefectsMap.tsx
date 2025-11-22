'use client'

import { useState } from 'react'
import { Stage, Layer, Rect, Circle, Text, Line } from 'react-konva'
import { DEFECT_COLORS } from './DefectsChart'
import { useRoll } from '@/app/contexts/DefectsContext'

export function DefectsMap() {
    const { rollData, setSelectedDefectTypeId } = useRoll()
    const [hoveredDefect, setHoveredDefect] = useState<number | null>(null)

    if (!rollData) return null

    const defects = rollData.individualDefects
    const rollLengthM = rollData.roll.lengthM

    // Canvas dimensions
    const width = 800
    const height = 200
    const rollHeight = 60
    const rollY = (height - rollHeight) / 2

    if (defects.length === 0) {
        return (
            <div className="flex items-center justify-center h-[200px] bg-muted/20 rounded-lg">
                <p className="text-muted-foreground">No defects to display on map</p>
            </div>
        )
    }

    // Create a map of defect type IDs to colors
    const uniqueDefectTypes = Array.from(new Set(defects.map(d => d.defect_type_id)))
    const defectTypeColorMap = new Map(
        uniqueDefectTypes.map((typeId, index) => [typeId, DEFECT_COLORS[index % DEFECT_COLORS.length]])
    )

    return (
        <div className="bg-muted/20 rounded-lg p-4">
            <div className="mb-4 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    Roll length: {rollLengthM}m
                </div>
                <div className="flex gap-3 text-xs">
                    {Array.from(new Set(defects.map(d => d.defect_types.code))).map((code, idx) => {
                        const defectType = defects.find(d => d.defect_types.code === code)
                        const color = defectTypeColorMap.get(defectType?.defect_type_id || 0)
                        return (
                            <div key={code} className="flex items-center gap-1">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: color }}
                                />
                                <span className="text-muted-foreground">{code}</span>
                            </div>
                        )
                    })}
                </div>
            </div>

            <Stage width={width} height={height}>
                <Layer>
                    {/* Roll representation */}
                    <Rect
                        x={50}
                        y={rollY}
                        width={700}
                        height={rollHeight}
                        fill="#f5f5f5"
                        stroke="#333"
                        strokeWidth={2}
                        cornerRadius={4}
                    />

                    {/* Position markers every 100m */}
                    {Array.from({ length: Math.floor(rollLengthM / 100) + 1 }, (_, i) => i * 100).map((pos) => {
                        const x = 50 + (pos / rollLengthM) * 700
                        return (
                            <Line
                                key={`marker-${pos}`}
                                points={[x, rollY + rollHeight, x, rollY + rollHeight + 10]}
                                stroke="#999"
                                strokeWidth={1}
                            />
                        )
                    })}

                    {/* Position labels */}
                    <Text
                        x={50}
                        y={rollY + rollHeight + 15}
                        text="0m"
                        fontSize={11}
                        fill="#666"
                    />
                    <Text
                        x={700}
                        y={rollY + rollHeight + 15}
                        text={`${rollLengthM}m`}
                        fontSize={11}
                        fill="#666"
                    />

                    {/* Defects as circles */}
                    {defects.map((defect) => {
                        const x = 50 + (Number(defect.position_m) / rollLengthM) * 700
                        const y = rollY + rollHeight / 2
                        const color = defectTypeColorMap.get(defect.defect_type_id) || '#000'
                        const isHovered = hoveredDefect === defect.id
                        const radius = isHovered ? 8 : 6

                        return (
                            <Circle
                                key={defect.id}
                                x={x}
                                y={y}
                                radius={radius}
                                fill={color}
                                stroke="#fff"
                                strokeWidth={2}
                                shadowBlur={isHovered ? 10 : 5}
                                shadowColor={color}
                                onMouseEnter={(e) => {
                                    setHoveredDefect(defect.id)
                                    const container = e.target.getStage()?.container()
                                    if (container) {
                                        container.style.cursor = 'pointer'
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    setHoveredDefect(null)
                                    const container = e.target.getStage()?.container()
                                    if (container) {
                                        container.style.cursor = 'default'
                                    }
                                }}
                                onClick={() => setSelectedDefectTypeId(defect.defect_type_id)}
                            />
                        )
                    })}

                    {/* Tooltip for hovered defect */}
                    {hoveredDefect && defects.find(d => d.id === hoveredDefect) && (() => {
                        const defect = defects.find(d => d.id === hoveredDefect)!
                        const x = 50 + (Number(defect.position_m) / rollLengthM) * 700
                        const y = rollY - 40

                        return (
                            <>
                                <Rect
                                    x={x - 60}
                                    y={y - 25}
                                    width={120}
                                    height={40}
                                    fill="white"
                                    stroke="#333"
                                    strokeWidth={1}
                                    cornerRadius={4}
                                    shadowBlur={5}
                                />
                                <Text
                                    x={x - 55}
                                    y={y - 18}
                                    text={`${defect.defect_types.code}`}
                                    fontSize={12}
                                    fontStyle="bold"
                                    fill="#333"
                                />
                                <Text
                                    x={x - 55}
                                    y={y - 2}
                                    text={`${defect.position_m}m | Severity ${defect.severity}`}
                                    fontSize={10}
                                    fill="#666"
                                />
                            </>
                        )
                    })()}
                </Layer>
            </Stage>
        </div>
    )
}

