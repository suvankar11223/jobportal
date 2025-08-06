import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Sparkles, 
  Target, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const SmartJobMatcher = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [skillGaps, setSkillGaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchingScore, setMatchingScore] = useState(0);
  const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      generateSmartRecommendations();
    }
  }, [user]);

  const generateSmartRecommendations = async () => {
    setLoading(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock AI-powered job matching algorithm
    const userSkills = user?.profile?.skills || [];
    const userExperience = calculateExperience(user?.profile?.resume);
    
    const mockRecommendations = [
      {
        id: 1,
        title: 'Senior React Developer',
        company: 'TechCorp Inc.',
        location: 'San Francisco, CA',
        salary: '$120,000 - $150,000',
        matchScore: 94,
        reasons: [
          'Perfect skill match: React, JavaScript, Node.js',
          'Experience level aligns with requirements',
          'Company culture fits your preferences'
        ],
        missingSkills: ['TypeScript', 'GraphQL'],
        urgency: 'High',
        type: 'Full-time',
        posted: '2 days ago',
        applicants: 23
      },
      {
        id: 2,
        title: 'Full Stack Developer',
        company: 'StartupX',
        location: 'Remote',
        salary: '$90,000 - $120,000',
        matchScore: 87,
        reasons: [
          'Strong match: Full-stack skills',
          'Remote work preference match',
          'Startup environment preference'
        ],
        missingSkills: ['Docker', 'Kubernetes'],
        urgency: 'Medium',
        type: 'Full-time',
        posted: '1 week ago',
        applicants: 45
      },
      {
        id: 3,
        title: 'Frontend Developer',
        company: 'Design Studio',
        location: 'New York, NY',
        salary: '$85,000 - $110,000',
        matchScore: 82,
        reasons: [
          'Frontend skills alignment',
          'Design-focused role matches interests',
          'Good salary range for experience level'
        ],
        missingSkills: ['Figma', 'UI/UX Design'],
        urgency: 'Low',
        type: 'Full-time',
        posted: '3 days ago',
        applicants: 18
      }
    ];

    // Simulate skill gap analysis
    const mockSkillGaps = [
      {
        skill: 'TypeScript',
        importance: 'High',
        demandIncrease: 45,
        averageSalaryBoost: 15000,
        timeToLearn: '2-3 months',
        resources: [
          'TypeScript Official Docs',
          'TypeScript Deep Dive (Free Book)',
          'Udemy TypeScript Course'
        ]
      },
      {
        skill: 'GraphQL',
        importance: 'Medium',
        demandIncrease: 32,
        averageSalaryBoost: 12000,
        timeToLearn: '1-2 months',
        resources: [
          'GraphQL Official Tutorial',
          'Apollo GraphQL Course',
          'The Road to GraphQL'
        ]
      },
      {
        skill: 'Docker',
        importance: 'High',
        demandIncrease: 38,
        averageSalaryBoost: 18000,
        timeToLearn: '1-2 months',
        resources: [
          'Docker Official Documentation',
          'Docker for Developers Course',
          'Play with Docker'
        ]
      }
    ];

    setRecommendations(mockRecommendations);
    setSkillGaps(mockSkillGaps);
    setMatchingScore(Math.round(mockRecommendations.reduce((acc, job) => acc + job.matchScore, 0) / mockRecommendations.length));
    setLoading(false);
  };

  const calculateExperience = (resume) => {
    // Simple heuristic - would be more sophisticated in real implementation
    if (!resume) return 0;
    const currentYear = new Date().getFullYear();
    return Math.max(0, currentYear - 2020); // Placeholder logic
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency.toLowerCase()) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  const getMatchScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const JobRecommendationCard = ({ job }) => (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/description/${job.id}`)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{job.title}</CardTitle>
            <p className="text-muted-foreground">{job.company} • {job.location}</p>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${getMatchScoreColor(job.matchScore)}`}>
              {job.matchScore}%
            </div>
            <p className="text-xs text-muted-foreground">Match Score</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Job Details */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="font-medium">{job.salary}</span>
              <Badge variant={getUrgencyColor(job.urgency)}>{job.urgency} Priority</Badge>
            </div>
            <div className="text-muted-foreground">
              {job.applicants} applicants • {job.posted}
            </div>
          </div>

          {/* Why This Job Matches */}
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Why this matches you:
            </h4>
            <ul className="space-y-1">
              {job.reasons.map((reason, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                  {reason}
                </li>
              ))}
            </ul>
          </div>

          {/* Skills to Develop */}
          {job.missingSkills.length > 0 && (
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Skills to develop:
              </h4>
              <div className="flex flex-wrap gap-2">
                {job.missingSkills.map(skill => (
                  <Badge key={skill} variant="outline" className="text-orange-600">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Button className="w-full" onClick={(e) => {
            e.stopPropagation();
            navigate(`/description/${job.id}`);
          }}>
            View Details & Apply
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const SkillGapCard = ({ skill }) => (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          {skill.skill}
          <Badge variant={skill.importance === 'High' ? 'destructive' : 'secondary'}>
            {skill.importance}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Demand Increase</p>
              <p className="font-medium text-green-600">+{skill.demandIncrease}%</p>
            </div>
            <div>
              <p className="text-muted-foreground">Salary Boost</p>
              <p className="font-medium">+${skill.averageSalaryBoost.toLocaleString()}</p>
            </div>
          </div>
          
          <div>
            <p className="text-muted-foreground text-sm">Time to Learn</p>
            <p className="font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {skill.timeToLearn}
            </p>
          </div>

          <div>
            <p className="font-medium mb-2">Learning Resources:</p>
            <ul className="space-y-1">
              {skill.resources.map((resource, index) => (
                <li key={index} className="text-sm text-blue-600 hover:underline cursor-pointer">
                  • {resource}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin">
                <Brain className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium">AI is analyzing your profile...</h3>
                <p className="text-muted-foreground">
                  Finding the perfect job matches based on your skills and preferences
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-primary" />
            Smart Job Recommendations
          </h1>
          <p className="text-muted-foreground">
            AI-powered job matching based on your profile and preferences
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-primary">{matchingScore}%</div>
          <p className="text-sm text-muted-foreground">Average Match Score</p>
        </div>
      </div>

      {/* Recommendations */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Recommended for You</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
          {recommendations.map(job => (
            <JobRecommendationCard key={job.id} job={job} />
          ))}
        </div>
      </div>

      {/* Skill Gap Analysis */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-6 h-6" />
          <h2 className="text-2xl font-semibold">Skills to Boost Your Career</h2>
        </div>
        <p className="text-muted-foreground">
          These skills are in high demand and could significantly improve your job prospects
        </p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {skillGaps.map(skill => (
            <SkillGapCard key={skill.skill} skill={skill} />
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2">Ready to level up your career?</h3>
              <p className="text-muted-foreground">
                Get more personalized recommendations by completing your profile
              </p>
            </div>
            <Button onClick={() => navigate('/profile')}>
              Complete Profile
              <Star className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartJobMatcher;
