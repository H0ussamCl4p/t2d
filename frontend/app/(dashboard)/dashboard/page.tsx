'use client';

import React from 'react';
import Link from 'next/link';
import { BarChart3, MessageSquare, Settings, TrendingUp, Users, Shield, Clock, AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  const quickStats = [
    { label: 'Active Users', value: '1,247', icon: Users, color: 'text-blue-500' },
    { label: 'Training Sessions', value: '89', icon: TrendingUp, color: 'text-green-500' },
    { label: 'Security Alerts', value: '3', icon: Shield, color: 'text-safran-orange' },
    { label: 'Response Time', value: '< 2min', icon: Clock, color: 'text-purple-500' },
  ];

  const recentActivities = [
    { action: 'New user registered', time: '2 minutes ago', type: 'user' },
    { action: 'Training analysis completed', time: '15 minutes ago', type: 'analysis' },
    { action: 'Security scan performed', time: '1 hour ago', type: 'security' },
    { action: 'System backup completed', time: '3 hours ago', type: 'system' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Dashboard Overview</h1>
          <p className="text-slate-400 mt-1">Welcome to Safran Neural Hub</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-400">Last updated</p>
          <p className="text-slate-100 font-medium">{new Date().toLocaleTimeString()}</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-lg p-6 hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-100 mt-1">{stat.value}</p>
                </div>
                <Icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Analysis Card */}
        <Link href="/dashboard/analysis" className="group">
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-lg p-6 hover:bg-slate-800/50 hover:border-safran-orange/30 transition-all group-hover:scale-105">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-safran-orange/20 rounded-lg flex items-center justify-center group-hover:bg-safran-orange/30 transition-colors">
                <BarChart3 className="w-6 h-6 text-safran-orange" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-100">Training Analysis</h3>
                <p className="text-sm text-slate-400">Analyze training effectiveness and performance metrics</p>
              </div>
            </div>
          </div>
        </Link>

        {/* Chatbot Card */}
        <Link href="/dashboard/chatbot" className="group">
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-lg p-6 hover:bg-slate-800/50 hover:border-safran-orange/30 transition-all group-hover:scale-105">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-safran-orange/20 rounded-lg flex items-center justify-center group-hover:bg-safran-orange/30 transition-colors">
                <MessageSquare className="w-6 h-6 text-safran-orange" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-100">HR Assistant</h3>
                <p className="text-sm text-slate-400">Get instant answers to HR and training questions</p>
              </div>
            </div>
          </div>
        </Link>

        {/* Settings Card */}
        <Link href="/dashboard/settings" className="group">
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-lg p-6 hover:bg-slate-800/50 hover:border-safran-orange/30 transition-all group-hover:scale-105">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-safran-orange/20 rounded-lg flex items-center justify-center group-hover:bg-safran-orange/30 transition-colors">
                <Settings className="w-6 h-6 text-safran-orange" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-100">Settings</h3>
                <p className="text-sm text-slate-400">Manage your account and system preferences</p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2 text-orange-500" />
          Recent Activity
        </h3>
        <div className="space-y-3">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-b-0">
              <span className="text-slate-300">{activity.action}</span>
              <span className="text-sm text-slate-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

