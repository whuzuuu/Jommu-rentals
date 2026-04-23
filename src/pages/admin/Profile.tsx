import React, { useState, useEffect } from "react";
import { 
  User, 
  Mail, 
  Lock, 
  Shield, 
  Camera,
  Save,
  CheckCircle2
} from "lucide-react";
import Sidebar from "@/src/components/admin/Sidebar";
import Topbar from "@/src/components/admin/Topbar";
import { motion } from "motion/react";
import { auth } from "@/src/firebase";
import { updateProfile, updateEmail } from "firebase/auth";

const Profile = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState({
    name: auth.currentUser?.displayName || "Admin User",
    email: auth.currentUser?.email || "admin@jommurentals.com",
    role: "Super Admin",
    phone: "+254 700 000 000",
    bio: "Managing the premium car rental fleet in Nairobi."
  });

  useEffect(() => {
    if (auth.currentUser) {
      setProfile(prev => ({
        ...prev,
        name: auth.currentUser?.displayName || prev.name,
        email: auth.currentUser?.email || prev.email
      }));
    }
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    
    try {
      if (auth.currentUser) {
        if (profile.name !== auth.currentUser.displayName) {
          await updateProfile(auth.currentUser, { displayName: profile.name });
        }
        if (profile.email !== auth.currentUser.email) {
          await updateEmail(auth.currentUser, profile.email);
        }
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (err: any) {
      console.error("Failed to update profile:", err);
      setError(err.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Topbar title="Admin Profile" />
        
        <main className="p-8 pt-28 space-y-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
            {/* Profile Header */}
            <div className="h-48 bg-gradient-to-r from-orange-500 to-orange-600 relative">
              <div className="absolute -bottom-16 left-12 flex items-end gap-6">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-3xl bg-white p-1 shadow-xl">
                    <div className="w-full h-full rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 text-4xl font-bold">
                      AD
                    </div>
                  </div>
                  <button className="absolute bottom-2 right-2 p-2 bg-gray-900 text-white rounded-xl shadow-lg hover:scale-110 transition-transform">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div className="pb-4">
                  <h2 className="text-3xl font-bold text-white mb-1">{profile.name}</h2>
                  <p className="text-orange-100 font-medium flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    {profile.role}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-24 p-12">
              {showSuccess && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-3 text-green-600 font-bold"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Profile updated successfully!
                </motion.div>
              )}

              <form onSubmit={handleSave} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                      <input 
                        type="text" 
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                      <input 
                        type="email" 
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Bio</label>
                  <textarea 
                    rows={4}
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all font-medium resize-none"
                  ></textarea>
                </div>

                <div className="pt-4 flex justify-end">
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-3 px-10 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl transition-all shadow-xl shadow-orange-500/20 disabled:opacity-70"
                  >
                    {isSaving ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-12 pt-12 border-t border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Security Settings</h3>
                <div className="space-y-4">
                  <button className="flex items-center justify-between w-full p-6 bg-gray-50 hover:bg-gray-100 rounded-3xl transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-gray-500 group-hover:text-orange-500 transition-colors">
                        <Lock className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-gray-900">Change Password</p>
                        <p className="text-sm text-gray-500">Update your account password regularly</p>
                      </div>
                    </div>
                    <div className="px-4 py-2 bg-white rounded-xl text-xs font-bold text-gray-900 shadow-sm">Update</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
