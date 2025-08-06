import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { User, LogIn, UserPlus } from 'lucide-react';

const AuthDialog = ({ open, onOpenChange }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    onOpenChange(false);
    navigate('/login');
  };

  const handleSignup = () => {
    onOpenChange(false);
    navigate('/signup');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <User className="w-6 h-6 text-purple-600" />
          </div>
          <DialogTitle className="text-xl font-bold">Sign in Required</DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            Please sign in to your account to browse and save job opportunities. Join thousands of job seekers finding their dream careers.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 pt-4">
          <Button 
            onClick={handleLogin}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 text-base"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Sign In
          </Button>
          
          <Button 
            onClick={handleSignup}
            variant="outline" 
            className="w-full border-purple-200 text-purple-600 hover:bg-purple-50 font-semibold py-3 text-base"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Create Account
          </Button>
        </div>

        <div className="text-center text-sm text-gray-500 pt-4 border-t">
          <p>New to JobPortal? Creating an account is free and takes less than a minute.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
