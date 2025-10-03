import Link from 'next/link'

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Cari Kerja dengan AI
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Platform lowongan kerja dengan CV screening otomatis dan chatbot AI
        </p>
        <div className="space-x-4">
          <Link
            href="/jobs"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 text-lg"
          >
            Lihat Lowongan
          </Link>
          <Link
            href="/register"
            className="inline-block bg-gray-200 text-gray-800 px-8 py-3 rounded-lg hover:bg-gray-300 text-lg"
          >
            Daftar Sekarang
          </Link>
        </div>
      </div>

      <div className="mt-20 grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-2">AI CV Screening</h3>
          <p className="text-gray-600">Upload CV dan dapatkan analisis otomatis dari AI</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-2">Chatbot Assistant</h3>
          <p className="text-gray-600">Tanya jawab seputar karir dan interview</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-2">Track Aplikasi</h3>
          <p className="text-gray-600">Monitor status lamaran kamu real-time</p>
        </div>
      </div>
    </div>
  )
}