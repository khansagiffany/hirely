'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Plus, MapPin, DollarSign, Building2, Trash2, Briefcase } from 'lucide-react'

interface Job {
  id: string
  title: string
  company: string
  location: string
  salary: string
  createdAt: string
  category: string
  createdById?: string | null
}

export default function Jobs() {
  const { data: session } = useSession()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [categories, setCategories] = useState<string[]>([])
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchJobs = async (category: string = 'All') => {
    setLoading(true)
    try {
      const url = new URL('/api/jobs', window.location.origin)
      if (category && category !== 'All') {
        url.searchParams.set('category', category.toLowerCase())
      }

      const res = await fetch(url.toString())
      const data = (await res.json()) as { jobs: Job[] }

      setJobs(data.jobs || [])
      const uniqueCategories = Array.from(new Set(data.jobs.map(job => job.category)))
      setCategories(['All', ...uniqueCategories])
    } catch (error) {
      console.error('Fetch jobs error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (jobId: string, e: React.MouseEvent) => {
    e.preventDefault()
    
    if (!confirm('Apakah Anda yakin ingin menghapus lowongan ini?')) {
      return
    }

    setDeletingId(jobId)
    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: 'DELETE'
      })

      const data = await res.json()

      if (res.ok) {
        setJobs(prev => prev.filter(job => job.id !== jobId))
        alert('Lowongan berhasil dihapus!')
      } else {
        alert(data.error || 'Gagal menghapus lowongan')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Terjadi kesalahan saat menghapus lowongan')
    } finally {
      setDeletingId(null)
    }
  }

  const canDelete = (job: Job) => {
    if (!session || session.user.role !== 'EMPLOYER') return false
    return !job.createdById || job.createdById === session.user.id
  }

  useEffect(() => {
    fetchJobs(selectedCategory)
  }, [selectedCategory])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-600 to-blue-300 flex items-center justify-center">
        <div className="text-center bg-white/10 backdrop-blur-2xl rounded-3xl p-12 border border-white/20 shadow-2xl">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white/30 border-t-white"></div>
          <p className="mt-4 text-white font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-600 to-blue-300 relative overflow-hidden">
      {/* Decorative blurred circles */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 bg-white/20 backdrop-blur-2xl rounded-2xl p-6 border border-white/30 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="bg-white/30 backdrop-blur-xl p-3 rounded-2xl border border-white/40">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">Lowongan Kerja</h1>
          </div>
          {session?.user.role === 'EMPLOYER' && (
            <Link 
              href="/jobs/create"
              className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-6 py-3 rounded-2xl hover:shadow-xl transform hover:-translate-y-0.5 hover:scale-105 transition-all font-semibold flex items-center gap-2 border border-blue-500/30"
            >
              <Plus className="w-5 h-5" />
              Posting Lowongan
            </Link>
          )}
        </div>

        {/* Filter Kategori */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all transform hover:scale-105 border shadow-lg
                ${selectedCategory === cat 
                  ? 'bg-white text-blue-700 border-white/50 shadow-xl backdrop-blur-xl' 
                  : 'bg-white/20 text-white border-white/30 backdrop-blur-xl hover:bg-white/30'
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-20 bg-white/20 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30">
            <div className="bg-white/30 backdrop-blur-xl w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/40">
              <Briefcase className="w-10 h-10 text-white" />
            </div>
            <p className="text-white text-lg font-medium">Belum ada lowongan tersedia</p>
          </div>
        ) : (
          <div className="grid gap-5">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="relative bg-white/25 backdrop-blur-2xl rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 border border-white/30 group overflow-hidden"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-400/0 to-blue-300/0 group-hover:from-blue-500/10 group-hover:via-blue-400/10 group-hover:to-blue-300/10 transition-all duration-300 rounded-2xl"></div>
                
                <Link href={`/jobs/${job.id}`} className="block relative z-10">
                  <div className="p-6">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="bg-white/40 backdrop-blur-xl p-2.5 rounded-xl border border-white/50 shadow-lg">
                        <Building2 className="w-6 h-6 text-blue-700" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-1 text-white drop-shadow-md">{job.title}</h3>
                        <p className="text-blue-100 font-medium text-lg">{job.company}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 mb-4">
                      <span className="bg-white/40 backdrop-blur-xl text-blue-900 text-sm font-semibold px-3 py-1.5 rounded-full border border-white/50 shadow-lg">
                        {job.category}
                      </span>
                    </div>

                    <div className="flex gap-5 text-sm">
                      {job.location && (
                        <div className="flex items-center gap-2 text-white font-medium bg-white/20 backdrop-blur-xl px-3 py-1.5 rounded-full border border-white/30">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                      )}
                      {job.salary && (
                        <div className="flex items-center gap-2 text-white font-medium bg-white/20 backdrop-blur-xl px-3 py-1.5 rounded-full border border-white/30">
                          <span className="text-sm font-semibold">Rp</span>
                          <span>{job.salary}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>

                {/* Delete button for employer */}
                {canDelete(job) && (
                  <button
                    onClick={(e) => handleDelete(job.id, e)}
                    disabled={deletingId === job.id}
                    className="absolute top-5 right-5 text-red-100 hover:text-white bg-red-500/30 backdrop-blur-xl hover:bg-red-500/50 p-2.5 rounded-full transition-all border border-red-400/30 hover:border-red-400/50 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg z-20"
                    title="Hapus lowongan"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}