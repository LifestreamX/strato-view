'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'

export function Navigation() {
  const { data: session } = useSession()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement | null>(null)
  const hamburgerRef = useRef<HTMLButtonElement | null>(null)
  const mobileMenuRef = useRef<HTMLDivElement | null>(null)

  // click-outside for profile dropdown only (desktop)
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('click', onDoc)
    return () => document.removeEventListener('click', onDoc)
  }, [])

  // Close mobile menu when clicking/tapping outside the mobile menu or hamburger
  useEffect(() => {
    if (!isMobileOpen) return
    function handleOutside(e: MouseEvent) {
      const target = e.target as Node
      if (mobileMenuRef.current && mobileMenuRef.current.contains(target)) {
        return
      }
      if (hamburgerRef.current && hamburgerRef.current.contains(target)) {
        return
      }
      setIsMobileOpen(false)
    }
    document.addEventListener('click', handleOutside)
    return () => document.removeEventListener('click', handleOutside)
  }, [isMobileOpen])

  return (
    <nav className="fixed top-0 left-0 right-0 z-[1000] bg-black/40 backdrop-blur-md shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🚀</span>
            <span className="text-white font-bold text-xl">NeoView</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/asteroids"
              className="text-white hover:text-purple-300 transition duration-300"
            >
              Asteroids
            </Link>
            <Link
              href="/dashboard"
              className="text-white hover:text-purple-300 transition duration-300"
            >
              Dashboard
            </Link>

            {session ? (
              <div
                className="relative flex items-center space-x-2"
                ref={profileRef}
              >
                {session.user?.image && (
                  <button
                    type="button"
                    className="focus:outline-none"
                    onClick={() => setIsProfileOpen(p => !p)}
                    aria-expanded={isProfileOpen}
                  >
                    <Image
                      src={session.user.image}
                      alt={session.user.name || 'Profile'}
                      width={36}
                      height={36}
                      unoptimized
                      className="w-9 h-9 rounded-full border-2 border-purple-400 shadow-md hover:scale-105 transition-transform"
                    />
                  </button>
                )}
                <span className="text-purple-200">{session.user?.name}</span>
                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-40 bg-black/90 rounded-lg shadow-lg py-2 z-50">
                    <button
                      type="button"
                      onClick={() => signOut()}
                      className="block w-full text-left px-4 py-2 bg-purple-200 text-black hover:bg-purple-300 rounded transition"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Hamburger */}
          <button
            ref={hamburgerRef}
            type="button"
            onClick={() => setIsMobileOpen(v => !v)}
            className="md:hidden text-white text-2xl p-2 relative z-50"
            aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileOpen}
            aria-controls="mobile-menu"
          >
            {isMobileOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile menu + overlay */}
        {isMobileOpen && (
          <>
            <div
              className="fixed top-16 left-0 right-0 bottom-0 bg-black/20 z-[999]"
              onClick={() => setIsMobileOpen(false)}
              aria-hidden="true"
            />
            <div
              id="mobile-menu"
              ref={mobileMenuRef}
              className="md:hidden pb-4 relative z-[1000] bg-black/40 backdrop-blur-md"
            >
              <div className="flex flex-col space-y-3">
                <Link
                  href="/map"
                  className="text-white hover:text-purple-300 transition duration-300"
                  onClick={() => setIsMobileOpen(false)}
                >
                  Live Map
                </Link>
                <Link
                  href="/dashboard"
                  className="text-white hover:text-purple-300 transition duration-300"
                  onClick={() => setIsMobileOpen(false)}
                >
                  Dashboard
                </Link>
                {session ? (
                  <>
                    <span className="text-purple-200">
                      {session.user?.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileOpen(false)
                        signOut()
                      }}
                      className="block w-full text-left px-4 py-2 bg-purple-200 text-black hover:bg-purple-300 font-semibold rounded transition duration-300"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    href="/auth/signin"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
                    onClick={() => setIsMobileOpen(false)}
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  )
}
