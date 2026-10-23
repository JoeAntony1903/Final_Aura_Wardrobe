import React, { useState } from 'react';
import { UserProfile } from '../types';
import { APP_THEMES } from '../utils/theme';
import { User, Lock, Mail, Palette, Server, Check, AlertTriangle, LogOut, Eye, EyeOff, LogIn } from 'lucide-react';
import { useTheme } from '../utils/ThemeContext';
import { updateRegisteredUserPassword } from '../utils/authStorage';

interface ProfileSettingsViewProps {
  user: UserProfile;
  currentThemeId: string;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onSelectTheme: (themeId: string) => void;
  onOpenTechDocs: () => void;
  onOpenAuthScreen: () => void;
  onSignOut: () => void;
}

export const ProfileSettingsView: React.FC<ProfileSettingsViewProps> = ({
  user,
  currentThemeId,
  onUpdateUser,
  onSelectTheme,
  onOpenTechDocs,
  onOpenAuthScreen,
  onSignOut,
}) => {
  const { theme, accent, accentRgb, accentText } = useTheme();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackMessage(null);

    // If changing password, must require entering old password (PRD Requirement 7)
    if (newPassword.trim()) {
      if (!oldPassword.trim()) {
        setFeedbackMessage({
          text: 'Security requirement: You must enter your old password to set a new password.',
          type: 'error',
        });
        return;
      }
      if (newPassword !== confirmPassword) {
        setFeedbackMessage({
          text: 'New passwords do not match.',
          type: 'error',
        });
        return;
      }
      if (newPassword.length < 6) {
        setFeedbackMessage({
          text: 'New password must be at least 6 characters.',
          type: 'error',
        });
        return;
      }

      const updateRes = updateRegisteredUserPassword(user.email, oldPassword, newPassword);
      if (!updateRes.success) {
        setFeedbackMessage({
          text: updateRes.error || 'Failed to update password. Current password does not match.',
          type: 'error',
        });
        return;
      }
    }

    onUpdateUser({
      name: name.trim(),
      email: email.trim(),
    });

    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setFeedbackMessage({
      text: 'Profile preferences and security credentials updated successfully!',
      type: 'success',
    });
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Atelier Profile & Settings</h2>
          <p className="text-xs text-slate-400">
            Manage your account credentials, security preferences, and UI color palettes
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenTechDocs}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold flex items-center gap-2 transition border border-slate-700"
          >
            <Server className="w-3.5 h-3.5" />
            <span>Tech Stack & Schema</span>
          </button>

          <button
            onClick={onSignOut}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/40 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {feedbackMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-2 ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
              : 'bg-rose-500/20 border-rose-400 text-rose-200'
          }`}
        >
          {feedbackMessage.type === 'success' ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          )}
          <span>{feedbackMessage.text}</span>
        </div>
      )}

      {/* 8 Customizable Color Themes Section (PRD Requirement 7) */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-amber-400">
          <Palette className="w-5 h-5" />
          <h3 className="text-lg font-bold text-white">App Color Themes (8 Palettes)</h3>
        </div>
        <p className="text-xs text-slate-400">
          Personalize your AuraWardrobe aesthetic. Themes apply dynamically across the entire application interface.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {APP_THEMES.map((t) => {
            const isSelected = currentThemeId === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onSelectTheme(t.id)}
                style={
                  isSelected
                    ? {
                        borderColor: t.accent,
                        boxShadow: `0 0 16px rgba(${t.accentRgb}, 0.35)`,
                      }
                    : {}
                }
                className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all hover:scale-[1.02] ${
                  isSelected
                    ? 'bg-slate-950 ring-2'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{t.name}</span>
                    {isSelected && (
                      <span
                        className="p-1 rounded-full text-slate-950"
                        style={{ backgroundColor: t.accent, color: t.accentText }}
                      >
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-2">{t.tagline}</p>
                </div>

                {/* Color Swatch Dots */}
                <div className="flex items-center gap-1.5 pt-3">
                  <span
                    className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                    style={{ backgroundColor: t.primary }}
                  />
                  <span
                    className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                    style={{ backgroundColor: t.primaryLight }}
                  />
                  <span
                    className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                    style={{ backgroundColor: t.accent }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Edit Profile & Password Form */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-6">
        <div className="flex items-center gap-2 text-amber-400">
          <User className="w-5 h-5" />
          <h3 className="text-lg font-bold text-white">Profile & Security Credentials</h3>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-medium text-slate-300">Display Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-medium text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Password Update Section (Requires Old Password) */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3 pt-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" /> Change Password
              </span>
              <span className="text-[10px] text-amber-400 font-semibold">
                Requires entering current password
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Old Password */}
              <div className="space-y-1">
                <label className="text-slate-400 text-[11px]">Old Password *</label>
                <div className="relative">
                  <input
                    type={showOldPassword ? 'text' : 'password'}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Current password"
                    className="w-full px-3 pr-8 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                  >
                    {showOldPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1">
                <label className="text-slate-400 text-[11px]">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password"
                    className="w-full px-3 pr-8 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                  >
                    {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="space-y-1">
                <label className="text-slate-400 text-[11px]">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400 text-xs"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              style={{
                backgroundColor: accent,
                color: accentText,
                boxShadow: `0 4px 14px rgba(${accentRgb}, 0.35)`,
              }}
              className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition hover:scale-105"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
