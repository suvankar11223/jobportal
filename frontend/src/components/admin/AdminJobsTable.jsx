import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Badge } from '../ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { Edit2, Eye, MoreHorizontal, Trash2, MapPin, DollarSign, Clock, Users } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const AdminJobsTable = () => {
  const { allAdminJobs, searchJobByText } = useSelector((store) => store.job)
  const [filterJobs, setFilterJobs] = useState(allAdminJobs || [])
  const navigate = useNavigate()

  useEffect(() => {
    const filtered = allAdminJobs?.filter((job) => {
      if (!searchJobByText) return true
      const titleMatch = job?.title?.toLowerCase()?.includes(searchJobByText.toLowerCase())
      const companyMatch = job?.company?.name?.toLowerCase()?.includes(searchJobByText.toLowerCase())
      const locationMatch = job?.location?.toLowerCase()?.includes(searchJobByText.toLowerCase())
      return titleMatch || companyMatch || locationMatch
    }) || []

    setFilterJobs(filtered)
  }, [allAdminJobs, searchJobByText])

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'closed':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200'
    }
  }

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

  const formatSalary = (salary) => {
    if (!salary) return 'Not specified'
    return `$${salary.toLocaleString()}`
  }

  if (filterJobs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Eye className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
        <p className="text-gray-500 mb-6">
          {searchJobByText ? 
            `No jobs match your search "${searchJobByText}"` : 
            'You haven\'t posted any jobs yet'
          }
        </p>
        {!searchJobByText && (
          <Button 
            onClick={() => navigate('/admin/jobs/create')}
            className="bg-[#6A38C2] hover:bg-[#5b30a6]"
          >
            Post Your First Job
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
            <TableHead className="font-semibold text-gray-700 w-[300px]">Job Details</TableHead>
            <TableHead className="font-semibold text-gray-700">Location & Salary</TableHead>
            <TableHead className="font-semibold text-gray-700 text-center">Applications</TableHead>
            <TableHead className="font-semibold text-gray-700 text-center">Status</TableHead>
            <TableHead className="font-semibold text-gray-700 text-center">Posted</TableHead>
            <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterJobs?.map((job, index) => (
            <motion.tr
              key={job?._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="hover:bg-gray-50 transition-colors border-gray-100"
            >
              <TableCell className="py-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={job?.company?.logo} alt={job?.company?.name} />
                    <AvatarFallback className="bg-[#6A38C2] text-white font-medium">
                      {job?.company?.name?.charAt(0) || 'C'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">
                      {job?.title || 'Untitled Job'}
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-1">
                      {job?.company?.name || 'Unknown Company'}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {job?.jobType || 'Full-time'} • {job?.experienceLevel || 'Mid-level'}
                    </p>
                  </div>
                </div>
              </TableCell>
              
              <TableCell className="py-4">
                <div className="space-y-1">
                  <p className="text-sm text-gray-900 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    {job?.location || 'Remote'}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-gray-400" />
                    {formatSalary(job?.salary)}
                  </p>
                </div>
              </TableCell>

              <TableCell className="py-4 text-center">
                <div className="flex flex-col items-center space-y-1">
                  <Badge 
                    variant="secondary" 
                    className="bg-blue-100 text-blue-800 border-blue-200 px-2 py-1"
                  >
                    <Users className="w-3 h-3 mr-1" />
                    {job?.applications?.length || 0}
                  </Badge>
                  <span className="text-xs text-gray-500">applicants</span>
                </div>
              </TableCell>

              <TableCell className="py-4 text-center">
                <Badge 
                  variant="outline" 
                  className={`px-2 py-1 text-xs font-medium ${getStatusColor(job?.status || 'active')}`}
                >
                  {job?.status || 'Active'}
                </Badge>
              </TableCell>

              <TableCell className="py-4 text-center">
                <div className="text-sm text-gray-600">
                  {formatDate(job?.createdAt)}
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
                        onClick={() => navigate(`/admin/jobs/${job?._id}/applicants`)}
                        className="w-full justify-start h-8 px-2 text-sm hover:bg-gray-100"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Applicants
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/admin/jobs/edit/${job?._id}`)}
                        className="w-full justify-start h-8 px-2 text-sm hover:bg-gray-100"
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit Job
                      </Button>
                      <hr className="my-1" />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start h-8 px-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Job
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default AdminJobsTable
