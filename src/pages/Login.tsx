
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import { toast } from 'sonner';

const Login = () => {
  const { isAuthenticated, login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [animateShapes, setAnimateShapes] = useState(false);

  // Start animation after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateShapes(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper methods for demo accounts
  const loginAsAdmin = () => {
    setEmail('admin@example.com');
    setPassword('password123');
  };

  const loginAsMember = () => {
    setEmail('member@example.com');
    setPassword('password123');
  };

  // If user is already authenticated, redirect to dashboard
  if (isAuthenticated && !isLoading) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center bg-gradient-to-b from-background to-accent/30 relative overflow-hidden">
      {/* Decorative shapes */}
      <div 
        className={`absolute top-[-5%] right-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl transform transition-all duration-1000 ease-out ${
          animateShapes ? 'translate-x-0 opacity-70' : 'translate-x-full opacity-0'
        }`} 
      />
      <div 
        className={`absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-3xl transform transition-all duration-1000 delay-300 ease-out ${
          animateShapes ? 'translate-x-0 opacity-70' : '-translate-x-full opacity-0'
        }`} 
      />
      
      <div className="z-10 py-12 px-4 sm:px-6 lg:px-8 animate-slide-up">
        <div className="max-w-md w-full mx-auto">
          <div className="text-center mb-6">
            <div className="flex justify-center">
              <div className="h-14 w-14 rounded-xl bg-primary flex items-center justify-center shadow-lg mb-4 transform transition-transform hover:scale-105">
                <LockKeyhole className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="mt-4 text-3xl font-bold text-foreground">Welcome to ProjectFlow</h2>
            <p className="mt-2 text-muted-foreground">Sign in to your account</p>
          </div>
          
          <div className="mt-8 bg-card sm:rounded-xl shadow-card border border-border overflow-hidden">
            <div className="px-6 py-8">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                    Email address
                  </label>
                  <div className="relative rounded-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-input rounded-md focus:ring-2 focus:ring-primary/30 focus:border-primary bg-card text-foreground placeholder-muted-foreground shadow-sm transition-all"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
                      Password
                    </label>
                    <div className="text-sm">
                      <a href="#" className="font-medium text-primary hover:text-primary/80 transition-colors">
                        Forgot your password?
                      </a>
                    </div>
                  </div>
                  <div className="relative rounded-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockKeyhole className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-10 py-2.5 border border-input rounded-md focus:ring-2 focus:ring-primary/30 focus:border-primary bg-card text-foreground placeholder-muted-foreground shadow-sm transition-all"
                      placeholder="••••••••"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-muted-foreground hover:text-foreground focus:outline-none"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-primary border-input rounded focus:ring-primary bg-card transition-colors"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-foreground">
                      Remember me
                    </label>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-70 disabled:hover:bg-primary relative overflow-hidden transform active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      <span>Sign in</span>
                    )}
                  </button>
                </div>
              </form>
              
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-card text-muted-foreground">Or continue with demo accounts</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    onClick={loginAsAdmin}
                    className="w-full flex justify-center py-2 px-4 border border-input rounded-md shadow-sm text-sm font-medium text-foreground bg-accent hover:bg-accent/70 focus:outline-none transition-colors"
                  >
                    Admin Demo
                  </button>
                  <button
                    onClick={loginAsMember}
                    className="w-full flex justify-center py-2 px-4 border border-input rounded-md shadow-sm text-sm font-medium text-foreground bg-accent hover:bg-accent/70 focus:outline-none transition-colors"
                  >
                    Member Demo
                  </button>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-muted/40 border-t border-border">
              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <a href="#" className="font-medium text-primary hover:text-primary/80 transition-colors">
                  Create a free account
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
