'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface DefectsContextType {
    selectedDefectTypeId: number | null
    setSelectedDefectTypeId: (id: number | null) => void
}

const DefectsContext = createContext<DefectsContextType | undefined>(undefined)

export function DefectsProvider({ children }: { children: ReactNode }) {
    const [selectedDefectTypeId, setSelectedDefectTypeId] = useState<number | null>(null)

    return (
        <DefectsContext.Provider value={{ selectedDefectTypeId, setSelectedDefectTypeId }}>
            {children}
        </DefectsContext.Provider>
    )
}

export function useDefects() {
    const context = useContext(DefectsContext)
    if (context === undefined) {
        throw new Error('useDefects must be used within a DefectsProvider')
    }
    return context
}

