// ==========================================
// FILE: app/api/chat/route.ts
// ==========================================
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { chatWithAI } from "@/lib/openai"
import { prisma } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { messages } = await req.json()
    
    const response = await chatWithAI(messages)
    
    // Save chat history
    await prisma.chatHistory.upsert({
      where: { userId: session.user.id },
      update: {
        messages: [...messages, { role: 'assistant', content: response }]
      },
      create: {
        userId: session.user.id,
        messages: [...messages, { role: 'assistant', content: response }]
      }
    })

    return NextResponse.json({ response })
  } catch (error) {
    return NextResponse.json(
      { error: "Chat failed" },
      { status: 500 }
    )
  }
}