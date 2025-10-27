'use client'
import { useState, useEffect } from 'react'

interface Video {
  id: string
  title: string
  description: string
  thumbnail: string
  channelTitle: string
  publishedAt: string
  url: string
}

type Category = 'all' | 'software-dev' | 'psikologi' | 'hr' | 'akuntan' | 'marketing'

interface CategoryConfig {
  id: Category
  label: string
  query: string
  icon: string
}

const categories: CategoryConfig[] = [
  { id: 'all', label: 'Semua', query: 'tips+cari+kerja+indonesia', icon: '🎯' },
  { id: 'software-dev', label: 'Software Dev', query: 'tips+karir+software+developer+indonesia', icon: '💻' },
  { id: 'psikologi', label: 'Psikologi', query: 'tips+karir+psikologi+indonesia', icon: '🧠' },
  { id: 'hr', label: 'HR', query: 'tips+karir+HR+human+resources+indonesia', icon: '👥' },
  { id: 'akuntan', label: 'Akuntan', query: 'tips+karir+akuntan+akuntansi+indonesia', icon: '📊' },
  { id: 'marketing', label: 'Marketing', query: 'tips+karir+marketing+indonesia', icon: '📱' },
]

export default function TipsPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeCategory, setActiveCategory] = useState<Category>('all')

  useEffect(() => {
    fetchVideos(activeCategory)
  }, [activeCategory])

  const fetchVideos = async (category: Category) => {
    setLoading(true)
    setError('')
    
    try {
      const categoryConfig = categories.find(c => c.id === category)
      const query = categoryConfig?.query || 'tips+cari+kerja+indonesia'
      
      const response = await fetch(`/api/videos?q=${query}&maxResults=15`)
      const data = await response.json()
      
      if (data.success) {
        setVideos(data.videos)
      } else {
        setError('Gagal memuat video')
      }
    } catch (err) {
      setError('Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  if (loading && videos.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#722F37] via-[#8B3A44] to-[#5A2529]">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#EFDFBB] rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-[#D4B896] rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '1s'}} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Hero Skeleton */}
          <div className="text-center mb-20">
            <div className="h-16 w-3/4 max-w-2xl bg-[#EFDFBB]/10 rounded-2xl animate-pulse mx-auto mb-6" />
            <div className="h-8 w-1/2 max-w-lg bg-[#EFDFBB]/10 rounded-xl animate-pulse mx-auto" />
          </div>

          {/* Category Tabs Skeleton */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 w-32 bg-[#EFDFBB]/10 rounded-2xl animate-pulse" />
            ))}
          </div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#722F37] to-[#8B3A44] rounded-3xl opacity-30 blur animate-pulse" />
                <div className="relative bg-[#3D1F23]/50 backdrop-blur-xl rounded-3xl overflow-hidden border border-[#EFDFBB]/10">
                  <div className="aspect-video bg-[#5A2529]/50 animate-pulse" />
                  <div className="p-6 space-y-4">
                    <div className="h-5 bg-[#5A2529]/50 rounded-lg animate-pulse" />
                    <div className="h-5 bg-[#5A2529]/50 rounded-lg animate-pulse w-3/4" />
                    <div className="flex items-center gap-3 pt-2">
                      <div className="w-8 h-8 bg-[#5A2529]/50 rounded-full animate-pulse" />
                      <div className="h-4 bg-[#5A2529]/50 rounded animate-pulse flex-1" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#722F37] via-[#8B3A44] to-[#5A2529] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-red-500 rounded-full blur-2xl opacity-20" />
            <div className="relative w-24 h-24 bg-gradient-to-br from-red-500 to-red-700 rounded-3xl flex items-center justify-center mx-auto transform rotate-3">
              <svg className="w-12 h-12 text-[#EFDFBB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-[#EFDFBB] mb-3">{error}</h2>
          <p className="text-[#EFDFBB]/70 mb-8">Terjadi kesalahan saat memuat konten. Silakan coba lagi.</p>
          <button
            onClick={() => fetchVideos(activeCategory)}
            className="px-8 py-4 bg-gradient-to-r from-[#722F37] to-[#8B3A44] text-[#EFDFBB] rounded-2xl hover:from-[#8B3A44] hover:to-[#722F37] transition-all duration-300 font-semibold shadow-lg hover:shadow-[#722F37]/50 hover:scale-105"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#722F37] via-[#8B3A44] to-[#5A2529]">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#EFDFBB] rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-[#D4B896] rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}} />
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-[#C4A880] rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '4s'}} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#EFDFBB]/10 backdrop-blur-md rounded-full border border-[#EFDFBB]/20 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EFDFBB] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#EFDFBB]"></span>
            </span>
            <span className="text-sm font-medium text-[#EFDFBB]">Tips & Tutorial</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#EFDFBB] mb-6 leading-tight">
            Panduan Karir
            <span className="block bg-gradient-to-r from-[#EFDFBB] via-[#D4B896] to-[#C4A880] text-transparent bg-clip-text">
              Untuk Masa Depanmu
            </span>
          </h1>
          
          <p className="text-xl text-[#EFDFBB]/80 max-w-2xl mx-auto leading-relaxed">
            Kurasi video pilihan dari expert untuk membantu perjalanan karirmu menuju kesuksesan
          </p>
        </div>

        {/* Category Tabs */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                disabled={loading}
                className={`
                  group relative px-6 py-3 rounded-2xl font-semibold transition-all duration-300
                  ${activeCategory === category.id
                    ? 'bg-gradient-to-r from-[#722F37] to-[#8B3A44] text-[#EFDFBB] shadow-lg shadow-[#722F37]/30 scale-105'
                    : 'bg-[#EFDFBB]/5 text-[#EFDFBB]/70 hover:bg-[#EFDFBB]/10 hover:text-[#EFDFBB] border border-[#EFDFBB]/10 hover:border-[#EFDFBB]/20'
                  }
                  ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
                `}
              >
                {activeCategory === category.id && (
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#722F37] to-[#8B3A44] rounded-2xl blur opacity-50" />
                )}
                <span className="relative flex items-center gap-2">
                  <span className="text-xl">{category.icon}</span>
                  <span>{category.label}</span>
                  {activeCategory === category.id && (
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto mb-16">
          <div className="bg-[#EFDFBB]/5 backdrop-blur-md rounded-2xl p-4 border border-[#EFDFBB]/10 text-center">
            <div className="text-3xl font-bold text-[#EFDFBB] mb-1">{videos.length}</div>
            <div className="text-sm text-[#EFDFBB]/70">Video Tersedia</div>
          </div>
          <div className="bg-[#EFDFBB]/5 backdrop-blur-md rounded-2xl p-4 border border-[#EFDFBB]/10 text-center">
            <div className="text-3xl font-bold text-[#EFDFBB] mb-1">100%</div>
            <div className="text-sm text-[#EFDFBB]/70">Gratis</div>
          </div>
          <div className="bg-[#EFDFBB]/5 backdrop-blur-md rounded-2xl p-4 border border-[#EFDFBB]/10 text-center">
            <div className="text-3xl font-bold text-[#EFDFBB] mb-1">24/7</div>
            <div className="text-sm text-[#EFDFBB]/70">Akses Kapanpun</div>
          </div>
        </div>

        {/* Loading state for category change */}
        {loading && videos.length > 0 && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#EFDFBB]/10 backdrop-blur-md rounded-2xl border border-[#EFDFBB]/20">
              <div className="w-5 h-5 border-2 border-[#EFDFBB]/30 border-t-[#EFDFBB] rounded-full animate-spin" />
              <span className="text-[#EFDFBB]/80 font-medium">Memuat video...</span>
            </div>
          </div>
        )}

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {videos.map((video, index) => (
            <a
              key={video.id}
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative"
              style={{animationDelay: `${index * 50}ms`}}
            >
              {/* Glow effect on hover */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#722F37] to-[#8B3A44] rounded-3xl opacity-0 group-hover:opacity-100 blur transition-all duration-500" />
              
              {/* Card */}
              <div className="relative bg-[#3D1F23]/50 backdrop-blur-xl rounded-3xl overflow-hidden border border-[#EFDFBB]/10 hover:border-[#EFDFBB]/20 transition-all duration-500 group-hover:transform group-hover:scale-[1.02]">
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gradient-to-br from-[#5A2529] to-[#3D1F23] overflow-hidden">
                  <img
                    src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`
                    }}
                  />
                  
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#722F37] via-[#722F37]/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
                  
                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#722F37] rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                      <div className="relative w-16 h-16 bg-gradient-to-br from-[#722F37] to-[#8B3A44] rounded-full flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-2xl">
                        <svg className="w-7 h-7 text-[#EFDFBB] ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* YouTube badge */}
                  <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-black/80 backdrop-blur-sm rounded-full border border-[#EFDFBB]/10">
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    <span className="text-xs font-medium text-[#EFDFBB]">YouTube</span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <h3 className="font-bold text-lg text-[#EFDFBB] line-clamp-2 group-hover:text-[#D4B896] transition-colors leading-snug mb-4 min-h-[3.5rem]">
                    {video.title}
                  </h3>
                  
                  {/* Channel info */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#722F37] to-[#8B3A44] rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-[#EFDFBB]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                    <span className="text-sm text-[#EFDFBB]/80 line-clamp-1 font-medium">{video.channelTitle}</span>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2 text-xs text-[#EFDFBB]/60">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>
                      {new Date(video.publishedAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Empty state */}
        {videos.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-[#EFDFBB] rounded-full blur-2xl opacity-20" />
              <div className="relative w-24 h-24 bg-gradient-to-br from-[#722F37] to-[#8B3A44] rounded-3xl flex items-center justify-center mx-auto">
                <svg className="w-12 h-12 text-[#EFDFBB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-[#EFDFBB] mb-3">Tidak Ada Video</h3>
            <p className="text-[#EFDFBB]/70">Belum ada video untuk kategori ini. Coba kategori lain!</p>
          </div>
        )}

        {/* CTA Section */}
        <div className="relative max-w-4xl mx-auto">
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#722F37] via-[#8B3A44] to-[#722F37] rounded-3xl blur-2xl opacity-20" />
          
          <div className="relative bg-gradient-to-br from-[#3D1F23]/80 to-[#5A2529]/80 backdrop-blur-xl rounded-3xl border border-[#EFDFBB]/10 p-12 text-center overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#EFDFBB] rounded-full mix-blend-overlay filter blur-3xl opacity-10" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4B896] rounded-full mix-blend-overlay filter blur-3xl opacity-10" />
            
            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#722F37] to-[#8B3A44] rounded-2xl mb-6 transform rotate-3">
                <svg className="w-8 h-8 text-[#EFDFBB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              
              <h3 className="text-3xl md:text-4xl font-bold text-[#EFDFBB] mb-4">
                Siap Untuk Langkah Berikutnya?
              </h3>
              <p className="text-lg text-[#EFDFBB]/80 mb-8 max-w-2xl mx-auto leading-relaxed">
                Dapatkan panduan personal dari AI Career Assistant yang disesuaikan dengan profil dan tujuan karirmu
              </p>
              
              <a
                href="/chat"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#722F37] to-[#8B3A44] text-[#EFDFBB] rounded-2xl hover:from-[#8B3A44] hover:to-[#722F37] transition-all duration-300 font-semibold shadow-lg hover:shadow-[#722F37]/50 hover:scale-105 group"
              >
                <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Mulai Konsultasi Gratis
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}