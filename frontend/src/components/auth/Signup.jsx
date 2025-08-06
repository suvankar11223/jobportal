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
import { setLoading } from '@/redux/authSlice'
import { Loader2, Mail, Lock, User, Phone, UserPlus, ArrowRight, Upload } from 'lucide-react'

const Signup = () => {

    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "",
        file: ""
    });
    const {loading,user} = useSelector(store=>store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }
    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    }
    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();    //formdata object
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("role", input.role);
        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`http://localhost:3000/api/v1/user/register`, formData, {
                headers: { 'Content-Type': "multipart/form-data" },
                withCredentials: true,
            });
            if (res.data.success) {
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Signup failed");
        } finally{
            dispatch(setLoading(false));
        }
    }

    useEffect(()=>{
        if(user){
            navigate("/");
        }
    },[user, navigate])
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
            <Navbar />
            <div className="flex items-center justify-center px-4 py-12">
                <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg border border-white/20 backdrop-blur-sm">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <UserPlus className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Join Us Today</h1>
                        <p className="text-gray-600">Create your account to get started</p>
                    </div>

                    <form onSubmit={submitHandler} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <Label className="text-gray-700 font-medium">Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <Input
                                        type="text"
                                        value={input.fullname}
                                        name="fullname"
                                        onChange={changeEventHandler}
                                        placeholder="John Doe"
                                        className="pl-10 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-xl transition-all duration-200"
                                        required
                                    />
                                </div>
                            </div>

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
                                <Label className="text-gray-700 font-medium">Phone Number</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <Input
                                        type="tel"
                                        value={input.phoneNumber}
                                        name="phoneNumber"
                                        onChange={changeEventHandler}
                                        placeholder="+1 (555) 000-0000"
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
                                        placeholder="Create a strong password"
                                        className="pl-10 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-xl transition-all duration-200"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
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

                            <div className="space-y-2">
                                <Label className="text-gray-700 font-medium">Profile Photo (Optional)</Label>
                                <div className="relative">
                                    <div className="flex items-center justify-center w-full">
                                        <label className="flex flex-col items-center justify-center w-full h-16 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                                            <div className="flex items-center justify-center">
                                                <Upload className="w-5 h-5 mr-2 text-gray-500" />
                                                <p className="text-sm text-gray-500">
                                                    {input.file ? input.file.name : "Click to upload profile photo"}
                                                </p>
                                            </div>
                                            <Input
                                                accept="image/*"
                                                type="file"
                                                onChange={changeFileHandler}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {
                            loading ? (
                                <Button className="w-full h-12 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 disabled:transform-none" disabled>
                                    <Loader2 className='mr-2 h-5 w-5 animate-spin' /> 
                                    Creating account...
                                </Button>
                            ) : (
                                <Button type="submit" className="w-full h-12 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                                    Create Account
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            )
                        }
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                        <span className='text-gray-600'>
                            Already have an account? {' '}
                            <Link to="/login" className='text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200'>
                                Sign in
                            </Link>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup;
