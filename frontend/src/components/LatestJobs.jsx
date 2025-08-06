import React, { useState } from 'react'
import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Building2, ArrowRight } from 'lucide-react';
import AuthDialog from './shared/AuthDialog';

// const randomJobs = [1, 2, 3, 4, 5, 6, 7, 8];

const LatestJobs = () => {
    const {allJobs} = useSelector(store=>store.job);
    const { user } = useSelector(store => store.auth);
    const [showAuthDialog, setShowAuthDialog] = useState(false);
    const navigate = useNavigate();

    const handleAuthRequired = () => {
        setShowAuthDialog(true);
    };
    
    console.log('LatestJobs - allJobs:', allJobs);
    console.log('LatestJobs - allJobs length:', allJobs?.length);
    
    // Filter jobs to show only one job per company
    const uniqueCompanyJobs = allJobs?.reduce((acc, job) => {
        const companyId = job?.company?._id;
        if (companyId && !acc.some(existingJob => existingJob?.company?._id === companyId)) {
            acc.push(job);
        }
        return acc;
    }, []);
    
    console.log('Unique company jobs:', uniqueCompanyJobs);
   
    return (
        <div className='bg-gradient-to-b from-gray-50 to-white py-20'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='text-center mb-16'>
                    <div className='inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 font-semibold text-sm mb-6'>
                        <Building2 className='w-4 h-4 mr-2' />
                        Featured Opportunities
                    </div>
                    <h2 className='text-4xl md:text-5xl font-bold mb-6'>
                        <span className='bg-gradient-to-r from-gray-900 to-purple-900 bg-clip-text text-transparent'>
                            Latest & Top
                        </span>
                        <br />
                        <span className='bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent'>
                            Job Openings
                        </span>
                    </h2>
                    <p className='text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed'>
                        Discover exciting career opportunities from industry-leading companies. 
                        <span className='font-semibold text-purple-700'>Your next role awaits.</span>
                    </p>
                </div>
                
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {
                        uniqueCompanyJobs?.length <= 0 ? 
                        <div className='col-span-full text-center py-16'>
                            <div className='bg-gradient-to-br from-purple-100 to-blue-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6'>
                                <svg className='w-12 h-12 text-purple-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6m8 0H8m0 0h8m-8 0a2 2 0 00-2 2v6a2 2 0 002 2h8a2 2 0 002-2V8a2 2 0 00-2-2z" />
                                </svg>
                            </div>
                            <h3 className='text-2xl font-bold text-gray-900 mb-3'>No Jobs Available</h3>
                            <p className='text-gray-600 text-lg'>Check back later for new opportunities</p>
                        </div> 
                        : uniqueCompanyJobs?.slice(0,6).map((job) => (
                            <LatestJobCards 
                                key={job._id} 
                                job={job} 
                                onAuthRequired={handleAuthRequired}
                            />
                        ))
                    }
                </div>
                
                {/* View More Button */}
                {uniqueCompanyJobs?.length > 6 && (
                    <div className='text-center mt-12'>
                        <Button 
                            onClick={() => navigate('/browse')}
                            className='bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300'
                        >
                            View All Jobs
                            <ArrowRight className='w-5 h-5 ml-2' />
                        </Button>
                    </div>
                )}
            </div>
            
            <AuthDialog 
                open={showAuthDialog} 
                onOpenChange={setShowAuthDialog} 
            />
        </div>
    )
}

export default LatestJobs