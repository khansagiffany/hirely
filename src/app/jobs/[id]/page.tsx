'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, MapPin, DollarSign, Building2, Upload, Sparkles } from 'lucide-react'

export default function JobDetail({ params }: { params: { id: string } }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [cvFile, setCvFile] = useState<File | null>(null)

  useEffect(() => {
    fetch(`/api/jobs/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setJob(data)
        setLoading(false)
      })
  }, [params.id])

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!cvFile || !session) return

    setApplying(true)
    const formData = new FormData()
    formData.append('jobId', params.id)
    formData.append('cv', cvFile)

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        body: formData
      })

      if (res.ok) {
        alert('Lamaran berhasil dikirim! CV sedang di-screening AI.')
        router.push('/applications')
      } else {
        alert('Gagal mengirim lamaran')
      }
    } catch (err) {
      alert('Error')
    } finally {
      setApplying(false)
    }
  }

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
      
      <div className="max-w-5xl mx-auto px-4 py-8 relative z-10">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="group flex items-center gap-2 text-white/90 hover:text-white transition-colors mb-6 font-medium bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20 hover:bg-white/20"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Kembali</span>
        </button>

        {/* Main Content Card - Ultra Glass */}
        <div className="bg-white/20 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
          {/* Header Section with Glass Effect */}
          <div className="bg-gradient-to-r from-white/30 via-white/20 to-white/10 backdrop-blur-2xl p-8 text-white border-b border-white/20">
            <div className="flex items-start gap-3 mb-4">
              <div className="bg-white/30 backdrop-blur-xl p-3 rounded-2xl border border-white/40 shadow-lg">
                <Building2 className="w-8 h-8 text-blue-900" />
              </div>
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2 drop-shadow-lg text-blue-900">{job.title}</h1>
                <p className="text-xl text-white/95 font-medium">{job.company}</p>
              </div>
            </div>

            {/* Job Meta Info */}
            <div className="flex flex-wrap gap-4 mt-6">
              {job.location && (
                <div className="flex items-center gap-2 bg-white/25 backdrop-blur-xl px-4 py-2 rounded-full border border-white/30 shadow-lg">
                  <MapPin className="w-4 h-4 text-blue-900" />
                  <span className="font-medium text-blue-900">{job.location}</span>
                </div>
              )}
              {job.salary && (
                <div className="flex items-center gap-2 bg-white/25 backdrop-blur-xl px-4 py-2 rounded-full border border-white/30 shadow-lg">
                  <span className="text-sm font-semibold text-red-900">Rp</span>
                  <span className="font-medium text-red-900">
                    {new Intl.NumberFormat('id-ID').format(job.salary)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Job Description */}
          <div className="p-8">
            <div className="mb-8 bg-white/40 backdrop-blur-2xl rounded-2xl p-6 border border-white/30 shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-blue-900 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full shadow-lg"></div>
                Deskripsi Pekerjaan
              </h2>
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{job.description}</p>
            </div>

            {/* Application Section */}
            {session && (
              <div className="bg-white/40 backdrop-blur-2xl rounded-2xl p-6 border border-white/30 shadow-lg">
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-blue-600" />
                    Lamar Sekarang
                  </h2>
                  
                  <div className="bg-white/50 backdrop-blur-xl p-6 rounded-2xl border border-white/40 shadow-inner">
                    <label className="block text-sm font-semibold mb-3 text-blue-900">
                      Upload CV (PDF)
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept=".pdf"
                        required
                        onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                        className="w-full border-2 border-dashed border-blue-300/50 rounded-2xl px-4 py-3 bg-white/60 backdrop-blur-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-all cursor-pointer shadow-sm"
                      />
                    </div>
                    <div className="flex items-start gap-2 mt-3 text-sm text-blue-800 bg-white/60 backdrop-blur-xl p-3 rounded-xl border border-blue-200/50">
                      <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <p className="font-medium">
                        CV kamu akan di-screening otomatis oleh AI untuk mencocokkan dengan posisi ini
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleApply}
                    disabled={applying || !cvFile}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 border border-blue-500/30 backdrop-blur-xl"
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

            {/* Login Prompt */}
            {!session && (
              <div className="bg-white/40 backdrop-blur-2xl rounded-2xl p-6 border border-white/30 shadow-lg text-center">
                <p className="text-gray-800 font-medium">
                  Silakan{' '}
                  <a 
                    href="/login" 
                    className="text-blue-700 hover:text-blue-800 font-bold underline decoration-2 underline-offset-2 hover:decoration-blue-800 transition-colors"
                  >
                    login
                  </a>
                  {' '}untuk melamar pekerjaan ini
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}