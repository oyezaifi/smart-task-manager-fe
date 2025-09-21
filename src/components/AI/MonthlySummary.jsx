import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Clock, CheckCircle, Target, Lightbulb } from 'lucide-react';
import { api } from '../../lib/api';

const MonthlySummary = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('');

  const generateSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api(`/api/ai/summary/monthly${selectedMonth ? `?month=${selectedMonth}` : ''}`);
      setSummary(response);
    } catch (err) {
      setError('Failed to generate monthly summary. Please try again.');
      console.error('Error generating summary:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const getMonthOptions = () => {
    const options = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const value = date.toISOString().slice(0, 7); // YYYY-MM format
      const label = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      options.push({ value, label });
    }
    return options;
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-semibold text-white">Monthly Summary</h2>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600 focus:border-blue-400 focus:outline-none"
          >
            <option value="">Current Month</option>
            {getMonthOptions().map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            onClick={generateSummary}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating...
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4" />
                Generate Summary
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {summary && (
        <div className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-blue-400" />
                <span className="text-slate-300 text-sm">Total Tasks</span>
              </div>
              <div className="text-2xl font-bold text-white">{summary.statistics?.totalTasks || 0}</div>
            </div>
            <div className="bg-slate-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-slate-300 text-sm">Completed</span>
              </div>
              <div className="text-2xl font-bold text-white">{summary.statistics?.completedTasks || 0}</div>
            </div>
            <div className="bg-slate-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-yellow-400" />
                <span className="text-slate-300 text-sm">Time Spent</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {formatTime(summary.statistics?.totalTimeSpent || 0)}
              </div>
            </div>
            <div className="bg-slate-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <span className="text-slate-300 text-sm">Completion Rate</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {summary.statistics?.completionRate || 0}%
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              Summary for {summary.statistics?.month || 'This Month'}
            </h3>
            <p className="text-slate-300 leading-relaxed">{summary.summary}</p>
          </div>

          {/* Insights */}
          {summary.insights && summary.insights.length > 0 && (
            <div className="bg-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                Key Insights
              </h3>
              <ul className="space-y-2">
                {summary.insights.map((insight, index) => (
                  <li key={index} className="text-slate-300 flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          {summary.recommendations && summary.recommendations.length > 0 && (
            <div className="bg-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-green-400" />
                Recommendations
              </h3>
              <ul className="space-y-2">
                {summary.recommendations.map((recommendation, index) => (
                  <li key={index} className="text-slate-300 flex items-start gap-2">
                    <span className="text-green-400 mt-1">•</span>
                    {recommendation}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Achievements */}
          {summary.achievements && summary.achievements.length > 0 && (
            <div className="bg-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-purple-400" />
                Achievements
              </h3>
              <ul className="space-y-2">
                {summary.achievements.map((achievement, index) => (
                  <li key={index} className="text-slate-300 flex items-start gap-2">
                    <span className="text-purple-400 mt-1">🏆</span>
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MonthlySummary;
