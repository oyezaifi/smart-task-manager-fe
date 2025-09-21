import { useState } from "react";
import { toast } from 'react-toastify';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { formatMinutes } from "../../utils/formatMinutes";
import EditTaskModal from "./EditTaskModal";
import { api } from "../../lib/api";

// Droppable Column Component
const DroppableColumn = ({ column, tasks, onTaskClick }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
      {/* Column Header */}
      <div className={`flex items-center gap-3 mb-4 p-4 rounded-xl ${column.bgColor} border ${column.borderColor} shadow-lg backdrop-blur-sm`}>
        <div className={`${column.iconColor} drop-shadow-sm`}>
          {column.icon}
        </div>
        <div>
          <h3 className={`text-lg font-bold ${column.titleColor} drop-shadow-sm`}>
            {column.title}
          </h3>
          <p className={`text-sm font-medium ${column.countColor}`}>
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
          </p>
        </div>
      </div>

      {/* Drop Zone */}
      <div 
        ref={setNodeRef}
        className={`space-y-3 min-h-[200px] p-2 rounded-lg border-2 border-dashed transition-all duration-200 ${
          isOver 
            ? `${column.borderColor.replace('/30', '/60')} ${column.bgColor.replace('/20', '/30')} shadow-inner` 
            : 'border-transparent hover:border-white/20'
        }`}
      >
        <SortableContext items={tasks.map(task => task._id)} strategy={verticalListSortingStrategy}>
          {tasks.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <div className={`w-12 h-12 ${column.bgColor} rounded-xl mx-auto mb-2 flex items-center justify-center border ${column.borderColor}`}>
                  <svg className={`w-6 h-6 ${column.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3" />
                  </svg>
                </div>
                <p className={`text-sm ${column.countColor}`}>Drop tasks here</p>
              </div>
            </div>
          ) : (
            tasks.map(task => (
              <SortableTaskItem
                key={task._id}
                task={task}
                onClick={() => onTaskClick(task)}
              />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
};

// Sortable Task Item Component
const SortableTaskItem = ({ task, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      onClick={onClick}
      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 cursor-pointer hover:bg-white/15 hover:border-white/30 transition-all duration-200 group"
    >
      {/* Task Title */}
      <h4 className="text-white font-medium mb-2 line-clamp-2 group-hover:text-emerald-300 transition-colors">
        {task.title}
      </h4>

      {/* Task Description */}
      {task.description && (
        <p className="text-slate-300 text-sm mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Task Meta */}
      <div className="space-y-2">
        {/* Due Date */}
        {task.dueDate && (
          <div className="flex items-center gap-2">
            <svg className="w-3 h-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs text-purple-300">
              Due {new Date(task.dueDate).toLocaleDateString()}
            </span>
          </div>
        )}

        {/* Time Spent */}
        <div className="flex items-center gap-2">
          <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs text-emerald-300">
            {formatMinutes(task.timeSpentMinutes)}
          </span>
        </div>

        {/* Created Date */}
        <div className="flex items-center gap-2">
          <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs text-slate-400">
            Created {new Date(task.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Drag Handle */}
      <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between">
        <p className="text-xs text-slate-400 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Click to edit
        </p>
        <div
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-white/10 rounded opacity-0 group-hover:opacity-100 transition-opacity"
          title="Drag to move"
        >
          <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

const KanbanBoard = ({ tasks, onTaskUpdated, onTaskStatusUpdate }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTask, setActiveTask] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleTaskClick = (task) => {
    // Don't open modal if we're currently dragging
    if (isDragging) {
      return;
    }
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedTask(null);
  };

  const handleTaskUpdated = () => {
    onTaskUpdated();
    handleCloseEditModal();
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const activeTask = tasks.find(task => task._id === active.id);
    setActiveTask(activeTask);
    setIsDragging(true);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    console.log('Drag end:', { activeId: active.id, overId: over?.id });
    
    if (!over) {
      setActiveTask(null);
      setIsDragging(false);
      return;
    }

    const activeId = active.id;
    const overId = over.id;
    
    // Find the task being dragged
    const activeTask = tasks.find(task => task._id === activeId);
    if (!activeTask) {
      setActiveTask(null);
      setIsDragging(false);
      return;
    }

    // Determine the new status based on the drop target
    let newStatus = activeTask.status;
    
    // Check if we're dropping on a column (status change)
    if (overId === 'todo' || overId === 'in_progress' || overId === 'completed') {
      newStatus = overId;
    } else {
      // We're dropping on another task, find its status
      const overTask = tasks.find(task => task._id === overId);
      if (overTask) {
        newStatus = overTask.status;
      }
    }

    console.log('Status change:', { 
      from: activeTask.status, 
      to: newStatus, 
      taskId: activeId 
    });

    // Only update if status actually changed
    if (newStatus !== activeTask.status) {
      console.log('Updating task status...');
      
      // Update local state immediately for smooth UX
      onTaskStatusUpdate(activeId, newStatus);
      
      // Send API request in background (don't await)
      api(`/api/tasks/${activeId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      }).then(() => {
        console.log('Task status updated successfully');
        
        // Show success toast
        const statusLabels = {
          todo: 'To Do',
          in_progress: 'In Progress',
          completed: 'Completed'
        };
        
        toast.success(`Task moved to ${statusLabels[newStatus]}!`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }).catch(error => {
        console.error('Failed to update task status:', error);
        
        // Show error toast
        toast.error('Failed to update task status', {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        // If API fails, refresh to get correct state
        onTaskUpdated();
      });
    } else {
      console.log('No status change needed');
    }

    setActiveTask(null);
    setIsDragging(false);
  };

  // Group tasks by status
  const groupedTasks = {
    todo: tasks.filter(task => task.status === 'todo'),
    in_progress: tasks.filter(task => task.status === 'in_progress'),
    completed: tasks.filter(task => task.status === 'completed')
  };

  const columns = [
    {
      id: 'todo',
      title: 'To Do',
      color: 'amber',
      bgColor: 'bg-gradient-to-br from-amber-500/20 to-orange-500/20',
      borderColor: 'border-amber-500/30',
      iconColor: 'text-amber-400',
      titleColor: 'text-amber-300',
      countColor: 'text-amber-400/80',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      color: 'blue',
      bgColor: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20',
      borderColor: 'border-blue-500/30',
      iconColor: 'text-blue-400',
      titleColor: 'text-blue-300',
      countColor: 'text-blue-400/80',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      id: 'completed',
      title: 'Completed',
      color: 'emerald',
      bgColor: 'bg-gradient-to-br from-emerald-500/20 to-green-500/20',
      borderColor: 'border-emerald-500/30',
      iconColor: 'text-emerald-400',
      titleColor: 'text-emerald-300',
      countColor: 'text-emerald-400/80',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-6">
        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {columns.map(column => {
            const columnTasks = groupedTasks[column.id] || [];
            
            return (
              <DroppableColumn
                key={column.id}
                column={column}
                tasks={columnTasks}
                onTaskClick={handleTaskClick}
              />
            );
          })}
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeTask ? (
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-4 shadow-2xl transform rotate-3 scale-105">
              <h4 className="text-white font-medium mb-2">{activeTask.title}</h4>
              {activeTask.description && (
                <p className="text-slate-300 text-sm mb-3 line-clamp-2">
                  {activeTask.description}
                </p>
              )}
              <div className="flex items-center gap-2">
                <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs text-emerald-300">
                  {formatMinutes(activeTask.timeSpentMinutes)}
                </span>
              </div>
            </div>
          ) : null}
        </DragOverlay>

        {/* Edit Task Modal */}
        <EditTaskModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          task={selectedTask}
          onTaskUpdated={handleTaskUpdated}
        />
      </div>
    </DndContext>
  );
};

export default KanbanBoard;
