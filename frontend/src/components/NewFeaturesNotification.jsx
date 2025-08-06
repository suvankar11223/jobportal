import React, { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

const NewFeaturesNotification = () => {
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Check if user has seen the notification
    const hasSeenNotification = localStorage.getItem('hasSeenNewFeatures');
    if (!hasSeenNotification) {
      setShowNotification(true);
    }
  }, []);

  const closeNotification = () => {
    setShowNotification(false);
    localStorage.setItem('hasSeenNewFeatures', 'true');
  };

  if (!showNotification) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-2">
              <Sparkles className="w-5 h-5 mt-0.5 text-yellow-300" />
              <div>
                <h3 className="font-semibold text-sm">New Features Available!</h3>
                <p className="text-xs mt-1 opacity-90">
                  Explore AI job matching, skill assessments, and analytics dashboard!
                </p>
              </div>
            </div>
            <Button
              onClick={closeNotification}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewFeaturesNotification;
