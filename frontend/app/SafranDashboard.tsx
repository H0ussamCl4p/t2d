import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Home, MessageSquare, Settings, User, Send, AlertTriangle } from 'lucide-react';

const StrataeroDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'bot', text: 'Bonjour, comment puis-je vous aider avec les ressources RH ?' },
  ]);
  const [chatInput, setChatInput] = useState('');

  // Dummy data for charts
  const satisfactionData = [
    { name: 'Lean Six Sigma', satisfaction: 4.2 },
    { name: 'SAP', satisfaction: 3.8 },
    { name: 'Processus Métier', satisfaction: 4.5 },
    { name: 'Soft Skills', satisfaction: 3.9 },
  ];

  const sentimentData = [
    { name: 'Positif', value: 60, color: '#0ea5e9' },
    { name: 'Neutre', value: 25, color: '#64748b' },
    { name: 'Négatif', value: 15, color: '#f97316' },
  ];

  const alerts = [
    'Problème logistique détecté - Salle B',
    'Formation SAP sous-évaluée - Action requise',
    'Taux de participation faible - Module Sécurité',
  ];

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      setChatMessages([...chatMessages, { id: Date.now(), sender: 'user', text: chatInput }]);
      setChatInput('');
      // Simulate bot response
      setTimeout(() => {
        setChatMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: 'Votre demande a été enregistrée. Un conseiller RH vous contactera sous 24h.' }]);
      }, 1000);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold text-sky-500">STRATAERO</h1>
          <p className="text-sm text-slate-400">Platform</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                  activeTab === 'analytics' ? 'bg-sky-500 text-white' : 'hover:bg-slate-800'
                }`}
              >
                <Home className="w-5 h-5 mr-3" />
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('bob')}
                className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                  activeTab === 'bob' ? 'bg-sky-500 text-white' : 'hover:bg-slate-800'
                }`}
              >
                <MessageSquare className="w-5 h-5 mr-3" />
                Bob (Chatbot)
              </button>
            </li>
            <li>
              <button className="w-full flex items-center p-3 rounded-lg hover:bg-slate-800 transition-colors">
                <Settings className="w-5 h-5 mr-3" />
                Settings
              </button>
            </li>
          </ul>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center mr-3">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium">Ingénieur Cyber</p>
              <p className="text-xs text-slate-400">Connecté</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-slate-900 border-b border-slate-800 p-6">
          <h2 className="text-2xl font-bold text-sky-500">
            {activeTab === 'analytics' ? 'Analytics Dashboard' : 'Bob (Chatbot)'}
          </h2>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* KPI Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 bg-opacity-50 backdrop-blur-sm border border-slate-800 rounded-lg p-4">
                  <h3 className="text-sm text-slate-400">Satisfaction Moyenne</h3>
                  <p className="text-2xl font-mono font-bold text-sky-500">4.1/5</p>
                </div>
                <div className="bg-slate-900 bg-opacity-50 backdrop-blur-sm border border-slate-800 rounded-lg p-4">
                  <h3 className="text-sm text-slate-400">NPS</h3>
                  <p className="text-2xl font-mono font-bold text-sky-500">72</p>
                </div>
                <div className="bg-slate-900 bg-opacity-50 backdrop-blur-sm border border-slate-800 rounded-lg p-4">
                  <h3 className="text-sm text-slate-400">Alertes Actives</h3>
                  <p className="text-2xl font-mono font-bold text-safran-blue">3</p>
                </div>
                <div className="bg-slate-900 bg-opacity-50 backdrop-blur-sm border border-slate-800 rounded-lg p-4">
                  <h3 className="text-sm text-slate-400">Volume Évaluations</h3>
                  <p className="text-2xl font-mono font-bold text-sky-500">1,247</p>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4 text-sky-500">Satisfaction par Type de Formation</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={satisfactionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #374151' }} />
                      <Bar dataKey="satisfaction" fill="#0ea5e9" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4 text-sky-500">Distribution des Sentiments</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={sentimentData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {sentimentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #374151' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Alerts */}
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4 text-safran-blue flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Signaux Faibles Récentes
                </h3>
                <ul className="space-y-2">
                  {alerts.map((alert, index) => (
                    <li key={index} className="flex items-center p-2 bg-slate-800 rounded">
                      <AlertTriangle className="w-4 h-4 text-safran-blue mr-2" />
                      <span className="text-sm">{alert}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'bob' && (
            <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-lg">
              {/* Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto font-mono text-sm">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`mb-4 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                    <div
                      className={`inline-block p-3 rounded-lg max-w-xs ${
                        msg.sender === 'user'
                          ? 'bg-sky-500 text-white'
                          : 'bg-slate-800 text-slate-100'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-slate-800">
                <div className="flex">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Tapez votre message..."
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-l-lg px-4 py-2 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-sky-500 hover:bg-sky-600 px-4 py-2 rounded-r-lg transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default StrataeroDashboard;