'use client'

import { useState, useEffect } from 'react';
import { Search, Briefcase, Users, Calendar, MessageSquare, FileCheck, Video, CheckCircle, MapPin, DollarSign, ArrowRight, Bell, Sparkles, Target, Zap, Star, Building2, Clock, ArrowLeft, X, Upload } from 'lucide-react';

interface Job {
  id: string
  title: string
  company: string
  location: string
  salary: string
  createdAt: string
  category: string
  description?: string
}

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showMobileDetail, setShowMobileDetail] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [applying, setApplying] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/jobs');
      const data = (await res.json()) as { jobs: Job[] };

      setJobs(data.jobs || []);
      
      const categoryCounts: Record<string, number> = {};
      (data.jobs || []).forEach(job => {
        categoryCounts[job.category] = (categoryCounts[job.category] || 0) + 1;
      });
      
      const uniqueCategories = Object.keys(categoryCounts).sort();
      setCategories(['All', ...uniqueCategories]);
      
      if (data.jobs && data.jobs.length > 0) {
        setSelectedJob(data.jobs[0]);
      }
    } catch (error) {
      console.error('Fetch jobs error:', error);
      setJobs([]);
      setCategories(['All']);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = searchQuery === '' ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const displayedJobs = filteredJobs.slice(0, 6);

  const getCategoryCount = (category: string) => {
    if (category === 'All') return jobs.length;
    return jobs.filter(job => job.category === category).length;
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  const handleJobClick = (job: Job) => {
    window.location.href = `/jobs/${job.id}`;
  };

  const handleApply = async () => {
    if (!cvFile || !selectedJob) return;

    setApplying(true);
    try {
      setTimeout(() => {
        alert('Application submitted successfully!');
        setCvFile(null);
        setApplying(false);
      }, 1500);
    } catch (err) {
      alert('Error submitting application');
      setApplying(false);
    }
  };

  // Mobile Detail View
  if (showMobileDetail && selectedJob) {
    return (
      <div className="min-h-screen bg-gray-50 lg:hidden">
        <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
          <button
            onClick={() => setShowMobileDetail(false)}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Jobs</span>
          </button>
        </div>

        <div className="px-4 py-6">
          <div className="mb-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center border-2 border-orange-700/20 flex-shrink-0">
                <Building2 className="w-8 h-8" style={{ color: '#722F37' }} />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 break-words">{selectedJob.title}</h1>
                <p className="text-base sm:text-lg text-gray-700 font-medium mb-1 break-words">{selectedJob.company}</p>
                <p className="text-xs sm:text-sm text-gray-500">www.{selectedJob.company.toLowerCase().replace(/\s+/g, '')}.com</p>
              </div>
            </div>

            <div className="flex gap-2 mb-4 flex-wrap">
              <span className="bg-green-100 text-green-700 text-xs sm:text-sm font-semibold px-3 py-1 rounded-full">New</span>
              <span className="bg-orange-100 text-orange-700 text-xs sm:text-sm font-semibold px-3 py-1 rounded-full">Urgent</span>
            </div>

            <div className="space-y-3 text-sm mb-6">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="font-semibold text-gray-900">{selectedJob.location || 'Remote'}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="font-semibold text-gray-900">Rp {Number(selectedJob.salary).toLocaleString('id-ID')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="font-semibold text-gray-900">Full-time</span>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Description</h2>
            <div className="text-sm sm:text-base text-gray-700 leading-relaxed space-y-4">
              {selectedJob.description ? (
                <div className="whitespace-pre-wrap">{selectedJob.description}</div>
              ) : (
                <>
                  <p>Join our team and make an impact with your skills and experience.</p>
                  <p>We are looking for talented professionals to help us grow and achieve our goals.</p>
                </>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Apply Now</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Upload CV (PDF) *</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                  className="w-full border-2 border-dashed border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 bg-white text-xs sm:text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-orange-700 file:text-white hover:file:bg-orange-600 transition-all cursor-pointer"
                />
                {cvFile && (
                  <p className="mt-2 text-xs sm:text-sm text-gray-600 flex items-center gap-2 break-all">
                    <span className="font-medium">{cvFile.name}</span>
                    <button 
                      type="button"
                      onClick={() => setCvFile(null)}
                      className="text-red-500 hover:text-red-700 flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </p>
                )}
              </div>

              <button
                onClick={handleApply}
                disabled={applying || !cvFile}
                className="w-full text-white px-4 sm:px-6 py-3 rounded-lg font-semibold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                style={{ background: applying || !cvFile ? '#ccc' : '#722F37' }}
              >
                {applying ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    <span>Submit Application</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        :root {
          --primary: #EFDFBB;
          --wine: #722F37;
          --wine-dark: #5a2430;
          --wine-light: #8b3a42;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-20px) translateX(10px); }
          66% { transform: translateY(-10px) translateX(-10px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-15px) translateX(-10px); }
          66% { transform: translateY(-25px) translateX(5px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          50% { transform: translateY(-30px) translateX(15px) rotate(5deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(114, 47, 55, 0.4); }
          50% { box-shadow: 0 0 40px rgba(114, 47, 55, 0.6); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 7s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        @media (max-width: 640px) {
          .animate-float,
          .animate-float-delayed,
          .animate-float-slow,
          .animate-pulse-glow {
            animation: none;
          }
        }
      `}</style>

      {/* Hero Section */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(to bottom right, #faf8f3, #f3efea, #faf8f3)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-24 sm:pb-32">
          <div className="text-center max-w-4xl mx-auto relative z-10">            
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-tight" style={{ color: '#2d2620' }}>
              Hirely
              <br />
              <span style={{ background: 'linear-gradient(to right, #722F37, #8b3a42, #722F37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Hire, EARLY.
              </span>
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-2" style={{ color: '#6b5d54' }}>
              Our AI-powered bot scans thousands of listings and uses smart algorithms to find the roles that best fit your skills and preferences.
            </p>
          </div>

          {/* Floating Cards - Hidden on mobile, visible on tablet+ */}
          <div className="relative max-w-6xl mx-auto h-0 sm:h-80 mt-0 sm:mt-12 hidden sm:block">
            <div className="absolute top-0 left-0 sm:left-12 bg-white rounded-2xl shadow-2xl p-5 w-64 sm:w-72 animate-float" style={{ borderColor: '#e8e1d9', borderWidth: '1px' }}>
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0" style={{ background: '#722F37' }}>P</div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-lg text-gray-900 truncate">Product Designer</h4>
                  <p className="text-sm mb-2 text-gray-500">DesignHub • Remote</p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="px-2 py-1 rounded-lg text-xs font-semibold" style={{ backgroundColor: '#f3efea', color: '#722F37' }}>Full-time</span>
                    <span className="px-2 py-1 rounded-lg text-xs font-semibold" style={{ backgroundColor: '#EFDFBB', color: '#722F37' }}>$12k</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 rounded-2xl shadow-2xl p-6 w-72 animate-float-delayed animate-pulse-glow hidden md:block" style={{ background: '#722F37' }}>
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <Target className="w-7 h-7" style={{ color: '#722F37' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-white text-xl truncate">UI/UX Designer</h4>
                  <p className="text-sm mb-3 text-gray-200">Creative Studio • Remote</p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="px-3 py-1 rounded-lg text-xs font-semibold" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}>Contract</span>
                    <span className="px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}>
                      <Star className="w-3 h-3" /> Featured
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute top-8 right-0 sm:right-12 bg-white rounded-2xl shadow-2xl p-5 w-64 sm:w-72 animate-float-slow hidden md:block" style={{ borderColor: '#e8e1d9', borderWidth: '1px' }}>
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0" style={{ background: '#722F37' }}>F</div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-lg text-gray-900 truncate">Full-stack Developer</h4>
                  <p className="text-sm mb-2 text-gray-500">TechCorp • Remote</p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="px-2 py-1 rounded-lg text-xs font-semibold" style={{ backgroundColor: '#f3efea', color: '#722F37' }}>Remote</span>
                    <span className="px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1" style={{ backgroundColor: '#EFDFBB', color: '#722F37' }}>
                      <Zap className="w-3 h-3" /> Urgent
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-12 left-1/4 bg-white rounded-full px-4 py-2 shadow-lg animate-float hidden md:block" style={{ borderColor: '#ddd2c7', borderWidth: '1px' }}>
              <p className="text-sm font-semibold flex items-center gap-2" style={{ color: '#2d2620' }}>
                <Bell className="w-4 h-4" style={{ color: '#722F37' }} />
                15+ New Jobs Today
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold mb-4"
              style={{ backgroundColor: "#f3efea", color: "#722F37" }}
            >
              ✦ FEATURES
            </div>
            <h2
              className="text-3xl sm:text-5xl font-bold mb-4 sm:mb-6 tracking-tight px-2"
              style={{ color: "#2d2620" }}
            >
              All the Tools You Need
            </h2>
            <p
              className="text-base sm:text-xl max-w-3xl mx-auto px-2"
              style={{ color: "#6b5d54" }}
            >
              Empowering you with intelligent features to simplify your job search.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: Users, label: 'AI-Powered Matching', desc: 'Match with the best opportunities using advanced AI technology and machine learning.', color: 'from-purple-600 to-pink-600', bg: 'from-purple-50 to-pink-50', border: 'border-purple-100' },
              { icon: FileCheck, label: 'Smart CV Screening', desc: 'Automated CV analysis for finding the best candidates instantly.', color: 'from-blue-600 to-cyan-600', bg: 'from-blue-50 to-cyan-50', border: 'border-blue-100' },
              { icon: Bell, label: 'Job Alerts', desc: 'Real-time notifications for new opportunities matching your profile.', color: 'from-orange-600 to-yellow-600', bg: 'from-orange-50 to-yellow-50', border: 'border-orange-100' },
              { icon: CheckCircle, label: 'One-Click Apply', desc: 'Apply to multiple jobs quickly with one click and track progress.', color: 'from-green-600 to-emerald-600', bg: 'from-green-50 to-emerald-50', border: 'border-green-100' },
              { icon: MessageSquare, label: '24/7 AI Chatbot', desc: 'AI assistant available anytime for your questions and guidance.', color: 'from-rose-600 to-pink-600', bg: 'from-rose-50 to-pink-50', border: 'border-rose-100' },
              { icon: Calendar, label: 'Smart Calendar', desc: 'Schedule interviews with automatic sync across all devices.', color: 'from-indigo-600 to-purple-600', bg: 'from-indigo-50 to-purple-50', border: 'border-indigo-100' },
              { icon: Video, label: 'Career Coaching', desc: 'Professional guidance and tips to accelerate your career growth.', color: 'from-teal-600 to-cyan-600', bg: 'from-teal-50 to-cyan-50', border: 'border-teal-100' },
              { icon: Sparkles, label: 'Job Recommendations', desc: 'Personalized suggestions based on your profile and preferences.', color: 'from-amber-600 to-orange-600', bg: 'from-amber-50 to-orange-50', border: 'border-amber-100' },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className={`group bg-gradient-to-br ${item.bg} rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border ${item.border}`}>
                  <div className={`w-12 sm:w-14 h-12 sm:h-14 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform shadow-lg`}>
                    <Icon className="w-6 sm:w-7 h-6 sm:h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-2 sm:mb-3">{item.label}</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Job Listings Section */}
      <div id="jobs" className="py-16 sm:py-24" style={{ backgroundColor: '#faf8f3' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-5xl font-bold mb-2 sm:mb-4 tracking-tight px-2" style={{ color: '#2d2620' }}>Find Your Dream Job</h2>
            <p className="text-base sm:text-xl max-w-2xl mx-auto px-2" style={{ color: '#6b5d54' }}>
              Browse our latest job openings and apply today!
            </p>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-8 mb-8 sm:mb-12" style={{ borderColor: '#e8e1d9', borderWidth: '1px' }}>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1 flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl" style={{ borderColor: '#ddd2c7', borderWidth: '2px' }}>
                <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search job title or keyword"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full outline-none font-medium text-sm sm:text-base"
                  style={{ color: '#2d2620' }}
                />
              </div>
              <button className="text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold hover:shadow-xl transition-all text-sm sm:text-base" style={{ background: '#722F37' }}>
                Find jobs
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm p-4 sm:p-6 sticky top-20 lg:top-24" style={{ borderColor: '#e8e1d9', borderWidth: '1px' }}>
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h3 className="font-bold text-base sm:text-lg" style={{ color: '#2d2620' }}>Filters</h3>
                  <button 
                    onClick={() => {
                      setSelectedCategory('All');
                      setSearchQuery('');
                    }}
                    className="text-xs sm:text-sm font-semibold hover:opacity-75 transition"
                    style={{ color: '#722F37' }}
                  >
                    Clear all
                  </button>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 sm:mb-3 text-sm" style={{ color: '#2d2620' }}>Job Category</h4>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {categories.map((category, index) => (
                      <label key={index} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === category}
                          onChange={() => setSelectedCategory(category)}
                          className="w-4 h-4"
                          style={{ accentColor: '#722F37' }}
                        />
                        <span className="group-hover:font-semibold font-medium text-sm" style={{ color: '#6b5d54' }}>{category}</span>
                        <span className="ml-auto text-xs sm:text-sm font-semibold" style={{ color: '#999' }}>({getCategoryCount(category)})</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Job Cards */}
            <div className="lg:col-span-3">
              <div className="mb-4 sm:mb-6">
                <p className="text-base sm:text-lg">
                  <span className="font-bold" style={{ color: '#2d2620' }}>{filteredJobs.length}</span>
                  <span style={{ color: '#6b5d54' }}> Jobs found</span>
                </p>
              </div>

              {loading ? (
                <div className="text-center py-16 sm:py-20">
                  <div className="inline-block w-12 h-12 border-4 rounded-full animate-spin" style={{ borderColor: '#722F37', borderTopColor: 'transparent' }}></div>
                  <p className="mt-4 text-sm sm:text-base" style={{ color: '#6b5d54' }}>Loading jobs...</p>
                </div>
              ) : displayedJobs.length === 0 ? (
                <div className="text-center py-16 sm:py-20 bg-white rounded-2xl sm:rounded-3xl">
                  <Briefcase className="w-12 sm:w-16 h-12 sm:h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-base sm:text-lg" style={{ color: '#6b5d54' }}>No jobs found</p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {displayedJobs.map((job) => (
                    <div
                      key={job.id}
                      onClick={() => handleJobClick(job)}
                      className="bg-white rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-xl transition-all p-4 sm:p-6 cursor-pointer group"
                      style={{ borderColor: selectedJob?.id === job.id ? '#722F37' : '#e8e1d9', borderWidth: '1px', backgroundColor: selectedJob?.id === job.id ? '#faf8f3' : 'white' }}
                    >
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-lg sm:rounded-2xl flex items-center justify-center text-white font-bold text-lg sm:text-2xl flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform" style={{ background: '#722F37' }}>
                          {job.company.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 sm:mb-3 gap-2">
                            <div className="min-w-0">
                              <h3 className="text-lg sm:text-xl font-bold mb-1 truncate" style={{ color: '#2d2620' }}>{job.title}</h3>
                              <p className="font-medium text-sm sm:text-base truncate" style={{ color: '#6b5d54' }}>{job.company}</p>
                            </div>
                            <div className="flex gap-2 flex-wrap flex-shrink-0">
                              <span className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-xs font-bold whitespace-nowrap" style={{ backgroundColor: '#EFDFBB', color: '#722F37' }}>
                                Full-time
                              </span>
                              <span className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-xs font-bold text-white whitespace-nowrap" style={{ background: '#722F37' }}>
                                Urgent
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
                            <span className="flex items-center gap-1.5 font-medium" style={{ color: '#6b5d54' }}>
                              <MapPin className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">{job.location || 'Remote'}</span>
                            </span>
                            {job.salary && (
                              <span className="flex items-center gap-1.5 font-bold whitespace-nowrap" style={{ color: '#722F37' }}>
                                Rp {Number(job.salary).toLocaleString('id-ID')}
                              </span>
                            )}
                            <span className="font-medium flex-shrink-0" style={{ color: '#999' }}>
                              {getTimeAgo(job.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredJobs.length > 6 && (
                    <div className="text-center pt-6 sm:pt-8">
                      <button
                        className="text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-2xl font-semibold hover:shadow-xl hover:scale-105 transition-all inline-block text-sm sm:text-base"
                        style={{ background: "#722F37" }}
                      >
                        View All Jobs ({filteredJobs.length})
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div id="faq" className="bg-white py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold mb-4" style={{ backgroundColor: '#f3efea', color: '#722F37' }}>
              ✦ FAQ
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold mb-4 sm:mb-6 tracking-tight px-2" style={{ color: '#2d2620' }}>Everything You Need to Know</h2>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {[
              {
                q: 'How does AI help me find the right job?',
                a: 'Our AI analyzes your skills and preferences to match you with the most relevant job opportunities.'
              },
              {
                q: 'Do I need a detailed resume to get started?',
                a: 'You can start with basic information and update your profile as you go.'
              },
              {
                q: 'Is the platform free to use?',
                a: 'Yes! Hirely is completely free for job seekers.'
              },
            ].map((item, idx) => (
              <details key={idx} className="rounded-lg sm:rounded-2xl p-4 sm:p-6 shadow-sm group" style={{ backgroundColor: '#faf8f3', borderColor: '#ddd2c7', borderWidth: '1px' }}>
                <summary className="font-bold cursor-pointer flex items-center justify-between text-base sm:text-lg" style={{ color: '#2d2620' }}>
                  {item.q}
                  <span className="text-2xl sm:text-3xl transition-transform" style={{ color: '#722F37' }}>+</span>
                </summary>
                <p className="mt-3 sm:mt-4 leading-relaxed text-sm sm:text-base" style={{ color: '#6b5d54' }}>
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile App Section */}
      <div className="py-16 sm:py-24 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #5a2430 0%, #722F37 50%, #5a2430 100%)' }}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAgNHYyaDJ2LTJoLTJ6bS0yLTJ2Mmgydi0yaC0yem0wIDR2Mmgydi0yaC0yem0tMi0ydjJoMnYtMmgtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold text-white mb-4 sm:mb-6" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                📱 Mobile App
              </div>
              <h2 className="text-2xl sm:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight px-2">
                Take your job search anywhere
              </h2>
              <p className="text-base sm:text-xl mb-8 sm:mb-10 leading-relaxed px-2" style={{ color: '#f3efea' }}>
                Download our mobile app and access thousands of job opportunities right from your phone. Apply on the go and never miss an opportunity.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 px-2">
                <button className="text-gray-900 px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-2xl font-bold hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center sm:justify-start gap-3 text-sm sm:text-base flex-1 sm:flex-none" style={{ backgroundColor: '#EFDFBB' }}>
                  <span className="text-2xl sm:text-3xl">📱</span> 
                  <div className="text-left hidden sm:block">
                    <div className="text-xs" style={{ color: '#722F37' }}>Download on the</div>
                    <div className="text-sm" style={{ color: '#2d2620' }}>App Store</div>
                  </div>
                </button>
                <button className="text-gray-900 px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-2xl font-bold hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center sm:justify-start gap-3 text-sm sm:text-base flex-1 sm:flex-none" style={{ backgroundColor: '#EFDFBB' }}>
                  <span className="text-2xl sm:text-3xl">🤖</span> 
                  <div className="text-left hidden sm:block">
                    <div className="text-xs" style={{ color: '#722F37' }}>Get it on</div>
                    <div className="text-sm" style={{ color: '#2d2620' }}>Google Play</div>
                  </div>
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl sm:rounded-[3rem] p-8 sm:p-12 h-64 sm:h-[500px] flex items-center justify-center shadow-2xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.2)', borderWidth: '1px' }}>
                <div className="text-center text-white">
                  <div className="text-6xl sm:text-8xl mb-4 sm:mb-6">📱</div>
                  <p className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Hirely Mobile</p>
                  <p className="text-sm sm:text-base" style={{ color: '#f3efea' }}>Job search on the go</p>
                </div>
              </div>
              <div className="absolute -top-4 sm:-top-6 -right-4 sm:-right-6 bg-white rounded-lg sm:rounded-2xl p-3 sm:p-4 shadow-2xl hidden sm:block">
                <Star className="w-6 sm:w-8 h-6 sm:h-8" style={{ color: '#EFDFBB' }} />
              </div>
              <div className="absolute -bottom-4 sm:-bottom-6 -left-4 sm:-left-6 rounded-lg sm:rounded-2xl p-3 sm:p-4 shadow-2xl hidden sm:block" style={{ background: '#EFDFBB' }}>
                <CheckCircle className="w-6 sm:w-8 h-6 sm:h-8" style={{ color: '#722F37' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-white py-12 sm:py-16" style={{ backgroundColor: '#2d2620' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-lg" style={{ background: '#722F37' }}>
                  H
                </div>
                <span className="font-bold text-lg">Hirely</span>
              </div>
              <p className="leading-relaxed text-sm" style={{ color: '#ddd2c7' }}>
                Your AI-powered partner in finding the perfect career opportunity.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-base">For Job Seekers</h4>
              <ul className="space-y-2 sm:space-y-3 text-sm" style={{ color: '#ddd2c7' }}>
                <li><a href="#jobs" className="hover:text-white transition">Browse Jobs</a></li>
                <li><a href="#" className="hover:text-white transition">Career Advice</a></li>
                <li><a href="#" className="hover:text-white transition">Resume Builder</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-base">For Employers</h4>
              <ul className="space-y-2 sm:space-y-3 text-sm" style={{ color: '#ddd2c7' }}>
                <li><a href="#" className="hover:text-white transition">Post a Job</a></li>
                <li><a href="#" className="hover:text-white transition">Find Talent</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-base">Company</h4>
              <ul className="space-y-2 sm:space-y-3 text-sm" style={{ color: '#ddd2c7' }}>
                <li><a href="#faq" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm" style={{ borderTopColor: '#4a3d34', borderTopWidth: '1px' }}>
            <p style={{ color: '#ddd2c7' }}>© 2024 Hirely. All rights reserved.</p>
            <div className="flex gap-4 sm:gap-6">
              <a href="#" className="transition font-medium hover:text-white" style={{ color: '#ddd2c7' }}>Twitter</a>
              <a href="#" className="transition font-medium hover:text-white" style={{ color: '#ddd2c7' }}>LinkedIn</a>
              <a href="#" className="transition font-medium hover:text-white" style={{ color: '#ddd2c7' }}>Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}