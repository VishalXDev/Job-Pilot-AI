import { useState } from 'react';
import API from '../api/api';

export default function AIAssistant() {
  const [resume, setResume] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    } catch (err) {
      setError('❌ Failed to generate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🧠 AI Resume Assistant</h1>

      <div className="mb-4">
        <label className="block font-semibold mb-1">📄 Your Resume:</label>
        <textarea
          rows={6}
          value={resume}
          onChange={(e) => setResume(e.target.value)}
          placeholder="Paste your resume text here..."
          className="w-full p-3 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">💼 Job Description:</label>
        <textarea
          rows={6}
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
          placeholder="Paste the job description here..."
          className="w-full p-3 border rounded"
        />
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => handleGenerate('resume')}
          disabled={loading}
          className={`px-4 py-2 rounded text-white transition ${
            loading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          ✍️ Resume Suggestions
        </button>
        <button
          onClick={() => handleGenerate('cover')}
          disabled={loading}
          className={`px-4 py-2 rounded text-white transition ${
            loading ? 'bg-green-300' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          📧 Generate Cover Letter
        </button>
      </div>

      {loading && <p className="text-sm text-gray-500">⏳ Generating...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {result && (
        <div className="bg-gray-50 p-4 border rounded mt-4 whitespace-pre-wrap">
          <h2 className="font-semibold mb-2">✨ AI Output:</h2>
          {result}
        </div>
      )}
    </div>
  );
}
