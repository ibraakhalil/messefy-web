import { ArrowRight, Sparkles, Zap, FileDown } from 'lucide-react'
import Button from '../ui/button'

// Constants
const FEATURES = [
  {
    icon: Zap,
    title: '10x faster',
    description: 'Smart meal entry grid',
    colorScheme: 'purple',
  },
  {
    icon: Sparkles,
    title: 'Real-time',
    description: 'Live rates & balances',
    colorScheme: 'pink',
  },
  {
    icon: FileDown,
    title: 'Export',
    description: 'One-click reports',
    colorScheme: 'yellow',
  },
] as const

const DEMO_USERS = ['Rahim', 'Karim', 'Jui'] as const

const STATS = [
  {
    label: 'Todays Meals',
    value: '124.5',
    subtext: '↑ 12% from yesterday',
    gradient: 'from-purple-500 to-purple-600',
    textColors: {
      label: 'text-purple-100',
      subtext: 'text-purple-200',
    },
  },
  {
    label: 'Meal Rate',
    value: '৳53.25',
    subtext: 'Auto-calculated',
    gradient: 'from-pink-500 to-pink-600',
    textColors: {
      label: 'text-pink-100',
      subtext: 'text-pink-200',
    },
  },
] as const

const COLOR_CLASSES = {
  purple: {
    border: '',
    bg: 'from-purple-50',
    blur: 'bg-purple-200',
    icon: 'text-purple-600',
  },
  pink: {
    border: '',
    bg: 'from-pink-50',
    blur: 'bg-pink-200',
    icon: 'text-pink-600',
  },
  yellow: {
    border: 'border-yellow-100',
    bg: 'from-yellow-50',
    blur: 'bg-yellow-200',
    icon: 'text-yellow-600',
  },
} as const

export const Hero = () => {
  return (
    <section className="relative">
      <div className="container max-w-7xl py-20 md:py-28">
        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* Left Column - Content */}
          <div className="reveal">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2">
              <span className="relative flex size-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex size-3 rounded-full bg-green-500" />
              </span>
              <p className="border-border-color flex items-center gap-2 rounded-full border p-1 px-3 font-sans">
                <Sparkles className="h-3.5 w-3.5" />
                New • AI-powered meal tracking
              </p>
            </div>

            {/* Heading */}
            <h1 className="text-pure text-5xl leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Run your mess like a{' '}
              <span className="relative">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  pro
                </span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                  <path
                    d="M2 9C2 9 75.5 2 150 2C224.5 2 298 9 298 9"
                    stroke="url(#gradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#9333ea" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>

            {/* Description */}
            <p className="mt-6 text-xl leading-relaxed text-gray-600">
              Effortlessly manage meals, deposits, and expenses. Get instant monthly statements with
              automated calculations.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button variant="secondary">
                Start free
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <a
                href="#features"
                className="text-subtitle-color hover:text-pure-color inline-flex items-center gap-2 text-lg font-semibold"
              >
                View features
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            {/* Feature Cards */}
            <div className="mt-12 grid grid-cols-3 gap-4">
              {FEATURES.map(({ icon: Icon, title, description, colorScheme }) => {
                const colors = COLOR_CLASSES[colorScheme]
                return (
                  <div
                    key={title}
                    className={`group border-border-color relative overflow-hidden rounded-2xl border bg-gradient-to-br ${colors.bg} to-transparent p-4 transition-all duration-300 hover:shadow-lg ${colors.border}`}
                  >
                    <div
                      className={`absolute top-0 right-0 h-20 w-20 rounded-full ${colors.blur} opacity-20 blur-2xl transition-opacity group-hover:opacity-30`}
                    />
                    <Icon className={`mb-2 h-5 w-5 ${colors.icon}`} />
                    <p className="text-lg font-bold text-gray-900">{title}</p>
                    <p className="mt-1 text-sm text-gray-600">{description}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Column - Demo */}
          <div className="relative">
            <div className="absolute inset-0 rounded-3xl opacity-20 blur-3xl" />
            <div className="border-border-color relative transform rounded-3xl border p-6">
              <div className="rounded-2xl">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="size-3 rounded-full bg-red-500" />
                    <span className="size-3 rounded-full bg-yellow-500" />
                    <span className="size-3 rounded-full bg-green-500" />
                  </div>
                  <span className="bg-primary/10 rounded-full px-3 py-1 text-xs font-medium">
                    Live Demo
                  </span>
                </div>

                {/* Stats Cards */}
                <div className="mb-4 grid grid-cols-2 gap-3">
                  {STATS.map(({ label, value, subtext, gradient, textColors }) => (
                    <div
                      key={label}
                      className={`rounded-2xl bg-gradient-to-br ${gradient} p-4 text-white`}
                    >
                      <p className={`text-sm font-medium ${textColors.label}`}>{label}</p>
                      <p className="mt-1 text-3xl font-bold">{value}</p>
                      <p className={`mt-1 text-xs ${textColors.subtext}`}>{subtext}</p>
                    </div>
                  ))}
                </div>

                {/* Meal Entry Grid */}
                <div className="bg-secondary-bg mb-4 rounded-2xl p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="font-semibold">Quick Entry Grid</p>
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                      Auto-save
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {DEMO_USERS.map((name, index) => (
                      <div key={name} className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                        <p className="mb-2 text-sm font-medium">{name}</p>
                        <div className="flex gap-1">
                          {[1, index === 1 ? 0 : 1, 1].map((meal, mealIndex) => (
                            <span
                              key={mealIndex}
                              className="rounded-lg bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700"
                            >
                              {meal}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Balance Indicator */}
                <div className="rounded-2xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-700">Current Balance</p>
                      <p className="text-2xl font-bold text-green-900">+৳2,140</p>
                    </div>
                    <div className="rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white">
                      All Settled ✓
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
