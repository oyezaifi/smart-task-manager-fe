import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import Navbar from "./navbar";
import CreateTaskModal from "./CreateTaskModal";
import KanbanBoard from "./KanbanBoard";
import TaskLimitIndicator from "./TaskLimitIndicator";

function Tasks() {
    const [tasks,setTasks]=useState([]);
    const [err,setErr]=useState('');
    const [status,setStatus]=useState('');
    const [sortBy,setSortBy]=useState('createdAt');
    const [order,setOrder]=useState('desc');
    const [loading,setLoading]=useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [userRole, setUserRole] = useState('free');
  
    const loadUserData = () => {
      const role = localStorage.getItem('role') || sessionStorage.getItem('role') || 'free';
      console.log(role)
      setUserRole(role);
    };

    const load=async()=>{ setLoading(true); try{
        const params = new URLSearchParams();
        if (status) params.set('status', status);
        if (sortBy) params.set('sortBy', sortBy);
        if (order) params.set('order', order);
        const qs = params.toString();
        const data = await api(`/api/tasks${qs ? `?${qs}`:''}`);
        setTasks(data);
      }catch(e){ setErr(e.data?.message||'Failed to load'); } finally { setLoading(false); } };
    
    useEffect(()=>{ 
      loadUserData();
      load(); 
    },[status,sortBy,order]);
  
    const handleTaskCreated = () => {
      load();
    };

    const handleTaskUpdated = () => {
      load();
    };

    const handleTaskStatusUpdate = (taskId, newStatus) => {
      // Optimistically update the local state
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task._id === taskId 
            ? { ...task, status: newStatus }
            : task
        )
      );
    };

    const handleUpgrade = () => {
      // Navigate to profile page where upgrade functionality exists
      window.location.href = '/profile';
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
            <h1 className="text-4xl font-bold text-white mb-2">Task Board</h1>
            <p className="text-slate-300">Organize your work with the Kanban board</p>
          </div>

          {/* Action Bar */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create Task
                </button>
                
                <div className="text-slate-300 text-sm">
                  Total: {tasks.length} tasks
                </div>
              </div>
              
              {/* Filters */}
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-slate-200">Status</label>
                  <select 
                    value={status} 
                    onChange={e=>setStatus(e.target.value)} 
                    className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 backdrop-blur-sm"
                  >
                    <option value="" className="bg-slate-800">All</option>
                    <option value="todo" className="bg-slate-800">To do</option>
                    <option value="in_progress" className="bg-slate-800">In progress</option>
                    <option value="completed" className="bg-slate-800">Completed</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-slate-200">Sort by</label>
                  <select 
                    value={sortBy} 
                    onChange={e=>setSortBy(e.target.value)} 
                    className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 backdrop-blur-sm"
                  >
                    <option value="createdAt" className="bg-slate-800">Created</option>
                    <option value="dueDate" className="bg-slate-800">Due date</option>
                    <option value="timeSpentMinutes" className="bg-slate-800">Time spent</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-slate-200">Order</label>
                  <select 
                    value={order} 
                    onChange={e=>setOrder(e.target.value)} 
                    className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 backdrop-blur-sm"
                  >
                    <option value="desc" className="bg-slate-800">Desc</option>
                    <option value="asc" className="bg-slate-800">Asc</option>
                  </select>
                </div>
                
                <button
                  onClick={load}
                  className="bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white px-4 py-2 rounded-lg border border-white/20 transition-all duration-200 text-sm font-medium"
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>
  
          {/* Error Display */}
          {err && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-sm rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {err}
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-16">
              <div className="inline-flex items-center gap-2 text-slate-300">
                <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading tasks...
              </div>
            </div>
          )}

          {/* Kanban Board */}
          {!loading && (
            <KanbanBoard 
              tasks={tasks} 
              onTaskUpdated={handleTaskUpdated}
              onTaskStatusUpdate={handleTaskStatusUpdate}
            />
          )}

          {/* Empty State */}
          {!loading && tasks.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 max-w-md mx-auto">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-600/20 to-blue-600/20 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No tasks found</h3>
                <p className="text-slate-400 mb-6">Create your first task to get started with your Kanban board.</p>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                >
                  Create First Task
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Create Task Modal */}
        <CreateTaskModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onTaskCreated={handleTaskCreated}
          userRole={userRole}
          currentTaskCount={tasks.length}
        />

        {/* Task Limit Indicator - Fixed Position */}
        <TaskLimitIndicator 
          currentTaskCount={tasks.length}
          userRole={userRole}
          onUpgrade={handleUpgrade}
        />
      </div>
    );
  }
  
  export default Tasks;