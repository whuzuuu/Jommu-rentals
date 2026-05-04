import React, { useState, useEffect } from "react";
import { 
  User, 
  Mail, 
  Shield, 
  Camera,
  Save,
  CheckCircle2,
  Plus,
  Trash2,
  Edit2
} from "lucide-react";
import Sidebar from "@/src/components/admin/Sidebar";
import Topbar from "@/src/components/admin/Topbar";
import { motion } from "motion/react";
import { 
  subscribeToAdminProfiles, 
  createAdminProfile, 
  updateAdminProfile, 
  deleteAdminProfile 
} from "@/src/services/firebaseService";

const Profile = () => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Admin",
    phone: "",
    bio: ""
  });

  useEffect(() => {
    const unsubscribe = subscribeToAdminProfiles((data) => {
      setProfiles(data);
    });
    return () => unsubscribe();
  }, []);

  const handleEdit = (profile: any) => {
    setEditingId(profile.id);
    setFormData({
      name: profile.name || "",
      email: profile.email || "",
      role: profile.role || "Admin",
      phone: profile.phone || "",
      bio: profile.bio || ""
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(editingId || "new");
    
    try {
      if (editingId) {
        await updateAdminProfile(editingId, formData);
        setEditingId(null);
      } else {
        if (profiles.length >= 3) {
          alert("Maximum 3 profiles allowed");
          return;
        }
        await createAdminProfile(formData);
      }
      setShowSuccess(editingId || "new");
      setTimeout(() => setShowSuccess(null), 3000);
      setFormData({ name: "", email: "", role: "Admin", phone: "", bio: "" });
    } catch (err: any) {
      console.error("Failed to save profile:", err);
      alert(err.message || "Failed to save profile.");
    } finally {
      setIsSaving(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this profile?")) {
      try {
        await deleteAdminProfile(id);
      } catch (err: any) {
        console.error("Failed to delete profile:", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Topbar title="Admin Profiles Management" />
        
        <main className="p-8 pt-28 space-y-8 max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Admin Profiles</h2>
              <p className="text-gray-500 mt-1">Manage up to 3 administrative accounts</p>
            </div>
            {profiles.length < 3 && !editingId && (
              <button 
                onClick={() => setEditingId("new")}
                className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20"
              >
                <Plus className="w-5 h-5" />
                Add Profile
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Profile Slots */}
            {[0, 1, 2].map((index) => {
              const profile = profiles[index];
              const isEditing = editingId === (profile?.id || (editingId === "new" && profiles.length === index ? "new" : null));

              if (profile) {
                return (
                  <motion.div 
                    key={profile.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden group"
                  >
                    <div className="h-32 bg-gradient-to-r from-orange-500 to-orange-600 relative">
                      <div className="absolute -bottom-10 left-8 flex items-end gap-4">
                        <div className="w-20 h-20 rounded-2xl bg-white p-1 shadow-lg">
                          <div className="w-full h-full rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 text-2xl font-bold uppercase">
                            {profile.name?.[0] || "A"}
                          </div>
                        </div>
                      </div>
                      <div className="absolute top-4 right-4 flex gap-2 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEdit(profile)}
                          className="p-2 bg-white/20 hover:bg-white/40 text-white backdrop-blur-md rounded-xl transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(profile.id)}
                          className="p-2 bg-red-500/80 hover:bg-red-500 text-white backdrop-blur-md rounded-xl transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="pt-12 p-8 space-y-4">
                      <div>
                        <h4 className="text-xl font-bold text-gray-900">{profile.name}</h4>
                        <p className="text-orange-600 text-sm font-bold flex items-center gap-1 mt-1">
                          <Shield className="w-4 h-4" />
                          {profile.role}
                        </p>
                      </div>
                      <div className="space-y-2 text-sm text-gray-500 font-medium">
                        <p className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {profile.email}
                        </p>
                        <p className="line-clamp-2 italic">{profile.bio}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              }

              return (
                <div 
                  key={`empty-${index}`}
                  className="bg-gray-100/50 border-2 border-dashed border-gray-200 rounded-[40px] h-[320px] flex flex-col items-center justify-center text-gray-400 gap-4"
                >
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                    <User className="w-8 h-8" />
                  </div>
                  <p className="font-bold text-sm uppercase tracking-widest">Available Slot</p>
                </div>
              );
            })}
          </div>

          {/* Edit/Create Form Modal-like Section */}
          {editingId && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-12 bg-white rounded-[40px] shadow-sm border border-gray-100 p-12"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900">
                  {editingId === "new" ? "Create New Profile" : "Edit Profile"}
                </h3>
                <button 
                  onClick={() => setEditingId(null)}
                  className="text-gray-400 hover:text-gray-900 font-bold"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. John Doe"
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
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Role</label>
                    <select 
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all font-medium cursor-pointer"
                    >
                      <option value="Super Admin">Super Admin</option>
                      <option value="Admin">Admin</option>
                      <option value="Manager">Manager</option>
                      <option value="Support">Support</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Success Feedback</label>
                    {showSuccess && (
                      <div className="flex items-center gap-2 text-green-600 font-bold p-4 bg-green-50 rounded-2xl">
                        <CheckCircle2 className="w-5 h-5" />
                        Saved!
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Bio</label>
                  <textarea 
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Short description about this admin..."
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all font-medium resize-none"
                  ></textarea>
                </div>

                <div className="pt-4 flex justify-end">
                  <button 
                    type="submit"
                    disabled={!!isSaving}
                    className="flex items-center gap-3 px-10 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl transition-all shadow-xl shadow-orange-500/20 disabled:opacity-70"
                  >
                    {isSaving ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        {editingId === "new" ? "Create Profile" : "Save Changes"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Profile;

