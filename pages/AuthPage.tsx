
import React, { useState } from 'react';
import { useStudent } from '../context/StudentContext';
import { useNavigate } from 'react-router-dom';
import { Button, InputGroup } from '../components/UI';
import { BrainCircuit, Mail, Lock, User, ArrowRight, Sun, Moon, Eye, EyeOff, ArrowLeft } from 'lucide-react';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, theme, toggleTheme } = useStudent();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    otp: ''
  });

  const [showOtp, setShowOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isForgotPassword) {
      alert("If an account exists with this email, a reset link has been sent.");
      setIsForgotPassword(false);
      return;
    }

    if (!isLogin && !showOtp) {
      setShowOtp(true);
      return;
    }
    // Simulate successful auth
    login(formData.name || 'Student', formData.email);
    navigate('/profile');
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-sage-bg dark:bg-sage-darkBg transition-colors">
      {/* Theme Toggle Button */}
      <button 
        onClick={toggleTheme}
        className="absolute top-6 right-6 z-50 p-2 rounded-full bg-white dark:bg-sage-darkCard shadow-md text-sage-navy dark:text-sage-darkText hover:scale-110 transition-all border border-sage-gray/20 dark:border-white/10"
      >
        {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
      </button>

      {/* Left Side: Brand */}
      <div className="bg-sage-navy dark:bg-slate-900 text-white flex flex-col justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <svg viewBox="0 0 100 100" className="w-full h-full">
             <circle cx="20" cy="20" r="20" fill="currentColor" />
             <circle cx="80" cy="80" r="30" fill="currentColor" />
           </svg>
        </div>
        <div className="z-10 text-center max-w-md">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-sage-blue rounded-2xl flex items-center justify-center shadow-2xl">
              <BrainCircuit className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4 font-inter">SkillSage AI</h1>
          <p className="text-lg text-sage-gray">
            Discover your potential. Unlock your future. <br/>
            The smartest career roadmap generator for students.
          </p>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="flex items-center justify-center p-6 bg-sage-bg dark:bg-sage-darkBg">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-sage-darkCard p-8 rounded-2xl shadow-xl border border-sage-gray/20 dark:border-white/10 transition-colors">
            
            {!isForgotPassword ? (
              <>
                <div className="flex gap-6 mb-8 border-b border-sage-gray/30 dark:border-white/10 pb-2">
                  <button 
                    onClick={() => { setIsLogin(true); setShowOtp(false); }}
                    className={`text-lg font-medium pb-2 transition-colors ${isLogin ? 'text-sage-blue border-b-2 border-sage-blue' : 'text-sage-gray dark:text-gray-400'}`}
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => { setIsLogin(false); setShowOtp(false); }}
                    className={`text-lg font-medium pb-2 transition-colors ${!isLogin ? 'text-sage-blue border-b-2 border-sage-blue' : 'text-sage-gray dark:text-gray-400'}`}
                  >
                    Sign Up
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && !showOtp && (
                    <InputGroup label="Full Name">
                      <div className="relative">
                        <User className="absolute left-3 top-3.5 w-5 h-5 text-sage-gray dark:text-gray-400" />
                        <input 
                          type="text" 
                          required 
                          className="w-full pl-10 pr-4 py-3 border border-sage-gray dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-sage-blue focus:border-transparent outline-none text-sage-navy dark:text-white bg-white dark:bg-slate-700 transition-colors"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                      </div>
                    </InputGroup>
                  )}

                  {!showOtp && (
                    <>
                      <InputGroup label="Email Address">
                        <div className="relative">
                          <Mail className="absolute left-3 top-3.5 w-5 h-5 text-sage-gray dark:text-gray-400" />
                          <input 
                            type="email" 
                            required 
                            className="w-full pl-10 pr-4 py-3 border border-sage-gray dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-sage-blue focus:border-transparent outline-none text-sage-navy dark:text-white bg-white dark:bg-slate-700 transition-colors"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                          />
                        </div>
                      </InputGroup>

                      <InputGroup label="Password">
                        <div className="relative">
                          <Lock className="absolute left-3 top-3.5 w-5 h-5 text-sage-gray dark:text-gray-400" />
                          <input 
                            type={showPassword ? "text" : "password"} 
                            required 
                            className="w-full pl-10 pr-12 py-3 border border-sage-gray dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-sage-blue focus:border-transparent outline-none text-sage-navy dark:text-white bg-white dark:bg-slate-700 transition-colors"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={e => setFormData({...formData, password: e.target.value})}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3.5 text-sage-gray dark:text-gray-400 hover:text-sage-blue transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        {isLogin && (
                          <div className="flex justify-end mt-1">
                            <button 
                              type="button" 
                              onClick={() => setIsForgotPassword(true)}
                              className="text-xs font-bold text-sage-blue hover:underline"
                            >
                              Forgot Password?
                            </button>
                          </div>
                        )}
                      </InputGroup>
                    </>
                  )}

                  {!isLogin && !showOtp && (
                    <InputGroup label="Confirm Password">
                       <div className="relative">
                          <Lock className="absolute left-3 top-3.5 w-5 h-5 text-sage-gray dark:text-gray-400" />
                          <input 
                            type={showConfirmPassword ? "text" : "password"} 
                            required 
                            className="w-full pl-10 pr-12 py-3 border border-sage-gray dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-sage-blue focus:border-transparent outline-none text-sage-navy dark:text-white bg-white dark:bg-slate-700 transition-colors"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-3.5 text-sage-gray dark:text-gray-400 hover:text-sage-blue transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                    </InputGroup>
                  )}

                  {!isLogin && showOtp && (
                     <InputGroup label="Enter OTP Sent to your email">
                        <input 
                          type="text" 
                          required 
                          className="w-full px-4 py-3 border border-sage-gray dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-sage-blue text-center text-2xl tracking-widest text-sage-navy dark:text-white bg-white dark:bg-slate-700 transition-colors"
                          placeholder="1 2 3 4"
                          value={formData.otp}
                          onChange={e => setFormData({...formData, otp: e.target.value})}
                        />
                     </InputGroup>
                  )}

                  <Button type="submit" className="w-full mt-6">
                    {!isLogin && !showOtp ? 'Send OTP' : (!isLogin ? 'Verify & Sign Up' : 'Login')} <ArrowRight className="w-4 h-4" />
                  </Button>
                </form>

                <div className="mt-6 flex items-center gap-4">
                  <div className="h-px bg-sage-gray/30 dark:bg-white/10 flex-1"></div>
                  <span className="text-sm text-sage-gray dark:text-gray-500">OR</span>
                  <div className="h-px bg-sage-gray/30 dark:bg-white/10 flex-1"></div>
                </div>

                <button type="button" className="w-full mt-6 flex items-center justify-center gap-3 border border-sage-gray dark:border-gray-600 rounded-xl py-3 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                  <span className="font-medium text-sage-navy dark:text-white">Continue with Google</span>
                </button>
              </>
            ) : (
              // FORGOT PASSWORD VIEW
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <button 
                  onClick={() => setIsForgotPassword(false)} 
                  className="mb-6 flex items-center text-sage-gray dark:text-gray-400 hover:text-sage-navy dark:hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
                </button>
                
                <h2 className="text-2xl font-bold text-sage-navy dark:text-white mb-2">Reset Password</h2>
                <p className="text-sage-navy/70 dark:text-gray-400 mb-8">
                  Enter the email associated with your account and we'll send you a link to reset your password.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                   <InputGroup label="Email Address">
                      <div className="relative">
                        <Mail className="absolute left-3 top-3.5 w-5 h-5 text-sage-gray dark:text-gray-400" />
                        <input 
                          type="email" 
                          required 
                          className="w-full pl-10 pr-4 py-3 border border-sage-gray dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-sage-blue focus:border-transparent outline-none text-sage-navy dark:text-white bg-white dark:bg-slate-700 transition-colors"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                      </div>
                    </InputGroup>

                    <Button type="submit" className="w-full">
                      Send Reset Link
                    </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
