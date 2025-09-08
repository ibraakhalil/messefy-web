'use client'

import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

const FAQItems = [
  {
    question: 'Can members be added without creating user accounts?',
    answer: 'Yes—add offline members by name and track their meals and balances.',
  },
  {
    question: 'How is the meal rate calculated?',
    answer: 'By total shared meal expenses divided by total meals in the period.',
  },
  {
    question: 'Can I export monthly statements?',
    answer: 'Yes—CSV export is available on all plans.',
  },
  {
    question: 'Do you support multiple currencies?',
    answer: 'Yes—set the default currency per workspace.',
  },
]

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="py-16 sm:py-20">
      <div className="container max-w-4xl">
        <div className="reveal mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl">Frequently asked questions</h2>
          <p className="mt-3 text-gray-600 dark:text-gray-300">
            Everything you need to know about MessMate.
          </p>
        </div>

        <div className="mt-8 space-y-3">
          {FAQItems.map((item, index) => (
            <details
              key={index}
              className="reveal group rounded-xl border border-gray-200 bg-white p-5 open:shadow-sm dark:border-gray-800 dark:bg-gray-900"
              open={openIndex === index}
              onClick={(e) => {
                e.preventDefault()
                setOpenIndex(openIndex === index ? null : index)
              }}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                <span className="font-semibold">{item.question}</span>
                <span
                  className={`rounded-md border border-gray-200 p-1 text-gray-600 transition-transform duration-200 dark:border-gray-800 dark:text-gray-300 ${openIndex === index ? 'rotate-180' : ''}`}
                >
                  <ChevronDown size={18} />
                </span>
              </summary>
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQ
