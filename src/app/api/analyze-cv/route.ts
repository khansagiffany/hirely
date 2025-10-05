import { GoogleGenerativeAI } from "@google/generative-ai";
import * as pdfjs from "pdfjs-dist";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const data = new Uint8Array(buffer);
  const pdf = await pdfjs.getDocument({ data }).promise;
  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item: any) => item.str)
      .join(" ");
    text += pageText + "\n";
  }

  return text;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const text = await extractTextFromPDF(buffer);

    if (!text || text.trim().length === 0) {
      return Response.json({ error: "No text found in PDF" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
Analisis CV berikut dan berikan penilaian numerik untuk setiap aspek.

${text}

WAJIB return dalam format JSON YANG VALID seperti ini (tidak boleh ada teks lain):
{
  "overall_score": [angka 1-100],
  "scores": {
    "technical_skills": [angka 1-100],
    "experience": [angka 1-100],
    "education": [angka 1-100],
    "achievements": [angka 1-100],
    "presentation": [angka 1-100]
  },
  "summary": "[1-2 kalimat singkat]",
  "strengths": [
    "[Poin 1: max 1 kalimat]",
    "[Poin 2: max 1 kalimat]",
    "[Poin 3: max 1 kalimat]"
  ],
  "improvements": [
    "[Poin 1: max 1 kalimat]",
    "[Poin 2: max 1 kalimat]"
  ],
  "recommendations": [
    "[Poin 1: max 1 kalimat]",
    "[Poin 2: max 1 kalimat]"
  ]
}

PENTING: 
- Langsung ke inti. to the point.
- gunakan bahasa indonesia manusia, human naturalized. jangan terlalu formal.
- Response harus PURE JSON, tidak ada text tambahan
- Nilai 1-25 = Sangat Kurang, 26-50 = Kurang, 51-75 = Cukup, 76-100 = Sangat Baik
- Overall score adalah rata-rata dari semua scores
    `;

    const result = await model.generateContent(prompt);
    let output = result.response.text();
    
    // Clean up response to ensure it's valid JSON
    output = output.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const analysisData = JSON.parse(output);

    return Response.json({ analysis: analysisData });
  } catch (error) {
    console.error("Error analyzing CV:", error);
    return Response.json(
      { 
        error: "Failed to analyze CV", 
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}