import { RollsList } from './components/RollsList'

export default function Home() {
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
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Available Rolls</h2>
          <p className="text-muted-foreground">Select a roll to view its defect analytics</p>
        </div>
        <RollsList />
      </main>
    </div>
  );
}
