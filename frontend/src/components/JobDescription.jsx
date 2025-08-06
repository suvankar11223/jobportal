import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT, USER_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { ArrowLeft, MapPin, Calendar, Users, DollarSign, Clock, Building, FileText, Upload, CheckCircle, Bookmark, BookmarkCheck } from 'lucide-react';
import { getCompanyLogoSrc } from '../utils/companyLogos';
import Navbar from './shared/Navbar';
import SuccessAnimation from './SuccessAnimation';

const JobDescription = () => {
    const {singleJob} = useSelector(store => store.job);
    const {user} = useSelector(store=>store.auth);
    const isIntiallyApplied = singleJob?.applications?.some(application => application.applicant === user?._id) || false;
    const [isApplied, setIsApplied] = useState(isIntiallyApplied);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [resume, setResume] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [savingJob, setSavingJob] = useState(false);
    const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
    
    const params = useParams();
    const jobId = params.id;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const logoSrc = getCompanyLogoSrc(singleJob?.company);

    const handleResumeChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                toast.error('Please upload a PDF file only');
                return;
            }
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error('File size should be less than 5MB');
                return;
            }
            setResume(file);
        }
    };

    const applyJobHandler = async () => {
        if (!resume) {
            toast.error('Please upload your resume first');
            return;
        }

        setIsUploading(true);
        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {withCredentials:true});
            
            if(res.data.success){
                setIsApplied(true);
                const updatedSingleJob = {...singleJob, applications:[...singleJob.applications,{applicant:user?._id}]}
                dispatch(setSingleJob(updatedSingleJob));
                setIsDialogOpen(false);
                setResume(null);
                // Show success animation after a short delay
                setTimeout(() => {
                    setShowSuccessAnimation(true);
                }, 300);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Application failed');
        } finally {
            setIsUploading(false);
        }
    }

    const handleSaveJob = async () => {
        if (!user) {
            toast.error('Please login to save jobs');
            return;
        }
        setSavingJob(true);
        try {
            const endpoint = saved ? `unsaveJob/${jobId}` : `saveJob/${jobId}`;
            const method = saved ? 'delete' : 'post';

            // Configure axios request properly based on method
            const config = { 
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            let res;
            if (method === 'delete') {
                res = await axios.delete(`${USER_API_END_POINT}/${endpoint}`, config);
            } else {
                res = await axios.post(`${USER_API_END_POINT}/${endpoint}`, {}, config);
            }

            if (res.data.success) {
                setSaved(!saved);
                toast.success(res.data.message || (saved ? 'Job unsaved successfully' : 'Job saved successfully'));
            } else {
                throw new Error(res.data.message || 'Failed to process request');
            }
        } catch (error) {
            console.error('Failed to save/unsave job', error);
            
            // Handle specific error cases
            if (error.response?.status === 401) {
                toast.error('Session expired. Please log in again.');
                // Optionally redirect to login
                // navigate('/login');
            } else if (error.response?.status === 404) {
                toast.error('Job not found.');
            } else if (error.response?.status === 500) {
                toast.error('Server error. Please try again later.');
            } else {
                toast.error(error.response?.data?.message || error.message || 'An error occurred');
            }
        } finally {
            setSavingJob(false);
        }
    };

    useEffect(()=>{
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`,{withCredentials:true});
                if(res.data.success){
                    dispatch(setSingleJob(res.data.job));
                    setIsApplied(res.data.job.applications.some(application=>application.applicant === user?._id))
                }
            } catch (error) {
                console.log(error);
            }
        }

        const fetchSavedJobs = async () => {
            try {
                const res = await axios.get(`${USER_API_END_POINT}/savedJobs`, { withCredentials: true });
                const savedJobs = res.data?.jobs || [];
                if (savedJobs.some((j) => j._id === jobId)) setSaved(true);
            } catch (err) {
                console.error("Failed to fetch saved jobs", err);
            }
        };

        fetchSingleJob(); 
        if (user) fetchSavedJobs();
    },[jobId, dispatch, user]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const companyName = typeof singleJob?.company === 'string' 
        ? singleJob?.company 
        : singleJob?.company?.name;

    if (!singleJob) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading job details...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <Button 
                                variant="ghost" 
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Jobs
                            </Button>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                    <img 
                                        src={logoSrc} 
                                        alt={`${companyName} logo`}
                                        className="w-6 h-6 object-contain"
                                        onError={(e) => { 
                                            e.target.onerror = null; 
                                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iIzlDQTNBRiIvPgo8dGV4dCB4PSIxMiIgeT0iMTYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiPkM8L3RleHQ+Cjwvc3ZnPgo='; 
                                        }}
                                    />
                                </div>
                                <span className="text-sm font-medium text-gray-700">{companyName}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Job Header */}
                            <div className="bg-white rounded-xl shadow-sm border p-8">
                                <div className="flex items-start gap-6">
                                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center shadow-sm flex-shrink-0">
                                        <img 
                                            src={logoSrc} 
                                            alt={`${companyName} logo`}
                                            className="w-14 h-14 object-contain"
                                            onError={(e) => { 
                                                e.target.onerror = null; 
                                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iIzlDQTNBRiIvPgo8dGV4dCB4PSIxMiIgeT0iMTYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiPkM8L3RleHQ+Cjwvc3ZnPgo='; 
                                            }}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{singleJob?.title}</h1>
                                        <div className="flex items-center gap-2 text-lg text-gray-600 mb-4">
                                            <Building className="w-5 h-5" />
                                            <span className="font-medium">{companyName}</span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-3 mb-6">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <MapPin className="w-4 h-4" />
                                                <span>{singleJob?.location || 'Remote'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Calendar className="w-4 h-4" />
                                                <span>Posted {formatDate(singleJob?.createdAt)}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Users className="w-4 h-4" />
                                                <span>{singleJob?.applications?.length || 0} applicants</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                                                <Users className="w-3 h-3 mr-1" />
                                                {singleJob?.position || singleJob?.postion || 0} Positions
                                            </Badge>
                                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                                <Clock className="w-3 h-3 mr-1" />
                                                {singleJob?.jobType || 'Full-time'}
                                            </Badge>
                                            <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                                                <DollarSign className="w-3 h-3 mr-1" />
                                                {singleJob?.salary} LPA
                                            </Badge>
                                            {singleJob?.experience && (
                                                <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
                                                    {singleJob.experience} years exp
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Job Description */}
                            <div className="bg-white rounded-xl shadow-sm border p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                    <FileText className="w-6 h-6 text-purple-600" />
                                    Job Description
                                </h2>
                                <div className="prose prose-gray max-w-none">
                                    <p className="text-gray-700 leading-relaxed mb-6">
                                        {singleJob?.description || 'No description available for this position.'}
                                    </p>
                                </div>
                            </div>

                            {/* Requirements & Skills */}
                            <div className="bg-white rounded-xl shadow-sm border p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Requirements & Skills</h2>
                                <div className="space-y-4">
                                    {singleJob?.requirements ? (
                                        singleJob.requirements.map((req, index) => (
                                            <div key={index} className="flex items-start gap-3">
                                                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                                                <span className="text-gray-700">{req}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-gray-500 text-center py-4">
                                            No specific requirements listed for this position.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Apply Button */}
                            <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-4">
                                <div className="space-y-4">
                                    {isApplied ? (
                                        <div className="text-center py-8">
                                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Application Submitted!</h3>
                                            <p className="text-sm text-gray-600">You have already applied for this position.</p>
                                        </div>
                                    ) : (
                                        <>
                                            <h3 className="font-semibold text-lg text-gray-900 mb-4">Ready to Apply?</h3>
                                            <p className="text-sm text-gray-600 mb-4">
                                                Submit your application with your resume to get started.
                                            </p>
                                            <div className="space-y-3">
                                                {user ? (
                                                <>
                                                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                                        <DialogTrigger asChild>
                                                            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 text-lg">
                                                                Apply for this Job
                                                            </Button>
                                                        </DialogTrigger>
                                                    <DialogContent className="sm:max-w-md">
                                                        <DialogHeader>
                                                            <DialogTitle className="text-xl font-semibold">Apply for {singleJob?.title}</DialogTitle>
                                                            <DialogDescription className="text-sm text-gray-600">
                                                                Upload your resume (PDF only, max 5MB) to complete your application.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <div className="space-y-4 py-4">
                                                            <div className="space-y-2">
                                                                <label className="text-sm font-medium text-gray-700">Resume *</label>
                                                                <div className="relative">
                                                                    <Input
                                                                        type="file"
                                                                        accept=".pdf"
                                                                        onChange={handleResumeChange}
                                                                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                                                                    />
                                                                </div>
                                                                {resume && (
                                                                    <div className="flex items-center gap-2 text-sm text-green-600">
                                                                        <CheckCircle className="w-4 h-4" />
                                                                        <span>{resume.name} selected</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <DialogFooter>
                                                            <Button 
                                                                variant="outline" 
                                                                onClick={() => setIsDialogOpen(false)}
                                                                disabled={isUploading}
                                                            >
                                                                Cancel
                                                            </Button>
                                                            <Button 
                                                                onClick={applyJobHandler} 
                                                                disabled={!resume || isUploading}
                                                                className="bg-purple-600 hover:bg-purple-700"
                                                            >
                                                                {isUploading ? (
                                                                    <>
                                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                                        Submitting...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Upload className="w-4 h-4 mr-2" />
                                                                        Submit Application
                                                                    </>
                                                                )}
                                                            </Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                    </Dialog>
                                                    <Button
                                                        onClick={handleSaveJob}
                                                        disabled={savingJob}
                                                        variant="outline"
                                                        className={`w-full font-semibold py-3 text-lg ${saved ? 'border-purple-600 text-purple-600 hover:bg-purple-50' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                                                    >
                                                        {savingJob ? (
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2"></div>
                                                        ) : saved ? (
                                                            <BookmarkCheck className="w-5 h-5 mr-2" />
                                                        ) : (
                                                            <Bookmark className="w-5 h-5 mr-2" />
                                                        )}
                                                        {saved ? 'Saved' : 'Save Job'}
                                                    </Button>
                                                </>
                                                ) : (
                                                <div className="text-center py-8">
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Sign in Required</h3>
                                                    <p className="text-sm text-gray-600 mb-4">Please sign in to apply for jobs and save opportunities.</p>
                                                    <div className="space-y-2">
                                                        <Button 
                                                            onClick={() => navigate('/login')}
                                                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 text-lg"
                                                        >
                                                            Sign In
                                                        </Button>
                                                        <Button 
                                                            onClick={() => navigate('/signup')}
                                                            variant="outline" 
                                                            className="w-full border-purple-200 text-purple-600 hover:bg-purple-50 font-semibold py-3 text-lg"
                                                        >
                                                            Create Account
                                                        </Button>
                                                    </div>
                                                </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Job Summary */}
                            <div className="bg-white rounded-xl shadow-sm border p-6">
                                <h3 className="font-semibold text-lg text-gray-900 mb-4">Job Summary</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                        <span className="text-sm font-medium text-gray-600">Salary</span>
                                        <span className="text-sm font-semibold text-gray-900">₹{singleJob?.salary} LPA</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                        <span className="text-sm font-medium text-gray-600">Experience</span>
                                        <span className="text-sm font-semibold text-gray-900">{singleJob?.experience || 'Not specified'} years</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                        <span className="text-sm font-medium text-gray-600">Positions</span>
                                        <span className="text-sm font-semibold text-gray-900">{singleJob?.position || singleJob?.postion || 'Multiple'}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                        <span className="text-sm font-medium text-gray-600">Job Type</span>
                                        <span className="text-sm font-semibold text-gray-900">{singleJob?.jobType || 'Full-time'}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-sm font-medium text-gray-600">Applications</span>
                                        <span className="text-sm font-semibold text-gray-900">{singleJob?.applications?.length || 0} received</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Success Animation */}
            <SuccessAnimation
                isVisible={showSuccessAnimation}
                onClose={() => setShowSuccessAnimation(false)}
                onNavigateToAppliedJobs={() => {
                    setShowSuccessAnimation(false);
                    navigate('/profile', { state: { activeTab: 'applied' } });
                }}
            />
        </>
    )
}

export default JobDescription
