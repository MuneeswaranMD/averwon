import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  addProject, updateProject, deleteProject,
  addTool, removeTool, assignUser, removeUser,
  addTask, updateTask, deleteTask,
} from '../store';
import {
  Plus, FolderOpen, Users, Link2, CheckSquare, Trash2, Edit2,
  BarChart3, Calendar, IndianRupee, ExternalLink, X, ChevronRight,
  ArrowLeft, Wrench, UserPlus, ClipboardList
} from 'lucide-react';
import { SectionHeader, StatusChip, Button, Input, Select, Modal } from '../components/ui';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const STATUSES    = ['Planning', 'In Progress', 'Completed', 'On Hold'];
const PRIORITIES  = ['Low', 'Medium', 'High'];
const TASK_STATUS = ['Todo', 'In Progress', 'Done'];

const sc = { Planning: 'bg-blue-500', 'In Progress': 'bg-amber-500', Completed: 'bg-emerald-500', 'On Hold': 'bg-slate-400' };
const pc = { Low: 'text-emerald-600 bg-emerald-50', Medium: 'text-amber-600 bg-amber-50', High: 'text-rose-600 bg-rose-50' };
const ts = { Todo: 'bg-slate-200 text-slate-600', 'In Progress': 'bg-blue-100 text-blue-700', Done: 'bg-emerald-100 text-emerald-700' };

const EMPTY_PROJECT = { name: '', client: '', description: '', status: 'Planning', deadline: '', budget: '' };
const EMPTY_TOOL    = { name: '', link: '' };
const EMPTY_TASK    = { title: '', priority: 'Medium', status: 'Todo', assignedTo: '', due: '' };

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatBadge({ icon: Icon, label, value, color = 'text-slate-700' }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl">
      <Icon size={14} className="text-slate-400" />
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{label}</span>
      <span className={`text-xs font-black ${color}`}>{value}</span>
    </div>
  );
}

function ProgressBar({ pct, color }) {
  return (
    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
    </div>
  );
}

// ─── Project Card ─────────────────────────────────────────────────────────────
function ProjectCard({ project, users, onClick, onDelete }) {
  const members = users.filter(u => project.assignedUsers.includes(u.id));
  const bgColor = sc[project.status] || 'bg-slate-400';
  const budgetPct = project.budget ? Math.round(((project.spent || 0) / project.budget) * 100) : 0;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative overflow-hidden"
    >
      {/* Delete button */}
      <button
        onClick={e => { e.stopPropagation(); onDelete(project.id); }}
        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-1.5 rounded-xl text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all"
      >
        <Trash2 size={14} />
      </button>

      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className={`w-10 h-10 rounded-2xl ${bgColor} bg-opacity-15 flex items-center justify-center flex-shrink-0`}>
          <FolderOpen size={18} className={`${bgColor.replace('bg-', 'text-')}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-black text-slate-800 truncate group-hover:text-blue-600 transition-colors">
            {project.name}
          </h3>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">{project.client}</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-500 leading-relaxed mb-5 line-clamp-2">{project.description}</p>

      {/* Progress */}
      <div className="space-y-2 mb-5">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Completion</span>
          <span className="text-xs font-black text-slate-700">{project.progress}%</span>
        </div>
        <ProgressBar pct={project.progress} color={bgColor} />
      </div>

      {/* Stats row */}
      <div className="flex flex-wrap gap-2 mb-5">
        <StatusChip label={project.status} size="small" />
        <div className="flex items-center gap-1 px-2.5 py-1 bg-slate-50 rounded-lg">
          <Calendar size={11} className="text-slate-400" />
          <span className="text-[10px] font-bold text-slate-500">{project.deadline || '—'}</span>
        </div>
        <div className="flex items-center gap-1 px-2.5 py-1 bg-slate-50 rounded-lg">
          <Link2 size={11} className="text-slate-400" />
          <span className="text-[10px] font-bold text-slate-500">{project.tools?.length || 0} tools</span>
        </div>
      </div>

      {/* Members */}
      <div className="flex items-center gap-2 pt-4 border-t border-slate-50">
        <Users size={13} className="text-slate-300" />
        <div className="flex -space-x-2">
          {members.slice(0, 4).map((u, i) => (
            <div
              key={u.id}
              title={u.name}
              className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 border-2 border-white flex items-center justify-center text-white text-[9px] font-black"
            >
              {u.name.split(' ').map(n => n[0]).join('')}
            </div>
          ))}
          {members.length === 0 && <span className="text-[10px] text-slate-300 font-bold italic">No members</span>}
          {members.length > 4 && <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-slate-500 text-[9px] font-black">+{members.length - 4}</div>}
        </div>
        <ChevronRight size={14} className="ml-auto text-slate-200 group-hover:text-blue-400 transition-colors" />
      </div>
    </div>
  );
}

// ─── Project Detail Panel ─────────────────────────────────────────────────────
function ProjectDetail({ project, users, tasks, onBack, dispatch }) {
  const [tab, setTab] = useState('tasks'); // tasks | tools | members
  const [newTool, setNewTool]     = useState(EMPTY_TOOL);
  const [newTask, setNewTask]     = useState(EMPTY_TASK);
  const [addingTool, setAddingTool] = useState(false);
  const [addingTask, setAddingTask] = useState(false);
  const [editTask, setEditTask]   = useState(null);

  const members    = users.filter(u => project.assignedUsers.includes(u.id));
  const nonMembers = users.filter(u => !project.assignedUsers.includes(u.id) && u.role !== 'admin');
  const projTasks  = tasks.filter(t => t.projectId === project.id);

  const saveTool = () => {
    if (!newTool.name || !newTool.link) return;
    dispatch(addTool({ projectId: project.id, tool: newTool }));
    setNewTool(EMPTY_TOOL); setAddingTool(false);
  };

  const saveTask = () => {
    if (!newTask.title) return;
    const member = users.find(u => u.id === newTask.assignedTo);
    const payload = {
      ...newTask,
      projectId: project.id,
      project: project.name,
      assignee: member?.name || '',
    };
    if (editTask) dispatch(updateTask({ ...editTask, ...payload }));
    else dispatch(addTask({ ...payload, id: Date.now() }));
    setNewTask(EMPTY_TASK); setAddingTask(false); setEditTask(null);
  };

  const TABS = [
    { id: 'tasks',   label: 'Tasks',   count: projTasks.length,      icon: ListTodo },
    { id: 'tools',   label: 'Tools',   count: project.tools?.length, icon: Link2 },
    { id: 'members', label: 'Members', count: members.length,        icon: Users },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Back + Title */}
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-sm transition-colors">
          <ArrowLeft size={16} /> Back to Projects
        </button>
      </div>

      {/* Project Header Card */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl ${sc[project.status] || 'bg-slate-400'} bg-opacity-15 flex items-center justify-center`}>
              <FolderOpen size={24} className={`${(sc[project.status] || 'bg-slate-400').replace('bg-', 'text-')}`} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">{project.name}</h2>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{project.client}</p>
            </div>
          </div>
          <StatusChip label={project.status} size="medium" />
        </div>
        <p className="mt-4 text-sm text-slate-500 leading-relaxed">{project.description}</p>
        <div className="mt-5 space-y-2">
          <div className="flex justify-between">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wide">Progress</span>
            <span className="text-xs font-black text-blue-600">{project.progress}%</span>
          </div>
          <ProgressBar pct={project.progress} color={sc[project.status] || 'bg-slate-400'} />
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <StatBadge icon={Calendar} label="Deadline" value={project.deadline || '—'} />
          {project.budget && <StatBadge icon={IndianRupee} label="Budget" value={`₹${Number(project.budget).toLocaleString('en-IN')}`} color="text-emerald-600" />}
          <StatBadge icon={CheckSquare} label="Tasks" value={projTasks.length} />
          <StatBadge icon={Users} label="Members" value={members.length} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-slate-100/60 rounded-2xl w-fit gap-1">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-200 ${tab === t.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <t.icon size={13} />
            {t.label}
            {t.count > 0 && <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${tab === t.id ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-500'}`}>{t.count}</span>}
          </button>
        ))}
      </div>

      {/* ── Tasks Tab ── */}
      {tab === 'tasks' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-50">
            <h3 className="font-black text-slate-800">Project Tasks</h3>
            <Button icon={Plus} onClick={() => { setAddingTask(true); setEditTask(null); setNewTask(EMPTY_TASK); }}>Add Task</Button>
          </div>

          {projTasks.length === 0 
            ? <div className="py-16 text-center text-slate-300 text-sm font-bold">No tasks yet — add your first task</div>
            : (
              <div className="divide-y divide-slate-50">
                {projTasks.map(task => {
                  const member = users.find(u => u.id === task.assignedTo);
                  return (
                    <div key={task.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/60 group transition-colors">
                      <div className={`w-2 h-8 rounded-full flex-shrink-0 ${pc[task.priority]?.includes('rose') ? 'bg-rose-400' : pc[task.priority]?.includes('amber') ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate">{task.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${pc[task.priority]}`}>{task.priority}</span>
                          {task.due && <span className="text-[10px] text-slate-400 font-bold">Due {task.due}</span>}
                        </div>
                      </div>
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg ${ts[task.status]}`}>{task.status}</span>
                      {member && (
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[9px] font-black flex-shrink-0" title={member.name}>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      )}
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setEditTask(task); setNewTask({ title: task.title, priority: task.priority, status: task.status, assignedTo: task.assignedTo, due: task.due }); setAddingTask(true); }} className="p-1.5 rounded-lg text-slate-300 hover:text-blue-500 hover:bg-blue-50 transition-colors">
                          <Edit2 size={13} />
                        </button>
                        <button onClick={() => dispatch(deleteTask(task.id))} className="p-1.5 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          }
        </div>
      )}

      {/* ── Tools Tab ── */}
      {tab === 'tools' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-50">
            <h3 className="font-black text-slate-800">Tool Links & Resources</h3>
            <Button icon={Plus} onClick={() => setAddingTool(true)}>Add Tool</Button>
          </div>

          {(!project.tools || project.tools.length === 0)
            ? <div className="py-16 text-center text-slate-300 text-sm font-bold">No tools added yet</div>
            : (
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.tools.map(tool => (
                  <div key={tool.id} className="flex items-center gap-4 p-4 border border-slate-100 rounded-2xl hover:border-blue-200 hover:bg-blue-50/30 group transition-all">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center flex-shrink-0">
                      <Link2 size={18} className="text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-slate-800 truncate">{tool.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{tool.link}</p>
                    </div>
                    <a href={tool.link} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors flex-shrink-0" title="Open">
                      <ExternalLink size={14} />
                    </a>
                    <button onClick={() => dispatch(removeTool({ projectId: project.id, toolId: tool.id }))} className="p-2 rounded-xl text-slate-300 hover:text-rose-500 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )
          }
        </div>
      )}

      {/* ── Members Tab ── */}
      {tab === 'members' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-50">
            <h3 className="font-black text-slate-800">Assigned Team</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {members.map(u => (
              <div key={u.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/50 group">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-xs flex-shrink-0">
                  {u.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-black text-slate-800">{u.name}</p>
                  <p className="text-[11px] text-slate-400 font-bold capitalize">{u.role} · {u.email}</p>
                </div>
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg ${u.role === 'intern' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{u.role}</span>
                <button
                  onClick={() => dispatch(removeUser({ projectId: project.id, userId: u.id }))}
                  className="p-1.5 rounded-xl text-slate-300 hover:text-rose-500 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
          {nonMembers.length > 0 && (
            <div className="p-5 border-t border-slate-50">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Add Members</p>
              <div className="flex flex-wrap gap-2">
                {nonMembers.map(u => (
                  <button
                    key={u.id}
                    onClick={() => dispatch(assignUser({ projectId: project.id, userId: u.id }))}
                    className="flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 rounded-xl text-xs font-bold text-slate-600 hover:text-blue-600 transition-all"
                  >
                    <UserPlus size={12} /> {u.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Task Modal */}
      <Modal isOpen={addingTask} onClose={() => { setAddingTask(false); setEditTask(null); }} title={editTask ? 'Edit Task' : 'Add Task'}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input label="Task Title" value={newTask.title} onChange={e => setNewTask(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Design Dashboard UI" />
          </div>
          <Select label="Priority" value={newTask.priority} onChange={e => setNewTask(f => ({ ...f, priority: e.target.value }))} options={PRIORITIES.map(p => ({ label: p, value: p }))} />
          <Select label="Status"   value={newTask.status}   onChange={e => setNewTask(f => ({ ...f, status: e.target.value }))}   options={TASK_STATUS.map(s => ({ label: s, value: s }))} />
          <Select label="Assigned To" value={newTask.assignedTo} onChange={e => setNewTask(f => ({ ...f, assignedTo: e.target.value }))}
            options={[{ label: 'Unassigned', value: '' }, ...members.map(u => ({ label: u.name, value: u.id }))]}
          />
          <Input label="Due Date" type="date" value={newTask.due} onChange={e => setNewTask(f => ({ ...f, due: e.target.value }))} />
          <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={() => { setAddingTask(false); setEditTask(null); }}>Cancel</Button>
            <Button onClick={saveTask}>{editTask ? 'Save Changes' : 'Add Task'}</Button>
          </div>
        </div>
      </Modal>

      {/* Tool Modal */}
      <Modal isOpen={addingTool} onClose={() => setAddingTool(false)} title="Add Tool / Resource Link">
        <div className="space-y-4">
          <Input label="Tool Name" value={newTool.name} onChange={e => setNewTool(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Figma, GitHub, Notion" />
          <Input label="URL" value={newTool.link} onChange={e => setNewTool(f => ({ ...f, link: e.target.value }))} placeholder="https://..." />
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={() => setAddingTool(false)}>Cancel</Button>
            <Button onClick={saveTool}>Add Tool</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ─── Main Projects Page ────────────────────────────────────────────────────────
export default function Projects() {
  const dispatch  = useDispatch();
  const projects  = useSelector(s => s.projects.items);
  const users     = useSelector(s => s.users.items);
  const tasks     = useSelector(s => s.tasks.items);
  const currentUser = useSelector(s => s.auth.currentUser);

  const isAdmin   = currentUser?.role === 'admin';

  // Employee/Intern: only show their projects
  const visibleProjects = isAdmin
    ? projects
    : projects.filter(p => p.assignedUsers.includes(currentUser?.id));

  const [tab,        setTab]        = useState('All');
  const [selected,   setSelected]   = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form,       setForm]       = useState(EMPTY_PROJECT);

  const tabs = ['All', 'In Progress', 'Completed', 'Planning', 'On Hold'];
  const filtered = tab === 'All' ? visibleProjects : visibleProjects.filter(p => p.status === tab);

  const selectedProject = projects.find(p => p.id === selected);

  const createProject = () => {
    if (!form.name) return;
    dispatch(addProject({ ...form }));
    setForm(EMPTY_PROJECT); setShowCreate(false);
  };

  // ── Detail view ──
  if (selected && selectedProject) {
    return (
      <ProjectDetail
        project={selectedProject}
        users={users}
        tasks={tasks}
        onBack={() => setSelected(null)}
        dispatch={dispatch}
      />
    );
  }

  // ── List view ──
  return (
    <div className="space-y-6">
      <SectionHeader
        title={isAdmin ? 'Projects' : 'My Projects'}
        subtitle={`${visibleProjects.length} total · ${visibleProjects.filter(p => p.status === 'In Progress').length} active`}
        action={isAdmin && <Button icon={Plus} onClick={() => setShowCreate(true)}>New Project</Button>}
      />

      {/* Tabs */}
      <div className="flex p-1 bg-slate-100/50 rounded-2xl w-fit gap-1 flex-wrap">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-200 ${tab === t ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-300">
          <FolderOpen size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-sm font-bold">No projects in this category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map(p => (
            <ProjectCard
              key={p.id}
              project={p}
              users={users}
              onClick={() => setSelected(p.id)}
              onDelete={id => dispatch(deleteProject(id))}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create New Project">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input label="Project Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. CRM System" />
          </div>
          <div className="md:col-span-2">
            <Input label="Client / Company" value={form.client} onChange={e => setForm(f => ({ ...f, client: e.target.value }))} placeholder="e.g. TechWave Solutions" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Brief description of the project..."
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 resize-none font-medium"
            />
          </div>
          <Select label="Status" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} options={STATUSES.map(s => ({ label: s, value: s }))} />
          <Input label="Deadline" type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} />
          <div className="md:col-span-2">
            <Input label="Budget (₹)" type="number" value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} placeholder="e.g. 500000" />
          </div>
          <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={createProject}>Create Project</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
