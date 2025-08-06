import { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setUser } from '@/redux/authSlice'
import { Loader2, Mail, Lock, User, ArrowRight } from 'lucide-react'

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "",
    });

    const { loading, user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            const res = await axios.post(
                "http://localhost:3000/api/v1/user/login",
                {
                    email: input.email,
                    password: input.password,
                    role: input.role,
                },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );

            if (res.data.success) {
                dispatch(setUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            // Defensive: check if error.response exists before accessing data.message
            toast.error(error?.response?.data?.message || "Login failed");
        } finally {
            dispatch(setLoading(false));
        }
    }

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
            <Navbar />
            <div className="flex items-center justify-center px-4 py-12">
                <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border border-white/20 backdrop-blur-sm">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <User className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
                        <p className="text-gray-600">Sign in to your account</p>
                    </div>

                    <form onSubmit={submitHandler} className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-gray-700 font-medium">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                    type="email"
                                    value={input.email}
                                    name="email"
                                    onChange={changeEventHandler}
                                    placeholder="you@example.com"
                                    className="pl-10 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-xl transition-all duration-200"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-700 font-medium">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                    type="password"
                                    value={input.password}
                                    name="password"
                                    onChange={changeEventHandler}
                                    placeholder="Enter your password"
                                    className="pl-10 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-xl transition-all duration-200"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-gray-700 font-medium">I am a</Label>
                            <div className="grid grid-cols-2 gap-3">
                                <label className={`flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                                    input.role === 'student' 
                                        ? 'border-purple-500 bg-purple-50 text-purple-700' 
                                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                }`}>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="student"
                                        checked={input.role === 'student'}
                                        onChange={changeEventHandler}
                                        className="sr-only"
                                        required
                                    />
                                    <User className="w-5 h-5 mr-2" />
                                    Student
                                </label>
                                <label className={`flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                                    input.role === 'recruiter' 
                                        ? 'border-purple-500 bg-purple-50 text-purple-700' 
                                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                }`}>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="recruiter"
                                        checked={input.role === 'recruiter'}
                                        onChange={changeEventHandler}
                                        className="sr-only"
                                        required
                                    />
                                    <User className="w-5 h-5 mr-2" />
                                    Recruiter
                                </label>
                            </div>
                        </div>

                        {
                            loading ? (
                                <Button className="w-full h-12 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 disabled:transform-none" disabled>
                                    <Loader2 className='mr-2 h-5 w-5 animate-spin' /> 
                                    Signing in...
                                </Button>
                            ) : (
                                <Button type="submit" className="w-full h-12 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                                    Sign In
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            )
                        }
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                        <span className='text-gray-600'>
                            Don't have an account? {' '}
                            <Link to="/signup" className='text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200'>
                                Create account
                            </Link>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;
