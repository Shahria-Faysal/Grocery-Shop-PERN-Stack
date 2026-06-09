"use client";
import { useState, useEffect } from "react";
import { User, Mail, Phone, Lock, Bell, ShieldCheck, LogOut, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

type Tab = "details" | "password" | "notifications";

export default function ProfilePage() {
  const { user, setUser, loading } = useAuth();
  const router = useRouter();

  const [tab, setTab] = useState<Tab>("details");
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    } else if (!loading) {
      router.push("/login"); // Redirect to login if not authenticated
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
      router.push("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const saveDetails = async () => {
    setError("");
    setIsSaving(true);
    try {
      const res = await api.patch("/user/edit", formData);
      setUser(res.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update user");
    } finally {
      setIsSaving(false);
    }
  };

  const updatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    setIsSaving(true);
    try {
      // hevent added yet
      await api.patch("/user/edit", { password: passwordData.newPassword });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update password");
    } finally {
      setIsSaving(false);
    }
  };

  const savePreferences = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "details",       label: "Personal Details", icon: User  },
    { id: "password",      label: "Password",         icon: Lock  },
    { id: "notifications", label: "Notifications",    icon: Bell  },
  ];

  if (loading || !user) {
    return (
      <div className="pt-32 flex justify-center items-center pb-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#FD6E20]" />
      </div>
    );
  }

  return (
    <div className="pt-24 max-w-3xl mx-auto px-4 pb-12">
      {/* Avatar header */}
      <div className="flex items-center gap-5 mb-10">
        <div className="w-20 h-20 rounded-2xl bg-orange-100 text-[#FD6E20] flex items-center justify-center text-3xl font-bold shrink-0">
          {user.name?.[0]?.toUpperCase() || "U"}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-gray-500 text-sm">{user.email}</p>
          {user.isVerified && (
            <span className="inline-flex items-center gap-1 mt-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              <ShieldCheck className="h-3 w-3" /> Verified account
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Sidebar tabs */}
        <nav className="sm:w-52 shrink-0 flex sm:flex-col gap-1">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setError(""); }}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${tab === t.id ? "bg-orange-50 text-[#FD6E20]" : "text-gray-600 hover:bg-gray-100"}`}
            >
              <t.icon className="h-4 w-4 shrink-0" /> {t.label}
            </button>
          ))}
          <Separator className="my-2" />
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
            <LogOut className="h-4 w-4 shrink-0" /> Sign Out
          </button>
        </nav>

        {/* Panel */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
          {saved && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-3 rounded-xl text-sm font-medium">
              <CheckCircle className="h-4 w-4" /> Changes saved successfully!
            </div>
          )}
          
          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          {tab === "details" && (
            <>
              <h2 className="font-bold text-lg">Personal Details</h2>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="pl-9 rounded-xl" 
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      value={formData.email} 
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      type="email" 
                      className="pl-9 rounded-xl" 
                      disabled // Email usually requires verification to change, disabled for now or allow if backend supports it
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      value={formData.phone} 
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="pl-9 rounded-xl" 
                    />
                  </div>
                </div>
              </div>
              <Button disabled={isSaving} className="rounded-full bg-[#FD6E20] hover:bg-[#e55a0f]" onClick={saveDetails}>
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null} Save Changes
              </Button>
            </>
          )}

          {tab === "password" && (
            <>
              <h2 className="font-bold text-lg">Change Password</h2>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Current Password</Label>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    className="rounded-xl" 
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>New Password</Label>
                  <Input 
                    type="password" 
                    placeholder="Min. 8 characters" 
                    className="rounded-xl" 
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Confirm New Password</Label>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    className="rounded-xl" 
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  />
                </div>
              </div>
              <Button disabled={isSaving} className="rounded-full bg-[#FD6E20] hover:bg-[#e55a0f]" onClick={updatePassword}>
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null} Update Password
              </Button>
            </>
          )}

          {tab === "notifications" && (
            <>
              <h2 className="font-bold text-lg">Notification Preferences</h2>
              <div className="space-y-4">
                {[
                  { label: "Order updates",           desc: "Shipping and delivery notifications", defaultChecked: true  },
                  { label: "Promotions & offers",     desc: "Deals, discounts, and new arrivals",  defaultChecked: true  },
                  { label: "Account security alerts", desc: "Login attempts and changes",          defaultChecked: true  },
                  { label: "Weekly newsletter",       desc: "Curated recipes and tips",            defaultChecked: false },
                ].map(n => (
                  <label key={n.label} className="flex items-center justify-between gap-4 p-4 rounded-xl hover:bg-gray-50 cursor-pointer">
                    <div>
                      <div className="text-sm font-medium">{n.label}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{n.desc}</div>
                    </div>
                    <input type="checkbox" defaultChecked={n.defaultChecked} className="accent-[#FD6E20] w-4 h-4 shrink-0" />
                  </label>
                ))}
              </div>
              <Button className="rounded-full bg-[#FD6E20] hover:bg-[#e55a0f]" onClick={savePreferences}>Save Preferences</Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

