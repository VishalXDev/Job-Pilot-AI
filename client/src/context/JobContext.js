import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/api';

const JobContext = createContext();

export function JobProvider({ children }) {
  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    const token = localStorage.getItem('token');
    if (!token) return; // 🔐 Skip fetching if no token

    try {
      const res = await API.get('/jobs');
      setJobs(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch jobs:', err);
    }
  };

  useEffect(() => {
    fetchJobs(); // 🔄 Only fetch if token exists
  }, []);

  return (
    <JobContext.Provider value={{ jobs, setJobs, fetchJobs }}>
      {children}
    </JobContext.Provider>
  );
}

export function useJobs() {
  return useContext(JobContext);
}
