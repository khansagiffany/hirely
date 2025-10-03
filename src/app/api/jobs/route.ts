// ==========================================
// FILE: app/api/jobs/route.ts
// ==========================================
import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

// GET all jobs
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const jobs = await prisma.job.findMany({
      where: { isActive: true },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    })

    const total = await prisma.job.count({ where: { isActive: true } })

    return NextResponse.json({
      jobs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error("GET /api/jobs error:", error)
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    )
  }
}

// POST create job (Employer only)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    console.log("Session:", session) // 🔹 lihat session di server

    if (!session) {
      console.log("Unauthorized: No session")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== 'EMPLOYER') {
      console.log("Unauthorized: User role not EMPLOYER", session.user.role)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, company, description, location, salary } = await req.json()
    console.log("Form data:", { title, company, description, location, salary })

    // Pastikan createdById ada
    if (!session.user.id) {
      console.log("Error: session.user.id is undefined")
      return NextResponse.json({ error: "User ID not found in session" }, { status: 500 })
    }

    const job = await prisma.job.create({
      data: {
        title,
        company,
        description,
        location,
        salary,
        source: 'CUSTOM',
        createdById: null
      }
    })

    console.log("Job created:", job)

    return NextResponse.json(job)
  } catch (error) {
    console.error("POST /api/jobs error:", error)
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 }
    )
  }
}
