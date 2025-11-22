'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { RollData } from '@/app/models/roll-data'

interface RollContextType {
    // Data
    rollData: RollData | null

    // UI state
    selectedDefectTypeId: number | null
    setSelectedDefectTypeId: (id: number | null) => void

    // Loading states
    loading: boolean
    error: string | null
}

const RollContext = createContext<RollContextType | undefined>(undefined)

interface RollProviderProps {
    rollId: number
    children: ReactNode
}

export function RollProvider({ rollId, children }: RollProviderProps) {
    const [rollData, setRollData] = useState<RollData | null>(null)
    const [selectedDefectTypeId, setSelectedDefectTypeId] = useState<number | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchRollData() {
            try {
                setLoading(true)
                setError(null)

                // Single unified API call
                const response = await fetch(`/api/rolls/${rollId}`)

                if (!response.ok) {
                    const errorData = await response.json()
                    throw new Error(errorData.error || 'Failed to fetch roll data')
                }

                const data = await response.json()
                setRollData(data)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred')
            } finally {
                setLoading(false)
            }
        }

        fetchRollData()
    }, [rollId])

    return (
        <RollContext.Provider
            value={{
                rollData,
                selectedDefectTypeId,
                setSelectedDefectTypeId,
                loading,
                error,
            }}
        >
            {children}
        </RollContext.Provider>
    )
}

export function useRoll() {
    const context = useContext(RollContext)
    if (context === undefined) {
        throw new Error('useRoll must be used within a RollProvider')
    }
    return context
}

