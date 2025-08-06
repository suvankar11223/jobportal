import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { getCompanyLogoSrc } from '../utils/companyLogos';
import { USER_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';

export default function JobCard({ job, onAuthRequired }) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector(store => store.auth);

  const logoSrc = getCompanyLogoSrc(job.company);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      if (!user) return; // Don't fetch if not logged in
      try {
        const res = await axios.get(`${USER_API_END_POINT}/savedJobs`, { withCredentials: true });
        const savedJobs = res.data?.jobs || [];
        if (savedJobs.some((j) => j._id === job._id)) setSaved(true);
      } catch (err) {
        console.error("Failed to fetch saved jobs", err);
      }
    };
    fetchSavedJobs();
  }, [job._id, user]);

  const handleSaveJob = async (e) => {
    e.stopPropagation();
    if (!user) {
      onAuthRequired && onAuthRequired();
      return;
    }
    if (loading) return;
    setLoading(true);

    try {
      let res;
      if (saved) {
        res = await axios.delete(`${USER_API_END_POINT}/unsaveJob/${job._id}`, { 
          withCredentials: true,
          timeout: 10000 // 10 second timeout
        });
        if (res.data.success) {
          setSaved(false);
          toast.success('Job removed from saved jobs');
        } else {
          throw new Error(res.data.message || 'Failed to unsave job');
        }
      } else {
        res = await axios.post(`${USER_API_END_POINT}/saveJob/${job._id}`, {}, { 
          withCredentials: true,
          timeout: 10000 // 10 second timeout
        });
        if (res.data.success) {
          setSaved(true);
          toast.success('Job saved successfully');
        } else {
          throw new Error(res.data.message || 'Failed to save job');
        }
      }
    } catch (err) {
      console.error("Failed to save/unsave job:", err);
      
      // Handle different types of errors
      if (err.code === 'ECONNABORTED') {
        toast.error('Request timeout. Please check your connection and try again.');
      } else if (err.response?.status === 400) {
        toast.error(err.response?.data?.message || 'Invalid request. Please try again.');
      } else if (err.response?.status === 401) {
        toast.error('You need to be logged in to save jobs.');
      } else if (err.response?.status >= 500) {
        toast.error('Server error. Please try again later.');
      } else {
        toast.error(err.response?.data?.message || 'Failed to save/unsave job. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleJobClick = () => {
    if (!user) {
      onAuthRequired && onAuthRequired();
      return;
    }
    navigate(`/description/${job._id}`);
  };

  return (
    <div 
      className="group relative bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-2xl hover:border-purple-300 transition-all duration-500 cursor-pointer transform hover:-translate-y-2 overflow-hidden backdrop-blur-sm"
      onClick={handleJobClick}
    >
      {/* Gradient Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-transparent to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
      
      <div className="relative z-10">
        {/* Company Logo & Save Button */}
        <div className="flex items-start justify-between mb-6">
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-100 via-white to-blue-100 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300 ring-2 ring-white">
            <img
              src={logoSrc}
              alt={`${typeof job.company === "string" ? job.company : job.company?.name} logo`}
              className="w-12 h-12 object-contain"
              onError={(e) => { e.target.onerror = null; e.target.src = '/logos/default-logo.svg'; }}
            />
          </div>
          {user && (
            <Button
              onClick={handleSaveJob}
              disabled={loading}
              variant="ghost"
              size="sm"
              className={`rounded-full w-10 h-10 p-0 transition-all duration-300 backdrop-blur-sm border ${saved ? 'text-purple-600 bg-purple-50 border-purple-200 hover:bg-purple-100 shadow-md' : 'text-gray-400 bg-white/80 border-gray-200 hover:text-purple-600 hover:bg-purple-50 hover:border-purple-200'} group-hover:scale-110`}
            >
              {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </Button>
          )}
        </div>

        {/* Company Name */}
        <div className="mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border border-purple-200">
            {typeof job.company === "string" ? job.company : job.company?.name}
          </span>
        </div>
        
        {/* Job Title */}
        <h2 className="font-bold text-2xl text-gray-900 mb-4 line-clamp-2 leading-tight group-hover:text-purple-900 transition-colors duration-300">
          {job.title}
        </h2>

        {/* Location */}
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center mr-2">
            <svg className="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <span className="font-medium">{job.location || 'Remote'}</span>
        </div>
        
        {/* Job Description */}
        <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed text-sm">
          {job.description}
        </p>

        {/* Job Details Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 group-hover:border-purple-100 transition-colors duration-300">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-sm font-semibold text-emerald-600">{job.position} Positions</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">₹{job.salary} LPA</span>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <div className="w-3 h-3 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="w-2 h-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-medium">Full-time</span>
            </div>
            <span className="text-xs text-gray-400">Click to {user ? 'view details' : 'sign in'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

JobCard.propTypes = {
  job: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    company: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        name: PropTypes.string,
      }),
    ]),
    location: PropTypes.string,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
  }).isRequired,
};
