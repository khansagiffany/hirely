'use client'

import { useSession } from 'next-auth/react'

export default function Profile() {
  const { data: session } = useSession()

  if (!session) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p>Silakan login untuk melihat profile</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      
      <div className="bg-white rounded-lg shadow p-8">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
          <p className="text-lg">{session.user?.name || '-'}</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <p className="text-lg">{session.user?.email}</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <p className="text-lg capitalize">{session.user?.role?.replace('_', ' ')}</p>
        </div>

        <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Edit Profile
        </button>
      </div>
    </div>
  )
}