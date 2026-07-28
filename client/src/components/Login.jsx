import { useState } from 'react';
import axios from "axios";
import companyLogo from '../assets/ULOGO.jpg'; // Make sure your logo is saved in src/assets/logo.png

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post(
      "https://leadcraft-saas.onrender.com/api/auth/login",
      {
        username,
        password,
      }
    );

    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    

    onLogin();
  } catch (error) {
    if (error.response) {
      setError(error.response.data.message);
    } else {
      setError("Unable to connect to server");
    }
  }
};

  return (
    <div className="min-h-screen flex bg-slate-950 font-sans">
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-slate-950 via-slate-900 to-black p-12 flex-col justify-between relative overflow-hidden border-r border-slate-800">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 mb-10">
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
          <p className="text-slate-300 text-lg leading-relaxed mb-8">
            Track customer information, organize leads, monitor their progress, and streamline your sales workflow through a simple and intuitive CRM dashboard.
          </p>

          {/* Feature highlights instead of fabricated stats */}
          <div className="space-y-5 border-t border-slate-800 pt-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <div>
                <div className="text-white font-bold text-sm">Lead Tracking</div>
                <div className="text-slate-400 text-xs mt-0.5">Never lose a prospect again</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-2.13a4 4 0 10-4-4 4 4 0 004 4zm6 0a4 4 0 10-4-4" />
                </svg>
              </div>
              <div>
                <div className="text-white font-bold text-sm">Team Collaboration</div>
                <div className="text-slate-400 text-xs mt-0.5">Keep everyone in sync</div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-slate-500 text-sm font-medium mt-3">
          © 2026 Digital Solutions Inc. All rights reserved.
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-4 sm:px-10 sm:py-6 bg-gray-50">
        <div className="w-full max-w-lg bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-100">
          <div className="text-center mb-6">
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
           
           {/* Demo Accounts */}
<div className="mb-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
  <div className="flex items-center gap-2 mb-3">
    <span className="w-2 h-2 rounded-full bg-red-600"></span>
    <h3 className="text-sm font-bold text-slate-800">
      Demo Accounts
    </h3>
  </div>

  <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
    <table className="w-full text-sm">
      <thead className="bg-slate-100 text-slate-700">
        <tr>
          <th className="px-3 py-2 text-left">Role</th>
          <th className="px-3 py-2 text-left">Username</th>
          <th className="px-3 py-2 text-left">Password</th>
        </tr>
      </thead>

      <tbody>
        <tr className="border-t">
          <td className="px-3 py-2 font-semibold text-red-600">Administrator</td>
          <td className="px-3 py-2 font-mono">admin</td>
          <td className="px-3 py-2 font-mono">password</td>
        </tr>

        <tr className="border-t">
          <td className="px-3 py-2 font-semibold text-red-600">Sales Manager</td>
          <td className="px-3 py-2 font-mono">manager</td>
          <td className="px-3 py-2 font-mono">password</td>
        </tr>

        <tr className="border-t">
          <td className="px-3 py-2 font-semibold text-red-600">Sales Executive</td>
          <td className="px-3 py-2 font-mono">executive</td>
          <td className="px-3 py-2 font-mono">password</td>
        </tr>
      </tbody>
    </table>
  </div>

  <p className="mt-3 text-xs text-slate-500">
    Use these accounts to explore role-based permissions and CRM features.
  </p>
</div>
        
          {error && (
            <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-600 text-red-700 text-sm rounded-r flex items-center justify-between">
              <span className="font-medium">{error}</span>
              <button onClick={() => setError('')} className="text-red-400 hover:text-red-600 font-bold cursor-pointer">×</button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3.5 px-4 rounded-xl font-bold shadow-lg shadow-red-600/25 hover:shadow-red-600/35 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 cursor-pointer text-sm tracking-wide"
            >
              Sign In to Workspace →
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-3">
            Lead Management System • Built with React & Tailwind CSS
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;