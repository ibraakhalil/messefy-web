'use client'

import { useState } from 'react'

const PricingPlans = [
  {
    name: 'Free',
    description: 'For small messes getting started',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: ['1 workspace', 'Unlimited members', 'Meal grid, deposits, expenses', 'CSV export'],
    buttonText: 'Get started',
    buttonVariant: 'secondary',
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
  },
]

export const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false)

  return (
    <section id="pricing" className="py-16 sm:py-20">
      <div className="reveal container max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl">Simple pricing</h2>
          <p className="mt-3 text-gray-600 dark:text-gray-300">
            Start free. Upgrade when you need more control.
          </p>

          {/* Billing toggle */}
          <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-gray-200 bg-white px-2 py-2 text-sm dark:border-gray-800 dark:bg-gray-900">
            <span className="px-3">Monthly</span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="relative inline-flex h-7 w-14 items-center rounded-full bg-gray-200 transition dark:bg-gray-700"
              aria-pressed={isYearly}
            >
              <span className="sr-only">Toggle billing period</span>
              <span
                className={`absolute size-5 rounded-full bg-white shadow transition dark:bg-gray-200 ${
                  isYearly ? 'left-[calc(100%-1.25rem-4px)]' : 'left-1'
                }`}
              ></span>
            </button>
            <span className="px-3">
              Yearly{' '}
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {PricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`reveal rounded-2xl bg-white p-6 dark:bg-gray-900 ${
                plan.popular
                  ? 'border-brand-500 shadow-brand-500/10 relative border-2 shadow-lg'
                  : 'border border-gray-200 shadow-sm dark:border-gray-800'
              }`}
            >
              {plan.popular && (
                <span className="bg-brand-600 absolute -top-3 right-4 rounded-full px-2 py-1 text-xs font-semibold text-white">
                  Popular
                </span>
              )}

              <h3 className="text-lg font-bold">{plan.name}</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{plan.description}</p>

              <p className="mt-4">
                <span className="text-3xl font-extrabold">
                  ৳{isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                </span>{' '}
                <span className="text-sm text-gray-500">/mo</span>
              </p>

              <ul className="mt-4 space-y-2 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature}>• {feature}</li>
                ))}
              </ul>

              <a
                href="#"
                className={`mt-6 inline-flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold ${
                  plan.buttonVariant === 'primary'
                    ? 'from-brand-600 hover:from-brand-500 bg-gradient-to-tr to-cyan-600 text-white shadow-lg hover:to-cyan-500'
                    : 'border border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900'
                }`}
              >
                {plan.buttonText}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Pricing
