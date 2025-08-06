import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, Briefcase } from 'lucide-react';

const Browse = () => {
    useGetAllJobs();
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const dispatch = useDispatch();
    const [filterJobs, setFilterJobs] = useState(allJobs);
    
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
    
    // Filter jobs based on search query
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
    
    useEffect(() => {
        return () => {
            dispatch(setSearchedQuery(""));
        }
    }, [])
    
    return (
        <div className='min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50'>
            <Navbar />
            <div className='max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8'>
                {/* Header */}
                <div className='mb-8'>
                    <div className='flex items-center justify-between mb-4'>
                        <div>
                            <h1 className='text-4xl font-bold bg-gradient-to-r from-gray-900 to-purple-900 bg-clip-text text-transparent mb-2'>
                                {searchedQuery ? `Results for "${searchedQuery}"` : 'Browse All Jobs'}
                            </h1>
                            <p className='text-gray-600 text-lg'>
                                {filterJobs.length > 0 ? (
                                    <>Found <span className='font-semibold text-purple-700'>{filterJobs.length}</span> job{filterJobs.length !== 1 ? 's' : ''}</>
                                ) : (
                                    'No jobs match your search criteria'
                                )}
                            </p>
                        </div>
                        <div className='hidden md:flex items-center space-x-2 text-sm text-gray-500'>
                            <Search className='w-4 h-4' />
                            <span>Search results</span>
                        </div>
                    </div>
                </div>
                
                {/* Results */}
                {filterJobs.length <= 0 ? (
                    <div className='bg-white rounded-2xl shadow-xl border border-gray-200 text-center py-20 px-8'>
                        <div className='bg-gradient-to-br from-purple-100 to-blue-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8'>
                            <Search className='w-12 h-12 text-purple-600' />
                        </div>
                        <h3 className='text-2xl font-bold text-gray-900 mb-4'>No Jobs Found</h3>
                        <p className='text-gray-600 text-lg mb-8 max-w-md mx-auto leading-relaxed'>
                            {searchedQuery ? (
                                <>No results found for <span className='font-semibold text-purple-700'>"{searchedQuery}"</span>. Try different keywords or browse all jobs.</>  
                            ) : (
                                'Try different search terms or check back later for new opportunities'
                            )}
                        </p>
                        <button 
                            onClick={() => {
                                dispatch(setSearchedQuery(""));
                                setFilterJobs(allJobs);
                            }}
                            className='bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300'
                        >
                            <Search className='w-5 h-5 mr-2 inline-block' />
                            Browse All Jobs
                        </button>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {filterJobs.map((job, index) => (
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -50 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                key={job._id || index}
                            >
                                <Job job={job} />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Browse