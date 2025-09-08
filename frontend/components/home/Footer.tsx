const footerLinks = {
  product: [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Changelog', href: '#' },
  ],
  company: [
    { name: 'About', href: '#' },
    { name: 'Contact', href: '#' },
    { name: 'Careers', href: '#' },
  ],
  legal: [
    { name: 'Privacy', href: '#' },
    { name: 'Terms', href: '#' },
  ],
  social: [
    { name: 'Twitter', href: '#' },
    { name: 'GitHub', href: '#' },
    { name: 'Support', href: '#' },
  ],
}

const Footer = () => {
  return (
    <footer className="border-t border-gray-100 py-10 text-sm text-gray-600 dark:border-gray-900 dark:text-gray-300">
      <div className="container max-w-7xl">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <span className="from-brand-500 ring-gradient inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr to-cyan-500 text-white"></span>
              <span className="font-bold text-gray-900 dark:text-white">MessMate</span>
            </div>
            <p className="mt-3 text-xs">
              Smart meal and expense management for messes, hostels, and co-living.
            </p>
          </div>

          {/* Product */}
          <div>
            <div className="font-semibold text-gray-900 dark:text-white">Product</div>
            <ul className="mt-3 space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="hover:underline">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <div className="font-semibold text-gray-900 dark:text-white">Company</div>
            <ul className="mt-3 space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="hover:underline">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <div className="font-semibold text-gray-900 dark:text-white">Legal</div>
            <ul className="mt-3 space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="hover:underline">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-gray-100 pt-6 text-xs text-gray-500 sm:flex-row dark:border-gray-900">
          <p>© {new Date().getFullYear()} MessMate. All rights reserved.</p>
          <div className="flex items-center gap-3">
            {footerLinks.social.map((link) => (
              <a key={link.name} href={link.href} className="hover:underline">
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
