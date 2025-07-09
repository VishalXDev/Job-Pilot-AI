import { useState } from 'react';
import API from '../api/api';

export default function AIAssistant() {
  const [resume, setResume] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('input');

  const handleGenerate = async (type) => {
    setLoading(true);
    setResult('');
    setError('');
    try {
      const endpoint = type === 'resume' ? '/ai/resume' : '/ai/cover-letter';
      const res = await API.post(endpoint, {
        resumeText: resume,
        jobDescription: jobDesc,
      });
      setResult(res.data.result || res.data);
      setActiveTab('output');
    } catch (err) {
      setError('❌ Failed to generate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 p-4">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-bounce"></div>
      </div>

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite ${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-blue-500 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1M6.5 6.5l.7.7M17.5 6.5l-.7.7M9.663 17h4.673M12 3v1M6.5 6.5l.7.7M17.5 6.5l-.7.7" />
                </svg>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-sm">✨</span>
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 animate-fade-in">AI Resume Assistant</h1>
          <p className="text-gray-300">Powered by advanced AI to optimize your career materials</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2 flex space-x-2">
            <button
              onClick={() => setActiveTab('input')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'input'
                  ? 'bg-purple-500 text-white shadow-lg scale-105'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              📝 Input
            </button>
            <button
              onClick={() => setActiveTab('output')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'output'
                  ? 'bg-purple-500 text-white shadow-lg scale-105'
                  : 'text-gray-300 hover:text-white hover:bg-2/10'
              }`}
            >
              ✨ Output
            </button>
          </div>
        </div>

        {/* Input Tab */}
        {activeTab === 'input' && (
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl transform transition-all duration-500 animate-fade-in">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Resume Input */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <label className="text-xl font-semibold text-white">Your Resume</label>
                </div>
                <textarea
                  rows={8}
                  value={resume}
                  onChange={(e) => setResume(e.target.value)}
                  placeholder="Paste your resume text here..."
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all duration-300 hover:bg-white/20 resize-none"
                />
              </div>

              {/* Job Description Input */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.96 23.96 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0v3.5a2 2 0 01-2 2H8a2 2 0 01-2-2V6m2 0v-2" />
                    </svg>
                  </div>
                  <label className="text-xl font-semibold text-white">Job Description</label>
                </div>
                <textarea
                  rows={8}
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                  placeholder="Paste the job description here..."
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all duration-300 hover:bg-white/20 resize-none"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-6 mt-8">
              <button
                onClick={() => handleGenerate('resume')}
                disabled={loading}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-2xl shadow-xl transition-all duration-300 hover:from-blue-600 hover:to-purple-600 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.5H3v-3.5L16.732 3.732z" />
                  </svg>
                  <span>Resume Suggestions</span>
                </span>
              </button>

              <button
                onClick={() => handleGenerate('cover')}
                disabled={loading}
                className="group relative px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-2xl shadow-xl transition-all duration-300 hover:from-green-600 hover:to-emerald-600 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.6a1.44 1.44 0 001.322 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Generate Cover Letter</span>
                </span>
              </button>
            </div>

            {/* Status Messages */}
            {loading && (
              <div className="flex justify-center mt-6">
                <div className="flex items-center space-x-3 bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 rounded-xl px-6 py-3">
                  <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-purple-200">AI is processing your request...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="flex justify-center mt-6">
                <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-xl px-6 py-3 animate-shake">
                  <span className="text-red-200">{error}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Output Tab */}
        {activeTab === 'output' && (
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl transform transition-all duration-500 animate-fade-in">
            {result ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1M6.5 6.5l.7.7M17.5 6.5l-.7.7M9.663 17h4.673M12 3v1M6.5 6.5l.7.7M17.5 6.5l-.7.7" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white">AI Generated Content</h2>
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(result)}
                    className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white transition-all duration-300 hover:scale-105"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>Copy</span>
                  </button>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-white/90 whitespace-pre-wrap font-mono text-sm leading-relaxed max-h-96 overflow-y-auto">
                  {result}
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1M6.5 6.5l.7.7M17.5 6.5l-.7.7M9.663 17h4.673M12 3v1M6.5 6.5l.7.7M17.5 6.5l-.7.7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2">No output yet</h3>
                <p className="text-gray-300">Generate content using the Input tab to see results here</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        /* Custom scrollbar for output */
        *::-webkit-scrollbar {
          width: 8px;
        }
        
        *::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        
        *::-webkit-scrollbar-thumb {
          background: rgba(147, 51, 234, 0.5);
          border-radius: 10px;
        }
        
        *::-webkit-scrollbar-thumb:hover {
          background: rgba(147, 51, 234, 0.7);
        }
        
        /* Enhanced hover effects */
        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        
        textarea:focus {
          transform: translateY(-2px);
          box-shadow: 0 20px 40px rgba(147, 51, 234, 0.3);
        }
        
        /* Responsive design */
        @media (max-width: 768px) {
          .grid-cols-2 {
            grid-template-columns: 1fr;
          }
          
          .flex-row {
            flex-direction: column;
          }
          
          .space-x-6 > * + * {
            margin-left: 0;
            margin-top: 1rem;
          }
        }
      `}</style>
    </div>
  );
}