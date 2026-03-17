import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGlobal } from '../context/GlobalContext';

export default function Profile() {
  const { user, setUser } = useGlobal();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  
  // Local state for the form during editing
  const [formData, setFormData] = useState({ ...user });

  const handleSave = () => {
    setUser(formData);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="py-12 bg-slate-50/50 min-h-full">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center gap-6 mb-12">
           <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-indigo-200">
             {user.avatar}
           </div>
           <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Account Settings</h1>
              <p className="text-slate-500 font-medium">Configure your personal information and preferences.</p>
           </div>
        </div>

        {saved && (
          <div className="mb-8 px-6 py-4 bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-bold rounded-2xl flex items-center gap-3 animate-fade-in">
            <span className="text-xl">✨</span> Global Profile Synchronized Successfully!
          </div>
        )}
        
        <div className="clear-card p-8 sm:p-10 shadow-lg shadow-slate-200/50">
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
               <div>
                 <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Full Identity</label>
                 <input 
                   type="text" 
                   value={formData.name} 
                   disabled={!editing}
                   onChange={(e) => setFormData(p => ({ ...p, name: e.target.value, avatar: e.target.value.charAt(0).toUpperCase() }))}
                   className="block w-full border border-slate-200 rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium disabled:bg-slate-50" 
                 />
               </div>
               <div>
                 <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Verified Email</label>
                 <input 
                   type="email" 
                   value={formData.email} 
                   disabled={!editing}
                   onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                   className="block w-full border border-slate-200 rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium disabled:bg-slate-50" 
                 />
               </div>
            </div>
            
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
              {!editing ? (
                <button 
                  onClick={() => setEditing(true)}
                  className="btn btn-primary px-10 py-3.5 shadow-lg shadow-indigo-100"
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button 
                    onClick={handleSave}
                    className="btn btn-primary px-10 py-3.5 shadow-lg shadow-indigo-100"
                  >
                    Save Changes
                  </button>
                  <button 
                    onClick={() => { setEditing(false); setFormData({ ...user }); }}
                    className="btn btn-outline px-10 py-3.5"
                  >
                    Discard
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 clear-card p-8 bg-slate-900 text-white relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000"></div>
           <h3 className="text-xl font-extrabold mb-2 relative z-10 tracking-tight">Booking History</h3>
           <p className="text-slate-400 text-sm mb-6 relative z-10 font-medium">Your account changes are synced across all your sessions and devices automatically.</p>
           <Link to="/dashboard" className="text-white text-xs font-bold uppercase tracking-widest hover:underline relative z-10">Manage Active Jobs →</Link>
        </div>
      </div>
    </div>
  );
}
