'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, Shield, Key, Save, Eye, EyeOff, AlertCircle, Check } from 'lucide-react';

export default function SettingsPage() {
  const { user, logout, checkAuthStatus } = useAuth();
  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  // Update local state when user changes
  useEffect(() => {
    setFirstName(user?.first_name || '');
    setLastName(user?.last_name || '');
  }, [user]);

  // Update name and/or password
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    // Password validation if changing
    if (newPassword || confirmPassword) {
      if (newPassword !== confirmPassword) {
        setMessage('New passwords do not match');
        setMessageType('error');
        setIsLoading(false);
        return;
      }
      if (newPassword.length < 8) {
        setMessage('Password must be at least 8 characters long');
        setMessageType('error');
        setIsLoading(false);
        return;
      }
    }

    try {
      const payload: any = {};
      if (firstName !== user?.first_name) payload.first_name = firstName;
      if (lastName !== user?.last_name) payload.last_name = lastName;
      if (newPassword) payload.password = newPassword;

      if (Object.keys(payload).length === 0) {
        setMessage('No changes to update');
        setMessageType('error');
        setIsLoading(false);
        return;
      }

      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/me`, payload);
      setMessage('Profile updated successfully');
      setMessageType('success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      // Refresh user info
      await checkAuthStatus();
    } catch (error: any) {
      setMessage(error.response?.data?.detail || 'Failed to update profile');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Profile Settings</h1>
          <p className="text-slate-400 mt-1">Manage your account and security preferences</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-slate-400">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Secure Session</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Account Info & Name Edit */}
          <form onSubmit={handleProfileUpdate} className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold text-slate-100 mb-6 flex items-center">
              <User className="w-5 h-5 mr-2 text-orange-500" />
              Account Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">First Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder="First Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Last Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  placeholder="Last Name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
              <div className="flex items-center space-x-3 p-3 bg-slate-800/30 border border-slate-700 rounded-lg">
                <Mail className="w-5 h-5 text-slate-500" />
                <span className="text-slate-100">{user?.email || 'admin@safran.com'}</span>
                <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 border border-green-500/30 rounded">Verified</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Role</label>
              <div className="flex items-center space-x-3 p-3 bg-slate-800/30 border border-slate-700 rounded-lg">
                <Shield className="w-5 h-5 text-slate-500" />
                <span className="text-slate-100 capitalize">{user?.role || 'Admin'}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Account Status</label>
              <div className="flex items-center space-x-3 p-3 bg-slate-800/30 border border-slate-700 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-slate-100">Active & Secure</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-900 flex items-center justify-center mt-4"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Update Profile
                </>
              )}
            </button>
            {message && (
              <div className={`flex items-center space-x-2 p-3 mt-4 rounded-lg border ${
                messageType === 'success'
                  ? 'bg-green-500/10 border-green-500/20 text-green-400'
                  : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}>
                {messageType === 'success' ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <span className="text-sm">{message}</span>
              </div>
            )}
          </form>

          {/* Password Change is now part of the profile update form above */}
        </div>

        {/* Security Info removed for MVP */}
      </div>
    </div>
  );
}