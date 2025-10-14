'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, MapPin, DollarSign, Building2, Upload, Sparkles, Clock, X, CheckCircle } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function JobDetail({ params }: { params: { id: string } }) {
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [session, setSession] = useState(true) // Simulasi session, sesuaikan dengan useSession()

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div
            className="inline-block w-12 h-12 border-4 rounded-full animate-spin mb-4"
            style={{ borderColor: '#722F37', borderTopColor: 'transparent' }}
          ></div>
          <p className="text-gray-600 font-medium">Loading job details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Jobs</span>
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Job Header Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm p-6 sm:p-8 mb-6 border border-gray-200">
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-6">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center border-2 flex-shrink-0"
              style={{ backgroundColor: '#EFDFBB', borderColor: '#722F37' }}
            >
              <Building2 className="w-10 h-10" style={{ color: '#722F37' }} />
            </div>
            <div className="flex-1 min-w-0">
              <h1
                className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 break-words"
                style={{ color: '#2d2620' }}
              >
                {job.title}
              </h1>
              <p className="text-lg sm:text-xl font-medium mb-1 break-words" style={{ color: '#6b5d54' }}>
                {job.company}
              </p>
              <p className="text-sm" style={{ color: '#999' }}>
                www.{job.company.toLowerCase().replace(/\s+/g, '')}.com
              </p>
            </div>
          </div>

          <div className="flex gap-2 mb-6 flex-wrap">
            <span className="bg-green-100 text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full">
              New Position
            </span>
            <span
              className="text-white text-sm font-semibold px-4 py-1.5 rounded-full"
              style={{ backgroundColor: '#722F37' }}
            >
              Urgent Hiring
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              className="rounded-xl p-4"
              style={{ backgroundColor: '#faf8f3', borderColor: '#e8e1d9', borderWidth: '1px' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5" style={{ color: '#722F37' }} />
                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6b5d54' }}>
                  Location
                </span>
              </div>
              <span className="font-bold text-base" style={{ color: '#2d2620' }}>
                {job.location || 'Remote'}
              </span>
            </div>

            <div
              className="rounded-xl p-4"
              style={{ backgroundColor: '#faf8f3', borderColor: '#e8e1d9', borderWidth: '1px' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5" style={{ color: '#722F37' }} />
                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6b5d54' }}>
                  Salary
                </span>
              </div>
              <span className="font-bold text-base" style={{ color: '#2d2620' }}>
                Rp {new Intl.NumberFormat('id-ID').format(job.salary)}
              </span>
            </div>

            <div
              className="rounded-xl p-4"
              style={{ backgroundColor: '#faf8f3', borderColor: '#e8e1d9', borderWidth: '1px' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5" style={{ color: '#722F37' }} />
                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6b5d54' }}>
                  Type
                </span>
              </div>
              <span className="font-bold text-base" style={{ color: '#2d2620' }}>
                Full-time
              </span>
            </div>
          </div>
        </div>

        {/* Job Description Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm p-6 sm:p-8 mb-6 border border-gray-200">
          <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: '#2d2620' }}>
            Job Description
          </h2>

          <div className="max-w-none">
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
      p: ({ node, ...props }) => (
        <p className="text-[#2d2620] text-justify leading-relaxed mb-3" {...props} />
      ),
      strong: ({ node, ...props }) => (
        <strong className="font-semibold text-[#2d2620]" {...props} />
      ),
      a: ({ node, ...props }) => (
        <a
          className="text-[#722F37] font-medium underline hover:text-[#9b3c45]"
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        />
      ),
      h1: ({ node, ...props }) => (
        <h1
          className="text-2xl font-bold border-b pb-1 mb-4 text-[#722F37]"
          {...props}
        />
      ),
      h2: ({ node, ...props }) => (
        <h2
          className="text-xl font-semibold mt-6 mb-3 text-[#722F37] border-l-4 border-[#722F37] pl-3"
          {...props}
        />
      ),
      h3: ({ node, ...props }) => (
        <h2
          className="text-xl font-semibold mt-6 mb-3 text-[#722F37] border-l-4 border-[#722F37] pl-3"
          {...props}
        />
      ),
      ol: ({ node, ...props }) => (
        <ol
          className="list-decimal pl-6 space-y-2 text-[#2d2620] text-justify leading-relaxed"
          {...props}
        />
      ),
      li: ({ node, ...props }) => (
        <li className="text-[#2d2620] leading-relaxed" {...props} />
      ),
      blockquote: ({ node, ...props }) => (
        <blockquote
          className="border-l-4 pl-4 italic text-[#2d2620] bg-[#EFDFBB]/20 rounded-r-lg"
          {...props}
        />
      ),
    }}
  >
    {job.description}
  </ReactMarkdown>
</div>



        </div>

        {/* Apply Section */}
        {session ? (
          <div
            className="rounded-2xl sm:rounded-3xl shadow-sm p-6 sm:p-8 border-2"
            style={{
              background: 'linear-gradient(to bottom right, #faf8f3, #f3efea)',
              borderColor: '#EFDFBB',
            }}
          >
            <h2
              className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2"
              style={{ color: '#2d2620' }}
            >
              <Sparkles className="w-6 h-6" style={{ color: '#722F37' }} />
              Apply for this Position
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#2d2620' }}>
                  Upload Your CV (PDF) *
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                  className="w-full border-2 border-dashed rounded-lg px-4 py-3 bg-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:text-white hover:file:opacity-90 transition-all cursor-pointer"
                  style={{ borderColor: '#ddd2c7' }}
                />
                <style>{`
                  input[type="file"]::file-selector-button {
                    background: #722F37;
                  }
                `}</style>
                {cvFile && (
                  <p className="mt-2 text-sm flex items-center gap-2" style={{ color: '#6b5d54' }}>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="font-medium">{cvFile.name}</span>
                    <button
                      type="button"
                      onClick={() => setCvFile(null)}
                      className="text-red-500 hover:text-red-700 ml-auto"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </p>
                )}
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-blue-900">
                  CV kamu akan di-screening otomatis oleh AI untuk mencocokkan dengan posisi ini
                </p>
              </div>

              <button
                onClick={handleApply}
                disabled={applying || !cvFile}
                className="w-full text-white px-6 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
                style={{ background: applying || !cvFile ? '#ccc' : '#722F37' }}
              >
                {applying ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    <span>Submit Application</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm p-6 sm:p-8 border border-gray-200 text-center">
            <p className="font-medium" style={{ color: '#6b5d54' }}>
              Silakan{' '}
              <a
                href="/login"
                className="font-bold underline decoration-2 underline-offset-2 transition-colors"
                style={{ color: '#722F37' }}
              >
                login
              </a>{' '}
              untuk melamar pekerjaan ini
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
