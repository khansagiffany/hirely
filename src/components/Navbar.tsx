'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'

export default function Navbar() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="border-b sticky top-0 z-50 shadow-sm" style={{ borderColor: '#e8e1d9', backgroundColor: 'white', backdropFilter: 'blur(10px)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold shadow-lg" style={{ background: '#722F37' }}>
              H
            </div>
            <span className="font-bold text-xl" style={{ color: '#2d2620' }}>Hirely</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {session && session.user.role === 'EMPLOYER' && (
              <Link href="/jobs/new" className="transition font-medium" style={{ color: '#6b5d54' }}>
                Post Job
              </Link>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {session ? (
              <>
                <Link href="/profile" className="hidden md:block transition text-sm font-semibold" style={{ color: '#6b5d54' }}>
                  {session.user?.name || 'Profile'}
                </Link>
                <button
                  onClick={() => signOut()}
                  className="hidden md:block backdrop-blur-md px-4 py-2 rounded-xl text-sm font-semibold transition-all" 
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.6)',
                    borderColor: '#722F37',
                    borderWidth: '1px',
                    color: '#722F37'
                  }}
                  onMouseEnter={(e) => {
                    const target = e.target as HTMLButtonElement;
                    target.style.backgroundColor = '#faf8f3'
                    target.style.borderColor = '#722F37'
                  }}
                  onMouseLeave={(e) => {
                    const target = e.target as HTMLButtonElement;
                    target.style.backgroundColor = 'rgba(255, 255, 255, 0.6)'
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="transition text-sm font-semibold" style={{ color: '#6b5d54' }}>
                  Login
                </Link>
                <Link href="/register" className="text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all" style={{ background: '#722F37' }}>
                  Daftar
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden transition"
              style={{ color: '#6b5d54' }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-3 border-t backdrop-blur-lg rounded-b-2xl -mx-4 px-4" style={{ borderColor: '#ddd2c7', backgroundColor: 'rgba(255, 255, 255, 0.4)' }}>
            {session && session.user.role === 'EMPLOYER' && (
              <Link href="/jobs/new" className="block transition font-medium py-2" style={{ color: '#6b5d54' }}>
                Post Job
              </Link>
            )}
            
            {session && (
              <>
                <Link href="/profile" className="block transition font-medium py-2" style={{ color: '#6b5d54' }}>
                  {session.user?.name || 'Profile'}
                </Link>
                <button
                  onClick={() => signOut()}
                  className="block w-full text-left backdrop-blur-md px-4 py-2 rounded-xl text-sm font-semibold transition-all mt-2" 
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.6)',
                    borderColor: '#722F37',
                    borderWidth: '1px',
                    color: '#722F37'
                  }}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}