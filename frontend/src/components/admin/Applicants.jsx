import { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import ApplicantsTable from './ApplicantsTable'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAllApplicants } from '@/redux/applicationSlice';
import { motion } from 'framer-motion'
import { 
  Users, 
  Briefcase, 
  ArrowLeft,
  Download,
  Filter,
  Search,
  UserCheck,
  UserX,
  Clock,
  TrendingUp,
  Star
} from 'lucide-react'
import { Input } from '../ui/input'

const Applicants = () => {
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { applicants } = useSelector(store => store.application);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        const fetchAllApplicants = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`, { withCredentials: true });
                dispatch(setAllApplicants(res.data.job));
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllApplicants();
    }, []);

    const applications = applicants?.applications || [];
    const jobTitle = applicants?.title || 'Job Position';
    const companyName = applicants?.company?.name || 'Company';

    // Calculate statistics
    const totalApplications = applications.length;
    const acceptedApplications = applications.filter(app => app.status === 'accepted').length;
    const rejectedApplications = applications.filter(app => app.status === 'rejected').length;
    const pendingApplications = applications.filter(app => app.status === 'pending').length;

    const stats = [
        {
            title: "Total Applications",
            value: totalApplications,
            icon: Users,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-200"
        },
        {
            title: "Accepted",
            value: acceptedApplications,
            icon: UserCheck,
            color: "text-green-600",
            bgColor: "bg-green-50",
            borderColor: "border-green-200"
        },
        {
            title: "Rejected",
            value: rejectedApplications,
            icon: UserX,
            color: "text-red-600",
            bgColor: "bg-red-50",
            borderColor: "border-red-200"
        },
        {
            title: "Pending Review",
            value: pendingApplications,
            icon: Clock,
            color: "text-orange-600",
            bgColor: "bg-orange-50",
            borderColor: "border-orange-200"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <Button 
                            variant="outline" 
                            onClick={() => navigate('/admin/jobs')}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Jobs
                        </Button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6">
                        <div className="mb-4 sm:mb-0">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-[#6A38C2] rounded-lg">
                                    <Briefcase className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">{jobTitle}</h1>
                                    <p className="text-gray-600">{companyName}</p>
                                </div>
                            </div>
                            <p className="text-gray-600 flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                {totalApplications} applications received
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Button variant="outline" className="flex items-center gap-2">
                                <Download className="h-4 w-4" />
                                Export
                            </Button>
                            <Button 
                                variant="outline" 
                                className="flex items-center gap-2"
                            >
                                <Filter className="h-4 w-4" />
                                Filter
                            </Button>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Card className={`hover:shadow-lg transition-all duration-300 border-0 shadow-sm ${stat.borderColor} border-l-4`}>
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium text-gray-600">
                                                    {stat.title}
                                                </p>
                                                <h3 className="text-2xl font-bold text-gray-900">
                                                    {stat.value}
                                                </h3>
                                            </div>
                                            <div className={`${stat.bgColor} p-3 rounded-full`}>
                                                <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Search Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <Card className="border-0 shadow-sm mb-6">
                        <CardContent className="p-6">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        className="pl-10 border-gray-200 focus:border-[#6A38C2] focus:ring-[#6A38C2]"
                                        placeholder="Search applicants by name, email, or skills..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center space-x-3">
                                    <select 
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="px-3 py-2 border border-gray-200 rounded-md focus:border-[#6A38C2] focus:ring-[#6A38C2]"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="pending">Pending</option>
                                        <option value="accepted">Accepted</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Applicants Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold flex items-center gap-2">
                                <Users className="h-5 w-5 text-[#6A38C2]" />
                                All Applicants
                            </CardTitle>
                            <CardDescription>
                                Review and manage applications for this position
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <ApplicantsTable searchTerm={searchTerm} statusFilter={statusFilter} />
                        </CardContent>
                    </Card>
                </motion.div>
            </main>
        </div>
    )
}

export default Applicants