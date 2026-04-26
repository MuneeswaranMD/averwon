import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addTask, updateTask, deleteTask } from '../store';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Calendar, 
  CheckCircle2, 
  Circle, 
  Clock,
  MoreVertical
} from 'lucide-react';
import { 
  SectionHeader, 
  StatusChip, 
  UserAvatar, 
  Card, 
  Button, 
  Input, 
  Select, 
  Modal 
} from '../components/ui';

const STATUSES = ['Todo', 'In Progress', 'Done'];
const PRIORITIES = ['Low', 'Medium', 'High'];

const priorityColors = {
  Low: 'bg-emerald-500',
  Medium: 'bg-amber-500',
  High: 'bg-rose-500'
};

const statusColors = {
  Todo: 'bg-slate-400',
  'In Progress': 'bg-blue-600',
  Done: 'bg-emerald-500'
};

const DEFAULT_FORM = { title: '', priority: 'Medium', status: 'Todo', assignee: '', due: '', project: '' };

export default function Tasks() {
  const dispatch = useDispatch();
  const tasks    = useSelector(s => s.tasks.items);
  const users    = useSelector(s => s.users.items).filter(u => u.role !== 'admin');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [editItem, setEditItem] = useState(null);
  const [dragId, setDragId] = useState(null);

  const byStatus = (st) => tasks.filter(t => t.status === st);

  const save = () => {
    if (editItem) dispatch(updateTask({ ...editItem, ...form }));
    else dispatch(addTask({ ...form, id: Date.now() }));
    setOpen(false); setEditItem(null); setForm(DEFAULT_FORM);
  };

  const onDrop = (e, status) => {
    e.preventDefault();
    if (dragId) { 
      dispatch(updateTask({ ...tasks.find(t => t.id === dragId), status })); 
      setDragId(null); 
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Tasks"
        subtitle={`${tasks.length} total · ${byStatus('In Progress').length} in progress · ${byStatus('Done').length} completed`}
        action={
          <Button icon={Plus} onClick={() => { setOpen(true); setEditItem(null); setForm(DEFAULT_FORM); }}>
            Add Task
          </Button>
        }
      />

      <div className="flex gap-6 overflow-x-auto pb-8 snap-x">
        {STATUSES.map(status => {
          const cols = byStatus(status);
          return (
            <div 
              key={status} 
              className="min-w-[320px] flex-shrink-0 space-y-4"
              onDragOver={e => e.preventDefault()} 
              onDrop={e => onDrop(e, status)}
            >
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-6 rounded-full ${statusColors[status]}`} />
                  <h3 className="text-[13px] font-black text-slate-800 uppercase tracking-widest">{status}</h3>
                  <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-1.5 py-0.5 rounded-md">
                    {cols.length}
                  </span>
                </div>
              </div>

              <div className="space-y-3 min-h-[400px]">
                {cols.map(task => (
                  <div 
                    key={task.id} 
                    draggable 
                    onDragStart={() => setDragId(task.id)}
                    className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-grab group relative overflow-hidden"
                  >
                    <div className={`absolute top-0 left-0 bottom-0 w-1 ${priorityColors[task.priority]}`} />
                    
                    <div className="flex justify-between items-start mb-3 pl-1">
                      <h4 className="text-[13px] font-black text-slate-800 leading-tight flex-1 pr-2">
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => { setEditItem(task); setForm(task); setOpen(true); }}
                          className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button 
                          onClick={() => dispatch(deleteTask(task.id))}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4 pl-1">
                      {task.project}
                    </p>

                    <div className="flex justify-between items-center pl-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-tighter bg-opacity-10 ${priorityColors[task.priority]} ${priorityColors[task.priority].replace('bg-', 'text-')}`}>
                          {task.priority}
                        </span>
                        {task.due && (
                          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                            <Clock size={10} />
                            {task.due}
                          </div>
                        )}
                      </div>
                      <UserAvatar name={task.assignee} size={24} />
                    </div>
                  </div>
                ))}
                {cols.length === 0 && (
                  <div className="h-32 border-2 border-dashed border-slate-100 rounded-3xl flex items-center justify-center">
                    <p className="text-[11px] font-bold text-slate-300 uppercase tracking-widest text-center px-4">
                      No tasks in {status.toLowerCase()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Modal 
        isOpen={open} 
        onClose={() => setOpen(false)} 
        title={editItem ? 'Edit Task' : 'Create New Task'}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input 
              label="Task Title" 
              value={form.title} 
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))} 
              placeholder="e.g. Design system implementation"
            />
          </div>
          <div className="md:col-span-2">
            <Input 
              label="Project" 
              value={form.project} 
              onChange={e => setForm(f => ({ ...f, project: e.target.value }))} 
              placeholder="Associated project"
            />
          </div>
          <Select 
            label="Priority" 
            value={form.priority} 
            onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
            options={PRIORITIES.map(p => ({ label: p, value: p }))}
          />
          <Select 
            label="Status" 
            value={form.status} 
            onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
            options={STATUSES.map(s => ({ label: s, value: s }))}
          />
          <Select 
            label="Assignee" 
            value={form.assignee} 
            onChange={e => setForm(f => ({ ...f, assignee: e.target.value }))}
            options={users.map(u => ({ label: u.name, value: u.name }))}
          />
          <Input 
            label="Due Date" 
            type="date" 
            value={form.due} 
            onChange={e => setForm(f => ({ ...f, due: e.target.value }))} 
          />
          
          <div className="md:col-span-2 flex justify-end gap-3 mt-6 pt-6 border-t border-slate-100">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>{editItem ? 'Save Changes' : 'Create Task'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
