import { DefectsStats } from '@/app/components/DefectsStats'
import { RollProvider } from '@/app/contexts/DefectsContext'
import Link from 'next/link'

interface PageProps {
    params: Promise<{ rollId: string }>
}

export default async function RollPage({ params }: PageProps) {
    const { rollId } = await params
    const rollIdNum = parseInt(rollId, 10)

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border bg-card">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-lg">A</span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">AQC Test</h1>
                            <p className="text-sm text-muted-foreground">Defect Analytics Platform</p>
                        </div>
                    </div>
                    <Link
                        href="/"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        ← Back to Rolls
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                {isNaN(rollIdNum) ? (
                    <div className="text-center py-20">
                        <p className="text-destructive font-medium">Invalid roll ID</p>
                    </div>
                ) : (
                    <RollProvider rollId={rollIdNum}>
                        <DefectsStats />
                    </RollProvider>
                )}
            </main>
        </div>
    )
}

