'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useRoll } from '@/app/contexts/DefectsContext'

// Colors for different defect types (exported for use in other components)
export const DEFECT_COLORS = ['#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']

export function DefectsChart() {
  const { rollData, setSelectedDefectTypeId } = useRoll()

  if (!rollData) return null
  
  // Transform data for Recharts
  const chartData = rollData.aggregatedStats.defectsByType.map((defect) => ({
    code: defect.defectTypeCode,
    count: defect.count,
    description: defect.defectTypeDescription,
    defectTypeId: defect.defectTypeId,
  }))

  const handleBarClick = (data: any) => {
    if (data && data.defectTypeId) {
      setSelectedDefectTypeId(data.defectTypeId)
    }
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis 
          dataKey="code" 
          tick={{ fontSize: 14, fontWeight: 500 }}
        />
        <YAxis 
          label={{ value: 'Number of Defects', angle: -90, position: 'insideLeft' }}
          tick={{ fontSize: 12 }}
        />
        <Tooltip 
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                  <p className="font-semibold text-foreground">{payload[0].payload.code}</p>
                  <p className="text-sm text-muted-foreground">{payload[0].payload.description}</p>
                  <p className="text-lg font-bold text-primary mt-1">
                    {payload[0].value} defect{payload[0].value !== 1 ? 's' : ''}
                  </p>
                </div>
              )
            }
            return null
          }}
        />
        <Bar 
          dataKey="count" 
          radius={[8, 8, 0, 0]}
          onClick={handleBarClick}
          cursor="pointer"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={DEFECT_COLORS[index % DEFECT_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

