import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/api';
import { useAuth } from './AuthContext';

const JobContext = createContext();

export function JobProvider({ children }) {
  const [jobs, setJobs] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;

    const fetchJobs = async () => {
      try {
        const res = await API.get('/jobs', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setJobs(res.data);
      } catch (err) {
        console.error('❌ Failed to fetch jobs:', err.message);
      }
    };

    fetchJobs();
  }, [token]);

  return (
    <JobContext.Provider value={{ jobs, setJobs }}>
      {children}
    </JobContext.Provider>
  );
}

export function useJobs() {
  return useContext(JobContext);
}
