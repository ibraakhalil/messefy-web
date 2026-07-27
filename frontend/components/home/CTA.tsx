const CTA = () => {
  return (
    <section className="relative overflow-hidden border-t border-border-color bg-primary-bg py-16 transition-colors sm:py-20 dark:border-gray-800 dark:bg-gray-950">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 blur-3xl"></div>
      </div>
      <div className="container max-w-5xl px-4 text-center">
        <h2 className="reveal text-3xl font-extrabold text-pure-color sm:text-4xl dark:text-white">Ready to simplify your mess?</h2>
        <p className="reveal mt-3 text-subtitle-color dark:text-gray-400">
          Start free, invite members, and get instant clarity this month.
        </p>
        <div className="reveal mt-6 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-colors hover:from-emerald-700 hover:to-teal-700"
          >
            Create workspace
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-lg border border-border-color bg-card-bg px-6 py-3 text-sm font-semibold text-pure-color hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
          >
            Book a demo
          </a>
        </div>
      </div>
    </section>
  )
}

export default CTA

