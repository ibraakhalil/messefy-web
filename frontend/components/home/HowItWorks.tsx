import { Users, PlusCircle, Share2, ArrowRight, Sparkles } from 'lucide-react'

const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      title: 'Create workspace',
      description: 'Add members (online or offline), set currency, choose roles.',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200',
    },
    {
      number: 2,
      title: 'Log meals & deposits',
      description: 'Use the day-by-day grid; record payments and bazar costs.',
      icon: PlusCircle,
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      borderColor: 'border-emerald-200',
    },
    {
      number: 3,
      title: 'Share statements',
      description: 'Auto meal rate and per-member balances—export or share.',
      icon: Share2,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-200',
    },
  ]

  return (
    <section id="how" className="tablet:py-24 relative overflow-hidden bg-white py-16">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/30 to-white"></div>
      <div className="absolute top-20 left-10 h-32 w-32 rounded-full bg-blue-100 opacity-20 blur-3xl"></div>
      <div className="absolute right-10 bottom-20 h-40 w-40 rounded-full bg-emerald-100 opacity-20 blur-3xl"></div>

      <div className="relative container max-w-6xl px-4">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-100 to-blue-100 px-4 py-2 text-sm font-medium text-emerald-700">
            <Sparkles size={16} />
            How it works
          </div>
          <h2 className="tablet:text-5xl mb-4 text-3xl leading-tight font-bold text-gray-900">
            Three steps to
            <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              {' '}
              clarity
            </span>
          </h2>
          <p className="text-lg leading-relaxed text-gray-600">
            Create workspace, enter daily meals, record expenses. We do the math.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line - hidden on mobile */}
          <div className="tablet:block absolute top-24 left-1/2 hidden w-full max-w-4xl -translate-x-1/2 transform">
            <div className="flex items-center justify-between px-20">
              <div className="relative h-0.5 w-full bg-gradient-to-r from-blue-200 via-emerald-200 to-purple-200">
                <div className="absolute -top-1 left-1/3 h-2 w-2 rounded-full bg-emerald-400"></div>
                <div className="absolute -top-1 right-1/3 h-2 w-2 rounded-full bg-purple-400"></div>
              </div>
            </div>
          </div>

          <div className="tablet:grid-cols-3 tablet:gap-6 grid gap-8">
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
                    <div className="tablet:hidden absolute -bottom-4 left-1/2 z-10 -translate-x-1/2 transform">
                      <ArrowRight size={24} className="text-gray-300" />
                    </div>
                  )}

                  {/* Card */}
                  <div
                    className={`relative h-full rounded-2xl border-2 ${step.borderColor} ${step.bgColor} group p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-gray-200/50`}
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
                        className={`absolute -top-2 -right-2 h-10 w-10 ${step.bgColor} rounded-xl border-2 ${step.borderColor} flex transform items-center justify-center transition-transform duration-300 group-hover:rotate-12`}
                      >
                        <Icon size={20} className={step.iconColor} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-gray-900 transition-colors group-hover:text-gray-800">
                        {step.title}
                      </h3>
                      <p className="leading-relaxed text-gray-600">{step.description}</p>
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
                                i <= index ? 'bg-current' : 'bg-gray-300'
                              }`}
                              style={{
                                color: i <= index ? step.iconColor.replace('text-', '') : undefined,
                              }}
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
          <div className="inline-flex transform cursor-pointer items-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-blue-600 px-8 py-4 font-semibold text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:from-emerald-700 hover:to-blue-700 hover:shadow-emerald-200/50">
            <Sparkles size={20} />
            Get started now
            <ArrowRight size={18} className="ml-1" />
          </div>
          <p className="mt-3 text-sm text-gray-500">No credit card required • Free forever</p>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
