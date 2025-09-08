'use client'

import { Menu, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useState } from 'react'

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
  }

  return (
    <header id="top" className="sticky top-0 z-50 w-full backdrop-blur-md">
      <div className="container flex items-center justify-between py-4">
        {/* Brand */}
        <a href="#top" className="group inline-flex items-center gap-2">
          <span className="bg-primary text-primary-fg inline-flex h-9 w-9 items-center justify-center rounded-lg shadow-lg">
            M
          </span>
          <span className="text-lg font-extrabold tracking-tight">MessMate</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-subtitle hover:text-pure text-sm font-medium">
            Features
          </a>
          <a href="#how" className="text-subtitle hover:text-pure text-sm font-medium">
            How it works
          </a>
          <a href="#pricing" className="text-subtitle hover:text-pure text-sm font-medium">
            Pricing
          </a>
          <a href="#faq" className="text-subtitle hover:text-pure text-sm font-medium">
            FAQ
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="border-border-color text-icon hover:bg-secondary-background inline-flex h-9 w-9 items-center justify-center rounded-lg border"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </button>
          <a
            href="#"
            className="border-border-color text-pure hover:bg-secondary-background hidden rounded-lg border px-4 py-2 text-sm font-semibold md:inline-block"
          >
            Sign in
          </a>
          <a
            href="#pricing"
            className="bg-primary text-primary-fg inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold shadow-lg"
          >
            Get Started
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12h14M13 5l7 7-7 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="border-border-color text-icon hover:bg-secondary-background inline-flex h-9 w-9 items-center justify-center rounded-lg border md:hidden"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <Menu className="size-5" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`container ${isMenuOpen ? '' : 'hidden'} border-border-color bg-primary-background border-t py-3 md:hidden`}
      >
        <nav className="grid gap-2">
          <a
            href="#features"
            className="text-subtitle hover:bg-secondary-background hover:text-pure rounded-md px-3 py-2 text-sm font-medium"
          >
            Features
          </a>
          <a
            href="#how"
            className="text-subtitle hover:bg-secondary-background hover:text-pure rounded-md px-3 py-2 text-sm font-medium"
          >
            How it works
          </a>
          <a
            href="#pricing"
            className="text-subtitle hover:bg-secondary-background hover:text-pure rounded-md px-3 py-2 text-sm font-medium"
          >
            Pricing
          </a>
          <a
            href="#faq"
            className="text-subtitle hover:bg-secondary-background hover:text-pure rounded-md px-3 py-2 text-sm font-medium"
          >
            FAQ
          </a>
          <a
            href="#"
            className="border-border-color text-pure hover:bg-secondary-background mt-1 rounded-md border px-3 py-2 text-sm font-semibold"
          >
            Sign in
          </a>
        </nav>
      </div>
    </header>
  )
}

export default Header
