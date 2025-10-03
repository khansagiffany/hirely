'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

export default function Applications() {
  const { data: session } = useSession()
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session) {
      fetch('/api/applications')
        .then(res => res.json())
        .then(data => {
          setApplications(data)
          setLoading(false)
        })
    }
  }, [session])

  if (loading) return <div className="text-center py-16">Loading...</div>

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Lamaran Saya</h1>

      {applications.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow">
          <p className="text-gray-600">Belum ada lamaran</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {applications.map((app) => (
            <div key={app.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">{app.job.title}</h3>
                  <p className="text-gray-600">{app.job.company}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Dilamar: {new Date(app.createdAt).toLocaleDateString('id-ID')}
                  </p>
                </div>
                <div className="text-right">
                  {app.aiScore && (
                    <div className="mb-2">
                      <span className="text-2xl font-bold text-blue-600">
                        {app.aiScore}/100
                      </span>
                      <p className="text-sm text-gray-500">AI Score</p>
                    </div>
                  )}
                  <span className={`inline-block px-3 py-1 rounded text-sm ${
                    app.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    app.status === 'SHORTLISTED' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {app.status}
                  </span>
                </div>
              </div>

              {app.aiFeedback && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-bold mb-2">AI Feedback:</h4>
                  {app.aiFeedback.strengths && (
                    <div className="mb-2">
                      <p className="text-sm font-medium text-green-700">Kelebihan:</p>
                      <ul className="text-sm text-gray-700 list-disc list-inside">
                        {app.aiFeedback.strengths.map((s: string, i: number) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {app.aiFeedback.weaknesses && (
                    <div>
                      <p className="text-sm font-medium text-red-700">Area Improvement:</p>
                      <ul className="text-sm text-gray-700 list-disc list-inside">
                        {app.aiFeedback.weaknesses.map((w: string, i: number) => (
                          <li key={i}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
