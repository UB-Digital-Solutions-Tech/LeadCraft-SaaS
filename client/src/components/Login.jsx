
import { useState } from 'react';
import companyLogo from '../assets/ULOGO.jpg'; // Make sure your logo is saved in src/assets/logo.png

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (username === 'admin' && password === 'password') {
      onLogin();
    } else {
      setError('Invalid credentials. Please use admin / password');
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950 font-sans">
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-slate-950 via-slate-900 to-black p-12 flex-col justify-between relative overflow-hidden border-r border-slate-800">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <img 
              src={companyLogo} 
              alt="Digital Solutions Logo" 
              className="h-10 w-auto object-contain drop-shadow-md"
            />
            <span className="text-white font-extrabold text-2xl tracking-wide">Digital Solutions</span>
          </div>
        </div>

        <div className="relative z-10 max-w-lg">
          <span className="px-3.5 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full text-xs font-bold uppercase tracking-wider mb-6 inline-block">
           Lead Management System
          </span>
          
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6">
            Manage your customer leads efficiently.
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Track customer information, organize leads, monitor their progress, and streamline your sales workflow through a simple and intuitive CRM dashboard.
          </p>
        </div>

        <div className="relative z-10 text-slate-600 text-sm font-medium">
          © 2026 Digital Solutions Inc. All rights reserved.
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-gray-50">
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-slate-100">
          <div className="text-center mb-8">
            <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
              <img 
                src={companyLogo} 
                alt="Digital Solutions Logo" 
                className="h-9 w-auto object-contain"
              />
              <span className="text-slate-900 font-extrabold text-xl tracking-wide">Digital Solutions</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Welcome back</h2>
            <p className="text-slate-500 text-sm">Please enter your credentials to access your workspace</p>
          </div>

          <div className="mb-6 p-3 bg-red-50/60 border border-red-100 rounded-xl flex items-center justify-between text-xs text-red-900">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <span className="font-bold">Demo Access:</span>
            </div>
            <span className="font-mono bg-white px-2.5 py-1 rounded border border-red-200 text-slate-700 font-semibold">admin / password</span>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-600 text-red-700 text-sm rounded-r flex items-center justify-between">
              <span className="font-medium">{error}</span>
              <button onClick={() => setError('')} className="text-red-400 hover:text-red-600 font-bold cursor-pointer">×</button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-semibold text-slate-700">Password</label>
                <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-xs text-red-600 hover:text-red-700 font-semibold transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  className="w-full pl-4 pr-11 py-3 border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all font-mono"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                defaultChecked
                className="w-4 h-4 text-red-600 border-slate-300 rounded focus:ring-red-500 cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 cursor-pointer">
                Remember this device for 30 days
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-red-600 text-white py-3.5 px-4 rounded-xl font-bold shadow-lg shadow-slate-900/10 hover:shadow-red-600/25 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 cursor-pointer text-sm tracking-wide"
            >
              Sign In to Workspace →
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-8">
            Lead Management System • Built with React & Tailwind CSS
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;