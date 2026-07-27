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

export const Footer = () => {
  return (
    <footer className="relative overflow-hidden border-t border-border-color bg-secondary-bg transition-colors dark:border-gray-800 dark:bg-gray-950">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-100 opacity-20 blur-3xl dark:bg-emerald-950/30"></div>
      <div className="absolute right-0 bottom-0 h-80 w-80 translate-x-1/2 translate-y-1/2 rounded-full bg-blue-100 opacity-20 blur-3xl dark:bg-blue-950/30"></div>

      <div className="relative container max-w-7xl px-4">
        {/* Main footer content */}
        <div className="py-16">
          <div className="grid gap-12 tablet:grid-cols-2 laptop:grid-cols-6">
            {/* Brand section - spans 2 columns on larger screens */}
            <div className="space-y-6 laptop:col-span-2">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="flex h-12 w-12 rotate-3 transform items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 shadow-lg">
                    <Sparkles size={24} className="text-white" />
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 opacity-30 blur-lg"></div>
                </div>
                <span className="text-2xl font-bold text-pure-color dark:text-white">
                  MessMate
                </span>
              </div>

              {/* Description */}
              <p className="max-w-sm leading-relaxed text-subtitle-color dark:text-gray-400">
                Smart meal and expense management for messes, hostels, and co-living spaces.
                Simplifying shared living, one meal at a time.
              </p>

              {/* Contact info */}
              <div className="space-y-3 text-sm text-subtitle-color dark:text-gray-400">
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-emerald-600 dark:text-emerald-400" />
                  <span>Dhaka, Bangladesh</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-emerald-600 dark:text-emerald-400" />
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
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-border-color bg-card-bg text-subtitle-color transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500 hover:text-emerald-600 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-emerald-500 dark:hover:text-emerald-400"
                      aria-label={social.name}
                    >
                      <Icon size={18} />
                    </a>
                  )
                })}
              </div>
            </div>

            {/* Newsletter signup */}
            <div className="space-y-6 laptop:col-span-2">
              <div>
                <h3 className="mb-2 font-bold text-pure-color dark:text-white">Stay updated</h3>
                <p className="text-sm text-subtitle-color dark:text-gray-400">
                  Get the latest updates, tips, and features delivered to your inbox.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 rounded-xl border border-border-color bg-card-bg px-4 py-3 text-pure-color transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                  />
                  <button className="transform rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:from-emerald-700 hover:to-teal-700 hover:shadow-lg">
                    <ArrowRight size={18} />
                  </button>
                </div>
                <p className="text-xs text-subtitle-secondary dark:text-gray-500">No spam, unsubscribe at any time.</p>
              </div>
            </div>

            {/* Links sections */}
            <div className="grid grid-cols-2 gap-8 laptop:col-span-2">
              {/* Product */}
              <div>
                <h3 className="mb-4 font-bold text-pure-color dark:text-white">Product</h3>
                <ul className="space-y-3">
                  {footerLinks.product.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="group flex items-center gap-2 text-sm text-subtitle-color transition-colors duration-200 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400"
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
                <h3 className="mb-4 font-bold text-pure-color dark:text-white">Company</h3>
                <ul className="space-y-3">
                  {footerLinks.company.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="group flex items-center gap-2 text-sm text-subtitle-color transition-colors duration-200 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400"
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
                <h3 className="mb-4 font-bold text-pure-color dark:text-white">Support</h3>
                <ul className="space-y-3">
                  {footerLinks.support.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="group flex items-center gap-2 text-sm text-subtitle-color transition-colors duration-200 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400"
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
                <h3 className="mb-4 font-bold text-pure-color dark:text-white">Legal</h3>
                <ul className="space-y-3">
                  {footerLinks.legal.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="group flex items-center gap-2 text-sm text-subtitle-color transition-colors duration-200 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400"
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
        <div className="border-t border-border-color py-8 dark:border-gray-800">
          <div className="flex flex-col items-center justify-between gap-4 tablet:flex-row">
            <div className="flex items-center gap-6 text-sm text-subtitle-color dark:text-gray-400">
              <p className="flex items-center gap-2">
                © {new Date().getFullYear()} MessMate. Made with
                <Heart size={14} className="fill-current text-red-500" />
                in Bangladesh
              </p>
            </div>

            <div className="flex items-center gap-6 text-sm text-subtitle-color dark:text-gray-400">
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

