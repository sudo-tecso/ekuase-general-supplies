"use client";

import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { User, Phone, MapPin, ShieldCheck, Camera, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useState } from "react";
import axios from "axios";

const profileSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  address: z.string().min(5, "Address is required"),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ProfileValues = z.infer<typeof profileSchema>;
type PasswordValues = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: session?.user?.name || "",
      phone: (session?.user as any)?.phone || "",
      address: (session?.user as any)?.address || "",
    },
  });

  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
  });

  const onUpdateProfile = async (values: ProfileValues) => {
    setIsSaving(true);
    try {
      await axios.patch("/api/users/me", values);
      await update(); // Sync session
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const onChangePassword = async (values: PasswordValues) => {
    setIsChangingPassword(true);
    try {
      await axios.post("/api/users/me/change-password", values);
      toast.success("Password changed successfully!");
      passwordForm.reset();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-12">
      <div className="space-y-1">
        <h1 className="text-3xl font-heading font-black uppercase tracking-tighter text-secondary">Account Settings</h1>
        <p className="text-sm font-medium text-muted-foreground italic">Manage your profile and security preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Profile Info Form */}
        <div className="md:col-span-2 space-y-8">
          <Card className="p-8 border shadow-xl space-y-8">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-[32px] bg-muted border-4 border-white shadow-xl flex items-center justify-center overflow-hidden">
                   <User className="w-10 h-10 text-muted-foreground" />
                </div>
                <button className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center shadow-lg border-4 border-white hover:scale-110 transition-transform">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-heading font-black uppercase tracking-tighter text-secondary">{session?.user?.name}</h3>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{session?.user?.email}</p>
              </div>
            </div>

            <form onSubmit={profileForm.handleSubmit(onUpdateProfile)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-secondary">Full Name</label>
                  <Input {...profileForm.register("name")} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-secondary">Phone Number</label>
                  <Input {...profileForm.register("phone")} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-secondary">Default Delivery Address</label>
                <textarea 
                  {...profileForm.register("address")}
                  className="w-full min-h-[100px] p-4 rounded-2xl border-2 border-muted focus:border-accent outline-none transition-all resize-none font-medium text-sm"
                />
              </div>
              <Button disabled={isSaving} className="h-14 px-10 font-black uppercase tracking-tighter shadow-xl shadow-accent/20">
                {isSaving ? <Loader2 className="animate-spin w-5 h-5" /> : "Save Changes"}
              </Button>
            </form>
          </Card>

          {/* Password Form */}
          <Card className="p-8 border shadow-xl space-y-8">
            <div className="space-y-1">
              <h3 className="text-xl font-heading font-black uppercase tracking-tighter text-secondary">Security</h3>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Update your password</p>
            </div>
            <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-secondary">Current Password</label>
                <Input type="password" {...passwordForm.register("currentPassword")} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-secondary">New Password</label>
                  <Input type="password" {...passwordForm.register("newPassword")} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-secondary">Confirm New Password</label>
                  <Input type="password" {...passwordForm.register("confirmPassword")} />
                </div>
              </div>
              <Button disabled={isChangingPassword} variant="secondary" className="h-14 px-10 font-black uppercase tracking-tighter">
                {isChangingPassword ? <Loader2 className="animate-spin w-5 h-5" /> : "Update Password"}
              </Button>
            </form>
          </Card>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <Card className="p-8 border shadow-2xl bg-secondary text-white space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-heading font-black uppercase tracking-tighter">Privacy First</h4>
              <p className="text-xs text-white/60 font-medium leading-relaxed">
                Your personal information is encrypted and never shared with third parties without your consent.
              </p>
            </div>
          </Card>
          
          <div className="p-6 bg-muted/30 rounded-[32px] border-2 border-dashed border-muted flex flex-col items-center text-center gap-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Verification Status</p>
            <span className="px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase tracking-widest">Verified Account</span>
          </div>
        </div>
      </div>
    </div>
  );
}
