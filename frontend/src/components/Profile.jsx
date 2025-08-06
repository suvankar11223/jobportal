import React, { useState } from 'react';
import Navbar from './shared/Navbar';
import { Avatar, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Contact, Mail, Pen, Briefcase, Code, FileText } from 'lucide-react';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import AppliedJobTable from './AppliedJobTable';
import UpdateProfileDialog from './UpdateProfileDialog';
import { useSelector } from 'react-redux';
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs';

const Profile = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);

    return (
        <div className='bg-gray-50 min-h-screen'>
            <Navbar />
            <div className='max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
                <div className='bg-white rounded-2xl shadow-lg overflow-hidden'>
                    {/* Profile Header */}
                    <div className='p-8 bg-gradient-to-r from-purple-500 to-indigo-600'>
                        <div className='flex flex-col md:flex-row items-center gap-6'>
                            <Avatar className='h-32 w-32 border-4 border-white shadow-lg'>
                                <AvatarImage src={user?.profile?.profilePhoto || "/default-avatar.png"} alt='profile' />
                            </Avatar>
                            <div className='text-center md:text-left text-white'>
                                <h1 className='text-4xl font-bold tracking-tight'>{user?.fullname}</h1>
                                <p className='text-purple-200 mt-1 text-lg'>{user?.profile?.bio}</p>
                            </div>
                            <Button onClick={() => setOpen(true)} className='ml-auto bg-white text-purple-600 hover:bg-purple-50 self-start md:self-center rounded-full p-3'>
                                <Pen size={20} />
                            </Button>
                        </div>
                    </div>

                    {/* Profile Details */}
                    <div className='p-8 grid grid-cols-1 md:grid-cols-3 gap-8'>
                        {/* Left Column: Contact Info & Resume */}
                        <div className='md:col-span-1 space-y-6'>
                            <div className='p-6 bg-gray-50 rounded-xl'>
                                <h2 className='font-bold text-xl text-gray-800 mb-4 flex items-center'>
                                    <Contact className='mr-3 text-purple-500' /> Contact Information
                                </h2>
                                <div className='space-y-3'>
                                    <div className='flex items-center gap-3 text-gray-600'>
                                        <Mail size={20} />
                                        <span>{user?.email}</span>
                                    </div>
                                    <div className='flex items-center gap-3 text-gray-600'>
                                        <Contact size={20} />
                                        <span>{user?.phoneNumber}</span>
                                    </div>
                                </div>
                            </div>
                            <div className='p-6 bg-gray-50 rounded-xl'>
                                <h2 className='font-bold text-xl text-gray-800 mb-4 flex items-center'>
                                    <FileText className='mr-3 text-purple-500' /> Resume
                                </h2>
                                {
                                    user?.profile?.resume ? (
                                        <a 
                                            target='_blank' 
                                            href={user.profile.resume} 
                                            className='text-blue-600 hover:underline font-medium break-all'
                                            rel="noreferrer"
                                        >
                                            {user.profile.resumeOriginalName}
                                        </a>
                                    ) : (
                                        <span className='text-gray-500'>No resume uploaded.</span>
                                    )
                                }
                            </div>
                        </div>

                        {/* Right Column: Skills & Applied Jobs */}
                        <div className='md:col-span-2 space-y-8'>
                            <div className='p-6 bg-gray-50 rounded-xl'>
                                <h2 className='font-bold text-xl text-gray-800 mb-4 flex items-center'>
                                    <Code className='mr-3 text-purple-500' /> Technical Skills
                                </h2>
                                <div className='flex flex-wrap items-center gap-3'>
                                    {
                                        user?.profile?.skills.length > 0 ? (
                                            user.profile.skills.map((item, index) => (
                                                <Badge key={index} variant='secondary' className='text-base px-4 py-2'>{item}</Badge>
                                            ))
                                        ) : (
                                            <p className='text-gray-500'>No skills specified.</p>
                                        )
                                    }
                                </div>
                            </div>

                            <div className='p-6 bg-white rounded-xl border'>
                                <h2 className='font-bold text-xl text-gray-800 mb-4 flex items-center'>
                                    <Briefcase className='mr-3 text-purple-500' /> Applied Jobs
                                </h2>
                                <AppliedJobTable />
                            </div>
                        </div>
                    </div>
                </div>
                <UpdateProfileDialog open={open} setOpen={setOpen} />
            </div>
        </div>
    );
};

export default Profile