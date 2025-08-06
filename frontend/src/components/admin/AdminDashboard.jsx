import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Navbar from '../shared/Navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { 
  Users, 
  Briefcase, 
  Building2, 
  TrendingUp, 
  Eye, 
  FileText,
  Calendar,
  BarChart3,
  PlusCircle,
  ArrowRight,
  Activity
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs'
import useGetAllCompanies from '@/hooks/useGetAllCompanies'

const AdminDashboard = () => {
  useGetAllAdminJobs()
  useGetAllCompanies()
  
  const { allAdminJobs } = useSelector(store => store.job)
  const { companies } = useSelector(store => store.company)
  const { user } = useSelector(store => store.auth)

  // Calculate statistics
  const totalJobs = allAdminJobs?.length || 0
  const totalCompanies = companies?.length || 0
  const activeJobs = allAdminJobs?.filter(job => job.status === 'active')?.length || 0
  
  // Get total applications from all jobs
  const totalApplications = allAdminJobs?.reduce((sum, job) => {
    return sum + (job.applications?.length || 0)
  }, 0) || 0

  // Recent jobs (last 5)
  const recentJobs = allAdminJobs?.slice(0, 5) || []

  const stats = [
    {
      title: "Total Jobs Posted",
      value: totalJobs,
      icon: Briefcase,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "+12%",
      trend: "up"
    },
    {
      title: "Active Companies",
      value: totalCompanies,
      icon: Building2,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: "+8%",
      trend: "up"
    },
    {
      title: "Total Applications",
      value: totalApplications,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "+23%",
      trend: "up"
    },
    {
      title: "Active Jobs",
      value: activeJobs,
      icon: Activity,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      change: "+5%",
      trend: "up"
    }
  ]

  const quickActions = [
    {
      title: "Post New Job",
      description: "Create a new job posting",
      href: "/admin/jobs/create",
      icon: PlusCircle,
      color: "bg-gradient-to-r from-blue-500 to-blue-600"
    },
    {
      title: "Add Company",
      description: "Register a new company",
      href: "/admin/companies/create",
      icon: Building2,
      color: "bg-gradient-to-r from-green-500 to-green-600"
    },
    {
      title: "View Analytics",
      description: "Check performance metrics",
      href: "/admin/analytics",
      icon: BarChart3,
      color: "bg-gradient-to-r from-purple-500 to-purple-600"
    },
    {
      title: "Manage Jobs",
      description: "View and edit all jobs",
      href: "/admin/jobs",
      icon: Briefcase,
      color: "bg-gradient-to-r from-orange-500 to-orange-600"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.fullname}! 👋
              </h1>
              <p className="text-gray-600">
                Here's what's happening with your job portal today.
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <Button variant="outline" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Today
              </Button>
              <Button className="bg-[#6A38C2] hover:bg-[#5b30a6] flex items-center gap-2">
                <FileText className="h-4 w-4" />
                View Reports
              </Button>
            </div>
          </motion.div>
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
              <Card className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">
                        {stat.title}
                      </p>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-2xl font-bold text-gray-900">
                          {stat.value.toLocaleString()}
                        </h3>
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                          {stat.change}
                        </Badge>
                      </div>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[#6A38C2]" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Common tasks to manage your job portal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <Link key={action.title} to={action.href}>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                        className="group"
                      >
                        <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-white group-hover:scale-105">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="space-y-2">
                                <div className={`${action.color} w-10 h-10 rounded-lg flex items-center justify-center`}>
                                  <action.icon className="h-5 w-5 text-white" />
                                </div>
                                <h4 className="font-semibold text-gray-900">{action.title}</h4>
                                <p className="text-sm text-gray-600">{action.description}</p>
                              </div>
                              <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <Activity className="h-5 w-5 text-[#F83002]" />
                  Recent Jobs
                </CardTitle>
                <CardDescription>
                  Your latest job postings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentJobs.length > 0 ? (
                  recentJobs.map((job, index) => (
                    <motion.div
                      key={job._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                      className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={job.company?.logo} />
                        <AvatarFallback className="bg-[#6A38C2] text-white">
                          {job.company?.name?.charAt(0) || 'C'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {job.title}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {job.company?.name}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {job.applications?.length || 0}
                      </Badge>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No jobs posted yet</p>
                    <Link to="/admin/jobs/create">
                      <Button size="sm" className="mt-2 bg-[#6A38C2] hover:bg-[#5b30a6]">
                        Post Your First Job
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Applications Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <Users className="h-5 w-5 text-[#6A38C2]" />
                    Application Overview
                  </CardTitle>
                  <CardDescription>
                    Recent applications across all job postings
                  </CardDescription>
                </div>
                <Link to="/admin/jobs">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allAdminJobs?.slice(0, 6).map((job, index) => (
                  <motion.div
                    key={job._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 line-clamp-1">
                          {job.title}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-1">
                          {job.company?.name}
                        </p>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className="bg-blue-100 text-blue-800"
                      >
                        {job.applications?.length || 0}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                      <Link to={`/admin/jobs/${job._id}/applicants`}>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-[#6A38C2] hover:text-[#5b30a6] p-0 h-auto"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}

export default AdminDashboard
