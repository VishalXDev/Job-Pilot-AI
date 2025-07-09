import { useEffect, useState } from 'react';
import API from '../api/api';
import { formatDate } from '../utils/formatDate';
import { statusColorMap } from '../utils/statusColorMap';

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    location: '',
    status: 'Applied',
    notes: ''
  });

  const getJobs = async () => {
    const res = await API.get('/jobs');
    setJobs(res.data);
  };

  useEffect(() => {
    getJobs();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post('/jobs', formData);
    setFormData({ company: '', position: '', location: '', status: 'Applied', notes: '' });
    getJobs();
  };

  const handleDelete = async (id) => {
    await API.delete(`/jobs/${id}`);
    getJobs();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Job Dashboard</h1>

      <form onSubmit={handleSubmit} className="bg-white shadow p-4 rounded mb-6">
        <div className="grid grid-cols-2 gap-4">
          <input name="company" placeholder="Company" value={formData.company} onChange={handleChange} className="p-2 border rounded" required />
          <input name="position" placeholder="Position" value={formData.position} onChange={handleChange} className="p-2 border rounded" required />
          <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} className="p-2 border rounded" />
          <select name="status" value={formData.status} onChange={handleChange} className="p-2 border rounded">
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <textarea name="notes" placeholder="Notes..." value={formData.notes} onChange={handleChange} className="w-full mt-2 p-2 border rounded" rows={3}></textarea>
        <button type="submit" className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Add Job</button>
      </form>

      <div className="space-y-4">
        {jobs.map(job => (
          <div key={job._id} className="bg-gray-50 border p-4 rounded flex justify-between items-center">
            <div>
              <p className="font-semibold">{job.position} @ {job.company}</p>
              <p className={`text-xs inline-block px-2 py-1 mt-1 rounded ${statusColorMap[job.status]}`}>
                {job.status}
              </p>
              <p className="text-sm text-gray-600 mt-1">Applied on: {formatDate(job.dateApplied)}</p>
            </div>
            <button onClick={() => handleDelete(job._id)} className="text-red-600 hover:underline">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
