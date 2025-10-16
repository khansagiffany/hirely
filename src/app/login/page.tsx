'use client'

import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mail, Lock } from 'lucide-react'
import Link from 'next/link'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      })

      if (result?.error) {
        setError('Email atau password salah')
      } else {
        router.push('/jobs')
        router.refresh()
      }
    } catch (err) {
      setError('Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Welcome Text */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Masuk ke Akun Anda.</h1>
            <p className="text-gray-500">Kembali ke Hirely dan tingkatkan peluang kerja Anda!</p>
          </div>

          {/* Success Message */}
          {searchParams.get('registered') && (
            <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-6 text-sm">
              Registrasi berhasil! Silakan login.
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-700"
                />
                {formData.email && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-700"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white py-3 rounded-lg font-medium transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              style={{
                backgroundColor: loading ? '#722f37' : '#722f37',
              }}
            >
              {loading ? 'Loading...' : 'Masuk'}
            </button>
          </form>

          {/* Footer Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Belum punya akun?{' '}
            <Link
              href="/register"
              className="hover:underline font-medium"
              style={{ color: '#722f37' }}
            >
              Daftar
            </Link>
          </p>

          {/* Footer Text */}
          <p className="mt-8 text-center text-sm text-gray-500">
            Join thousands of job seekers and employers who trust Hirely to connect talent with opportunity. 
            Create your account and unlock access to exclusive job opportunities.
          </p>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-400 via-blue-300 to-blue-200 items-center justify-center p-0 relative overflow-hidden">
        <img
          src="/img/hirely.png"
          alt="Poster Hirely Career Coaching"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    </div>
  )
}

export default function Login() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}