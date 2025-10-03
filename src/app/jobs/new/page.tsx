'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function NewJob() {
  const { data: session } = useSession()
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    location: '',
    salary: '',
    category: ''
  })
  const [loading, setLoading] = useState(false)

  const categories = [
    'Software Engineering',
    'Product Design',
    'Data Science',
    'Marketing',
    'Sales',
    'Customer Success',
    'IT',
    'Psychology',
    'Finance',
    'Human Resources',
    'Operations',
    'Legal',
    'Other'
  ]

  if (!session || session.user.role !== 'EMPLOYER') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p>Hanya Employer yang bisa posting lowongan</p>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        alert('Lowongan berhasil ditambahkan!')
        router.push('/jobs')
      } else {
        alert('Gagal menambahkan lowongan')
      }
    } catch (err) {
      alert('Error')
    } finally {
      setLoading(false)
    }
  }

  return (
  <div className="max-w-4xl mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold mb-6 text-[#0f172a]">Posting Lowongan Baru</h1>
    
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 text-[#0f172a]">Job Title *</label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          className="w-full border rounded px-3 py-2 text-[#0f172a] placeholder-[#475569]"
          placeholder="e.g. Frontend Developer"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-[#0f172a]">Company *</label>
        <input
          type="text"
          required
          value={formData.company}
          onChange={(e) => setFormData({...formData, company: e.target.value})}
          className="w-full border rounded px-3 py-2 text-[#0f172a] placeholder-[#475569]"
          placeholder="e.g. Tech Company"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-[#0f172a]">Category *</label>
        <select
          required
          value={formData.category}
          onChange={(e) => setFormData({...formData, category: e.target.value})}
          className="w-full border rounded px-3 py-2 bg-white text-[#0f172a]"
        >
          <option value="">Pilih Kategori</option>
          {categories.map((cat) => (
            <option key={cat} value={cat} className="text-[#0f172a]">
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-[#0f172a]">Location</label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => setFormData({...formData, location: e.target.value})}
          className="w-full border rounded px-3 py-2 text-[#0f172a] placeholder-[#475569]"
          placeholder="e.g. Jakarta, Remote"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-[#0f172a]">Salary</label>
        <input
          type="text"
          value={formData.salary}
          onChange={(e) => setFormData({...formData, salary: e.target.value})}
          className="w-full border rounded px-3 py-2 text-[#0f172a] placeholder-[#475569]"
          placeholder="e.g. Rp 5.000.000 - Rp 8.000.000"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-[#0f172a]">Job Description *</label>
        <textarea
          required
          rows={10}
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          className="w-full border rounded px-3 py-2 text-[#0f172a] placeholder-[#475569]"
          placeholder="Deskripsi pekerjaan, requirements, dll"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-700 text-white py-3 rounded hover:bg-blue-800 disabled:bg-gray-400"
      >
        {loading ? 'Memposting...' : 'Post Lowongan'}
      </button>
    </form>
  </div>
)
}