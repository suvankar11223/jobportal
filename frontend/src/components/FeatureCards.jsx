import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, BarChart3, Trophy, Bookmark, Search, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

const FeatureCards = () => {
  const { user } = useSelector(store => store.auth);

  // Only show features if user is logged in and is a student
  if (!user || user.role !== 'student') {
    return null;
  }

  const features = [
    {
      icon: Brain,
      title: 'Smart Job Matcher',
      description: 'AI-powered job recommendations tailored to your skills and preferences',
      link: '/smart-matcher',
      color: 'from-purple-500 to-indigo-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      icon: Trophy,
      title: 'Skill Assessment',
      description: 'Test and showcase your technical skills to potential employers',
      link: '/skill-assessment',
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600'
    },
    {
      icon: BarChart3,
      title: 'Career Analytics',
      description: 'Track your job application progress and career insights',
      link: '/analytics',
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600'
    },
    {
      icon: Bookmark,
      title: 'Saved Jobs',
      description: 'Keep track of interesting job opportunities for later review',
      link: '/saved-jobs',
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Explore Powerful Features
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Take advantage of our advanced tools to accelerate your job search and career growth
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <Link
                  to={feature.link}
                  className="block p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 hover:border-purple-200"
                >
                  <div className={`w-14 h-14 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className={`w-7 h-7 ${feature.iconColor}`} />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  
                  <div className={`w-full h-1 bg-gradient-to-r ${feature.color} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Quick Actions */}
        <div className="mt-12 flex flex-wrap gap-4 justify-center">
          <Link
            to="/jobs"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Search className="w-5 h-5 mr-2" />
            Browse All Jobs
          </Link>
          
          <Link
            to="/browse"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-slate-600 to-gray-700 text-white font-medium rounded-xl hover:from-slate-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Users className="w-5 h-5 mr-2" />
            Browse Companies
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;
