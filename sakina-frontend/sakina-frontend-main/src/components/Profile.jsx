import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const MenuItem = ({ icon, label, value, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between px-4 py-3.5 bg-white rounded-2xl hover:bg-gray-50 transition-colors duration-150"
  >
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-[#EBF5FF] flex items-center justify-center text-[#71BCFF]">
        {icon}
      </div>
      <span className="text-sm font-medium text-gray-800">{label}</span>
    </div>
    <div className="flex items-center gap-1">
      {value && <span className="text-sm text-gray-400">{value}</span>}
      <ChevronRight />
    </div>
  </button>
);

const Backdrop = ({ onClose, children }) => (
  <div
    className="absolute inset-0 flex items-end justify-center"
    style={{ borderRadius: "40px", backgroundColor: "rgba(0,0,0,0.4)", zIndex: 50 }}
    onClick={onClose}
  >
    <div
      className="bg-white w-full px-6 pt-6 pb-8 flex flex-col gap-4"
      style={{ borderRadius: "28px 28px 0 0" }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-1" />
      {children}
    </div>
  </div>
);

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { user, logout } = useAuth();

  const [showPrivacy, setShowPrivacy]   = useState(false);
  const [showLanguage, setShowLanguage] = useState(false);
  const [showContact, setShowContact]   = useState(false);
  const [showLogout, setShowLogout]     = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp]         = useState(false);
  const [showEmergencyConfirm, setShowEmergencyConfirm] = useState(false);
  const [emergencyAllowed, setEmergencyAllowed]         = useState(false);

  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [phone, setPhone]     = useState("");
  const [avatar, setAvatar]   = useState(null);
  const [tempName, setTempName]   = useState("");
  const [tempEmail, setTempEmail] = useState("");
  const [tempPhone, setTempPhone] = useState("");
  const [tempAvatar, setTempAvatar] = useState(null);
  const [saved, setSaved]     = useState(false);

  // Populate from auth context user data
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const openSettings = () => {
    setTempName(name);
    setTempEmail(email);
    setTempPhone(phone);
    setTempAvatar(avatar);
    setSaved(false);
    setShowSettings(true);
  };

  const handleSave = () => {
    setName(tempName);
    setEmail(tempEmail);
    setPhone(tempPhone);
    setAvatar(tempAvatar);
    setSaved(true);
    setTimeout(() => setShowSettings(false), 800);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setTempAvatar(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleEmergencyToggle = () => {
    if (!emergencyAllowed) {
      setShowEmergencyConfirm(true);
    } else {
      setEmergencyAllowed(false);
      setTempPhone("");
    }
  };

  const confirmEmergency = () => {
    setEmergencyAllowed(true);
    setShowEmergencyConfirm(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FBFF] p-4 md:p-8 lg:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-[#111827] mb-2">My Profile</h1>
          <p className="text-lg text-gray-500 font-medium">Manage your account and preferences.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Profile Info */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white p-10 shadow-sm flex flex-col items-center text-center" style={{ borderRadius: '32px' }}>
              <div className="relative group mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden border-[6px] border-[#F8FBFF] shadow-lg bg-[#C8DFF5] transition-transform group-hover:scale-105 duration-300">
                  {avatar ? (
                    <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                      <rect width="96" height="96" fill="#C8DFF5"/>
                      <ellipse cx="48" cy="38" rx="18" ry="20" fill="#A0C4E8"/>
                      <ellipse cx="48" cy="90" rx="32" ry="24" fill="#A0C4E8"/>
                    </svg>
                  )}
                </div>
                <button 
                  onClick={openSettings}
                  className="absolute bottom-1 right-1 w-10 h-10 bg-[#71BCFF] text-white rounded-2xl flex items-center justify-center shadow-lg border-4 border-white hover:scale-110 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{name}</h2>
              <p className="text-[#71BCFF] font-bold mb-8">{email}</p>
              
              <div className="w-full grid grid-cols-2 gap-4 pt-8 border-t border-gray-50">
                <div className="p-4 bg-[#F8FBFF] rounded-2xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                  <p className="text-sm font-bold text-emerald-500">Active</p>
                </div>
                <div className="p-4 bg-[#F8FBFF] rounded-2xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Joined</p>
                  <p className="text-sm font-bold text-gray-800">Oct 2023</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowLogout(true)}
              className="w-full h-16 bg-[#FFF1F1] text-red-500 font-bold rounded-[22px] transition-all flex items-center justify-center gap-3 hover:bg-red-50 shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Log Out of Account
            </button>
          </div>

          {/* Right Column: Settings & Menus */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white p-10 shadow-sm" style={{ borderRadius: '32px' }}>
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Account Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <MenuItem
                    onClick={() => setShowPrivacy(true)}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
                    label="Privacy & Security"
                  />
                  <MenuItem
                    onClick={() => setShowLanguage(true)}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    label="Language"
                    value="English"
                  />
                  <MenuItem
                    onClick={openSettings}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                    label="App Settings"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Support & Help</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <MenuItem
                    onClick={() => setShowHelp(true)}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    label="Help Center"
                  />
                  <MenuItem
                    onClick={() => setShowContact(true)}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.573 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>}
                    label="Contact Us"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#111827] p-10 shadow-xl overflow-hidden relative" style={{ borderRadius: '32px' }}>
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                <div className="w-16 h-16 rounded-2xl bg-[#71BCFF] flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
                   <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                   </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">Upgrade to Sakina Premium</h3>
                  <p className="text-gray-400 font-medium leading-relaxed">Unlock advanced mood insights, unlimited AI therapy sessions, and personalized wellness plans.</p>
                </div>
                <button className="px-8 py-4 bg-white text-[#111827] font-bold rounded-2xl hover:bg-white/90 transition-all whitespace-nowrap">
                  Get Started
                </button>
              </div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#71BCFF]/10 rounded-full blur-3xl"></div>
            </div>
            
            <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Mindful App v2.4.0 • Made with ❤️ for Wellness</p>
          </div>


        {/* ── SETTINGS MODAL ── */}
        {showSettings && (
          <div className="absolute inset-0 flex items-end justify-center" style={{ borderRadius: "40px", backgroundColor: "rgba(0,0,0,0.4)", zIndex: 50 }} onClick={() => setShowSettings(false)}>
            <div className="bg-white w-full px-6 pt-6 pb-8 flex flex-col gap-4" style={{ borderRadius: "28px 28px 0 0", maxHeight: "85%" }} onClick={(e) => e.stopPropagation()}>
              <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#EBF5FF] flex items-center justify-center text-[#71BCFF] flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <h2 className="text-lg font-bold text-gray-900">Settings</h2>
              </div>
              <div className="overflow-y-auto flex flex-col gap-4" style={{ scrollbarWidth: "none" }}>
                {/* Profile Photo */}
                <div className="flex flex-col items-center gap-2">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-[#e8f4ff] bg-[#C8DFF5]">
                      {tempAvatar ? (
                        <img src={tempAvatar} alt="preview" className="w-full h-full object-cover" />
                      ) : (
                        <svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                          <rect width="96" height="96" fill="#C8DFF5"/>
                          <ellipse cx="48" cy="38" rx="18" ry="20" fill="#A0C4E8"/>
                          <ellipse cx="48" cy="90" rx="32" ry="24" fill="#A0C4E8"/>
                        </svg>
                      )}
                    </div>
                    <button type="button" onClick={() => fileInputRef.current.click()} className="absolute bottom-0 right-0 w-6 h-6 bg-[#71BCFF] rounded-full flex items-center justify-center shadow border-2 border-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                  </div>
                  <button type="button" onClick={() => fileInputRef.current.click()} className="text-xs text-[#71BCFF] font-medium">Change Photo</button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                </div>
                {/* Name */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Full Name</label>
                  <input type="text" value={tempName} onChange={(e) => setTempName(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-700 outline-none focus:border-[#71BCFF] transition" placeholder="Your full name" />
                </div>
                {/* Email */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Email Address</label>
                  <input type="email" value={tempEmail} onChange={(e) => setTempEmail(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-700 outline-none focus:border-[#71BCFF] transition" placeholder="your@email.com" />
                </div>
                {/* Emergency Contact */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-gray-500">Emergency Contact Number</label>
                    <button type="button" onClick={handleEmergencyToggle} className={`w-10 h-5 rounded-full transition-all duration-200 relative flex-shrink-0 ${emergencyAllowed ? "bg-[#71BCFF]" : "bg-gray-200"}`}>
                      <div className={`w-4 h-4 rounded-full bg-white shadow absolute top-0.5 transition-all duration-200 ${emergencyAllowed ? "left-5" : "left-0.5"}`} />
                    </button>
                  </div>
                  {emergencyAllowed ? (
                    <input type="tel" value={tempPhone} onChange={(e) => setTempPhone(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-700 outline-none focus:border-[#71BCFF] transition" placeholder="+1 (000) 000-0000" />
                  ) : (
                    <p className="text-xs text-gray-400 leading-relaxed">Enable to add a number the app can contact in case of an emergency.</p>
                  )}
                </div>
                {/* Save */}
                <button type="button" onClick={handleSave} className={`w-full font-semibold py-4 rounded-2xl transition-all duration-200 shadow-md text-sm ${saved ? "bg-green-400 text-white" : "bg-[#71BCFF] hover:bg-[#5aadf0] text-white"}`}>
                  {saved ? "✓ Saved!" : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── EMERGENCY CONFIRM ── */}
        {showEmergencyConfirm && (
          <div className="absolute inset-0 flex items-end justify-center" style={{ borderRadius: "40px", backgroundColor: "rgba(0,0,0,0.5)", zIndex: 60 }} onClick={() => setShowEmergencyConfirm(false)}>
            <div className="bg-white w-full px-6 pt-6 pb-8 flex flex-col gap-4" style={{ borderRadius: "28px 28px 0 0" }} onClick={(e) => e.stopPropagation()}>
              <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto" />
              <div className="flex flex-col items-center gap-3 py-2">
                <div className="w-14 h-14 rounded-full bg-[#FFF8E8] flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <h2 className="text-lg font-bold text-gray-900 text-center">Enable Emergency Contact?</h2>
                <p className="text-sm text-gray-400 text-center leading-relaxed">By enabling this, you allow Sakina to contact the number you provide in case of an emergency. Do you agree?</p>
              </div>
              <div className="flex flex-col gap-3">
                <button type="button" onClick={confirmEmergency} className="w-full bg-[#71BCFF] hover:bg-[#5aadf0] text-white font-semibold py-4 rounded-2xl transition-all duration-200 shadow-md text-sm">Yes, I Agree</button>
                <button type="button" onClick={() => setShowEmergencyConfirm(false)} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-4 rounded-2xl transition-all duration-200 text-sm">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* ── HELP CENTER ── */}
        {showHelp && (
          <div className="absolute inset-0 flex items-end justify-center" style={{ borderRadius: "40px", backgroundColor: "rgba(0,0,0,0.4)", zIndex: 50 }} onClick={() => setShowHelp(false)}>
            <div className="bg-white w-full px-6 pt-6 pb-8 flex flex-col gap-4" style={{ borderRadius: "28px 28px 0 0", maxHeight: "80%" }} onClick={(e) => e.stopPropagation()}>
              <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#EBF5FF] flex items-center justify-center text-[#71BCFF] flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h2 className="text-lg font-bold text-gray-900">Help Center</h2>
              </div>
              <div className="overflow-y-auto flex flex-col gap-3" style={{ scrollbarWidth: "none" }}>
                {[
                  { q: "How do I track my mood?", a: "Go to the Mood Tracking tab from the bottom navigation bar. Select how you're feeling and optionally add a note, then tap Submit." },
                  { q: "How do I chat with Sakina Support?", a: "Tap the Chat tab in the navigation bar. You can type or use your microphone to speak with Sakina Support." },
                  { q: "How do I reset my password?", a: "On the login screen, tap 'Forgot?' and enter your email. We'll send you a reset link." },
                  { q: "How do I update my personal information?", a: "Go to Profile → Settings. You can edit your name, email, and profile photo there." },
                  { q: "What is the Emergency Contact feature?", a: "In Settings, you can enable an emergency contact number. With your permission, Sakina may reach out to this number if a crisis situation is detected." },
                ].map((item, i) => (
                  <div key={i} className="bg-gray-50 rounded-2xl px-4 py-3.5">
                    <p className="text-sm font-semibold text-gray-800 mb-1">{item.q}</p>
                    <p className="text-xs text-gray-400 leading-relaxed">{item.a}</p>
                  </div>
                ))}
                <div className="bg-[#f0f8ff] border border-[#71BCFF] rounded-2xl px-4 py-3.5 flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#71BCFF] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                  <div>
                    <p className="text-xs font-semibold text-[#71BCFF]">Still need help?</p>
                    <p className="text-xs text-gray-400">Tap Contact Us to reach our support team directly.</p>
                  </div>
                </div>
              </div>
              <button type="button" onClick={() => { setShowHelp(false); setShowContact(true); }} className="w-full bg-[#71BCFF] hover:bg-[#5aadf0] text-white font-semibold py-4 rounded-2xl transition-all duration-200 shadow-md text-sm">Contact Support</button>
            </div>
          </div>
        )}

        {/* ── PRIVACY ── */}
        {showPrivacy && (
          <Backdrop onClose={() => setShowPrivacy(false)}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#EBF5FF] flex items-center justify-center text-[#71BCFF] flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <h2 className="text-lg font-bold text-gray-900">Privacy & Security</h2>
            </div>
            <div className="flex flex-col gap-3 text-sm text-gray-500 leading-relaxed">
              <p>We respect your privacy and are committed to protecting your personal information. The application may collect basic data such as your name, email, and user inputs to improve the service and provide personalized support.</p>
              <p>All information is handled securely and is not shared with third parties. Users have the right to update or request deletion of their personal data at any time.</p>
              <p>By using this application, you agree to the terms of this Privacy & Security policy.</p>
            </div>
            <button type="button" onClick={() => setShowPrivacy(false)} className="w-full bg-[#71BCFF] hover:bg-[#5aadf0] text-white font-semibold py-4 rounded-2xl transition-all duration-200 shadow-md text-sm">Got it</button>
          </Backdrop>
        )}

        {/* ── LANGUAGE ── */}
        {showLanguage && (
          <Backdrop onClose={() => setShowLanguage(false)}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#EBF5FF] flex items-center justify-center text-[#71BCFF] flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h2 className="text-lg font-bold text-gray-900">Language</h2>
            </div>
            <div className="flex items-center justify-between px-4 py-3.5 bg-[#f0f8ff] border border-[#71BCFF] rounded-2xl">
              <div className="flex items-center gap-3"><span className="text-xl">🇬🇧</span><span className="text-sm font-medium text-gray-800">English</span></div>
              <div className="w-5 h-5 rounded-full border-2 border-[#71BCFF] flex items-center justify-center"><div className="w-2.5 h-2.5 rounded-full bg-[#71BCFF]" /></div>
            </div>
            <p className="text-xs text-gray-400 text-center">More languages coming soon</p>
            <button type="button" onClick={() => setShowLanguage(false)} className="w-full bg-[#71BCFF] hover:bg-[#5aadf0] text-white font-semibold py-4 rounded-2xl transition-all duration-200 shadow-md text-sm">Done</button>
          </Backdrop>
        )}

        {/* ── CONTACT ── */}
        {showContact && (
          <Backdrop onClose={() => setShowContact(false)}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#EBF5FF] flex items-center justify-center text-[#71BCFF] flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              </div>
              <h2 className="text-lg font-bold text-gray-900">Contact Us</h2>
            </div>
            <p className="text-sm text-gray-400">We'd love to hear from you. Reach out through any of the channels below.</p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-4 px-4 py-3.5 bg-gray-50 rounded-2xl">
                <div className="w-9 h-9 rounded-full bg-[#EBF5FF] flex items-center justify-center text-[#71BCFF] flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <div><p className="text-xs text-gray-400 mb-0.5">Email</p><p className="text-sm font-medium text-gray-800">support@sakina.app</p></div>
              </div>
              <div className="flex items-center gap-4 px-4 py-3.5 bg-gray-50 rounded-2xl">
                <div className="w-9 h-9 rounded-full bg-[#EBF5FF] flex items-center justify-center text-[#71BCFF] flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </div>
                <div><p className="text-xs text-gray-400 mb-0.5">Phone</p><p className="text-sm font-medium text-gray-800">+1 (800) 123-4567</p></div>
              </div>
            </div>
            <button type="button" onClick={() => setShowContact(false)} className="w-full bg-[#71BCFF] hover:bg-[#5aadf0] text-white font-semibold py-4 rounded-2xl transition-all duration-200 shadow-md text-sm mt-1">Close</button>
          </Backdrop>
        )}

        {/* ── LOGOUT ── */}
        {showLogout && (
          <Backdrop onClose={() => setShowLogout(false)}>
            <div className="flex flex-col items-center gap-3 py-2">
              <div className="w-14 h-14 rounded-full bg-[#FFF1F1] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              </div>
              <h2 className="text-lg font-bold text-gray-900">Log Out</h2>
              <p className="text-sm text-gray-400 text-center leading-relaxed">Are you sure you want to log out? You'll need to sign in again to access your account.</p>
            </div>
            <div className="flex flex-col gap-3 mt-1">
              <button type="button" onClick={() => { logout(); navigate("/login"); }} className="w-full bg-red-400 hover:bg-red-500 text-white font-semibold py-4 rounded-2xl transition-all duration-200 shadow-md text-sm">Yes, Log Out</button>
              <button type="button" onClick={() => setShowLogout(false)} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-4 rounded-2xl transition-all duration-200 text-sm">Cancel</button>
            </div>
          </Backdrop>
        )}
      </div>
    </div>
  </div>
  );
};

export default Profile;