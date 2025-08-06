import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Play, 
  RotateCcw,
  Award,
  Target,
  Brain,
  Code,
  FileText,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { useSelector } from 'react-redux';

const SkillAssessment = () => {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [results, setResults] = useState(null);
  const [assessmentHistory, setAssessmentHistory] = useState([]);
  const { user } = useSelector(store => store.auth);

  const skillAssessments = [
    {
      id: 'javascript',
      name: 'JavaScript',
      level: 'Intermediate',
      duration: 30,
      questionCount: 25,
      description: 'Test your knowledge of ES6+, async programming, and modern JavaScript concepts',
      topics: ['ES6+ Features', 'Async/Await', 'DOM Manipulation', 'Error Handling', 'Closures'],
      difficulty: 'Intermediate',
      badge: 'javascript-certified',
      questions: [
        {
          id: 1,
          question: "What is the output of the following code?\n\nconst arr = [1, 2, 3];\nconst [a, ...rest] = arr;\nconsole.log(rest);",
          options: ["[1, 2, 3]", "[2, 3]", "[1]", "undefined"],
          correct: 1,
          explanation: "The rest operator (...rest) captures the remaining elements after destructuring 'a' gets the first element."
        },
        {
          id: 2,
          question: "Which method would you use to create a new array with all elements that pass a test?",
          options: ["map()", "filter()", "reduce()", "forEach()"],
          correct: 1,
          explanation: "filter() creates a new array with all elements that pass the test implemented by the provided function."
        },
        {
          id: 3,
          question: "What is a closure in JavaScript?",
          options: [
            "A function that returns another function",
            "A function that has access to variables in its outer scope",
            "A method to close browser windows",
            "A way to end function execution"
          ],
          correct: 1,
          explanation: "A closure gives you access to an outer function's scope from an inner function."
        }
      ]
    },
    {
      id: 'react',
      name: 'React',
      level: 'Advanced',
      duration: 45,
      questionCount: 30,
      description: 'Advanced React concepts including hooks, context, performance optimization',
      topics: ['Hooks', 'Context API', 'Performance', 'Component Lifecycle', 'State Management'],
      difficulty: 'Advanced',
      badge: 'react-expert',
      questions: [
        {
          id: 1,
          question: "When should you use useCallback hook?",
          options: [
            "To cache expensive calculations",
            "To memoize functions to prevent unnecessary re-renders",
            "To handle side effects",
            "To manage component state"
          ],
          correct: 1,
          explanation: "useCallback returns a memoized version of the callback that only changes if dependencies change, preventing unnecessary re-renders."
        },
        {
          id: 2,
          question: "What is the correct way to update state based on previous state?",
          options: [
            "setState(state + 1)",
            "setState(prevState => prevState + 1)",
            "setState(this.state + 1)",
            "setState(state++)"
          ],
          correct: 1,
          explanation: "Using the functional update form ensures you get the latest state value, especially important with async updates."
        }
      ]
    },
    {
      id: 'python',
      name: 'Python',
      level: 'Intermediate',
      duration: 40,
      questionCount: 28,
      description: 'Python fundamentals, data structures, OOP, and popular libraries',
      topics: ['Data Structures', 'OOP', 'List Comprehensions', 'Decorators', 'Exception Handling'],
      difficulty: 'Intermediate',
      badge: 'python-certified',
      questions: [
        {
          id: 1,
          question: "What is the output of: print([i**2 for i in range(3)])?",
          options: ["[0, 1, 4]", "[1, 4, 9]", "[0, 1, 2]", "Error"],
          correct: 0,
          explanation: "List comprehension squares each number in range(3) which is [0, 1, 2], resulting in [0, 1, 4]."
        }
      ]
    }
  ];

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleAssessmentComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const startAssessment = (skill) => {
    setSelectedSkill(skill);
    setCurrentQuestion(0);
    setAnswers([]);
    setTimeLeft(skill.duration * 60); // Convert minutes to seconds
    setIsActive(true);
    setResults(null);
  };

  const handleAnswer = (answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = {
      questionId: selectedSkill.questions[currentQuestion].id,
      selected: answerIndex,
      correct: selectedSkill.questions[currentQuestion].correct,
      isCorrect: answerIndex === selectedSkill.questions[currentQuestion].correct
    };
    setAnswers(newAnswers);

    if (currentQuestion < selectedSkill.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleAssessmentComplete();
    }
  };

  const handleAssessmentComplete = () => {
    setIsActive(false);
    
    const correctAnswers = answers.filter(answer => answer.isCorrect).length;
    const totalQuestions = selectedSkill.questions.length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    
    let grade = 'F';
    let level = 'Beginner';
    if (score >= 90) { grade = 'A+'; level = 'Expert'; }
    else if (score >= 80) { grade = 'A'; level = 'Advanced'; }
    else if (score >= 70) { grade = 'B'; level = 'Intermediate'; }
    else if (score >= 60) { grade = 'C'; level = 'Basic'; }
    
    const result = {
      skill: selectedSkill.name,
      score,
      grade,
      level,
      correctAnswers,
      totalQuestions,
      timeSpent: (selectedSkill.duration * 60) - timeLeft,
      completedAt: new Date(),
      badge: score >= 80 ? selectedSkill.badge : null
    };

    setResults(result);
    
    // Add to history
    setAssessmentHistory(prev => [result, ...prev]);
  };

  const resetAssessment = () => {
    setSelectedSkill(null);
    setCurrentQuestion(0);
    setAnswers([]);
    setTimeLeft(0);
    setIsActive(false);
    setResults(null);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Assessment Selection View
  if (!selectedSkill) {
    return (
      <div className="space-y-6 p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold flex items-center justify-center gap-2 mb-4">
            <Trophy className="w-8 h-8 text-primary" />
            Skill Assessments
          </h1>
          <p className="text-muted-foreground">
            Test your skills and earn certificates to showcase your expertise
          </p>
        </div>

        {/* Assessment History */}
        {assessmentHistory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Your Recent Assessments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {assessmentHistory.slice(0, 3).map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant={result.score >= 80 ? 'default' : 'secondary'}>
                        {result.skill}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {result.completedAt.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${getScoreColor(result.score)}`}>
                        {result.score}%
                      </span>
                      <Badge variant="outline">{result.grade}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Available Assessments */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {skillAssessments.map(skill => (
            <Card key={skill.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="w-5 h-5" />
                      {skill.name}
                    </CardTitle>
                    <Badge variant="secondary" className="mt-2">
                      {skill.difficulty}
                    </Badge>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {skill.duration}min
                    </div>
                    <div>{skill.questions.length} questions</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {skill.description}
                  </p>
                  
                  <div>
                    <h4 className="font-medium mb-2">Topics Covered:</h4>
                    <div className="flex flex-wrap gap-1">
                      {skill.topics.map(topic => (
                        <Badge key={topic} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={() => startAssessment(skill)}
                    className="w-full"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Assessment
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Results View
  if (results) {
    return (
      <div className="space-y-6 p-6 max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Assessment Complete!</CardTitle>
            <div className={`text-4xl font-bold ${getScoreColor(results.score)} mt-4`}>
              {results.score}%
            </div>
            <Badge variant={results.score >= 80 ? 'default' : 'secondary'} className="mt-2">
              Grade: {results.grade} - {results.level}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-green-600">
                    {results.correctAnswers}
                  </div>
                  <div className="text-sm text-muted-foreground">Correct Answers</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold">
                    {formatTime(results.timeSpent)}
                  </div>
                  <div className="text-sm text-muted-foreground">Time Spent</div>
                </div>
              </div>

              {results.badge && (
                <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                  <Trophy className="w-12 h-12 text-yellow-600 mx-auto mb-2" />
                  <h3 className="font-bold text-lg">Congratulations!</h3>
                  <p className="text-sm text-muted-foreground">
                    You've earned the {selectedSkill.name} certification badge!
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={resetAssessment} variant="outline" className="flex-1">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Take Another
                </Button>
                <Button 
                  onClick={() => {
                    // Share or download certificate
                    console.log('Sharing certificate...');
                  }}
                  className="flex-1"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Get Certificate
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Assessment in Progress View
  const currentQ = selectedSkill.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / selectedSkill.questions.length) * 100;

  return (
    <div className="space-y-6 p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{selectedSkill.name} Assessment</h1>
          <p className="text-muted-foreground">
            Question {currentQuestion + 1} of {selectedSkill.questions.length}
          </p>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${timeLeft < 300 ? 'text-red-600' : 'text-primary'}`}>
            {formatTime(timeLeft)}
          </div>
          <p className="text-xs text-muted-foreground">Time remaining</p>
        </div>
      </div>

      {/* Progress */}
      <Progress value={progress} className="w-full" />

      {/* Question */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Question {currentQuestion + 1}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="text-lg font-medium leading-relaxed whitespace-pre-line">
              {currentQ.question}
            </div>
            
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full p-4 text-left justify-start h-auto"
                  onClick={() => handleAnswer(index)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full border-2 border-muted-foreground flex items-center justify-center text-sm font-medium">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span>{option}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SkillAssessment;
