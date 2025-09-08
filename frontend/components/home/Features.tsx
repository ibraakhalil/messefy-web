import { Timer, Plus, Clock, Activity, FileText, Grid } from 'lucide-react'

const FEATURES = [
  {
    icon: Grid,
    title: 'Spreadsheet-like meal grid',
    description: 'Keyboard-first input with bulk fill and repeat yesterday.',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50 hover:bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    icon: Plus,
    title: 'Deposits & expenses',
    description: 'Record payments and bazar costs; categorize for clarity.',
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-50 hover:bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
  {
    icon: Timer,
    title: 'Auto meal rate',
    description: 'Meal rate updates as you add expenses and meals.',
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-50 hover:bg-orange-100',
    iconColor: 'text-orange-600',
  },
  {
    icon: Activity,
    title: 'Monthly statements',
    description: 'Clear per-member due or refund, ready to share.',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50 hover:bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    icon: FileText,
    title: 'Fast export',
    description: 'Export CSV in one click for reporting and backup.',
    color: 'from-indigo-500 to-blue-500',
    bgColor: 'bg-indigo-50 hover:bg-indigo-100',
    iconColor: 'text-indigo-600',
  },
  {
    icon: Clock,
    title: 'Roles & members',
    description: 'Invite or add offline members; set permissions per workspace.',
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-50 hover:bg-amber-100',
    iconColor: 'text-amber-600',
  },
]

export const Features = () => {
  return (
    <section id="features" className="tablet:py-24 bg-gradient-to-b from-gray-50/50 to-white py-16">
      <div className="container max-w-7xl px-4">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700">
            <Activity size={16} />
            Features
          </div>
          <h2 className="tablet:text-5xl mb-4 text-4xl leading-tight font-bold text-gray-900">
            Everything you need to
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              {' '}
              run a mess
            </span>
          </h2>
          <p className="text-lg leading-relaxed text-gray-600">
            Fast entry, accurate summaries, clear balances. No spreadsheets needed.
          </p>
        </div>

        {/* Features Grid */}
        <div className="tablet:grid-cols-2 laptop:grid-cols-3 grid gap-6">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group relative"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Card */}
                <div className="relative h-full rounded-2xl border border-gray-200/60 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-200/40">
                  {/* Gradient border effect */}
                  <div
                    className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background: `linear-gradient(135deg, ${feature.color.split(' ')[1]}, ${feature.color.split(' ')[3]})`,
                    }}
                  ></div>

                  {/* Icon */}
                  <div
                    className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl transition-all duration-300 ${feature.bgColor}`}
                  >
                    <Icon
                      size={24}
                      className={`transition-all duration-300 ${feature.iconColor}`}
                    />
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-gray-900 transition-colors group-hover:text-gray-800">
                      {feature.title}
                    </h3>
                    <p className="leading-relaxed text-gray-600">{feature.description}</p>
                  </div>

                  {/* Hover arrow */}
                  <div className="mt-6 flex translate-x-0 transform items-center text-emerald-600 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                    <span className="text-sm font-medium">Learn more</span>
                    <svg
                      className="ml-2 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-medium text-white shadow-lg transition-colors hover:bg-emerald-700 hover:shadow-emerald-200">
            <Plus size={18} />
            Start managing your mess today
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features
