'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Plus, MapPin, Clock, Building2, Trash2, Briefcase, Search, ChevronDown, Star, DollarSign, Upload, X, ArrowLeft } from 'lucide-react'

interface Job {
  id: string
  title: string
  company: string
  location: string
  salary: string
  createdAt: string
  category: string
  createdById?: string | null
  description?: string
}

export default function Jobs() {
  const [active, toggle] = useState(false);
  const { data: session } = useSession()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [categories, setCategories] = useState<string[]>([])
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [applying, setApplying] = useState(false)
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [showMobileDetail, setShowMobileDetail] = useState(false)

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
      
      if (data.jobs.length > 0 && !selectedJob) {
        setSelectedJob(data.jobs[0])
      }
    } catch (error) {
      console.error('Fetch jobs error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (jobId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
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
        if (selectedJob?.id === jobId) {
          setSelectedJob(jobs[0] || null)
        }
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

  const handleApply = async () => {
    if (!cvFile || !session || !selectedJob) return

    setApplying(true)
    const formData = new FormData()
    formData.append('jobId', selectedJob.id)
    formData.append('cv', cvFile)

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        body: formData
      })

      if (res.ok) {
        alert('Lamaran berhasil dikirim! CV sedang di-screening AI.')
        setCvFile(null)
      } else {
        alert('Gagal mengirim lamaran')
      }
    } catch (err) {
      alert('Error')
    } finally {
      setApplying(false)
    }
  }

  const handleMobileApplyClick = (job: Job, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedJob(job)
    setShowMobileDetail(true)
  }

  const canDelete = (job: Job) => {
    if (!session || session.user.role !== 'EMPLOYER') return false
    return !job.createdById || job.createdById === session.user.id
  }

  const filteredJobs = jobs.filter(job => 
    searchQuery === '' || 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return 'Hari ini'
    if (diffInDays === 1) return 'Kemarin'
    if (diffInDays < 7) return `${diffInDays} hari lalu`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} minggu lalu`
    return `${Math.floor(diffInDays / 30)} bulan lalu`
  }

  useEffect(() => {
    fetchJobs(selectedCategory)
  }, [selectedCategory])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#722f37]"></div>
          <p className="mt-4 text-gray-600 font-medium">Memuat lowongan...</p>
        </div>
      </div>
    )
  }

  // Mobile Detail View
  if (showMobileDetail && selectedJob) {
    return (
      <div className="min-h-screen bg-gray-50 lg:hidden">
        {/* Back Button */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
          <button
            onClick={() => setShowMobileDetail(false)}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Kembali ke Daftar</span>
          </button>
        </div>

        {/* Job Detail Content */}
        <div className="px-4 py-6">
          {/* Job Header */}
          <div className="mb-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 bg-[#EFDFBB] rounded-lg flex items-center justify-center border-2 border-[#722f37]/20">
                <Building2 className="w-8 h-8 text-[#722f37]" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedJob.title}</h1>
                <p className="text-lg text-gray-700 font-medium mb-2">{selectedJob.company}</p>
                <p className="text-sm text-gray-500">www.{selectedJob.company.toLowerCase().replace(/\s+/g, '')}.com</p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex gap-2 mb-4">
              <span className="bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full">
                New
              </span>
              <span className="bg-orange-100 text-orange-700 text-sm font-semibold px-3 py-1 rounded-full">
                Urgent
              </span>
            </div>

            {/* Job Meta */}
            <div className="space-y-3 text-sm mb-6">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="font-semibold text-gray-900">{selectedJob.location || 'Remote'}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <span className="font-semibold text-gray-900">Rp {selectedJob.salary || 'Negotiable'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="font-semibold text-gray-900">Full-time</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
            <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed space-y-4">
              {selectedJob.description ? (
                <div className="whitespace-pre-wrap">{selectedJob.description}</div>
              ) : (
                <>
                  <p>At least $19.50, plus overtime and benefits</p>
                  <p>Amazon USPS (Delivery Service Partners) are looking for delivery driver associates to help deliver packages to customers.</p>
                </>
              )}
            </div>
          </div>

          {/* Application Section */}
          {session && (
            <div className="bg-white rounded-lg p-6 border border-gray-200 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Lamar Sekarang</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Upload CV (PDF) *
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                    className="w-full border-2 border-dashed border-gray-300 rounded-lg px-4 py-3 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#722f37] file:text-white hover:file:bg-[#5f2730] transition-all cursor-pointer"
                  />
                  {cvFile && (
                    <p className="mt-2 text-sm text-gray-600 flex items-center gap-2">
                      <span className="font-medium">{cvFile.name}</span>
                      <button 
                        type="button"
                        onClick={() => setCvFile(null)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </p>
                  )}
                  <p className="mt-2 text-sm text-gray-600">
                    ✨ CV kamu akan di-screening otomatis oleh AI
                  </p>
                </div>

                <button
                  onClick={handleApply}
                  disabled={applying || !cvFile}
                  className="w-full bg-[#722f37] text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:bg-[#5f2730] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {applying ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Mengirim...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      <span>Kirim Lamaran</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {!session && (
            <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
              <p className="text-gray-700 font-medium">
                Silakan{' '}
                <Link href="/login" className="text-[#722f37] hover:text-[#5f2730] font-bold underline">
                  login
                </Link>
                {' '}untuk melamar pekerjaan ini
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Search Bar */}
      <div className="w-full bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex gap-3">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Job title, keywords, or company"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#722f37] focus:border-transparent text-gray-800"
                />
              </div>
            </div>
            <button className="bg-[#4CAF50] text-white px-8 py-2.5 rounded-lg hover:bg-[#45a049] transition-colors font-semibold">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Category Filters & Stats */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-600">
              <span className="font-bold text-gray-900">{filteredJobs.length}</span> Jobs found
            </p>
            {session && session.user.role === 'EMPLOYER' && (
              <Link
                href="/jobs/new"
                className="inline-flex items-center gap-2 bg-[#722f37] text-white px-4 py-2 rounded-lg hover:bg-[#5f2730] transition-all font-medium text-sm"
              >
                <Plus className="w-4 h-4" />
                Post a Job
              </Link>
            )}
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <span className="text-sm font-semibold text-gray-700">Filters:</span>
            <div className="flex gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all border whitespace-nowrap
                    ${selectedCategory === cat 
                      ? 'bg-[#722f37] text-white border-[#722f37]' 
                      : 'bg-white text-gray-700 border-gray-300 hover:border-[#722f37]'
                    }
                  `}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden max-w-7xl mx-auto w-full">
        {/* Job List - Full width on mobile, left side on desktop */}
        <div className="w-full lg:w-[420px] bg-white lg:border-r border-gray-200 overflow-y-auto">
          <div className="p-4 lg:p-6">
            {filteredJobs.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">Tidak ada lowongan</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => {
                      // Desktop: just select the job
                      if (window.innerWidth >= 1024) {
                        setSelectedJob(job)
                      }
                      // Mobile: do nothing on card click
                    }}
                    className={`relative rounded-lg border-2 transition-all p-4 
                      ${window.innerWidth >= 1024 ? 'cursor-pointer hover:shadow-md' : ''}
                      ${selectedJob?.id === job.id && window.innerWidth >= 1024
                        ? 'border-[#722f37] bg-[#722f37]/5' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                      }
                    `}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-[#EFDFBB] rounded-lg flex items-center justify-center border border-[#722f37]/20">
                          <Building2 className="w-6 h-6 text-[#722f37]" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-bold text-gray-900 text-sm line-clamp-2 leading-tight">
                            {job.title}
                          </h3>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {canDelete(job) && (
                              <button
                                onClick={(e) => handleDelete(job.id, e)}
                                disabled={deletingId === job.id}
                                className="p-1 text-red-500 hover:bg-red-50 rounded disabled:opacity-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-700 mb-2 font-medium">{job.company}</p>

                        <div className="space-y-1 text-xs text-gray-600 mb-2">
                          {job.location && (
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-gray-400" />
                              <span>{job.location}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            <span>{getTimeAgo(job.createdAt)}</span>
                          </div>
                          {job.salary && (
                            <div className="flex items-center gap-1.5">
                              <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                              <span className="font-semibold">Rp {job.salary}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 mb-3">
                          <span className="bg-[#EFDFBB] text-[#722f37] text-xs font-semibold px-2 py-0.5 rounded-full">
                            {job.category}
                          </span>
                          <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                            New
                          </span>
                        </div>

                        <button 
                          onClick={(e) => handleMobileApplyClick(job, e)}
                          className="w-full bg-[#2C5F7C] text-white py-2 rounded-lg hover:bg-[#234a5f] transition-colors font-semibold text-sm"
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Job Detail (Desktop Only) */}
        <div className="hidden lg:block flex-1 bg-white overflow-y-auto">
          {selectedJob ? (
            <div className="max-w-4xl mx-auto px-6 lg:px-12 py-8">
              {/* Job Header */}
              <div className="mb-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-[#EFDFBB] rounded-lg flex items-center justify-center border-2 border-[#722f37]/20">
                    <Building2 className="w-8 h-8 text-[#722f37]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedJob.title}</h1>
                        <p className="text-xl text-gray-700 font-medium mb-3">{selectedJob.company}</p>
                        <p className="text-sm text-gray-500">www.{selectedJob.company.toLowerCase().replace(/\s+/g, '')}.com</p>
                      </div>
                      <button
                        onClick={() => toggle(!active)}
                        className={`p-2 border rounded-lg transition ${
                          active ? "bg-yellow-100 border-yellow-400" : "border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <Star
                          className={`w-5 h-5 ${active ? "text-yellow-500 fill-yellow-500" : "text-gray-400"}`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex gap-2 mb-4">
                  <span className="bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full">
                    New
                  </span>
                  <span className="bg-orange-100 text-orange-700 text-sm font-semibold px-3 py-1 rounded-full">
                    Urgent
                  </span>
                </div>

                {/* Job Meta */}
                <div className="grid grid-cols-3 gap-4 text-sm mb-6">
                  <div>
                    <p className="text-gray-600 mb-1">Location</p>
                    <p className="font-semibold text-gray-900">{selectedJob.location || 'Remote'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Salary</p>
                    <p className="font-semibold text-gray-900">Rp {selectedJob.salary || 'Negotiable'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Hours</p>
                    <p className="font-semibold text-gray-900">Full-time</p>
                  </div>
                </div>

                {/* Apply Button */}
                <button 
                  onClick={() => {
                    const applySection = document.getElementById('apply-section')
                    applySection?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="w-full bg-[#2C5F7C] text-white py-3 rounded-lg hover:bg-[#234a5f] transition-colors font-semibold"
                >
                  Apply Now
                </button>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
                <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed space-y-4">
                  {selectedJob.description ? (
                    <div className="whitespace-pre-wrap">{selectedJob.description}</div>
                  ) : (
                    <>
                      <p>At least $19.50, plus overtime and benefits</p>
                      <p>Amazon USPS (Delivery Service Partners) are looking for delivery driver associates to help deliver packages to customers.</p>
                    </>
                  )}
                </div>
              </div>

              {/* Application Section */}
              {session && (
                <div id="apply-section" className="bg-gray-50 rounded-lg p-6 border border-gray-200 mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Lamar Sekarang</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Upload CV (PDF) *
                      </label>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                        className="w-full border-2 border-dashed border-gray-300 rounded-lg px-4 py-3 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#722f37] file:text-white hover:file:bg-[#5f2730] transition-all cursor-pointer"
                      />
                      {cvFile && (
                        <p className="mt-2 text-sm text-gray-600 flex items-center gap-2">
                          <span className="font-medium">{cvFile.name}</span>
                          <button 
                            type="button"
                            onClick={() => setCvFile(null)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </p>
                      )}
                      <p className="mt-2 text-sm text-gray-600">
                        ✨ CV kamu akan di-screening otomatis oleh AI
                      </p>
                    </div>

                    <button
                      onClick={handleApply}
                      disabled={applying || !cvFile}
                      className="w-full bg-[#722f37] text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:bg-[#5f2730] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {applying ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                          <span>Mengirim...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-5 h-5" />
                          <span>Kirim Lamaran</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {!session && (
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 text-center mb-8">
                  <p className="text-gray-700 font-medium">
                    Silakan{' '}
                    <Link href="/login" className="text-[#722f37] hover:text-[#5f2730] font-bold underline">
                      login
                    </Link>
                    {' '}untuk melamar pekerjaan ini
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Pilih lowongan untuk melihat detail</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}