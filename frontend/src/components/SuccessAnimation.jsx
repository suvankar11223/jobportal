import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

const SuccessAnimation = ({ isVisible, onClose, onNavigateToAppliedJobs }) => {
  const [showGlitters, setShowGlitters] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowGlitters(true);
      const timer = setTimeout(() => setShowGlitters(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const glitterVariants = {
    hidden: { opacity: 0, scale: 0, rotate: 0 },
    visible: {
      opacity: [0, 1, 1, 0],
      scale: [0, 1.2, 1, 0],
      rotate: [0, 180, 360],
      transition: {
        duration: 2,
        ease: "easeInOut",
        times: [0, 0.2, 0.8, 1]
      }
    }
  };

  const createGlitters = () => {
    const glitters = [];
    for (let i = 0; i < 50; i++) {
      const randomDelay = Math.random() * 2;
      const randomX = Math.random() * 100;
      const randomY = Math.random() * 100;
      const randomColor = ['text-yellow-400', 'text-pink-400', 'text-blue-400', 'text-purple-400', 'text-green-400'][Math.floor(Math.random() * 5)];
      
      glitters.push(
        <motion.div
          key={i}
          className={`absolute ${randomColor}`}
          style={{
            left: `${randomX}%`,
            top: `${randomY}%`,
          }}
          variants={glitterVariants}
          initial="hidden"
          animate={showGlitters ? "visible" : "hidden"}
          transition={{ delay: randomDelay }}
        >
          <Sparkles className="w-6 h-6" />
        </motion.div>
      );
    }
    return glitters;
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 180, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300, duration: 0.8 }}
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full mx-4 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glitter Animation Container */}
            <div className="absolute inset-0 pointer-events-none">
              {createGlitters()}
            </div>

            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 opacity-50"></div>
            
            {/* Content */}
            <div className="relative z-10 p-12 text-center">
              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", damping: 15, stiffness: 400 }}
                className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mb-8 shadow-xl"
              >
                <CheckCircle className="w-12 h-12 text-white" />
              </motion.div>

              {/* Main Message */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="mb-8"
              >
                <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent leading-tight"
                    style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}>
                  Booyah! 🎉
                </h1>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 leading-tight"
                    style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}>
                  One step closer to
                </h2>
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent leading-tight"
                    style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}>
                  brighter future! ✨
                </h2>
              </motion.div>

              {/* Sub Message */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="text-gray-600 text-lg mb-8 leading-relaxed max-w-lg mx-auto"
              >
                Your application has been successfully submitted! 🚀 
                <br />
                <span className="font-semibold text-purple-700">Great opportunities await ahead!</span>
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <Button
                  onClick={onNavigateToAppliedJobs}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center group"
                >
                  View Applied Jobs
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="px-6 py-3 rounded-xl font-semibold text-lg border-2 border-gray-300 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300"
                >
                  Continue Browsing
                </Button>
              </motion.div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{
                y: [-10, 10, -10],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-4 left-4 text-yellow-400"
            >
              <Sparkles className="w-8 h-8" />
            </motion.div>
            
            <motion.div
              animate={{
                y: [10, -10, 10],
                rotate: [0, -5, 5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-6 right-6 text-pink-400"
            >
              <Sparkles className="w-6 h-6" />
            </motion.div>
            
            <motion.div
              animate={{
                y: [-5, 15, -5],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute bottom-4 left-8 text-blue-400"
            >
              <Sparkles className="w-7 h-7" />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessAnimation;
