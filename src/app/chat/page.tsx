// ==========================================
// FILE: app/chat/page.tsx
// ==========================================
'use client'
import { useSession } from 'next-auth/react'

export default function Chat() {
  const { data: session } = useSession()
  
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="max-w-md w-full mx-4">
          <div className="rounded-3xl shadow-2xl p-10 text-center border-2" style={{ 
            backgroundColor: '#FFFFFF',
            borderColor: '#722F37' 
          }}>
            <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #722F37 0%, #8a3a44 100%)' }}>
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-3" style={{ color: '#722F37' }}>Login Required</h2>
            <p className="text-gray-600 text-lg">Silakan login untuk menggunakan AI Career Assistant</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="rounded-3xl shadow-xl px-8 py-6 mb-8 border-2" style={{ 
          background: 'linear-gradient(135deg, #722F37 0%, #8a3a44 100%)',
          borderColor: '#EFDFBB'
        }}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: '#FFFFFF' }}>
              <svg className="w-8 h-8" style={{ color: '#722F37' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">AI Career Assistant</h1>
              <p className="text-sm" style={{ color: '#EFDFBB' }}>Powered by intelligent conversation</p>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="rounded-3xl shadow-2xl overflow-hidden border-4" style={{ 
          height: 'calc(100vh - 220px)',
          borderColor: '#722F37',
          background: 'white'
        }}>
          <iframe
            src="https://www.chatbase.co/chatbot-iframe/QasbHoEj-lx13cHI0ZXKv"
            width="100%"
            height="100%"
            frameBorder="0"
            className="w-full h-full"
            title="AI Career Assistant Chatbot"
          />
        </div>
      </div>
    </div>
  )
}