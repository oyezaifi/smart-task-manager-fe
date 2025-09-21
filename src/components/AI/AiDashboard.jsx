import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Calendar, MessageCircle, BarChart3, Clock, Target, Lightbulb } from 'lucide-react';
import Navbar from '../Tasks/navbar';
import MonthlySummary from './MonthlySummary';
import ChatInterface from './chatInterface';
import { api } from '../../lib/api';

const AIDashboard = () => {
  const [activeTab, setActiveTab] = useState('summary');
  const [productivityInsights, setProductivityInsights] = useState(null);
  const [taskAnalytics, setTaskAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProductivityInsights();
    loadTaskAnalytics();
  }, []);

  const loadProductivityInsights = async () => {
    try {
      const data = await api('/api/ai/insights/productivity?timeRange=week');
      setProductivityInsights(data);
    } catch (error) {
      console.error('Failed to load productivity insights:', error);
    }
  };

  const loadTaskAnalytics = async () => {
    try {
      const data = await api('/api/ai/analytics/tasks?timeRange=week');
      setTaskAnalytics(data);
    } catch (error) {
      console.error('Failed to load task analytics:', error);
    }
  };

  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const formatInsightText = (text) => {
    if (!text) return '';
    
    // Split by double line breaks to create sections
    const sections = text.split('\n\n');
    
    return sections.map((section, index) => {
      // Check if section starts with ** (bold header)
      if (section.startsWith('**') && section.includes(':**')) {
        const [header, ...content] = section.split(':**');
        const headerText = header.replace('**', '').trim();
        const contentText = content.join(':**').trim();
        
        return (
          <div key={index} className="mb-4">
            <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
              {headerText}
            </h4>
            <div className="text-slate-300 leading-relaxed whitespace-pre-line ml-4">
              {contentText}
            </div>
          </div>
        );
      }
      
      // Regular paragraph
      return (
        <div key={index} className="text-slate-300 leading-relaxed whitespace-pre-line mb-2">
          {section}
        </div>
      );
    });
  };

  const tabs = [
    {
      id: 'summary',
      label: 'Monthly Summary',
      icon: Calendar,
      description: 'AI-generated monthly reports'
    },
    {
      id: 'chat',
      label: 'AI Chat',
      icon: MessageCircle,
      description: 'Ask questions about your tasks'
    },
    {
      id: 'insights',
      label: 'Insights',
      icon: TrendingUp,
      description: 'Productivity patterns and trends'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      description: 'Detailed task analytics'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'summary':
        return <MonthlySummary />;
      
      case 'chat':
        return (
          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <MessageCircle className="w-6 h-6 text-blue-400" />
              <div>
                <h2 className="text-xl font-semibold text-white">AI Chat Assistant</h2>
                <p className="text-slate-400">Ask questions about your tasks and get intelligent insights</p>
              </div>
            </div>
            <ChatInterface />
          </div>
        );

      case 'insights':
        return (
          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-semibold text-white">Productivity Insights</h2>
            </div>
            
            {productivityInsights ? (
              <div className="space-y-6">
                {/* Insights */}
                {productivityInsights.insights && productivityInsights.insights.length > 0 && (
                  <div className="bg-slate-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-400" />
                      Key Insights
                    </h3>
                    <div className="space-y-4">
                      {formatInsightText(productivityInsights.insights[0])}
                    </div>
                  </div>
                )}

                {/* Trends */}
                {productivityInsights.trends && Object.keys(productivityInsights.trends).length > 0 && (
                  <div className="bg-slate-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-blue-400" />
                      Trends
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Object.entries(productivityInsights.trends).map(([key, value]) => (
                        <div key={key} className="bg-slate-600 rounded-lg p-4">
                          <div className="text-slate-300 text-sm capitalize mb-1">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                          <div className="text-xl font-bold text-white">
                            {typeof value === 'number' && key.includes('Time') ? formatTime(value) : value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {productivityInsights.recommendations && productivityInsights.recommendations.length > 0 && (
                  <div className="bg-slate-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <Target className="w-5 h-5 text-green-400" />
                      Recommendations
                    </h3>
                    <ul className="space-y-2">
                      {productivityInsights.recommendations.map((recommendation, index) => (
                        <li key={index} className="text-slate-300 flex items-start gap-2">
                          <span className="text-green-400 mt-1">•</span>
                          {recommendation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Loading Insights</h3>
                <p className="text-slate-400">Analyzing your productivity patterns...</p>
              </div>
            )}
          </div>
        );

      case 'analytics':
        return (
          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-6 h-6 text-green-400" />
              <h2 className="text-xl font-semibold text-white">Task Analytics</h2>
            </div>
            
            {taskAnalytics ? (
              <div className="space-y-6">
                {/* Statistics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-5 h-5 text-blue-400" />
                      <span className="text-slate-300 text-sm">Total Tasks</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{taskAnalytics.statistics?.totalTasks || 0}</div>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-5 h-5 text-green-400" />
                      <span className="text-slate-300 text-sm">Completed</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{taskAnalytics.statistics?.completedTasks || 0}</div>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-yellow-400" />
                      <span className="text-slate-300 text-sm">Time Spent</span>
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {formatTime(taskAnalytics.statistics?.totalTimeSpent || 0)}
                    </div>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-purple-400" />
                      <span className="text-slate-300 text-sm">Completion Rate</span>
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {taskAnalytics.statistics?.completionRate || 0}%
                    </div>
                  </div>
                </div>

                {/* Task Distribution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Status Distribution</h3>
                    <div className="space-y-3">
                      {taskAnalytics.distribution?.byStatus && Object.entries(taskAnalytics.distribution.byStatus).map(([status, count]) => (
                        <div key={status} className="flex items-center justify-between">
                          <span className="text-slate-300 capitalize">{status.replace('_', ' ')}</span>
                          <div className="flex items-center gap-2">
                            <div className={`w-12 h-2 rounded-full ${
                              status === 'completed' ? 'bg-green-500' :
                              status === 'inProgress' ? 'bg-blue-500' : 'bg-yellow-500'
                            }`}></div>
                            <span className="text-white font-medium">{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Tasks by Day</h3>
                    <div className="space-y-2">
                      {taskAnalytics.distribution?.byDay && Object.entries(taskAnalytics.distribution.byDay).map(([day, count]) => (
                        <div key={day} className="flex items-center justify-between text-sm">
                          <span className="text-slate-300">{day}</span>
                          <span className="text-white font-medium">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Overdue Tasks */}
                {taskAnalytics.overdueTasks && taskAnalytics.overdueTasks.length > 0 && (
                  <div className="bg-slate-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-red-400" />
                      Overdue Tasks ({taskAnalytics.overdueTasks.length})
                    </h3>
                    <div className="space-y-2">
                      {taskAnalytics.overdueTasks.slice(0, 5).map((task) => (
                        <div key={task.id} className="flex items-center justify-between p-3 bg-slate-600 rounded-lg">
                          <span className="text-white">{task.title}</span>
                          <div className="text-red-400 text-sm">
                            {task.daysOverdue} day{task.daysOverdue !== 1 ? 's' : ''} overdue
                          </div>
                        </div>
                      ))}
                      {taskAnalytics.overdueTasks.length > 5 && (
                        <p className="text-slate-400 text-sm text-center">
                          +{taskAnalytics.overdueTasks.length - 5} more overdue tasks
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <BarChart3 className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Loading Analytics</h3>
                <p className="text-slate-400">Analyzing your task data...</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-slate-800 to-blue-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-br from-emerald-600/10 to-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-tr from-blue-600/10 to-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-emerald-600/5 to-blue-600/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <Navbar />
      
      <main className="max-w-7xl mx-auto p-4 space-y-6 relative z-10">
        {/* Header */}
        <div className="text-center py-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">AI Dashboard</h1>
          </div>
          <p className="text-slate-300">Get intelligent insights about your productivity and task management</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
          
          {/* Tab Description */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-slate-400 text-sm">
              {tabs.find(tab => tab.id === activeTab)?.description}
            </p>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
};

export default AIDashboard;