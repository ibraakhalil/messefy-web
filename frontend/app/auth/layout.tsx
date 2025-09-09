import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Authentication - MessMate',
  description: 'Login or sign up to MessMate',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center">
          <Link href="/" className="group inline-flex items-center gap-3">
            <div className="relative">
              <div className="flex h-10 w-10 transform items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 shadow-lg transition-transform duration-300 group-hover:scale-105">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2v1" />
                  <path d="m4.93 4.93 .7.7" />
                  <path d="M2 12h1" />
                  <path d="m4.93 19.07 .7-.7" />
                  <path d="M12 21v-1" />
                  <path d="m19.07 19.07-.7-.7" />
                  <path d="M21 12h-1" />
                  <path d="m19.07 4.93-.7.7" />
                  <path d="M15.9 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
                </svg>
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 opacity-30 blur-lg transition-opacity duration-300 group-hover:opacity-50"></div>
            </div>
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-xl font-bold text-transparent dark:from-white dark:to-gray-300">
              MessMate
            </span>
          </Link>
        </div>
        {children}
      </div>
    </div>
  )
}
