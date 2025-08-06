import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import Navbar from './shared/Navbar';
import Job from './Job';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { USER_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      toast.error('Please login to view saved jobs');
      navigate('/login');
      return;
    }
    fetchSavedJobs();
  }, [user, navigate]);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${USER_API_END_POINT}/savedJobs`, { 
        withCredentials: true,
        timeout: 10000
      });
      if (res.data.success) {
        setSavedJobs(res.data.jobs || []);
      } else {
        toast.error('Failed to load saved jobs');
      }
    } catch (err) {
      console.error("Failed to fetch saved jobs:", err);
      if (err.response?.status === 401) {
        toast.error('Please login to view saved jobs');
      } else if (err.code === 'ECONNABORTED') {
        toast.error('Request timeout. Please check your connection.');
      } else {
        toast.error('Failed to load saved jobs. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUnsaveJob = async (jobId) => {
    try {
      const res = await axios.delete(`${USER_API_END_POINT}/unsaveJob/${jobId}`, { 
        withCredentials: true,
        timeout: 10000
      });
      if (res.data.success) {
        setSavedJobs(savedJobs.filter(job => job._id !== jobId));
        toast.success('Job removed from saved jobs');
      } else {
        toast.error('Failed to remove job from saved jobs');
      }
    } catch (err) {
      console.error("Failed to unsave job:", err);
      if (err.response?.status === 404) {
        toast.error('Job not found');
      } else if (err.code === 'ECONNABORTED') {
        toast.error('Request timeout. Please try again.');
      } else {
        toast.error('Failed to remove job. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto mt-5 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Saved Jobs</h1>
        
        {savedJobs.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-20"
          >
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-purple-100 rounded-full flex items-center justify-center">
                <Bookmark className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">No saved jobs yet</h3>
              <p className="text-gray-500 mb-6">Save jobs you're interested in to view them here later</p>
              <Link to="/jobs" className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors">
                Browse Jobs
              </Link>
            </div>
          </motion.div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {savedJobs.length} saved job{savedJobs.length !== 1 ? 's' : ''}
              </p>
              <button
                onClick={fetchSavedJobs}
                className="text-purple-600 hover:text-purple-800 font-medium transition-colors"
              >
                Refresh
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedJobs.map((job, index) => (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="relative group"
                >
                  <Job job={job} />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUnsaveJob(job._id);
                    }}
                    className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-lg hover:scale-110"
                    title="Remove from saved jobs"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;
