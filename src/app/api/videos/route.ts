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
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?` +
      `part=snippet&q=${encodeURIComponent(query)}&` +
      `type=video&maxResults=${maxResults}&` +
      `order=relevance&relevanceLanguage=id&` +
      `key=${process.env.YOUTUBE_API_KEY}`,
      { next: { revalidate: 3600 } } // Cache 1 jam
    )

    if (!response.ok) {
      throw new Error('Failed to fetch videos')
    }

    const data = await response.json() as YouTubeAPIResponse
    
    // Format data biar lebih clean
    const videos = data.items.map((item) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium.url,
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