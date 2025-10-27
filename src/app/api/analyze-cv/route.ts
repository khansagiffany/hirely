import { GoogleGenerativeAI } from "@google/generative-ai";

// Force Node.js runtime instead of Edge Runtime
export const runtime = 'nodejs';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    console.log('PDF Buffer size:', buffer.length);
    
    // Use pdf-parse with proper configuration
    const pdfParse = (await import("pdf-parse")).default as any;
    
    const data = await pdfParse(buffer, {
      max: 0, // Parse all pages
      version: 'default'
    });
    
    console.log('PDF parsed successfully. Pages:', data.numpages);
    console.log('Text length:', data.text.length);
    
    return data.text;
  } catch (error) {
    console.error("Error parsing PDF:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace');
    throw new Error(`Failed to extract text from PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return Response.json({ error: "Only PDF files are allowed" }, { status: 400 });
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return Response.json({ error: "File too large (max 10MB)" }, { status: 400 });
    }

    // Validate file size (min 1KB)
    if (file.size < 1024) {
      return Response.json({ error: "File too small or corrupt" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Check PDF signature
    const header = buffer.toString('utf8', 0, 5);
    if (header !== '%PDF-') {
      return Response.json({ error: "Invalid PDF file" }, { status: 400 });
    }

    const text = await extractTextFromPDF(buffer);

    if (!text || text.trim().length === 0) {
      return Response.json({ error: "No text found in PDF" }, { status: 400 });
    }

    console.log('Extracted text length:', text.length);

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `
Kamu adalah HR professional yang kasual dan to-the-point. Analisis CV ini dengan gaya bicara yang santai tapi tetap profesional.

CV yang akan dianalisis:
${text}

RULES PENULISAN (WAJIB DIIKUTI):
1. Tulis seperti orang ngobrol biasa - pakai "nih", "sih", "banget", "cukup oke", "lumayan solid"
2. JANGAN pakai:
   - Kata "Anda/Kandidat" → pakai "kamu/lo" 
   - Kalimat bertele-tele → langsung to the point
   - Bahasa corporate formal → pakai bahasa gaul profesional
   - Pujian berlebihan → realistis aja
3. Contoh gaya:
   ❌ "Kandidat memiliki keterampilan yang sangat baik"
   ✅ "Skill-nya cukup solid nih"
   
   ❌ "Perlu meningkatkan presentasi dokumen"
   ✅ "CV-nya bisa lebih rapi lagi"

WAJIB return dalam format JSON YANG VALID (tidak ada teks lain):
{
  "overall_score": [angka 1-100],
  "scores": {
    "technical_skills": [angka 1-100],
    "experience": [angka 1-100],
    "education": [angka 1-100],
    "achievements": [angka 1-100],
    "presentation": [angka 1-100]
  },
  "summary": "[2 kalimat max, kasual tapi jelas. Contoh: 'Profile-nya lumayan solid nih, pengalaman dan skill udah cukup mumpuni. Tinggal poles dikit lagi biar makin standout.']",
  "strengths": [
    "[Contoh: 'Pengalaman kerja lo udah cukup relevan, match sama role yang dicari']",
    "[Contoh: 'Skill technical-nya komplit, dari frontend sampe backend tercover']",
    "[Contoh: 'Ada beberapa achievement yang cukup wow, kayak naikin conversion rate 40%']"
  ],
  "improvements": [
    "[Contoh: 'CV-nya masih terlalu panjang, mending dibikin lebih concise']",
    "[Contoh: 'Kurang ada angka/metrics di pencapaian, padahal itu penting banget']"
  ],
  "recommendations": [
    "[Contoh: 'Tambahin portfolio atau link GitHub biar recruiter bisa liat hasil karya lo']",
    "[Contoh: 'Coba highlight 3-4 achievement utama aja di bagian atas, yang paling wow']"
  ]
}

PENTING BANGET:
- Nilai 1-25 = Kurang banget, 26-50 = Masih kurang, 51-75 = Oke lah, 76-100 = Bagus banget
- Overall score = rata-rata semua scores
- Response HARUS pure JSON, no markdown, no backticks
- Jujur aja dalam penilaian, jangan lebay
- Setiap poin MAX 15 kata, langsung to the point
- Pakai bahasa Indonesia yang natural kayak ngobrol sama temen
    `;

    const result = await model.generateContent(prompt);
    let output = result.response.text();
    
    // Clean up response to ensure it's valid JSON
    output = output.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    console.log('AI Response:', output.substring(0, 200));
    
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