import React, { useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2, User, Mail, Phone, FileText, Code, Upload, X } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { Badge } from './ui/badge'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const UpdateProfileDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);

    const [input, setInput] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio || "",
        skills: user?.profile?.skills?.join(", ") || "",
        file: null
    });
    const [currentSkill, setCurrentSkill] = useState("");
    const [skillsArray, setSkillsArray] = useState(user?.profile?.skills || []);
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file })
    }

    const addSkill = (e) => {
        e.preventDefault();
        if (currentSkill.trim() && !skillsArray.includes(currentSkill.trim())) {
            const newSkillsArray = [...skillsArray, currentSkill.trim()];
            setSkillsArray(newSkillsArray);
            setInput({ ...input, skills: newSkillsArray.join(", ") });
            setCurrentSkill("");
        }
    }

    const removeSkill = (skillToRemove) => {
        const newSkillsArray = skillsArray.filter(skill => skill !== skillToRemove);
        setSkillsArray(newSkillsArray);
        setInput({ ...input, skills: newSkillsArray.join(", ") });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("bio", input.bio);
        formData.append("skills", input.skills);
        if (input.file) {
            formData.append("file", input.file);
        }
        try {
            setLoading(true);
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally{
            setLoading(false);
        }
        setOpen(false);
        console.log(input);
    }



    return (
        <div>
            <Dialog open={open}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto" onInteractOutside={() => setOpen(false)}>
                    <DialogHeader className="pb-6">
                        <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                            Update Your Profile
                        </DialogTitle>
                    </DialogHeader>
                    
                    <form onSubmit={submitHandler} className="space-y-6">
                        <div className="grid gap-6">
                            {/* Personal Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                    <User className="w-5 h-5 mr-2 text-purple-600" />
                                    Personal Information
                                </h3>
                                
                                <div className="space-y-2">
                                    <Label className="text-gray-700 font-medium">Full Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <Input
                                            name="fullname"
                                            type="text"
                                            value={input.fullname}
                                            onChange={changeEventHandler}
                                            placeholder="Enter your full name"
                                            className="pl-10 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-lg"
                                        />
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-gray-700 font-medium">Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <Input
                                                name="email"
                                                type="email"
                                                value={input.email}
                                                onChange={changeEventHandler}
                                                placeholder="your@email.com"
                                                className="pl-10 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-lg"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label className="text-gray-700 font-medium">Phone Number</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <Input
                                                name="phoneNumber"
                                                type="tel"
                                                value={input.phoneNumber}
                                                onChange={changeEventHandler}
                                                placeholder="+1 (555) 000-0000"
                                                className="pl-10 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-lg"
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <Label className="text-gray-700 font-medium">Bio</Label>
                                    <textarea
                                        name="bio"
                                        value={input.bio}
                                        onChange={changeEventHandler}
                                        placeholder="Tell us about yourself..."
                                        rows={3}
                                        className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:border-purple-500 focus:ring-purple-500 transition-colors duration-200 resize-none"
                                    />
                                </div>
                            </div>
                            
                            {/* Skills Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                    <Code className="w-5 h-5 mr-2 text-purple-600" />
                                    Skills
                                </h3>
                                
                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <Input
                                            value={currentSkill}
                                            onChange={(e) => setCurrentSkill(e.target.value)}
                                            placeholder="Add a skill (e.g., React, Node.js)"
                                            className="flex-1 h-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-lg"
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    addSkill(e);
                                                }
                                            }}
                                        />
                                        <Button
                                            type="button"
                                            onClick={addSkill}
                                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
                                        >
                                            Add
                                        </Button>
                                    </div>
                                    
                                    {skillsArray.length > 0 && (
                                        <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg">
                                            {skillsArray.map((skill, index) => (
                                                <Badge
                                                    key={index}
                                                    variant="secondary"
                                                    className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors duration-200"
                                                >
                                                    {skill}
                                                    <X
                                                        className="w-3 h-3 cursor-pointer hover:text-red-600 transition-colors duration-200"
                                                        onClick={() => removeSkill(skill)}
                                                    />
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                    
                                    <p className="text-sm text-gray-500">
                                        Add skills that are relevant to your career goals. Click on a skill to remove it.
                                    </p>
                                </div>
                            </div>
                            
                            {/* Resume Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                    <FileText className="w-5 h-5 mr-2 text-purple-600" />
                                    Resume
                                </h3>
                                
                                <div className="space-y-2">
                                    <Label className="text-gray-700 font-medium">Upload Resume (PDF only)</Label>
                                    <div className="relative">
                                        <div className="flex items-center justify-center w-full">
                                            <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                                                <div className="flex items-center justify-center">
                                                    <Upload className="w-6 h-6 mr-2 text-gray-500" />
                                                    <p className="text-sm text-gray-500">
                                                        {input.file ? input.file.name : "Click to upload your resume"}
                                                    </p>
                                                </div>
                                                <p className="text-xs text-gray-400 mt-1">PDF files only, max 10MB</p>
                                                <Input
                                                    type="file"
                                                    accept="application/pdf"
                                                    onChange={fileChangeHandler}
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>
                                    </div>
                                    
                                    {user?.profile?.resume && (
                                        <div className="p-3 bg-blue-50 rounded-lg">
                                            <p className="text-sm text-blue-800">
                                                Current resume: <a href={user.profile.resume} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline">
                                                    {user.profile.resumeOriginalName || "View Resume"}
                                                </a>
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <DialogFooter className="pt-6">
                            <div className="flex gap-3 w-full">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setOpen(false)}
                                    className="flex-1 h-12 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                                >
                                    Cancel
                                </Button>
                                {
                                    loading ? (
                                        <Button className="flex-1 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-lg transition-all duration-200" disabled>
                                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                            Updating...
                                        </Button>
                                    ) : (
                                        <Button type="submit" className="flex-1 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                                            Update Profile
                                        </Button>
                                    )
                                }
                            </div>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default UpdateProfileDialog