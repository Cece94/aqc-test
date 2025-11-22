'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

interface Roll {
    id: number
    roll_code: string
    material: string
    width_mm: number
    length_m: number
    produced_at: string
}

export function RollsList() {
    const [rolls, setRolls] = useState<Roll[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        async function fetchRolls() {
            try {
                setLoading(true)
                setError(null)

                const response = await fetch('/api/rolls')

                if (!response.ok) {
                    throw new Error('Failed to fetch rolls')
                }

                const data = await response.json()
                setRolls(data)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred')
            } finally {
                setLoading(false)
            }
        }

        fetchRolls()
    }, [])

    if (loading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-4 w-48" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-4 w-full" />
                        </CardContent>
                    </Card>
                ))}
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

    if (rolls.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>No Rolls Found</CardTitle>
                    <CardDescription>There are no rolls in the database.</CardDescription>
                </CardHeader>
            </Card>
        )
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rolls.map((roll) => (
                <Card
                    key={roll.id}
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => router.push(`/rolls/${roll.id}`)}
                >
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            {roll.roll_code}
                            <Badge variant="outline">{roll.material}</Badge>
                        </CardTitle>
                        <CardDescription>
                            Produced: {new Date(roll.produced_at).toLocaleDateString()}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                            <span>Width: {roll.width_mm}mm</span>
                            <span>Length: {roll.length_m}m</span>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

