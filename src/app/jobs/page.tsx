'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

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
    e.preventDefault() // Prevent navigation to job detail
    
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
        // Remove job from state
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

  // Check if user can delete this job
  const canDelete = (job: Job) => {
    if (!session || session.user.role !== 'EMPLOYER') return false
    // If createdById is null, allow any employer to delete (for legacy jobs)
    // Otherwise, only allow if it's their own job
    return !job.createdById || job.createdById === session.user.id
  }

  useEffect(() => {
    fetchJobs(selectedCategory)
  }, [selectedCategory])

  if (loading) {
    return <div className="text-center py-16">Loading...</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-black/80">Lowongan Kerja</h1>
        {session?.user.role === 'EMPLOYER' && (
          <Link 
            href="/jobs/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + Posting Lowongan
          </Link>
        )}
      </div>

      {/* Filter Kategori */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition
              ${selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}
            `}
          >
            {cat}
          </button>
        ))}
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow">
          <p className="text-gray-600">Belum ada lowongan tersedia</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="relative bg-white p-6 rounded-lg shadow hover:shadow-md transition"
            >
              <Link href={`/jobs/${job.id}`} className="block">
                <h3 className="text-xl font-bold mb-1 text-black">{job.title}</h3>
                <p className="text-gray-600 mb-2">{job.company}</p>

                <div className="flex gap-2 mb-2">
                  <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                    {job.category}
                  </span>
                </div>

                <div className="flex gap-4 text-sm text-gray-500">
                  {job.location && <span>📍 {job.location}</span>}
                  {job.salary && <span>💰 {job.salary}</span>}
                </div>
              </Link>

              {/* Delete button for employer */}
              {canDelete(job) && (
                <button
                  onClick={(e) => handleDelete(job.id, e)}
                  disabled={deletingId === job.id}
                  className="absolute top-4 right-4 text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Hapus lowongan"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-6 w-6" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                    />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}