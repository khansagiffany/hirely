import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function screenCV(cvText: string, jobDescription: string) {
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are an expert HR recruiter. Analyze the CV against the job description and provide a score (0-100) and detailed feedback."
      },
      {
        role: "user",
        content: `Job Description:\n${jobDescription}\n\nCV:\n${cvText}\n\nProvide analysis in JSON format: {"score": number, "strengths": string[], "weaknesses": string[], "recommendation": string}`
      }
    ],
    temperature: 0.7,
  })

  return JSON.parse(completion.choices[0].message.content || '{}')
}

export async function chatWithAI(
  messages: Array<{ role: 'system' | 'user' | 'assistant', content: string }>
) {
  const systemMessage = {
    role: "system" as const,
    content: "You are a helpful career advisor assistant. Help users with job applications, CV tips, and interview preparation."
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [systemMessage, ...messages],
    temperature: 0.8,
  })

  return completion.choices[0].message.content
}