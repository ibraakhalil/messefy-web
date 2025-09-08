const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      title: 'Create workspace',
      description: 'Add members (online or offline), set currency, choose roles.',
    },
    {
      number: 2,
      title: 'Log meals & deposits',
      description: 'Use the day-by-day grid; record payments and bazar costs.',
    },
    {
      number: 3,
      title: 'Share statements',
      description: 'Auto meal rate and per-member balances—export or share.',
    },
  ]

  return (
    <section id="how" className="border-t border-gray-100 py-16 sm:py-20 dark:border-gray-900">
      <div className="container max-w-6xl">
        <div className="reveal mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl">Three steps to clarity</h2>
          <p className="mt-3 text-gray-600 dark:text-gray-300">
            Create workspace, enter daily meals, record expenses. We do the math.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="reveal rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
            >
              <span className="bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 mb-3 inline-flex size-8 items-center justify-center rounded-full">
                {step.number}
              </span>
              <h3 className="font-semibold">{step.title}</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
