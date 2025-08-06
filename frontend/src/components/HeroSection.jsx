import React, { useState } from 'react'
import { Button } from './ui/button'
import { Search, TrendingUp, Users, Star, ArrowRight, Building2, MapPin } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    const stats = [
        { icon: Building2, label: "Active Companies", value: "500+" },
        { icon: Users, label: "Active Job Seekers", value: "10K+" },
        { icon: TrendingUp, label: "Success Rate", value: "85%" },
        { icon: Star, label: "User Rating", value: "4.8" }
    ];

    const popularSearches = [
        "Frontend Developer", "Backend Developer", "Full Stack", "UI/UX Designer", "Data Scientist", "Product Manager"
    ];

    return (
        <div className='relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-blue-50'>
            {/* Background Elements */}
            <div className='absolute top-0 left-0 w-full h-full overflow-hidden'>
                <div className='absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob'></div>
                <div className='absolute top-40 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000'></div>
                <div className='absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000'></div>
            </div>

            <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32'>
                <div className='text-center mb-16'>
                    {/* Badge */}
                    <div className='inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 font-semibold text-sm mb-8 shadow-sm'>
                        <Star className='w-4 h-4 mr-2 fill-current' />
                        #1 Job Portal Platform
                        <TrendingUp className='w-4 h-4 ml-2' />
                    </div>

                    {/* Main Heading */}
                    <h1 className='text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6'>
                        <span className='bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900 bg-clip-text text-transparent'>
                            Find Your
                        </span>
                        <br />
                        <span className='bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent'>
                            Dream Career
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className='text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed'>
                        Connect with top companies and discover opportunities that match your skills. 
                        <span className='font-semibold text-purple-700'> Start your journey today.</span>
                    </p>

                    {/* Search Bar */}
                    <div className='max-w-2xl mx-auto mb-8'>
                        <div className='relative flex items-center bg-white rounded-2xl shadow-2xl border border-gray-200 p-2 hover:shadow-3xl transition-all duration-300'>
                            <div className='flex items-center px-4 py-3 flex-1'>
                                <Search className='w-5 h-5 text-gray-400 mr-3' />
                                <input
                                    type="text"
                                    placeholder='Search jobs, companies, or skills...'
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className='outline-none border-none w-full text-gray-700 text-lg placeholder-gray-400'
                                    onKeyPress={(e) => e.key === 'Enter' && searchJobHandler()}
                                />
                            </div>
                            <Button 
                                onClick={searchJobHandler} 
                                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
                            >
                                Search Jobs
                                <ArrowRight className='w-5 h-5 ml-2' />
                            </Button>
                        </div>
                    </div>

                    {/* Popular Searches */}
                    <div className='mb-16'>
                        <p className='text-sm text-gray-500 mb-4'>Popular Searches:</p>
                        <div className='flex flex-wrap justify-center gap-3'>
                            {popularSearches.map((term, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setQuery(term);
                                        dispatch(setSearchedQuery(term));
                                        navigate("/browse");
                                    }}
                                    className='px-4 py-2 bg-white rounded-full border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md'
                                >
                                    {term}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className='grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto'>
                    {stats.map((stat, index) => {
                        const IconComponent = stat.icon;
                        return (
                            <div key={index} className='text-center group'>
                                <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg'>
                                    <IconComponent className='w-8 h-8 text-purple-600' />
                                </div>
                                <h3 className='text-2xl font-bold text-gray-900 mb-1'>{stat.value}</h3>
                                <p className='text-sm text-gray-600 font-medium'>{stat.label}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}

export default HeroSection
