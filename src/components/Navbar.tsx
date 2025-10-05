'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            <Link href="/" className="flex items-center text-xl font-bold text-blue-600">
              JobApp
            </Link>
            <Link href="/jobs" className="flex items-center text-gray-700 hover:text-blue-600">
              Lowongan
            </Link>
            {session && (
              <>
                {session.user.role === 'EMPLOYER' && (
                  <Link href="/jobs/new" className="flex items-center text-gray-700 hover:text-blue-600">
                    + Post Job
                  </Link>
                )}
                {session.user.role === 'JOB_SEEKER' && (
                  <>
                    <Link href="/applications" className="flex items-center text-gray-700 hover:text-blue-600">
                      Lamaran Saya
                    </Link>
                    <Link href="/analyze" className="flex items-center text-gray-700 hover:text-blue-600">
                      🔍 Analisis CV
                    </Link>
                  </>
                )}
                <Link href="/chat" className="flex items-center text-gray-700 hover:text-blue-600">
                  AI Chat
                </Link>
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <Link href="/profile" className="text-gray-700 hover:text-blue-600">
                  {session.user?.name || 'Profile'}
                </Link>
                <button
                  onClick={() => signOut()}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-blue-600">
                  Login
                </Link>
                <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}