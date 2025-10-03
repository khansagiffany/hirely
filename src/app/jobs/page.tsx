'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Job {
  id: string
  title: string
  company: string
  location: string
  salary: string
  createdAt: string
}

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/jobs')
      .then(res => res.json())
      .then(data => {
        setJobs(data.jobs || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="text-center py-16">Loading...</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Lowongan Kerja</h1>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow">
          <p className="text-gray-600">Belum ada lowongan tersedia</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.id}`}
              className="block bg-white p-6 rounded-lg shadow hover:shadow-md transition"
            >
              <h3 className="text-xl font-bold mb-2">{job.title}</h3>
              <p className="text-gray-600 mb-2">{job.company}</p>
              <div className="flex gap-4 text-sm text-gray-500">
                {job.location && <span>📍 {job.location}</span>}
                {job.salary && <span>💰 {job.salary}</span>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}