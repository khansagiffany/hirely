'use client'

import { useState, useEffect, JSX } from 'react';
import { Search, Briefcase, Users, Calendar, MessageSquare, FileCheck, Video, CheckCircle, MapPin, DollarSign } from 'lucide-react';

interface Job {
  id: string
  title: string
  company: string
  location: string
  salary: string
  createdAt: string
  category: string
}

interface Feature {
  icon: JSX.Element
  title: string
  description: string
}

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [categories, setCategories] = useState<string[]>([]);

  const features: Feature[] = [
    {
      icon: <FileCheck className="w-8 h-8" />,
      title: 'AI CV Screening',
      description: 'Analisis CV otomatis dengan teknologi AI untuk menemukan kandidat terbaik'
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: 'Chatbot Assistant',
      description: 'Asisten AI 24/7 untuk menjawab pertanyaan seputar karir dan interview'
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: 'Task Manager',
      description: 'Kelola proses rekrutmen dengan sistem task management terintegrasi'
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: 'Smart Calendar',
      description: 'Jadwalkan interview dan meeting dengan sinkronisasi otomatis'
    },
    {
      icon: <Video className="w-8 h-8" />,
      title: 'Video Interview',
      description: 'Platform video interview terintegrasi dengan recording dan assessment'
    }
  ];

  const fetchJobs = async () => {
    setLoading(true);
    try {
      // Fetch all jobs tanpa filter category di API
      const res = await fetch('/api/jobs');
      const data = (await res.json()) as { jobs: Job[] };

      setJobs(data.jobs || []);
      
      // Build categories dengan jumlah data
      const categoryCounts: Record<string, number> = {};
      data.jobs.forEach(job => {
        categoryCounts[job.category] = (categoryCounts[job.category] || 0) + 1;
      });
      
      const uniqueCategories = Object.keys(categoryCounts).sort();
      setCategories(['All', ...uniqueCategories]);
    } catch (error) {
      console.error('Fetch jobs error:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const displayedJobs = filteredJobs.slice(0, 6);

  // Hitung jumlah job per kategori
  const getCategoryCount = (category: string) => {
    if (category === 'All') return jobs.length;
    return jobs.filter(job => job.category === category).length;
  };

  // Warna untuk setiap kategori badge
  const getCategoryBadgeColor = (category: string) => {
    const colors: Record<string, string> = {
      'Software Engineering': 'bg-blue-100 text-blue-700',
      'Product Design': 'bg-purple-100 text-purple-700',
      'Data Science': 'bg-green-100 text-green-700',
      'Marketing': 'bg-pink-100 text-pink-700',
      'Sales': 'bg-orange-100 text-orange-700',
      'Customer Success': 'bg-teal-100 text-teal-700',
      'IT': 'bg-indigo-100 text-indigo-700',
      'Psychology': 'bg-rose-100 text-rose-700',
      'Finance': 'bg-emerald-100 text-emerald-700',
      'Human Resources': 'bg-cyan-100 text-cyan-700',
      'Operations': 'bg-amber-100 text-amber-700',
      'Legal': 'bg-violet-100 text-violet-700',
      'Other': 'bg-gray-100 text-gray-700'
    };
    
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-blue-700">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 text-center">
        <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 tracking-tight">
          Hirely: Hire Early
        </h1>
        <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto">
          Platform rekrutmen berbasis AI yang membantu perusahaan menemukan talenta terbaik lebih cepat dan efisien
        </p>

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-2 flex items-center gap-2">
          <div className="flex-1 flex items-center gap-3 px-4">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari posisi, perusahaan, atau skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-4 outline-none text-gray-700 text-lg"
            />
          </div>
          <button className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-600 transition-all">
            Cari Pekerjaan
          </button>
        </div>
      </div>

      {/* Job Categories & Listings Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Jelajahi Kategori</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Categories - Mobile Dropdown */}
            <div className="lg:hidden">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-4 rounded-lg bg-white border-2 border-gray-200 text-gray-700 font-medium focus:border-blue-500 focus:outline-none"
              >
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category} ({getCategoryCount(category)})
                  </option>
                ))}
              </select>
            </div>

            {/* Categories - Desktop Sidebar */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-4 max-h-[600px] overflow-y-auto space-y-2 pr-2">
                {categories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedCategory(category)}
                    className={`block w-full text-left p-4 rounded-lg transition-all
                      ${selectedCategory === category ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}
                    `}
                  >
                    <div className="flex justify-between items-center gap-3">
                      <span className="font-medium flex-1">{category}</span>
                      <span className={`text-sm font-bold px-3 py-1 rounded-full min-w-[36px] text-center
                        ${selectedCategory === category ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}
                      `}>
                        {getCategoryCount(category)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Job Listings */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="text-center py-16">
                  <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-gray-600">Memuat lowongan...</p>
                </div>
              ) : displayedJobs.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-xl">
                  <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">Belum ada lowongan tersedia</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {displayedJobs.map((job) => (
                    <a
                      key={job.id}
                      href={`/jobs/${job.id}`}
                      className="block p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all bg-white"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h3>
                          <p className="text-gray-600">{job.company}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryBadgeColor(job.category)}`}>
                          {job.category}
                        </span>
                      </div>
                      <div className="flex gap-4 text-sm text-gray-500">
                        {job.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </span>
                        )}
                        {job.salary && (
                          <span className="flex items-center gap-1 font-semibold text-blue-600">
                            {new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                              maximumFractionDigits: 0,
                            }).format(Number(job.salary))}
                          </span>
                        )}
                      </div>
                    </a>
                  ))}

                  {filteredJobs.length > 6 && (
                    <div className="text-center pt-6">
                      <a
                        href="/jobs"
                        className="inline-block bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-600 transition-all"
                      >
                        Lihat Semua Lowongan ({filteredJobs.length})
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Fitur Unggulan</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Teknologi terdepan untuk mempercepat proses rekrutmen Anda
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <a
                key={index}
                href="#"
                className="p-8 rounded-2xl bg-white border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-gradient-to-br from-blue-900 to-slate-900 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Mengenal Hirely</h2>
          <p className="text-lg text-blue-100 leading-relaxed mb-8">
            Hirely adalah platform rekrutmen modern yang menggunakan kecerdasan buatan untuk menyederhanakan proses pencarian kandidat. Kami membantu perusahaan menemukan talenta yang tepat lebih cepat dengan teknologi screening otomatis, interview management, dan analytics yang canggih. Dengan Hirely, Anda bisa fokus pada hal yang paling penting: membangun tim yang luar biasa.
          </p>
        </div>
      </div>

      {/* Creator Section */}
      <div className="bg-white py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full flex items-center justify-center text-white font-bold">
              H
            </div>
            <div className="text-sm">
              <p className="text-gray-600">Created by</p>
              <p className="font-semibold text-gray-900">Hirely Team</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}