'use client'

import { useState } from 'react'
import { Check, Star, Zap, Shield, Users, Crown, Sparkles } from 'lucide-react'

const PricingPlans = [
  {
    name: 'Free',
    description: 'For small messes getting started',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: ['1 workspace', 'Unlimited members', 'Meal grid, deposits, expenses', 'CSV export'],
    buttonText: 'Get started',
    buttonVariant: 'secondary',
    icon: Users,
    color: 'from-gray-500 to-slate-600',
    bgGradient: 'from-gray-50 to-slate-50',
    borderColor: 'border-gray-200',
    popular: false,
  },
  {
    name: 'Pro',
    description: 'For managers who want control',
    monthlyPrice: 499,
    yearlyPrice: 399,
    features: [
      'Everything in Free',
      'Multiple periods & close/lock',
      'Advanced allocations',
      'Role-based access',
    ],
    buttonText: 'Upgrade',
    buttonVariant: 'primary',
    icon: Zap,
    color: 'from-emerald-500 to-teal-600',
    bgGradient: 'from-emerald-50 to-teal-50',
    borderColor: 'border-emerald-200',
    popular: true,
  },
  {
    name: 'Team',
    description: 'For hostels and large groups',
    monthlyPrice: 999,
    yearlyPrice: 799,
    features: ['Priority support', 'Audit logs & exports', 'Custom roles', 'SSO (on request)'],
    buttonText: 'Contact sales',
    buttonVariant: 'secondary',
    icon: Crown,
    color: 'from-purple-500 to-pink-600',
    bgGradient: 'from-purple-50 to-pink-50',
    borderColor: 'border-purple-200',
    popular: false,
  },
]

export const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false)

  return (
    <section
      id="pricing"
      className="relative overflow-hidden bg-gradient-to-b from-white via-gray-50/30 to-white py-16 sm:py-24"
    >
      {/* Background decorations */}
      <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-emerald-100 opacity-10 blur-3xl"></div>
      <div className="absolute right-1/4 bottom-0 h-80 w-80 rounded-full bg-purple-100 opacity-10 blur-3xl"></div>

      <div className="relative container max-w-6xl px-4">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-100 to-purple-100 px-4 py-2 text-sm font-medium text-emerald-700">
            <Sparkles size={16} />
            Pricing Plans
          </div>
          <h2 className="mb-4 text-3xl leading-tight font-bold text-gray-900 sm:text-5xl">
            Simple
            <span className="bg-gradient-to-r from-emerald-600 to-purple-600 bg-clip-text text-transparent">
              {' '}
              pricing
            </span>
          </h2>
          <p className="text-lg leading-relaxed text-gray-600">
            Start free. Upgrade when you need more control.
          </p>

          {/* Enhanced Billing toggle */}
          <div className="mt-8 inline-flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-2 shadow-lg backdrop-blur-sm">
            <span
              className={`rounded-xl px-4 py-2 font-medium transition-all duration-300 ${!isYearly ? 'text-gray-900' : 'text-gray-500'}`}
            >
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative inline-flex h-8 w-16 items-center rounded-full transition-all duration-300 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:outline-none ${
                isYearly ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gray-200'
              }`}
              aria-pressed={isYearly}
            >
              <span className="sr-only">Toggle billing period</span>
              <span
                className={`absolute h-6 w-6 transform rounded-full bg-white shadow-lg transition-all duration-300 ${
                  isYearly ? 'translate-x-9' : 'translate-x-1'
                }`}
              ></span>
            </button>
            <span
              className={`flex items-center gap-2 rounded-xl px-4 py-2 font-medium transition-all duration-300 ${isYearly ? 'text-gray-900' : 'text-gray-500'}`}
            >
              Yearly
              <span className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="tablet:grid-cols-3 tablet:gap-6 grid gap-8">
          {PricingPlans.map((plan, index) => {
            const Icon = plan.icon
            return (
              <div
                key={plan.name}
                className={`group relative transform transition-all duration-500 hover:-translate-y-2 ${
                  plan.popular ? 'scale-105' : 'hover:scale-105'
                }`}
                style={{
                  animationDelay: `${index * 150}ms`,
                }}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 z-10 -translate-x-1/2 transform">
                    <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-sm font-bold text-white shadow-lg">
                      <Star size={14} fill="currentColor" />
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Card */}
                <div
                  className={`relative h-full rounded-3xl border-2 transition-all duration-500 ${
                    plan.popular
                      ? 'border-emerald-200 bg-gradient-to-b from-white to-emerald-50/30 shadow-2xl shadow-emerald-200/20'
                      : `${plan.borderColor} bg-gradient-to-b ${plan.bgGradient} shadow-lg hover:shadow-2xl hover:shadow-gray-200/20`
                  } p-8`}
                >
                  {/* Glow effect */}
                  <div
                    className={`absolute inset-0 rounded-3xl bg-gradient-to-r opacity-0 transition-opacity duration-500 group-hover:opacity-20 ${plan.color} -z-10 blur-2xl`}
                  ></div>

                  {/* Plan header */}
                  <div className="mb-6 flex items-center gap-4">
                    <div
                      className={`h-12 w-12 rounded-2xl bg-gradient-to-r ${plan.color} flex transform items-center justify-center transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Icon size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                      <p className="text-sm text-gray-600">{plan.description}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-8">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-gray-900">
                        ৳{isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                      </span>
                      <span className="font-medium text-gray-500">/month</span>
                    </div>
                    {isYearly && plan.monthlyPrice > 0 && (
                      <p className="mt-1 text-sm font-medium text-emerald-600">
                        Save ৳{(plan.monthlyPrice - plan.yearlyPrice) * 12}/year
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="mb-8 space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <div
                          className={`h-5 w-5 rounded-full bg-gradient-to-r ${plan.color} mt-0.5 flex flex-shrink-0 items-center justify-center`}
                        >
                          <Check size={12} className="text-white" />
                        </div>
                        <span className="text-sm leading-relaxed text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    className={`w-full transform rounded-2xl px-6 py-4 text-sm font-semibold transition-all duration-300 hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:outline-none ${
                      plan.buttonVariant === 'primary'
                        ? `bg-gradient-to-r ${plan.color} text-white shadow-lg hover:shadow-xl focus:ring-emerald-500`
                        : `border-2 ${plan.borderColor} bg-white text-gray-900 hover:bg-gray-50 focus:ring-gray-500`
                    }`}
                  >
                    {plan.buttonText}
                  </button>

                  {/* Additional info for free plan */}
                  {plan.name === 'Free' && (
                    <p className="mt-4 text-center text-xs text-gray-500">
                      No credit card required
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom section */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 px-6 py-3 text-sm text-gray-700">
            <Shield size={16} />
            30-day money-back guarantee • Cancel anytime
          </div>
        </div>
      </div>
    </section>
  )
}

export default Pricing
