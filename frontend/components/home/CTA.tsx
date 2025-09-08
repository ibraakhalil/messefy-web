const CTA = () => {
  return (
    <section className="relative overflow-hidden border-t border-gray-100 py-16 sm:py-20">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="from-brand-400/30 absolute top-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-gradient-to-tr to-cyan-400/30 blur-3xl"></div>
      </div>
      <div className="container max-w-5xl text-center">
        <h2 className="reveal text-3xl font-extrabold sm:text-4xl">Ready to simplify your mess?</h2>
        <p className="reveal mt-3 text-gray-600">
          Start free, invite members, and get instant clarity this month.
        </p>
        <div className="reveal mt-6 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#"
            className="from-brand-600 hover:from-brand-500 inline-flex items-center gap-2 rounded-lg bg-gradient-to-tr to-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:to-cyan-500"
          >
            Create workspace
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50"
          >
            Book a demo
          </a>
        </div>
      </div>
    </section>
  )
}

export default CTA
