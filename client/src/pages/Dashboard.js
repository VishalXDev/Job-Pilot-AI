import { useEffect, useState } from 'react';

// Mock API for demonstration
const mockAPI = {
  get: async (url) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      data: [
        {
          _id: '1',
          company: 'Google',
          position: 'Senior Software Engineer',
          location: 'Mountain View, CA',
          status: 'Interview',
          notes: 'Great team culture, looking for React expertise',
          dateApplied: '2024-01-15'
        },
        {
          _id: '2',
          company: 'Microsoft',
          position: 'Frontend Developer',
          location: 'Seattle, WA',
          status: 'Applied',
          notes: 'Submitted through LinkedIn, waiting for response',
          dateApplied: '2024-01-10'
        },
        {
          _id: '3',
          company: 'Apple',
          position: 'UI/UX Developer',
          location: 'Cupertino, CA',
          status: 'Offer',
          notes: 'Excellent interview process, competitive salary offered',
          dateApplied: '2024-01-05'
        },
        {
          _id: '4',
          company: 'Netflix',
          position: 'Full Stack Developer',
          location: 'Los Gatos, CA',
          status: 'Rejected',
          notes: 'Good experience, they chose someone with more streaming experience',
          dateApplied: '2024-01-01'
        },
        {
          _id: '5',
          company: 'Amazon',
          position: 'Cloud Engineer',
          location: 'Austin, TX',
          status: 'Interview',
          notes: 'Technical round scheduled for next week',
          dateApplied: '2024-01-20'
        }
      ]
    };
  },
  post: async (url, data) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: { ...data, _id: Date.now().toString(), dateApplied: data.dateApplied || new Date().toISOString().split('T')[0] } };
  },
  put: async (url, data) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data };
  },
  delete: async (url) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: {} };
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const statusColorMap = {
  'Applied': 'bg-blue-100 text-blue-800 border border-blue-200',
  'Interview': 'bg-amber-100 text-amber-800 border border-amber-200',
  'Offer': 'bg-emerald-100 text-emerald-800 border border-emerald-200',
  'Rejected': 'bg-red-100 text-red-800 border border-red-200'
};

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    location: '',
    status: 'Applied',
    notes: '',
    dateApplied: new Date().toISOString().split('T')[0]
  });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getJobs = async () => {
    setLoading(true);
    try {
      const res = await mockAPI.get('/jobs');
      setJobs(res.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getJobs();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        const wasOffer = jobs.find(j => j._id === editingId)?.status === 'Offer';
        const isNowOffer = formData.status === 'Offer';
        if (!wasOffer && isNowOffer) {
          // Trigger confetti
          if (typeof window !== 'undefined') {
            const confetti = await import('canvas-confetti');
            confetti.default({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });
          }
        }
        await mockAPI.put(`/jobs/${editingId}`, formData);
        setJobs(jobs.map(job => job._id === editingId ? { ...job, ...formData } : job));
      } else {
        if (formData.status === 'Offer') {
          // Trigger confetti for new offers
          if (typeof window !== 'undefined') {
            const confetti = await import('canvas-confetti');
            confetti.default({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });
          }
        }
        const res = await mockAPI.post('/jobs', formData);
        setJobs([...jobs, res.data]);
      }
      setFormData({ 
        company: '', 
        position: '', 
        location: '', 
        status: 'Applied', 
        notes: '',
        dateApplied: new Date().toISOString().split('T')[0]
      });
      setShowForm(false);
      setEditingId(null);
    } catch (error) {
      console.error('Error saving job:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job application?')) {
      try {
        await mockAPI.delete(`/jobs/${id}`);
        setJobs(jobs.filter(job => job._id !== id));
      } catch (error) {
        console.error('Error deleting job:', error);
      }
    }
  };

  const handleEdit = (job) => {
    setFormData({
      company: job.company,
      position: job.position,
      location: job.location,
      status: job.status,
      notes: job.notes,
      dateApplied: job.dateApplied || new Date().toISOString().split('T')[0]
    });
    setEditingId(job._id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setFormData({ 
      company: '', 
      position: '', 
      location: '', 
      status: 'Applied', 
      notes: '',
      dateApplied: new Date().toISOString().split('T')[0]
    });
    setShowForm(false);
    setEditingId(null);
  };

  const getStatusStats = () => {
    const stats = jobs.reduce((acc, job) => {
      acc[job.status] = (acc[job.status] || 0) + 1;
      return acc;
    }, {});
    return stats;
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || job.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = getStatusStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header with improved styling */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-xl">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.049 23.049 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0v2.5a2.5 2.5 0 01-2.5 2.5H8.5A2.5 2.5 0 016 10.5V8m8-2H8m4 14v-2m-2-2h4m-4 0v2m0 0h4" />
              </svg>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-3">
              Career Dashboard
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Track your job applications with style and stay organized on your career journey
            </p>
          </div>

          {/* Enhanced Stats Cards with animations */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Applications</p>
                  <p className="text-3xl font-bold text-gray-900">{jobs.length}</p>
                  <p className="text-xs text-gray-500 mt-1">All time</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-2xl group-hover:bg-blue-200 transition-colors duration-300">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Interviews</p>
                  <p className="text-3xl font-bold text-amber-500">{stats.Interview || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">In progress</p>
                </div>
                <div className="p-3 bg-amber-100 rounded-2xl group-hover:bg-amber-200 transition-colors duration-300">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Offers</p>
                  <p className="text-3xl font-bold text-emerald-500">{stats.Offer || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">Success rate</p>
                </div>
                <div className="p-3 bg-emerald-100 rounded-2xl group-hover:bg-emerald-200 transition-colors duration-300">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Response Rate</p>
                  <p className="text-3xl font-bold text-purple-500">
                    {jobs.length > 0 ? Math.round(((stats.Interview || 0) / jobs.length) * 100) : 0}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Conversion</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-2xl group-hover:bg-purple-200 transition-colors duration-300">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar with Search and Filter */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search applications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-full sm:w-64"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-full sm:w-auto"
                >
                  <option value="All">All Status</option>
                  <option value="Applied">Applied</option>
                  <option value="Interview">Interview</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>{editingId ? 'Update Application' : 'Add New Application'}</span>
              </button>
            </div>
          </div>

          {/* Enhanced Form with animation */}
          {showForm && (
            <div className="mb-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8 animate-in slide-in-from-top duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingId ? '✏️ Edit Application' : '➕ Add New Application'}
                </h2>
                <button
                  onClick={handleCancel}
                  className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-all duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Company *</label>
                  <input
                    type="text"
                    name="company"
                    placeholder="Enter company name"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Position *</label>
                  <input
                    type="text"
                    name="position"
                    placeholder="Enter job position"
                    value={formData.position}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Location</label>
                  <input
                    type="text"
                    name="location"
                    placeholder="Enter location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Date Applied</label>
                  <input
                    type="date"
                    name="dateApplied"
                    value={formData.dateApplied}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700">Notes</label>
                  <textarea
                    name="notes"
                    placeholder="Add any notes about this application..."
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none"
                  />
                </div>
                <div className="flex justify-end space-x-4 pt-4 md:col-span-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-3 text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-70 disabled:transform-none disabled:hover:shadow-lg"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {editingId ? 'Updating...' : 'Adding...'}
                      </span>
                    ) : (
                      editingId ? 'Update Application' : 'Add Application'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Enhanced Job Applications List with Horizontal Cards */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Your Applications ({filteredJobs.length})
              </h2>
              {filteredJobs.length > 0 && (
                <div className="text-sm text-gray-500">
                  {searchTerm && `Search: "${searchTerm}"`}
                  {filterStatus !== 'All' && `Filter: ${filterStatus}`}
                </div>
              )}
            </div>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading applications...</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-8xl mb-4">🔍</div>
                <p className="text-gray-600 text-lg">
                  {searchTerm || filterStatus !== 'All' ? 'No applications match your criteria' : 'No applications yet. Add your first one!'}
                </p>
                {!(searchTerm || filterStatus !== 'All') && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2 mx-auto"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Add Your First Application</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredJobs.map((job, index) => (
                  <div 
                    key={job._id} 
                    className="group relative overflow-hidden bg-gradient-to-r from-white/90 via-blue-50/80 to-indigo-50/80 backdrop-blur-sm border-2 border-white/30 rounded-3xl p-6 hover:shadow-2xl hover:border-blue-200 transition-all duration-500 transform hover:-translate-y-1 animate-in slide-in-from-bottom"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Decorative gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Top decorative line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative z-10 flex items-center justify-between">
                      {/* Left side - Main content */}
                      <div className="flex items-center space-x-6 flex-1">
                        {/* Company Avatar with gradient */}
                        <div className="relative">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                            {job.company.charAt(0).toUpperCase()}
                          </div>
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                        </div>
                        
                        {/* Job Information */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-2">
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-300">
                              {job.position}
                            </h3>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusColorMap[job.status]} transform group-hover:scale-105 transition-transform duration-200`}>
                              {job.status}
                            </span>
                          </div>
                          
                          <p className="text-gray-700 font-semibold text-lg mb-3 group-hover:text-gray-900 transition-colors duration-300">
                            {job.company}
                          </p>
                          
                          <div className="flex items-center space-x-6 text-sm text-gray-600">
                            {job.location && (
                              <div className="flex items-center space-x-1 group-hover:text-blue-600 transition-colors duration-300">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="font-medium">{job.location}</span>
                              </div>
                            )}
                            <div className="flex items-center space-x-1 group-hover:text-blue-600 transition-colors duration-300">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span className="font-medium">{formatDate(job.dateApplied)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Right side - Notes and Actions */}
                      <div className="flex items-center space-x-4">
                        {/* Notes Preview */}
                        {job.notes && (
                          <div className="hidden md:block max-w-xs">
                            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-gray-200/50 group-hover:border-blue-200 transition-all duration-300 group-hover:shadow-md">
                              <p className="text-sm text-gray-700 truncate" title={job.notes}>
                                📝 {job.notes}
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {/* Action buttons */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit(job)}
                            className="p-3 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-200 transform hover:scale-110 shadow-md hover:shadow-lg"
                            title="Edit application"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(job._id)}
                            className="p-3 text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded-xl transition-all duration-200 transform hover:scale-110 shadow-md hover:shadow-lg"
                            title="Delete application"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Mobile notes section */}
                    {job.notes && (
                      <div className="md:hidden mt-4 pt-4 border-t border-gray-200/50">
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-gray-200/50">
                          <p className="text-sm text-gray-700">📝 {job.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}