'use client'

import Link from 'next/link'

export default function AuthError() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white/5 backdrop-blur-md p-8 rounded-xl shadow-2xl max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-white mb-4">
          Authentication Error
        </h1>
        <p className="text-purple-200 mb-6">
          There was a problem signing you in. Please try again.
        </p>
        <Link
          href="/auth/signin"
          className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300"
        >
          Try Again
        </Link>
      </div>
    </div>
  )
}
