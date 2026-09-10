import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, Lock, Mail, ArrowRight, Sparkles, Shield, UserCheck, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(
    searchParams.get('expired') ? 'Your session has expired. Please sign in again.' : ''
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'employer') navigate('/employer/dashboard');
      else navigate('/candidate/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    // Trigger login directly
    setLoading(true);
    login(demoEmail, demoPassword)
      .then((user) => {
        if (user.role === 'admin') navigate('/admin/dashboard');
        else if (user.role === 'employer') navigate('/employer/dashboard');
        else navigate('/candidate/dashboard');
      })
      .catch((err) => {
        setError(err.message || 'Login failed');
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition">
            <Briefcase className="w-5 h-5" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900">
            Smart<span className="text-indigo-600">Hire</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Sign in to your account
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Access your personalized dashboard, applications, or recruiter tools
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Quick Demo Credentials Panel */}
        <div className="mb-6 p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200/80 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>One-Click Demo Accounts (Viva Quick-Fill)</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('rahul.sharma@example.com', 'Candidate@123')}
              className="px-3 py-2 text-left rounded-xl bg-white border border-indigo-200 hover:border-indigo-400 hover:shadow-xs transition text-xs"
            >
              <p className="font-semibold text-slate-900">Rahul (Candidate)</p>
              <p className="text-[10px] text-emerald-600 font-medium">MERN Expert (95% Match)</p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('vikram.verma@example.com', 'Candidate@123')}
              className="px-3 py-2 text-left rounded-xl bg-white border border-indigo-200 hover:border-indigo-400 hover:shadow-xs transition text-xs"
            >
              <p className="font-semibold text-slate-900">Vikram (Candidate)</p>
              <p className="text-[10px] text-amber-600 font-medium">Fresher (40-85% Match)</p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('hr@techcorp.com', 'Employer@123')}
              className="px-3 py-2 text-left rounded-xl bg-white border border-indigo-200 hover:border-indigo-400 hover:shadow-xs transition text-xs"
            >
              <p className="font-semibold text-slate-900">TechCorp Recruiter</p>
              <p className="text-[10px] text-indigo-600 font-medium">Employer Dashboard</p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('admin@smarthire.com', 'Admin@123')}
              className="px-3 py-2 text-left rounded-xl bg-white border border-indigo-200 hover:border-indigo-400 hover:shadow-xs transition text-xs"
            >
              <p className="font-semibold text-slate-900">Platform Admin</p>
              <p className="text-[10px] text-purple-600 font-medium">Admin Command Center</p>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white py-8 px-6 sm:px-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="block w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-200 transition flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-500">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-indigo-600 hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
