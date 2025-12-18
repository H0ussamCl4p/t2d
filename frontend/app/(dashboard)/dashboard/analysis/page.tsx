'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Award, Target, Activity, AlertTriangle, Upload, FileText } from 'lucide-react';

const KPICard = ({ title, value, change, icon: Icon, color }: any) => (
  <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-lg p-6">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-slate-100" />
      </div>
      <div className={`text-sm font-medium ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
        {change >= 0 ? '+' : ''}{change}%
      </div>
    </div>
    <div className="space-y-1">
      <p className="text-2xl font-bold text-slate-100">{value}</p>
      <p className="text-sm text-slate-400">{title}</p>
    </div>
  </div>
);

export default function AnalysisPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async () => {
    if (!file) {
      setError('Please select a CSV file first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setData(response.data);
    } catch (error: any) {
      console.error('Failed to analyze file:', error);
      setError(error.response?.data?.detail || 'Failed to analyze file');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
      setError('Please select a valid CSV file');
      setFile(null);
    } else {
      setFile(selectedFile || null);
      setError(null);
    }
  };

  // Dynamic data based on API response
  const kpiData = data ? [
    { title: 'Total Evaluations', value: data.total_evaluations.toString(), change: 0, icon: Users, color: 'bg-blue-500/20' },
    { title: 'Average Satisfaction', value: data.satisfaction_moyenne.toFixed(1), change: 0, icon: Award, color: 'bg-green-500/20' },
    { title: 'Positive Rate', value: `${data.taux_positifs}%`, change: 0, icon: Target, color: 'bg-safran-blue/20' },
    { title: 'Total Keywords', value: data.keywords.length.toString(), change: 0, icon: Activity, color: 'bg-purple-500/20' },
  ] : [
    { title: 'Total Employees', value: '1,247', change: 2.5, icon: Users, color: 'bg-blue-500/20' },
    { title: 'Training Completion', value: '89%', change: 5.2, icon: Award, color: 'bg-green-500/20' },
    { title: 'Performance Score', value: '94.2', change: -1.3, icon: Target, color: 'bg-safran-blue/20' },
    { title: 'Active Sessions', value: '156', change: 12.8, icon: Activity, color: 'bg-purple-500/20' },
  ];

  const sentimentData = data ? Object.entries(data.sentiments).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: value as number,
    color: name === 'positif' ? '#10B981' : name === 'neutre' ? '#F59E0B' : '#EF4444'
  })) : [
    { name: 'Positive', value: 65, color: '#10B981' },
    { name: 'Neutral', value: 25, color: '#F59E0B' },
    { name: 'Negative', value: 10, color: '#EF4444' },
  ];

  const trainingData = data ? Object.entries(data.scores_moyens).map(([name, score]) => ({
    name,
    completion: Math.random() * 100, // Mock completion
    satisfaction: score as number
  })) : [
    { name: 'Lean Six Sigma', completion: 92, satisfaction: 4.2 },
    { name: 'SAP', completion: 78, satisfaction: 3.8 },
    { name: 'Process Métier', completion: 85, satisfaction: 4.5 },
    { name: 'Soft Skills', completion: 67, satisfaction: 3.9 },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-100">Training Analytics</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 animate-pulse">
              <div className="h-4 bg-slate-700 rounded mb-4"></div>
              <div className="h-8 bg-slate-700 rounded mb-2"></div>
              <div className="h-3 bg-slate-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Training Analytics</h1>
          <p className="text-slate-400 mt-1">Real-time insights into employee development</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-slate-400">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Live Data</span>
        </div>
      </div>

      {/* File Upload Section */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-lg p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Upload CSV File for Analysis
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="block w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-safran-orange file:text-slate-900 hover:file:bg-safran-orange/80"
              />
              <button
                onClick={handleFileUpload}
                disabled={!file || loading}
                className="flex items-center space-x-2 px-4 py-2 bg-safran-orange text-slate-900 rounded-lg hover:bg-safran-orange/80 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="w-4 h-4" />
                <span>{loading ? 'Analyzing...' : 'Analyze'}</span>
              </button>
            </div>
            {file && (
              <p className="text-sm text-slate-400 mt-2 flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Selected: {file.name}</span>
              </p>
            )}
            {error && (
              <p className="text-sm text-red-400 mt-2">{error}</p>
            )}
          </div>
        </div>
      </div>

      {data ? (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpiData.map((kpi, index) => (
              <KPICard key={index} {...kpi} />
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Training Completion Chart */}
            <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-slate-100 mb-4">Training Completion Rates</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={trainingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F3F4F6'
                    }}
                  />
                  <Bar dataKey="completion" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Sentiment Analysis */}
            <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-slate-100 mb-4">Employee Sentiment</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F3F4F6'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center space-x-6 mt-4">
                {sentimentData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-slate-400">{item.name}: {item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Insights Panel */}
          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-slate-100 mb-4">AI Insights</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-lg font-medium text-slate-100 mb-2">Key Insights</h4>
                  <ul className="space-y-2">
                    {data.insights.slice(0, 3).map((insight: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2 text-sm text-slate-300">
                        <span className="w-2 h-2 bg-safran-orange rounded-full mt-2 flex-shrink-0"></span>
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-slate-100 mb-2">Top Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.keywords.slice(0, 10).map((keyword: string, index: number) => (
                      <span key={index} className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-sm">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="p-4 text-sm text-slate-400 bg-slate-900/40 border border-slate-800 rounded-lg">
          Please upload a CSV file and click "Analyze" to see analysis results.
        </div>
      )}
    </div>
  );
}