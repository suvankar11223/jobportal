import { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import CompaniesTable from './CompaniesTable'
import { useNavigate } from 'react-router-dom'
import useGetAllCompanies from '@/hooks/useGetAllCompanies'
import { useDispatch, useSelector } from 'react-redux'
import { setSearchCompanyByText } from '@/redux/companySlice'
import { motion } from 'framer-motion'
import { 
  Search, 
  Plus, 
  Building2, 
  TrendingUp,
  Users,
  Calendar,
  Filter,
  Download,
  Globe,
  MapPin
} from 'lucide-react'

const Companies = () => {
    useGetAllCompanies();
    const [input, setInput] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { companies } = useSelector(store => store.company)
    const { allAdminJobs } = useSelector(store => store.job)

    useEffect(() => {
        dispatch(setSearchCompanyByText(input));
    }, [input]);

    // Calculate stats
    const totalCompanies = companies?.length || 0
    const activeCompanies = companies?.filter(company => company.status === 'active')?.length || totalCompanies
    const totalJobs = allAdminJobs?.length || 0
    const averageJobsPerCompany = totalCompanies > 0 ? Math.round(totalJobs / totalCompanies) : 0

    const stats = [
        {
            title: "Total Companies",
            value: totalCompanies,
            icon: Building2,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-200"
        },
        {
            title: "Active Companies",
            value: activeCompanies,
            icon: TrendingUp,
            color: "text-green-600",
            bgColor: "bg-green-50",
            borderColor: "border-green-200"
        },
        {
            title: "Avg Jobs/Company",
            value: averageJobsPerCompany,
            icon: Globe,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
            borderColor: "border-purple-200"
        }
    ]

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
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Management</h1>
                            <p className="text-gray-600">Manage all your registered companies and their details</p>
                        </div>
                        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
                            <Button variant="outline" className="flex items-center gap-2">
                                <Download className="h-4 w-4" />
                                Export
                            </Button>
                            <Button 
                                onClick={() => navigate("/admin/companies/create")}
                                className="bg-[#6A38C2] hover:bg-[#5b30a6] flex items-center gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                New Company
                            </Button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                                                    {stat.value.toLocaleString()}
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

                {/* Search and Filter Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <Card className="border-0 shadow-sm mb-6">
                        <CardContent className="p-6">
                            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                                <div className="relative flex-1 max-w-md">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        className="pl-10 border-gray-200 focus:border-[#6A38C2] focus:ring-[#6A38C2]"
                                        placeholder="Search by company name, industry, or location..."
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Button variant="outline" className="flex items-center gap-2">
                                        <Filter className="h-4 w-4" />
                                        Filter
                                    </Button>
                                    <Button variant="outline" className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        Date Range
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Companies Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-[#6A38C2]" />
                                All Companies
                            </CardTitle>
                            <CardDescription>
                                Manage and track all your registered companies
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <CompaniesTable />
                        </CardContent>
                    </Card>
                </motion.div>
            </main>
        </div>
    )
}

export default Companies