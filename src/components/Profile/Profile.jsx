import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import Navbar from "../Tasks/navbar";
import { api } from "../../lib/api";

function Profile() {
    const [user,setUser]=useState(null);
    const [name,setName]=useState('');
    const [saving,setSaving]=useState(false);
    const [msg,setMsg]=useState('');
    const [err,setErr]=useState('');
    const [cpCurrent,setCpCurrent]=useState('');
    const [cpNew,setCpNew]=useState('');
  
    const load=async()=>{ try{ const res = await api('/api/me'); setUser(res.user); setName(res.user.name||''); } catch(e){ setErr(e.data?.message||'Failed to load'); } };
    useEffect(()=>{ load(); },[]);
  
    const saveProfile=async(e)=>{ e.preventDefault(); setSaving(true); setMsg(''); setErr('');
      try{ 
        const res = await api('/api/me',{method:'PATCH',body:JSON.stringify({name})}); 
        setUser(res.user); 
        setMsg('Profile updated');
        
        // Show success toast
        toast.success('Profile updated successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
      catch(e){ 
        const errorMessage = e.data?.message || 'Update failed';
        setErr(errorMessage);
        
        // Show error toast
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
      finally{ setSaving(false); }
    };
  
    const changePassword=async(e)=>{ e.preventDefault(); setMsg(''); setErr('');
      try{ 
        await api('/api/change-password',{method:'POST',body:JSON.stringify({currentPassword:cpCurrent,newPassword:cpNew})}); 
        setMsg('Password changed'); 
        setCpCurrent(''); 
        setCpNew('');
        
        // Show success toast
        toast.success('Password changed successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
      catch(e){ 
        const errorMessage = e.data?.message || 'Change password failed';
        setErr(errorMessage);
        
        // Show error toast
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    };
  
    const upgrade=async()=>{ setMsg(''); setErr('');
      try{ 
        console.log('Starting upgrade process...');
        const res = await api('/api/subscription/upgrade',{method:'POST'}); 
        console.log('Upgrade response:', res);
        setUser(res.user); 
        setMsg('Upgraded to premium');
        
        // Update localStorage and sessionStorage with new role
        localStorage.setItem('role', 'premium');
        sessionStorage.setItem('role', 'premium');
        console.log('Role updated to premium in storage');
        
        // Clear any previous error state
        setErr('');
        
        // Show success toast
        toast.success('Successfully upgraded to premium!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
      catch(e){ 
        const errorMessage = e.data?.message || 'Upgrade failed';
        setErr(errorMessage);
        
        // Show error toast
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    };
  
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-slate-800 to-blue-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-br from-emerald-600/10 to-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-tr from-blue-600/10 to-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-emerald-600/5 to-blue-600/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
  
        <Navbar />
        
        <main className="max-w-6xl mx-auto p-4 space-y-6 relative z-10">
          {/* Header */}
          <div className="text-center py-8">
            <h1 className="text-4xl font-bold text-white mb-2">Profile Settings</h1>
            <p className="text-slate-300">Manage your account and preferences</p>
          </div>
  
          {/* Global Messages */}
          {(err || msg) && (
            <div className="space-y-4">
              {err && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-sm rounded-xl p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {err}
                  </div>
                </div>
              )}
              {msg && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm rounded-xl p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {msg}
                  </div>
                </div>
              )}
            </div>
          )}
  
          {/* Account Information */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                Account Information
              </h2>
              <p className="text-slate-300 text-sm">View and update your account details</p>
            </div>
            
            {user && (
              <div className="space-y-6">
                {/* Email and Role Display */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Email Address</label>
                    <div className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-300 text-sm">
                      {user.email}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Account Type</label>
                    <div className="flex items-center">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                        user.role === 'premium'
                          ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-300 border border-yellow-500/30'
                          : 'bg-slate-500/20 text-slate-300 border border-slate-500/30'
                      }`}>
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
  
                {/* Name Update Form */}
                <form onSubmit={saveProfile} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Full Name</label>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={name}
                          onChange={e=>setName(e.target.value)}
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={saving}
                        className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl whitespace-nowrap"
                      >
                        {saving ? (
                          <div className="flex items-center gap-2">
                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                          </div>
                        ) : (
                          'Save Changes'
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
  
          {/* Change Password */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                Change Password
              </h2>
              <p className="text-slate-300 text-sm">Update your account password for security</p>
            </div>
            
            <form onSubmit={changePassword} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Current Password</label>
                  <input
                    type="password"
                    value={cpCurrent}
                    onChange={e=>setCpCurrent(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                    placeholder="Enter current password"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">New Password</label>
                  <input
                    type="password"
                    value={cpNew}
                    onChange={e=>setCpNew(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                    placeholder="Enter new password"
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
  
          {/* Premium Upgrade */}
          {user && user.role === 'free' && (
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 backdrop-blur-xl border border-yellow-500/20 rounded-3xl shadow-2xl p-6">
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">Upgrade to Premium</h3>
                    <p className="text-yellow-200 text-sm">Unlock unlimited tasks, advanced features, and priority support</p>
                  </div>
                </div>
                
                <button
                  onClick={upgrade}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl whitespace-nowrap"
                >
                  Upgrade Now
                </button>
              </div>
            </div>
          )}
  
          {user && user.role === 'premium' && (
            <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 backdrop-blur-xl border border-emerald-500/20 rounded-3xl shadow-2xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">Premium Member</h3>
                  <p className="text-emerald-200 text-sm">You're enjoying all premium features. Thank you for your support!</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }
  
  export default Profile;