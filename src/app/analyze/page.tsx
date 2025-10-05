"use client";
import { useState } from "react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";

interface AnalysisData {
  overall_score: number;
  scores: {
    technical_skills: number;
    experience: number;
    education: number;
    achievements: number;
    presentation: number;
  };
  summary: string;
  strengths: string [];
  improvements: string[];
  recommendations: string[];
}

export default function Analyze() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/analyze-cv", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data.analysis);
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat menganalisis CV");
    } finally {
      setLoading(false);
    }
  };

  const getCategory = (score: number) => {
    if (score >= 76) return { label: "Sangat Baik", color: "text-green-600", bg: "bg-green-100" };
    if (score >= 51) return { label: "Cukup", color: "text-blue-600", bg: "bg-blue-100" };
    if (score >= 26) return { label: "Kurang", color: "text-yellow-600", bg: "bg-yellow-100" };
    return { label: "Sangat Kurang", color: "text-red-600", bg: "bg-red-100" };
  };

  const getScoreColor = (score: number) => {
    if (score >= 76) return "#10b981";
    if (score >= 51) return "#3b82f6";
    if (score >= 26) return "#f59e0b";
    return "#ef4444";
  };

  const radarData = result ? [
    { subject: "Technical Skills", score: result.scores.technical_skills, fullMark: 100 },
    { subject: "Experience", score: result.scores.experience, fullMark: 100 },
    { subject: "Education", score: result.scores.education, fullMark: 100 },
    { subject: "Achievements", score: result.scores.achievements, fullMark: 100 },
    { subject: "Presentation", score: result.scores.presentation, fullMark: 100 },
  ] : [];

  const pieData = result ? [
    { name: "Score", value: result.overall_score },
    { name: "Remaining", value: 100 - result.overall_score }
  ] : [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-2 text-center text-gray-900">
            🔍 AI CV Analyzer
          </h1>
          <p className="text-center text-gray-600 mb-6 text-sm">
            Upload CV untuk analisis cepat dari AI
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition">
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full text-sm"
                id="file-upload"
              />
              {file && (
                <div className="text-gray-700 mt-2 text-sm">
                  📄 {file.name}
                </div>
              )}
            </div>
            
            <button
              type="submit"
              disabled={loading || !file}
              className="w-full bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold disabled:bg-gray-400 hover:bg-blue-700 transition text-sm"
            >
              {loading ? "⏳ Menganalisis..." : "🚀 Analisis Sekarang"}
            </button>
          </form>

          {result && (
            <div className="mt-6 space-y-6">
              {/* Overall Score */}
              <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">📊 Skor Keseluruhan</h2>
                <div className="flex items-center justify-center gap-8">
                  <ResponsiveContainer width={200} height={200}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                      >
                        <Cell fill={getScoreColor(result.overall_score)} />
                        <Cell fill="#e5e7eb" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="text-center">
                    <div className="text-5xl font-bold" style={{ color: getScoreColor(result.overall_score) }}>
                      {result.overall_score}
                    </div>
                    <div className={`mt-2 px-4 py-1 rounded-full inline-block ${getCategory(result.overall_score).bg} ${getCategory(result.overall_score).color} font-semibold`}>
                      {getCategory(result.overall_score).label}
                    </div>
                  </div>
                </div>
              </div>

              {/* Radar Chart */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-lg font-bold text-gray-900 mb-4 text-center">📈 Detail Penilaian</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#374151', fontSize: 12 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#6b7280' }} />
                    <Radar name="Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  </RadarChart>
                </ResponsiveContainer>
                
                {/* Score Details */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
                  {Object.entries(result.scores).map(([key, value]) => (
                    <div key={key} className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-xs text-gray-600 mb-1 capitalize">
                        {key.replace(/_/g, ' ')}
                      </div>
                      <div className="text-2xl font-bold" style={{ color: getScoreColor(value) }}>
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-white p-5 rounded-lg border border-gray-200">
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  🎯 Ringkasan
                </h2>
                <p className="text-gray-700 text-sm leading-relaxed">{result.summary}</p>
              </div>

              {/* Strengths & Improvements */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-5 rounded-lg border border-green-200">
                  <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    ✅ Kelebihan
                  </h2>
                  <ul className="space-y-2">
                    {result.strengths.map((item, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-yellow-50 p-5 rounded-lg border border-yellow-200">
                  <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    ⚠️ Perlu Diperbaiki
                  </h2>
                  <ul className="space-y-2">
                    {result.improvements.map((item, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-yellow-600 mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  💡 Rekomendasi
                </h2>
                <ul className="space-y-2">
                  {result.recommendations.map((item, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}