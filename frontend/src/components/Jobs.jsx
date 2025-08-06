import { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Search, Filter, Briefcase, TrendingUp, MapPin, Building2 } from 'lucide-react';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import AuthDialog from './shared/AuthDialog';

const Jobs = () => {
    useGetAllJobs();
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);
    const [filterJobs, setFilterJobs] = useState(allJobs);
    const [showAuthDialog, setShowAuthDialog] = useState(false);

    const handleAuthRequired = () => {
        setShowAuthDialog(true);
    };

    // Helper function to match salary ranges
    const matchesSalaryRange = (jobSalary, filterSalary) => {
        if (!jobSalary || !filterSalary) return false;
        
        const salaryRanges = {
            '0-40k': { min: 0, max: 40000 },
            '42-1lakh': { min: 42000, max: 100000 },
            '1lakh to 5lakh': { min: 100000, max: 500000 },
            '5lakh to 10lakh': { min: 500000, max: 1000000 },
            '10lakh to 20lakh': { min: 1000000, max: 2000000 },
            '20lakh to 50lakh': { min: 2000000, max: 5000000 },
            '50lakh to 1 crore': { min: 5000000, max: 10000000 }
        };
        
        const range = salaryRanges[filterSalary];
        if (!range) return false;
        
        const salary = parseInt(jobSalary.toString().replace(/[^\d]/g, ''));
        return salary >= range.min && salary <= range.max;
    };
    
    // Filter internal Redux jobs only
    useEffect(() => {
        if (searchedQuery) {
            const filteredJobs = allJobs.filter((job) => {
                const query = searchedQuery.toLowerCase();
                const title = job.title?.toLowerCase() || '';
                const description = job.description?.toLowerCase() || '';
                const location = job.location?.toLowerCase() || '';
                const company = job.company?.name?.toLowerCase() || '';
                
                // Handle location-specific filtering with better matching
                const locationKeywords = {
                    'bangalore': ['bangalore', 'bengaluru', 'blr'],
                    'delhi ncr': ['delhi', 'ncr', 'gurgaon', 'gurugram', 'noida', 'faridabad', 'ghaziabad'],
                    'hyderabad': ['hyderabad', 'hyd', 'secunderabad'],
                    'pune': ['pune', 'puna'],
                    'mumbai': ['mumbai', 'bombay', 'bom'],
                    'chennai': ['chennai', 'madras'],
                    'vellore': ['vellore', 'vit']
                };
                
                // Check for location match
                let locationMatch = location.includes(query);
                if (!locationMatch) {
                    const locationEntry = Object.entries(locationKeywords).find(([key]) => 
                        key === query || locationKeywords[key]?.includes(query)
                    );
                    if (locationEntry) {
                        locationMatch = locationEntry[1].some(keyword => location.includes(keyword));
                    }
                }
                
                // Check for job title/industry match
                const industryKeywords = {
                    'frontend developer': ['frontend', 'front-end', 'react', 'vue', 'angular'],
                    'backend developer': ['backend', 'back-end', 'node', 'python', 'java', 'api'],
                    'fullstack developer': ['fullstack', 'full-stack', 'full stack'],
                    'ai/ml engineer': ['ai', 'ml', 'machine learning', 'artificial intelligence', 'data science'],
                    'data scientist': ['data scientist', 'data science', 'analytics', 'statistics'],
                    'data analyst': ['data analyst', 'business analyst', 'analytics'],
                    'devops engineer': ['devops', 'dev ops', 'infrastructure', 'deployment', 'ci/cd'],
                    'software engineer': ['software engineer', 'software developer', 'programmer']
                };
                
                let industryMatch = title.includes(query) || description.includes(query);
                if (!industryMatch) {
                    const industryEntry = Object.entries(industryKeywords).find(([key]) => key === query);
                    if (industryEntry) {
                        industryMatch = industryEntry[1].some(keyword => 
                            title.includes(keyword) || description.includes(keyword)
                        );
                    }
                }
                
                // Check for salary match
                const salaryMatch = matchesSalaryRange(job.salary, searchedQuery);
                
                return locationMatch || industryMatch || salaryMatch || company.includes(query);
            })
            setFilterJobs(filteredJobs)
        } else {
            setFilterJobs(allJobs)
        }
    }, [allJobs, searchedQuery]);

    return (
        <div className='min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50'>
            <Navbar />
            
            {/* Hero Header Section */}
            <div className='bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 relative overflow-hidden'>
                {/* Background Elements */}
                <div className='absolute inset-0'>
                    <div className='absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl'></div>
                    <div className='absolute bottom-10 right-20 w-40 h-40 bg-white/10 rounded-full blur-xl'></div>
                    <div className='absolute top-1/2 left-1/3 w-24 h-24 bg-white/10 rounded-full blur-xl'></div>
                </div>
                
                <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
                    <div className='text-center text-white'>
                        <div className='inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white font-semibold text-sm mb-6'>
                            <Briefcase className='w-4 h-4 mr-2' />
                            Explore Opportunities
                            <TrendingUp className='w-4 h-4 ml-2' />
                        </div>
                        
                        <h1 className='text-4xl md:text-6xl font-bold mb-6 leading-tight'>
                            <span className='block'>Discover Your</span>
                            <span className='block bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent'>Next Career Move</span>
                        </h1>
                        
                        <p className='text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto leading-relaxed'>
                            {searchedQuery ? (
                                <>Showing results for <span className='font-bold text-yellow-200'>"{searchedQuery}"</span></>
                            ) : (
                                'Browse through hundreds of job opportunities from top companies'
                            )}
                        </p>
                        
                        <div className='flex justify-center items-center mt-8 space-x-8'>
                            <div className='text-center'>
                                <div className='text-3xl font-bold text-yellow-200'>{allJobs?.length || 0}+</div>
                                <div className='text-purple-200 text-sm'>Total Jobs</div>
                            </div>
                            <div className='text-center'>
                                <div className='text-3xl font-bold text-yellow-200'>{filterJobs?.length || 0}</div>
                                <div className='text-purple-200 text-sm'>Filtered Results</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className='max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
                <div className='flex gap-8'>
                    {/* Filter Sidebar */}
                    <div className='w-80 flex-shrink-0'>
                        <div className='sticky top-8'>
                            <FilterCard />
                        </div>
                    </div>
                    
                    {/* Job Results Section */}
                    <div className='flex-1 min-w-0'>
                        {/* Results Header */}
                        <div className='mb-8'>
                            <div className='flex items-center justify-between mb-4'>
                                <div>
                                    <h2 className='text-3xl font-bold bg-gradient-to-r from-gray-900 to-purple-900 bg-clip-text text-transparent mb-2'>
                                        Available Positions
                                    </h2>
                                    <p className='text-gray-600 text-lg'>
                                        {filterJobs.length > 0 ? (
                                            <>
                                                <span className='font-semibold text-purple-700'>{filterJobs.length}</span> opportunity{filterJobs.length !== 1 ? 's' : ''} match your criteria
                                            </>
                                        ) : (
                                            'No jobs match your current criteria'
                                        )}
                                    </p>
                                </div>
                                <div className='hidden md:flex items-center space-x-2 text-sm text-gray-500'>
                                    <Filter className='w-4 h-4' />
                                    <span>Use filters to refine results</span>
                                </div>
                            </div>
                        </div>
                        
                        {
                            filterJobs.length <= 0 ? (
                                <div className='bg-white rounded-2xl shadow-xl border border-gray-200 text-center py-20 px-8'>
                                    <div className='bg-gradient-to-br from-purple-100 to-blue-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8'>
                                        <svg className='w-12 h-12 text-purple-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6m8 0H8m0 0h8m-8 0a2 2 0 00-2 2v6a2 2 0 002 2h8a2 2 0 002-2V8a2 2 0 00-2-2z" />
                                        </svg>
                                    </div>
                                    <h3 className='text-2xl font-bold text-gray-900 mb-4'>No Jobs Found</h3>
                                    <p className='text-gray-600 text-lg mb-8 max-w-md mx-auto leading-relaxed'>
                                        {searchedQuery ? (
                                            <>No results found for <span className='font-semibold text-purple-700'>"{searchedQuery}"</span>. Try different keywords or adjust your filters.</>
                                        ) : (
                                            'Try adjusting your search filters or check back later for new opportunities'
                                        )}
                                    </p>
                                    <button 
                                        onClick={() => window.location.reload()} 
                                        className='bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300'
                                    >
                                        <Search className='w-5 h-5 mr-2 inline-block' />
                                        Refresh Job Search
                                    </button>
                                </div>
                            ) : (
                                <div className='space-y-8'>
                                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                                        {
                                            filterJobs.map((job, index) => (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 50 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -50 }}
                                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                                    key={job._id || index}
                                                    className='h-fit'
                                                >
                                                    <Job job={job} onAuthRequired={handleAuthRequired} />
                                                </motion.div>
                                            ))
                                        }
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
            
            <AuthDialog 
                open={showAuthDialog} 
                onOpenChange={setShowAuthDialog} 
            />
        </div>
    )
}

export default Jobs
