import { useState } from 'react';

  const Settings = ({ onLogout }) => {
  const [profile, setProfile] = useState(() => {
    const savedProfile = localStorage.getItem('leadCraftProfile');
    return savedProfile ? JSON.parse(savedProfile) : {
      name: 'Aarav',
      email: 'aarav@example.com',
      workspace: 'NVIDIA Frontend Team'
    };
  });

  const [notifications, setNotifications] = useState(() => {
    const savedNotifs = localStorage.getItem('leadCraftNotifs');
    return savedNotifs !== null ? JSON.parse(savedNotifs) : true;
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('leadCraftProfile', JSON.stringify(profile));
    localStorage.setItem('leadCraftNotifs', JSON.stringify(notifications));
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Settings</h1>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 max-w-2xl">
        <form onSubmit={handleSave}>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Profile Information</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input 
                type="text" 
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input 
                type="email" 
                value={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
                className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Workspace Name</label>
              <input 
                type="text" 
                value={profile.workspace}
                onChange={(e) => setProfile({...profile, workspace: e.target.value})}
                className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>
          </div>

          <hr className="border-slate-200 mb-6" />

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Preferences</h2>
            <div className="flex items-center justify-between">
              <span className="text-slate-700 font-medium">Email Notifications</span>
              <button 
                type="button"
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-6 rounded-full transition-colors ${notifications ? 'bg-slate-900' : 'bg-slate-300'} relative cursor-pointer`}
              >
                <span className={`block w-4 h-4 bg-white rounded-full transition-transform ${notifications ? 'translate-x-7' : 'translate-x-1'} mt-1`} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              type="submit" 
              className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium transition-colors cursor-pointer"
            >
              Save Changes
            </button>
            {isSaved && (
              <span className="text-green-600 font-semibold bg-green-50 px-3 py-1 rounded-md border border-green-200 transition-all">
                Settings Saved!
              </span>
            )}
          </div>
        </form>
        
      <hr className="border-slate-200 my-6" />

        <div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Account Actions</h2>
          <p className="text-sm text-slate-500 mb-4">Sign out of your active session on this device.</p>
          <button 
            type="button"
            onClick={onLogout}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-200 hover:border-red-600 rounded-lg font-semibold transition-all cursor-pointer text-sm shadow-sm"
          >
            Log Out of Workspace
          </button>
        </div>
        {/* --- END OF ADDITION B --- */}

      </div>
    </div>
  );
};

export default Settings;