// ==========================================
// FILE: app/chat/page.tsx
// ==========================================
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'

export default function Chat() {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const newMessages = [...messages, { role: 'user', content: input }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      })

      const data = await res.json()
      setMessages([...newMessages, { role: 'assistant', content: data.response }])
    } catch (err) {
      alert('Error sending message')
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p>Silakan login untuk menggunakan chatbot</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">AI Career Assistant</h1>
      
      <div className="bg-white rounded-lg shadow h-[600px] flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 py-16">
              <p>Tanya aku tentang CV, interview, atau career tips!</p>
            </div>
          )}
          
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] rounded-lg p-3 ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3 text-gray-500">
                Typing...
              </div>
            </div>
          )}
        </div>

        <form onSubmit={sendMessage} className="border-t p-4 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ketik pesan..."
            className="flex-1 border rounded px-4 py-2"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            Kirim
          </button>
        </form>
      </div>
    </div>
  )
}