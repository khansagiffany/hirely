// ==========================================
// FILE: app/api/jobs/[id]/route.ts
// ==========================================
import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

// GET single job
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const job = await prisma.job.findUnique({
      where: { id: params.id }
    })

    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(job)
  } catch (error) {
    console.error("GET /api/jobs/[id] error:", error)
    return NextResponse.json(
      { error: "Failed to fetch job" },
      { status: 500 }
    )
  }
}

// DELETE job (Employer only - own jobs)
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    console.log("DELETE Session:", session)

    if (!session) {
      console.log("Unauthorized: No session")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== 'EMPLOYER') {
      console.log("Unauthorized: User role not EMPLOYER", session.user.role)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if job exists
    const job = await prisma.job.findUnique({
      where: { id: params.id }
    })

    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      )
    }

    // Verify ownership (jika createdById tidak null)
    if (job.createdById && job.createdById !== session.user.id) {
      console.log("Forbidden: User does not own this job")
      return NextResponse.json(
        { error: "Forbidden: You can only delete your own jobs" },
        { status: 403 }
      )
    }

    // Soft delete (set isActive = false) - Recommended
    await prisma.job.update({
      where: { id: params.id },
      data: { isActive: false }
    })

    // Atau hard delete (hapus permanen):
    // await prisma.job.delete({
    //   where: { id: params.id }
    // })

    console.log("Job deleted successfully:", params.id)

    return NextResponse.json({ 
      message: "Job deleted successfully",
      id: params.id 
    })
  } catch (error) {
    console.error("DELETE /api/jobs/[id] error:", error)
    return NextResponse.json(
      { error: "Failed to delete job" },
      { status: 500 }
    )
  }
}

// PUT/PATCH update job (Employer only - own jobs)
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    console.log("PUT Session:", session)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== 'EMPLOYER') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if job exists
    const job = await prisma.job.findUnique({
      where: { id: params.id }
    })

    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      )
    }

    // Verify ownership
    if (job.createdById && job.createdById !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden: You can only update your own jobs" },
        { status: 403 }
      )
    }

    const { title, company, description, location, salary, category } = await req.json()
    console.log("Update data:", { title, company, description, location, salary, category })

    // Validate required fields
    if (!title || !company || !description || !category) {
      return NextResponse.json(
        { error: "Missing required fields: title, company, description, category" },
        { status: 400 }
      )
    }

    const updatedJob = await prisma.job.update({
      where: { id: params.id },
      data: {
        title,
        company,
        description,
        location,
        salary,
        category
      }
    })

    console.log("Job updated successfully:", updatedJob)

    return NextResponse.json(updatedJob)
  } catch (error) {
    console.error("PUT /api/jobs/[id] error:", error)
    return NextResponse.json(
      { error: "Failed to update job" },
      { status: 500 }
    )
  }
}