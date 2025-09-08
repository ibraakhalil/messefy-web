import { Timer, Plus, Clock, Activity, FileText, Grid } from 'lucide-react'

const FEATURES = [
  {
    icon: Grid,
    title: 'Spreadsheet-like meal grid',
    description: 'Keyboard-first input with bulk fill and repeat yesterday.',
  },
  {
    icon: Plus,
    title: 'Deposits & expenses',
    description: 'Record payments and bazar costs; categorize for clarity.',
  },
  {
    icon: Timer,
    title: 'Auto meal rate',
    description: 'Meal rate updates as you add expenses and meals.',
  },
  {
    icon: Activity,
    title: 'Monthly statements',
    description: 'Clear per-member due or refund, ready to share.',
  },
  {
    icon: FileText,
    title: 'Fast export',
    description: 'Export CSV in one click for reporting and backup.',
  },
  {
    icon: Clock,
    title: 'Roles & members',
    description: 'Invite or add offline members; set permissions per workspace.',
  },
]

export const Features = () => {
  return (
    <section id="features" className="py-16 sm:py-20">
      <div className="container max-w-7xl">
        <div className="reveal mx-auto max-w-2xl text-center">
          <h2 className="section-title">Everything you need to run a mess</h2>
          <p className="section-subtitle">
            Fast entry, accurate summaries, clear balances. No spreadsheets needed.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="reveal rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="mb-3 inline-flex size-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                  <Icon size={20} />
                </div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Features
