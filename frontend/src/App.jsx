import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from './components/shared/Navbar'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Home from './components/Home'
import Jobs from './components/Jobs'
import Browse from './components/Browse'
import Profile from './components/Profile'
import JobDescription from './components/JobDescription'
import Companies from './components/admin/Companies'
import CompanyCreate from './components/admin/CompanyCreate'
import CompanySetup from './components/admin/CompanySetup'
import AdminJobs from "./components/admin/AdminJobs";
import PostJob from './components/admin/PostJob'
import Applicants from './components/admin/Applicants'
import AdminDashboard from './components/admin/AdminDashboard'
import ProtectedRoute from './components/admin/ProtectedRoute'
import SavedJobs from './components/SavedJobs'
import SmartJobMatcher from './components/SmartJobMatcher'
import AnalyticsDashboard from './components/AnalyticsDashboard'
import SkillAssessment from './components/SkillAssessment'
import { ThemeProvider } from './components/theme-provider'


const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: "/jobs",
    element: <Jobs />
  },
  {
    path: "/description/:id",
    element: <JobDescription />
  },
  {
    path: "/browse",
    element: <Browse />
  },
  {
    path: "/profile",
    element: <Profile />
  },
  {
    path: "/saved-jobs",
    element: <SavedJobs />
  },
  {
    path: "/smart-matcher",
    element: <SmartJobMatcher />
  },
  {
    path: "/analytics",
    element: <AnalyticsDashboard />
  },
  {
    path: "/skill-assessment",
    element: <SkillAssessment />
  },
  // admin ke liye yha se start hoga
  {
    path:"/admin/dashboard",
    element: <ProtectedRoute><AdminDashboard/></ProtectedRoute>
  },
  {
    path:"/admin/companies",
    element: <ProtectedRoute><Companies/></ProtectedRoute>
  },
  {
    path:"/admin/companies/create",
    element: <ProtectedRoute><CompanyCreate/></ProtectedRoute> 
  },
  {
    path:"/admin/companies/:id",
    element:<ProtectedRoute><CompanySetup/></ProtectedRoute> 
  },
  {
    path:"/admin/jobs",
    element:<ProtectedRoute><AdminJobs/></ProtectedRoute> 
  },
  {
    path:"/admin/jobs/create",
    element:<ProtectedRoute><PostJob/></ProtectedRoute> 
  },
  {
    path:"/admin/jobs/:id/applicants",
    element:<ProtectedRoute><Applicants/></ProtectedRoute> 
  },

])
function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="jobportal-theme">
      <div>
        <RouterProvider router={appRouter} />
      </div>
    </ThemeProvider>
  )
}

export default App
