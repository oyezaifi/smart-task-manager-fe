import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Crown } from 'lucide-react';

const TaskLimitIndicator = ({ currentTaskCount, userRole, onUpgrade }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  const TASK_LIMIT = 10;
  const isFreeUser = userRole === 'free' || !userRole;
  const tasksRemaining = TASK_LIMIT - currentTaskCount;
  const usagePercentage = (currentTaskCount / TASK_LIMIT) * 100;
  
  // Show indicator for free users when they have tasks
  useEffect(() => {
    if (isFreeUser && currentTaskCount > 0) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isFreeUser, currentTaskCount]);

  if (!isVisible || !isFreeUser) {
    return null;
  }

  const getStatusColor = () => {
    if (tasksRemaining <= 2) return 'text-red-400';
    if (tasksRemaining <= 5) return 'text-yellow-400';
    return 'text-emerald-400';
  };

  const getProgressColor = () => {
    if (tasksRemaining <= 2) return 'bg-red-500';
    if (tasksRemaining <= 5) return 'bg-yellow-500';
    return 'bg-emerald-500';
  };

  const getBorderColor = () => {
    if (tasksRemaining <= 2) return 'border-red-500/30';
    if (tasksRemaining <= 5) return 'border-yellow-500/30';
    return 'border-emerald-500/30';
  };

  const getIcon = () => {
    if (tasksRemaining <= 2) return <AlertTriangle className="w-4 h-4" />;
    if (tasksRemaining <= 5) return <AlertTriangle className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  const getMessage = () => {
    if (tasksRemaining <= 0) {
      return "Limit reached!";
    }
    if (tasksRemaining <= 2) {
      return `${tasksRemaining} left`;
    }
    if (tasksRemaining <= 5) {
      return `${tasksRemaining} left`;
    }
    return `${tasksRemaining} left`;
  };

  return (
    <div className={`fixed top-30 animate-bounce left-4 z-40 w-64 bg-white/10 backdrop-blur-sm border ${getBorderColor()} rounded-xl p-3 transition-all duration-300 shadow-lg`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`${getStatusColor()}`}>
            {getIcon()}
          </div>
          <div>
            <h3 className="text-white font-medium text-xs">
              {tasksRemaining <= 2 ? 'Task Limit' : 'Tasks'}
            </h3>
            <p className={`text-xs ${getStatusColor()}`}>
              {getMessage()}
            </p>
          </div>
        </div>
        
        {tasksRemaining <= 2 && (
          <button
            onClick={onUpgrade}
            className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg"
          >
            <Crown className="w-3 h-3" />
            Upgrade
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-slate-300">
          <span>{currentTaskCount}/{TASK_LIMIT}</span>
          <span>{usagePercentage.toFixed(0)}%</span>
        </div>
        
        <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
          <div 
            className={`h-full ${getProgressColor()} transition-all duration-500 ease-out`}
            style={{ width: `${Math.min(usagePercentage, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskLimitIndicator;
