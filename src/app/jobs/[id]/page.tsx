'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

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

  if (loading) return <div className="text-center py-16">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white p-8 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
        <p className="text-xl text-gray-600 mb-4">{job.company}</p>
        <div className="flex gap-4 mb-6 text-gray-600">
          {job.location && <span>📍 {job.location}</span>}
          {job.salary && <span>💰 {job.salary}</span>}
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-2">Deskripsi Pekerjaan</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
        </div>

        {session && (
          <form onSubmit={handleApply} className="border-t pt-6">
            <h2 className="text-xl font-bold mb-4">Lamar Sekarang</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Upload CV (PDF)</label>
              <input
                type="file"
                accept=".pdf"
                required
                onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                className="w-full border rounded px-3 py-2"
              />
              <p className="text-sm text-gray-500 mt-1">
                CV akan di-screening otomatis oleh AI
              </p>
            </div>
            <button
              type="submit"
              disabled={applying || !cvFile}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {applying ? 'Mengirim...' : 'Kirim Lamaran'}
            </button>
          </form>
        )}

        {!session && (
          <div className="border-t pt-6">
            <p className="text-gray-600">
              Silakan <a href="/login" className="text-blue-600 hover:underline">login</a> untuk melamar
            </p>
          </div>
        )}
      </div>
    </div>
  )
}