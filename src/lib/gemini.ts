// ==========================================
// FILE: lib/gemini.ts
// ==========================================
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function screenCV(cvText: string, jobDescription: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `
Kamu adalah AI recruiter yang bertugas menilai CV kandidat berdasarkan deskripsi pekerjaan.

DESKRIPSI PEKERJAAN:
${jobDescription}

CV KANDIDAT:
${cvText}

Berikan penilaian dalam format JSON dengan struktur:
{
  "score": <angka 0-100>,
  "strengths": ["kelebihan 1", "kelebihan 2", ...],
  "weaknesses": ["kekurangan 1", "kekurangan 2", ...],
  "recommendation": "ACCEPT/REVIEW/REJECT",
  "summary": "ringkasan singkat"
}
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    // Parse JSON dari response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Failed to parse AI response")
    }
    
    const screening = JSON.parse(jsonMatch[0])
    
    return {
      score: screening.score,
      strengths: screening.strengths,
      weaknesses: screening.weaknesses,
      recommendation: screening.recommendation,
      summary: screening.summary
    }
  } catch (error) {
    console.error("Gemini screening error:", error)
    return {
      score: 50,
      strengths: ["Unable to analyze"],
      weaknesses: ["AI analysis failed"],
      recommendation: "REVIEW",
      summary: "Please review manually"
    }
  }
}