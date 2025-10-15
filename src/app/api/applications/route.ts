// ==========================================
// FILE: app/api/applications/route.ts
// ==========================================
import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { screenCV } from "@/lib/gemini" // ✅ Ganti dari @/lib/openai

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const formData = await req.formData()
    const jobId = formData.get('jobId') as string
    const cvFile = formData.get('cv') as File
    
    // In production, upload to cloud storage (S3, Cloudinary, etc)
    // For now, we'll assume CV text is extracted
    const cvText = await cvFile.text()
    
    const job = await prisma.job.findUnique({
      where: { id: jobId }
    })

    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      )
    }

    // AI Screening dengan Gemini
    const screening = await screenCV(cvText, job.description)

    const application = await prisma.application.create({
      data: {
        userId: session.user.id,
        jobId,
        cvUrl: `/uploads/${cvFile.name}`, // Placeholder
        aiScore: screening.score,
        aiFeedback: screening
      }
    })

    return NextResponse.json(application)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const applications = await prisma.application.findMany({
      where: { userId: session.user.id },
      include: {
        job: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(applications)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    )
  }
}