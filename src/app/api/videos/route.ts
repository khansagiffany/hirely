// ==========================================
// FILE: app/api/videos/route.ts
// ==========================================
import { NextResponse } from 'next/server'

// Define YouTube API response types
interface YouTubeVideoItem {
  id: {
    videoId: string
  }
  snippet: {
    title: string
    description: string
    thumbnails: {
      high?: {
        url: string
      }
      medium: {
        url: string
      }
    }
    channelTitle: string
    publishedAt: string
  }
}

interface YouTubeAPIResponse {
  items: YouTubeVideoItem[]
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || 'tips cari kerja indonesia'
  const maxResults = searchParams.get('maxResults') || '12'

  try {
    // Fetch video dengan durasi medium (4-20 menit)
    const mediumResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?` +
      `part=snippet&q=${encodeURIComponent(query)}&` +
      `type=video&maxResults=${maxResults}&` +
      `videoDuration=medium&` + // Filter: durasi 4-20 menit
      `order=relevance&relevanceLanguage=id&` +
      `key=${process.env.YOUTUBE_API_KEY}`,
      { next: { revalidate: 3600 } } // Cache 1 jam
    )

    if (!mediumResponse.ok) {
      throw new Error('Failed to fetch medium videos')
    }

    // Fetch video dengan durasi long (>20 menit)
    const longResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?` +
      `part=snippet&q=${encodeURIComponent(query)}&` +
      `type=video&maxResults=${maxResults}&` +
      `videoDuration=long&` + // Filter: durasi >20 menit
      `order=relevance&relevanceLanguage=id&` +
      `key=${process.env.YOUTUBE_API_KEY}`,
      { next: { revalidate: 3600 } }
    )

    if (!longResponse.ok) {
      throw new Error('Failed to fetch long videos')
    }

    const mediumData = await mediumResponse.json() as YouTubeAPIResponse
    const longData = await longResponse.json() as YouTubeAPIResponse
    
    // Gabungkan hasil medium dan long
    const allItems = [
      ...(mediumData.items || []),
      ...(longData.items || [])
    ]

    // Hapus duplikat berdasarkan video ID
    const uniqueVideos = Array.from(
      new Map(
        allItems.map((item) => [item.id.videoId, item])
      ).values()
    )

    // Format data biar lebih clean
    const videos = uniqueVideos
      .slice(0, parseInt(maxResults)) // Batasi sesuai maxResults
      .map((item) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`
      }))

    return NextResponse.json({ videos, success: true })
  } catch (error) {
    console.error('YouTube API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch videos', success: false },
      { status: 500 }
    )
  }
}