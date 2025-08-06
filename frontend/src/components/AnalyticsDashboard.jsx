import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  Briefcase, 
  Eye, 
  MapPin, 
  DollarSign,
  Calendar,
  Award,
  Filter,
  Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';

const AnalyticsDashboard = ({ userRole }) => {
  const [timeRange, setTimeRange] = useState('30d');
  const [analytics, setAnalytics] = useState({
    overview: {},
    trends: [],
    demographics: {},
    topSkills: [],
    salaryTrends: [],
    locationData: []
  });

  // Mock analytics data - replace with actual API calls
  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange, userRole]);

  const fetchAnalyticsData = async () => {
    // Simulate API call
    const mockData = {
      overview: {
        totalJobs: userRole === 'recruiter' ? 45 : 1250,
        totalApplications: userRole === 'recruiter' ? 324 : 89,
        viewsThisMonth: userRole === 'recruiter' ? 2150 : 340,
        successRate: userRole === 'recruiter' ? 25 : 12,
        avgTimeToHire: '18 days',
        responseRate: '76%'
      },
      trends: [
        { month: 'Jan', applications: 45, jobs: 12 },
        { month: 'Feb', applications: 52, jobs: 18 },
        { month: 'Mar', applications: 48, jobs: 15 },
        { month: 'Apr', applications: 65, jobs: 22 },
        { month: 'May', applications: 58, jobs: 19 },
        { month: 'Jun', applications: 72, jobs: 28 }
      ],
      demographics: {
        experienceLevel: [
          { level: 'Entry (0-2)', count: 125, percentage: 35 },
          { level: 'Mid (3-5)', count: 98, percentage: 28 },
          { level: 'Senior (6-10)', count: 87, percentage: 24 },
          { level: 'Lead (10+)', count: 45, percentage: 13 }
        ],
        location: [
          { city: 'New York', count: 89 },
          { city: 'San Francisco', count: 76 },
          { city: 'Austin', count: 54 },
          { city: 'Seattle', count: 43 },
          { city: 'Remote', count: 112 }
        ]
      },
      topSkills: [
        { skill: 'React', demand: 95, avgSalary: 85000 },
        { skill: 'Node.js', demand: 87, avgSalary: 82000 },
        { skill: 'Python', demand: 92, avgSalary: 88000 },
        { skill: 'AWS', demand: 78, avgSalary: 95000 },
        { skill: 'TypeScript', demand: 73, avgSalary: 87000 },
        { skill: 'MongoDB', demand: 65, avgSalary: 75000 }
      ],
      salaryTrends: [
        { role: 'Frontend Developer', min: 60000, max: 120000, avg: 85000, trend: 8 },
        { role: 'Backend Developer', min: 65000, max: 130000, avg: 92000, trend: 12 },
        { role: 'Full Stack Developer', min: 70000, max: 140000, avg: 98000, trend: 15 },
        { role: 'DevOps Engineer', min: 75000, max: 150000, avg: 105000, trend: 18 },
        { role: 'Data Scientist', min: 80000, max: 160000, avg: 115000, trend: 22 }
      ]
    };
    
    setAnalytics(mockData);
  };

  const MetricCard = ({ title, value, subtitle, icon: Icon, trend, color = 'blue' }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 text-${color}-600`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground flex items-center">
          {trend && (
            <TrendingUp className={`mr-1 h-3 w-3 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`} />
          )}
          {subtitle}
        </p>
      </CardContent>
    </Card>
  );

  const exportData = () => {
    // Convert analytics data to CSV or JSON for download
    const dataStr = JSON.stringify(analytics, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `analytics_${timeRange}_${Date.now()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            {userRole === 'recruiter' ? 'Track your hiring performance' : 'Monitor job market trends'}
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportData}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title={userRole === 'recruiter' ? 'Active Jobs' : 'Job Views'}
          value={analytics.overview.totalJobs}
          subtitle={`${analytics.overview.responseRate} response rate`}
          icon={Briefcase}
          trend={5}
        />
        <MetricCard
          title={userRole === 'recruiter' ? 'Total Applications' : 'Applications Sent'}
          value={analytics.overview.totalApplications}
          subtitle={`${analytics.overview.successRate}% success rate`}
          icon={Users}
          trend={12}
          color="green"
        />
        <MetricCard
          title="Profile Views"
          value={analytics.overview.viewsThisMonth}
          subtitle="This month"
          icon={Eye}
          trend={8}
          color="purple"
        />
        <MetricCard
          title={userRole === 'recruiter' ? 'Avg Time to Hire' : 'Avg Response Time'}
          value={analytics.overview.avgTimeToHire}
          subtitle="Industry avg: 23 days"
          icon={Calendar}
          trend={-15}
          color="orange"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Application Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Application Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.trends.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium">{item.month}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-muted-foreground">
                      {item.applications} applications
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {item.jobs} jobs
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Most In-Demand Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topSkills.map((skill, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{skill.skill}</span>
                    <Badge variant="secondary">
                      ${(skill.avgSalary / 1000).toFixed(0)}k avg
                    </Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary rounded-full h-2 transition-all duration-500"
                      style={{ width: `${skill.demand}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Salary Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Salary Trends by Role
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4">Role</th>
                  <th className="text-left py-2 px-4">Salary Range</th>
                  <th className="text-left py-2 px-4">Average</th>
                  <th className="text-left py-2 px-4">YoY Growth</th>
                </tr>
              </thead>
              <tbody>
                {analytics.salaryTrends.map((role, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-4 font-medium">{role.role}</td>
                    <td className="py-2 px-4 text-muted-foreground">
                      ${(role.min / 1000).toFixed(0)}k - ${(role.max / 1000).toFixed(0)}k
                    </td>
                    <td className="py-2 px-4">
                      <Badge variant="outline">${(role.avg / 1000).toFixed(0)}k</Badge>
                    </td>
                    <td className="py-2 px-4">
                      <div className={`flex items-center ${role.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        <TrendingUp className="w-4 h-4 mr-1" />
                        {role.trend}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Demographics */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Experience Level Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Experience Level Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.demographics.experienceLevel?.map((level, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{level.level}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary rounded-full h-2"
                        style={{ width: `${level.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-muted-foreground w-8">
                      {level.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Locations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Top Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.demographics.location?.map((location, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="font-medium">{location.city}</span>
                  <Badge variant="secondary">{location.count} jobs</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
