import { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Edit2, MoreHorizontal, Trash2, Eye, Globe, Users, MapPin, Calendar } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const CompaniesTable = () => {
    const { companies, searchCompanyByText } = useSelector(store => store.company);
    const { allAdminJobs } = useSelector(store => store.job);
    const [filterCompany, setFilterCompany] = useState(companies);
    const navigate = useNavigate();
    
    useEffect(() => {
        const filteredCompany = companies.length >= 0 && companies.filter((company) => {
            if (!searchCompanyByText) {
                return true
            };
            const nameMatch = company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase());
            const locationMatch = company?.location?.toLowerCase().includes(searchCompanyByText.toLowerCase());
            const websiteMatch = company?.website?.toLowerCase().includes(searchCompanyByText.toLowerCase());
            return nameMatch || locationMatch || websiteMatch;
        });
        setFilterCompany(filteredCompany);
    }, [companies, searchCompanyByText])

    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            })
        } catch {
            return 'N/A'
        }
    }

    const getJobsCount = (companyId) => {
        return allAdminJobs?.filter(job => job.company?._id === companyId)?.length || 0
    }

    if (filterCompany.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Eye className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
                <p className="text-gray-500 mb-6">
                    {searchCompanyByText ?
                        `No companies match your search "${searchCompanyByText}"` :
                        'You haven\'t registered any companies yet'
                    }
                </p>
                {!searchCompanyByText && (
                    <Button
                        onClick={() => navigate('/admin/companies/create')}
                        className="bg-[#6A38C2] hover:bg-[#5b30a6]"
                    >
                        Register Your First Company
                    </Button>
                )}
            </div>
        )
    }

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow className="border-gray-200">
                        <TableHead className="font-semibold text-gray-700 w-[300px]">Company Details</TableHead>
                        <TableHead className="font-semibold text-gray-700">Location & Website</TableHead>
                        <TableHead className="font-semibold text-gray-700 text-center">Jobs Posted</TableHead>
                        <TableHead className="font-semibold text-gray-700 text-center">Registered</TableHead>
                        <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        filterCompany?.map((company, index) => (
                            <motion.tr
                                key={company._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="hover:bg-gray-50 transition-colors border-gray-100"
                            >
                                <TableCell className="py-4">
                                    <div className="flex items-center space-x-4">
                                        <Avatar className="h-12 w-12 border">
                                            <AvatarImage src={company.logo} alt={company.name} />
                                            <AvatarFallback className="bg-[#6A38C2] text-white font-medium">
                                                {company.name?.charAt(0) || 'C'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0 flex-1">
                                            <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">
                                                {company.name || 'Unnamed Company'}
                                            </h4>
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {company.description || 'No description provided'}
                                            </p>
                                        </div>
                                    </div>
                                </TableCell>

                                <TableCell className="py-4">
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-900 flex items-center gap-1">
                                            <MapPin className="w-3 h-3 text-gray-400" />
                                            {company.location || 'Not specified'}
                                        </p>
                                        {company.website && (
                                            <a 
                                                href={company.website} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                            >
                                                <Globe className="w-3 h-3" />
                                                Visit Website
                                            </a>
                                        )}
                                    </div>
                                </TableCell>

                                <TableCell className="py-4 text-center">
                                    <div className="flex flex-col items-center space-y-1">
                                        <Badge
                                            variant="secondary"
                                            className="bg-green-100 text-green-800 border-green-200 px-2 py-1"
                                        >
                                            <Users className="w-3 h-3 mr-1" />
                                            {getJobsCount(company._id)}
                                        </Badge>
                                        <span className="text-xs text-gray-500">active jobs</span>
                                    </div>
                                </TableCell>

                                <TableCell className="py-4 text-center">
                                    <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {formatDate(company.createdAt)}
                                    </div>
                                </TableCell>

                                <TableCell className="py-4 text-right">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-48 p-2" align="end">
                                            <div className="space-y-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => navigate(`/admin/companies/${company._id}`)}
                                                    className="w-full justify-start h-8 px-2 text-sm hover:bg-gray-100"
                                                >
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    View Details
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => navigate(`/admin/companies/${company._id}`)}
                                                    className="w-full justify-start h-8 px-2 text-sm hover:bg-gray-100"
                                                >
                                                    <Edit2 className="w-4 h-4 mr-2" />
                                                    Edit Company
                                                </Button>
                                                <hr className="my-1" />
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="w-full justify-start h-8 px-2 text-sm text-red-600 hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Delete Company
                                                </Button>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </motion.tr>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default CompaniesTable