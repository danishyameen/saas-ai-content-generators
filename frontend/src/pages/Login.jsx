import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [wrongPasswordCount, setWrongPasswordCount] = useState(0);
  const { login, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');

    try {
      await login(email, password);
      toast.success('Login successful!');
      setWrongPasswordCount(0);
      navigate('/dashboard');
    } catch (error) {
      const errType = error.response?.data?.errorType;
      const errMsg = error.response?.data?.message || 'Login failed';

      if (errType === 'email') {
        setEmailError('Invalid email. Please check and try again.');
        toast.error('Invalid email!');
      } else if (errType === 'password') {
        const newCount = wrongPasswordCount + 1;
        setWrongPasswordCount(newCount);
        setPasswordError('Invalid password. Please check and try again.');
        toast.error('Invalid password!');
      } else {
        setEmailError('Invalid email. Please check and try again.');
        setPasswordError('Invalid password. Please check and try again.');
        toast.error(errMsg);
      }
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="text-white" size={24} />
            </div>
            <span className="text-white font-bold text-xl">Genifai</span>
          </Link>
          <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
          <p className="text-dark-400">Sign in to your account</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 ${emailError ? 'text-red-400' : 'text-dark-400'}`} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                  className={`input w-full pl-10 ${emailError ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="you@example.com"
                  required
                />
              </div>
              {emailError && (
                <div className="flex items-center gap-1 mt-1">
                  <AlertCircle size={13} className="text-red-400 shrink-0" />
                  <p className="text-red-400 text-xs">{emailError}</p>
                </div>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">Password</label>
                <Link to="/forgot-password" className="text-sm text-primary-400 hover:text-primary-300">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 ${passwordError ? 'text-red-400' : 'text-dark-400'}`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setPasswordError(''); }}
                  className={`input w-full pl-10 pr-10 ${passwordError ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordError && (
                <div className="flex items-center gap-1 mt-1">
                  <AlertCircle size={13} className="text-red-400 shrink-0" />
                  <p className="text-red-400 text-xs">{passwordError}</p>
                </div>
              )}
            </div>

            {/* 3 baar galat password ke baad Forgot Password button */}
            {wrongPasswordCount >= 3 && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle size={16} className="text-yellow-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-yellow-300 text-sm font-medium">Trouble signing in?</p>
                  <p className="text-yellow-400/80 text-xs mt-0.5">
                    You have entered the wrong password {wrongPasswordCount} times.{' '}
                    <Link to="/forgot-password" className="text-yellow-300 underline hover:text-yellow-200 font-medium">
                      Reset your password
                    </Link>
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-dark-400 mt-4">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-400 hover:text-primary-300">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
