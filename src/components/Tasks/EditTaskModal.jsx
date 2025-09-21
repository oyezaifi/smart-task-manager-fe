import { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { api } from "../../lib/api";
import { formatMinutes } from "../../utils/formatMinutes";
import ConfirmationModal from "../ConfirmationModal";

const EditTaskModal = ({ isOpen, onClose, task, onTaskUpdated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('todo');
  const [timeToLog, setTimeToLog] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setDueDate(task.dueDate || '');
      setStatus(task.status || 'todo');
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    setError('');
    
    try {
      await api(`/api/tasks/${task._id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          dueDate: dueDate || undefined,
          status
        })
      });
      
      // Show success toast
      toast.success('Task updated successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      // Close modal and refresh tasks
      onClose();
      onTaskUpdated();
    } catch (err) {
      const errorMessage = err.data?.message || 'Failed to update task';
      setError(errorMessage);
      
      // Show error toast
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogTime = async (e) => {
    e.preventDefault();
    if (!timeToLog || parseInt(timeToLog) <= 0) return;

    setIsLoading(true);
    setError('');
    
    try {
      await api(`/api/tasks/${task._id}/time`, {
        method: 'POST',
        body: JSON.stringify({ minutes: parseInt(timeToLog) })
      });
      
      // Show success toast
      toast.success(`${timeToLog} minutes logged successfully!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      setTimeToLog('');
      onTaskUpdated();
    } catch (err) {
      const errorMessage = err.data?.message || 'Failed to log time';
      setError(errorMessage);
      
      // Show error toast
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      await api(`/api/tasks/${task._id}`, { method: 'DELETE' });
      
      // Show success toast
      toast.success('Task deleted successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      onClose();
      onTaskUpdated();
    } catch (err) {
      const errorMessage = err.data?.message || 'Failed to delete task';
      setError(errorMessage);
      
      // Show error toast
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setTitle('');
      setDescription('');
      setDueDate('');
      setStatus('todo');
      setTimeToLog('');
      setError('');
      onClose();
    }
  };

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Edit Task</h2>
              <p className="text-slate-300 text-sm mt-1">Update task details and status</p>
            </div>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="text-slate-400 hover:text-white transition-colors duration-200 disabled:opacity-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Task Details */}
            <div className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Task Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm resize-none"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                    disabled={isLoading}
                  >
                    <option value="todo" className="bg-slate-800">To Do</option>
                    <option value="in_progress" className="bg-slate-800">In Progress</option>
                    <option value="completed" className="bg-slate-800">Completed</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isLoading || !title.trim()}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Updating...' : 'Update Task'}
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isLoading}
                    className="px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 border border-red-500/30 rounded-xl transition-all duration-200 font-medium disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column - Task Info & Time Logging */}
            <div className="space-y-6">
              {/* Task Info */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Task Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-300 text-sm">Status:</span>
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                      task.status === 'completed' 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                        : task.status === 'in_progress'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-slate-500/20 text-slate-300 border border-slate-500/30'
                    }`}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  {task.dueDate && (
                    <div className="flex items-center gap-2">
                      <span className="text-slate-300 text-sm">Due Date:</span>
                      <span className="text-white text-sm">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <span className="text-slate-300 text-sm">Time Spent:</span>
                    <span className="text-white text-sm">{formatMinutes(task.timeSpentMinutes)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-slate-300 text-sm">Created:</span>
                    <span className="text-white text-sm">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Time Logging */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Log Time</h3>
                <form onSubmit={handleLogTime} className="space-y-3">
                  <div>
                    <input
                      type="number"
                      value={timeToLog}
                      onChange={(e) => setTimeToLog(e.target.value)}
                      placeholder="Minutes to log"
                      min="1"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 backdrop-blur-sm"
                      disabled={isLoading}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading || !timeToLog || parseInt(timeToLog) <= 0}
                    className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white rounded-lg border border-white/20 transition-all duration-200 text-sm font-medium disabled:opacity-50"
                  >
                    {isLoading ? 'Logging...' : 'Log Time'}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-sm rounded-xl p-4 backdrop-blur-sm mt-6">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}

          {/* Close Button */}
          <div className="flex justify-end pt-6 border-t border-white/10">
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="px-6 py-3 text-slate-300 hover:text-white border border-white/20 rounded-xl transition-all duration-200 font-medium disabled:opacity-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${task?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default EditTaskModal;
