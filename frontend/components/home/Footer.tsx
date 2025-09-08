import {
  Mail,
  Twitter,
  Github,
  Linkedin,
  Heart,
  ArrowRight,
  MapPin,
  Calendar,
  Sparkles,
} from 'lucide-react'

const footerLinks = {
  product: [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Changelog', href: '#' },
    { name: 'API Docs', href: '#' },
  ],
  company: [
    { name: 'About', href: '#' },
    { name: 'Contact', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Blog', href: '#' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Cookie Policy', href: '#' },
  ],
  support: [
    { name: 'Help Center', href: '#' },
    { name: 'Documentation', href: '#' },
    { name: 'Status', href: '#' },
    { name: 'Community', href: '#' },
  ],
}

const socialLinks = [
  { name: 'Twitter', href: '#', icon: Twitter },
  { name: 'GitHub', href: '#', icon: Github },
  { name: 'LinkedIn', href: '#', icon: Linkedin },
]

const Footer = () => {
  return (
    <footer className="relative overflow-hidden border-t border-gray-200 bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-100 opacity-20 blur-3xl"></div>
      <div className="absolute right-0 bottom-0 h-80 w-80 translate-x-1/2 translate-y-1/2 rounded-full bg-blue-100 opacity-20 blur-3xl"></div>

      <div className="relative container max-w-7xl px-4">
        {/* Main footer content */}
        <div className="py-16">
          <div className="tablet:grid-cols-2 laptop:grid-cols-6 grid gap-12">
            {/* Brand section - spans 2 columns on larger screens */}
            <div className="laptop:col-span-2 space-y-6">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="flex h-12 w-12 rotate-3 transform items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 shadow-lg">
                    <Sparkles size={24} className="text-white" />
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 opacity-30 blur-lg"></div>
                </div>
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-2xl font-bold text-transparent">
                  MessMate
                </span>
              </div>

              {/* Description */}
              <p className="max-w-sm leading-relaxed text-gray-600">
                Smart meal and expense management for messes, hostels, and co-living spaces.
                Simplifying shared living, one meal at a time.
              </p>

              {/* Contact info */}
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-emerald-600" />
                  <span>Dhaka, Bangladesh</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-emerald-600" />
                  <span>hello@messmate.com</span>
                </div>
              </div>

              {/* Social links */}
              <div className="flex items-center gap-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:text-emerald-600 hover:shadow-lg"
                      aria-label={social.name}
                    >
                      <Icon size={18} />
                    </a>
                  )
                })}
              </div>
            </div>

            {/* Newsletter signup */}
            <div className="laptop:col-span-2 space-y-6">
              <div>
                <h3 className="mb-2 font-bold text-gray-900">Stay updated</h3>
                <p className="text-sm text-gray-600">
                  Get the latest updates, tips, and features delivered to your inbox.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <button className="transform rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:from-emerald-700 hover:to-teal-700 hover:shadow-lg">
                    <ArrowRight size={18} />
                  </button>
                </div>
                <p className="text-xs text-gray-500">No spam, unsubscribe at any time.</p>
              </div>
            </div>

            {/* Links sections */}
            <div className="laptop:col-span-2 grid grid-cols-2 gap-8">
              {/* Product */}
              <div>
                <h3 className="mb-4 font-bold text-gray-900">Product</h3>
                <ul className="space-y-3">
                  {footerLinks.product.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="group flex items-center gap-2 text-sm text-gray-600 transition-colors duration-200 hover:text-emerald-600"
                      >
                        {link.name}
                        <ArrowRight
                          size={12}
                          className="opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div>
                <h3 className="mb-4 font-bold text-gray-900">Company</h3>
                <ul className="space-y-3">
                  {footerLinks.company.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="group flex items-center gap-2 text-sm text-gray-600 transition-colors duration-200 hover:text-emerald-600"
                      >
                        {link.name}
                        <ArrowRight
                          size={12}
                          className="opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support */}
              <div>
                <h3 className="mb-4 font-bold text-gray-900">Support</h3>
                <ul className="space-y-3">
                  {footerLinks.support.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="group flex items-center gap-2 text-sm text-gray-600 transition-colors duration-200 hover:text-emerald-600"
                      >
                        {link.name}
                        <ArrowRight
                          size={12}
                          className="opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h3 className="mb-4 font-bold text-gray-900">Legal</h3>
                <ul className="space-y-3">
                  {footerLinks.legal.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="group flex items-center gap-2 text-sm text-gray-600 transition-colors duration-200 hover:text-emerald-600"
                      >
                        {link.name}
                        <ArrowRight
                          size={12}
                          className="opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-200 py-8">
          <div className="tablet:flex-row flex flex-col items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                © {new Date().getFullYear()} MessMate. Made with
                <Heart size={14} className="fill-current text-red-500" />
                in Bangladesh
              </p>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></div>
                <span>All systems operational</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <span>Last updated: Today</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
