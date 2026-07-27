import { Users, PlusCircle, Share2, ArrowRight, Sparkles } from 'lucide-react'

export const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      title: 'Create workspace',
      description: 'Add members (online or offline), set currency, choose roles.',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/40',
      iconColor: 'text-blue-600 dark:text-blue-400',
      borderColor: 'border-blue-200 dark:border-blue-900/60',
    },
    {
      number: 2,
      title: 'Log meals & deposits',
      description: 'Use the day-by-day grid; record payments and bazar costs.',
      icon: PlusCircle,
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      borderColor: 'border-emerald-200 dark:border-emerald-900/60',
    },
    {
      number: 3,
      title: 'Share statements',
      description: 'Auto meal rate and per-member balances—export or share.',
      icon: Share2,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950/40',
      iconColor: 'text-purple-600 dark:text-purple-400',
      borderColor: 'border-purple-200 dark:border-purple-900/60',
    },
  ]

  return (
    <section id="how" className="relative overflow-hidden bg-primary-bg py-16 tablet:py-24 dark:bg-gray-900 transition-colors">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/30 to-transparent dark:from-gray-800/10"></div>
      <div className="absolute top-20 left-10 h-32 w-32 rounded-full bg-blue-100 opacity-20 blur-3xl dark:bg-blue-900/30"></div>
      <div className="absolute right-10 bottom-20 h-40 w-40 rounded-full bg-emerald-100 opacity-20 blur-3xl dark:bg-emerald-900/30"></div>

      <div className="relative container max-w-6xl px-4">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-100 to-blue-100 px-4 py-2 text-sm font-medium text-emerald-700 dark:from-emerald-950/80 dark:to-blue-950/80 dark:text-emerald-300">
            <Sparkles size={16} />
            How it works
          </div>
          <h2 className="mb-4 text-3xl font-extrabold leading-tight text-pure-color tablet:text-5xl dark:text-white">
            Three steps to
            <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent dark:from-emerald-400 dark:to-blue-400">
              {' '}
              clarity
            </span>
          </h2>
          <p className="text-lg leading-relaxed text-subtitle-color dark:text-gray-400">
            Create workspace, enter daily meals, record expenses. We do the math.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line - hidden on mobile */}
          <div className="absolute top-24 left-1/2 hidden w-full max-w-4xl -translate-x-1/2 transform tablet:block">
            <div className="flex items-center justify-between px-20">
              <div className="relative h-0.5 w-full bg-gradient-to-r from-blue-200 via-emerald-200 to-purple-200 dark:from-blue-900 dark:via-emerald-900 dark:to-purple-900">
                <div className="absolute -top-1 left-1/3 h-2 w-2 rounded-full bg-emerald-400"></div>
                <div className="absolute -top-1 right-1/3 h-2 w-2 rounded-full bg-purple-400"></div>
              </div>
            </div>
          </div>

          <div className="grid gap-8 tablet:grid-cols-3 tablet:gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div
                  key={step.number}
                  className="group relative"
                  style={{
                    animationDelay: `${index * 200}ms`,
                  }}
                >
                  {/* Mobile connector */}
                  {index < steps.length - 1 && (
                    <div className="absolute -bottom-4 left-1/2 z-10 -translate-x-1/2 transform tablet:hidden">
                      <ArrowRight size={24} className="text-gray-300 dark:text-gray-600" />
                    </div>
                  )}

                  {/* Card */}
                  <div
                    className={`relative h-full rounded-2xl border-2 ${step.borderColor} ${step.bgColor} group p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:border-gray-800 dark:bg-gray-800/80`}
                  >
                    {/* Glow effect */}
                    <div
                      className={`absolute inset-0 rounded-2xl bg-gradient-to-r opacity-0 transition-opacity duration-500 group-hover:opacity-20 ${step.color} -z-10 blur-xl`}
                    ></div>

                    {/* Step number with gradient background */}
                    <div className="relative mb-6">
                      <div
                        className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r ${step.color} transform text-xl font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}
                      >
                        {step.number}
                      </div>
                      {/* Floating icon */}
                      <div
                        className={`absolute -top-2 -right-2 flex h-10 w-10 transform items-center justify-center rounded-xl border-2 ${step.borderColor} ${step.bgColor} transition-transform duration-300 group-hover:rotate-12 dark:border-gray-700 dark:bg-gray-800`}
                      >
                        <Icon size={20} className={step.iconColor} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-pure-color transition-colors group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
                        {step.title}
                      </h3>
                      <p className="leading-relaxed text-subtitle-color dark:text-gray-400">{step.description}</p>
                    </div>

                    {/* Progress indicator */}
                    <div className="mt-6">
                      <div className="flex items-center justify-between text-sm">
                        <span className={`${step.iconColor} font-medium`}>Step {step.number}</span>
                        <div className="flex space-x-1">
                          {steps.map((_, i) => (
                            <div
                              key={i}
                              className={`h-2 w-2 rounded-full transition-colors ${
                                i <= index ? 'bg-current' : 'bg-gray-300 dark:bg-gray-700'
                              }`}
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex transform cursor-pointer items-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-blue-600 px-8 py-4 font-semibold text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:from-emerald-700 hover:to-blue-700">
            <Sparkles size={20} />
            Get started now
            <ArrowRight size={18} className="ml-1" />
          </div>
          <p className="mt-3 text-sm text-subtitle-color dark:text-gray-400">No credit card required • Free forever</p>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks

