'use client'

import Link from 'next/link'

export default function AuthError() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-aviation-dark via-blue-900 to-aviation-dark flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-2xl max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-white mb-4">
          Authentication Error
        </h1>
        <p className="text-blue-200 mb-6">
          There was a problem signing you in. Please try again.
        </p>
        <Link
          href="/auth/signin"
          className="inline-block bg-aviation-blue hover:bg-aviation-light text-white font-bold py-3 px-8 rounded-lg transition duration-300"
        >
          Try Again
        </Link>
      </div>
    </div>
  )
}
