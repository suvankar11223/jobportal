import React, { useState, useEffect } from 'react';
import { Search, MapPin, DollarSign, Clock, Building2, Filter, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';

const AdvancedSearch = ({ onSearch, initialFilters = {} }) => {
    const [searchQuery, setSearchQuery] = useState(initialFilters.query || '');
    const [location, setLocation] = useState(initialFilters.location || '');
    const [salaryRange, setSalaryRange] = useState(initialFilters.salaryRange || [0, 200000]);
    const [experienceLevel, setExperienceLevel] = useState(initialFilters.experienceLevel || '');
    const [jobType, setJobType] = useState(initialFilters.jobType || '');
    const [companySize, setCompanySize] = useState(initialFilters.companySize || '');
    const [industry, setIndustry] = useState(initialFilters.industry || '');
    const [remoteWork, setRemoteWork] = useState(initialFilters.remoteWork || '');
    const [skills, setSkills] = useState(initialFilters.skills || []);
    const [skillInput, setSkillInput] = useState('');
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
    const [userLocation, setUserLocation] = useState(null);

    // Get user's current location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => console.log('Geolocation error:', error)
            );
        }
    }, []);

    const popularSkills = [
        'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'SQL', 'AWS', 
        'Docker', 'MongoDB', 'TypeScript', 'Next.js', 'GraphQL'
    ];

    const industries = [
        'Technology', 'Healthcare', 'Finance', 'Education', 'Retail',
        'Manufacturing', 'Consulting', 'Media', 'Government', 'Non-profit'
    ];

    const companySizes = [
        'Startup (1-10)', 'Small (11-50)', 'Medium (51-200)', 
        'Large (201-1000)', 'Enterprise (1000+)'
    ];

    const addSkill = (skill) => {
        if (skill && !skills.includes(skill)) {
            setSkills([...skills, skill]);
            setSkillInput('');
        }
    };

    const removeSkill = (skillToRemove) => {
        setSkills(skills.filter(skill => skill !== skillToRemove));
    };

    const handleSearch = () => {
        const filters = {
            query: searchQuery,
            location,
            salaryRange,
            experienceLevel,
            jobType,
            companySize,
            industry,
            remoteWork,
            skills,
            userLocation
        };
        onSearch(filters);
    };

    const clearFilters = () => {
        setSearchQuery('');
        setLocation('');
        setSalaryRange([0, 200000]);
        setExperienceLevel('');
        setJobType('');
        setCompanySize('');
        setIndustry('');
        setRemoteWork('');
        setSkills([]);
        setSkillInput('');
    };

    return (
        <Card className="w-full mb-6">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Search className="w-5 h-5" />
                        Smart Job Search
                    </CardTitle>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                    >
                        <Filter className="w-4 h-4 mr-2" />
                        Advanced Filters
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Basic Search */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Job title, keywords, or company"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Button onClick={handleSearch} className="w-full">
                        Search Jobs
                    </Button>
                </div>

                {/* Advanced Filters */}
                {isAdvancedOpen && (
                    <div className="space-y-6 pt-4 border-t">
                        {/* Salary Range */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <DollarSign className="w-4 h-4" />
                                Salary Range: ${salaryRange[0].toLocaleString()} - ${salaryRange[1].toLocaleString()}
                            </label>
                            <Slider
                                value={salaryRange}
                                onValueChange={setSalaryRange}
                                max={200000}
                                min={0}
                                step={5000}
                                className="w-full"
                            />
                        </div>

                        {/* Filter Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="text-sm font-medium flex items-center gap-2 mb-2">
                                    <Clock className="w-4 h-4" />
                                    Experience Level
                                </label>
                                <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select experience" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">Entry Level (0-1 years)</SelectItem>
                                        <SelectItem value="1">Junior (1-3 years)</SelectItem>
                                        <SelectItem value="3">Mid-Level (3-5 years)</SelectItem>
                                        <SelectItem value="5">Senior (5-8 years)</SelectItem>
                                        <SelectItem value="8">Lead (8+ years)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-2 block">Job Type</label>
                                <Select value={jobType} onValueChange={setJobType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select job type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Full-time">Full-time</SelectItem>
                                        <SelectItem value="Part-time">Part-time</SelectItem>
                                        <SelectItem value="Contract">Contract</SelectItem>
                                        <SelectItem value="Freelance">Freelance</SelectItem>
                                        <SelectItem value="Internship">Internship</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="text-sm font-medium flex items-center gap-2 mb-2">
                                    <Building2 className="w-4 h-4" />
                                    Company Size
                                </label>
                                <Select value={companySize} onValueChange={setCompanySize}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select company size" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {companySizes.map(size => (
                                            <SelectItem key={size} value={size}>{size}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-2 block">Industry</label>
                                <Select value={industry} onValueChange={setIndustry}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select industry" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {industries.map(ind => (
                                            <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Remote Work Options */}
                        <div>
                            <label className="text-sm font-medium mb-2 block">Remote Work</label>
                            <Select value={remoteWork} onValueChange={setRemoteWork}>
                                <SelectTrigger className="w-full md:w-64">
                                    <SelectValue placeholder="Select remote preference" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="on-site">On-site only</SelectItem>
                                    <SelectItem value="hybrid">Hybrid</SelectItem>
                                    <SelectItem value="remote">Fully remote</SelectItem>
                                    <SelectItem value="flexible">Flexible</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Skills */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium">Skills</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {skills.map(skill => (
                                    <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                                        {skill}
                                        <X 
                                            className="w-3 h-3 cursor-pointer" 
                                            onClick={() => removeSkill(skill)}
                                        />
                                    </Badge>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Add a skill"
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            addSkill(skillInput);
                                        }
                                    }}
                                />
                                <Button 
                                    variant="outline" 
                                    onClick={() => addSkill(skillInput)}
                                    disabled={!skillInput}
                                >
                                    Add
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <span className="text-sm text-muted-foreground">Popular skills:</span>
                                {popularSkills.map(skill => (
                                    <Badge 
                                        key={skill} 
                                        variant="outline" 
                                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                                        onClick={() => addSkill(skill)}
                                    >
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-4 border-t">
                            <Button onClick={handleSearch} className="flex-1">
                                Apply Filters
                            </Button>
                            <Button variant="outline" onClick={clearFilters}>
                                Clear All
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default AdvancedSearch;
