import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addLead, updateLead, deleteLead } from '../store';
import { Search, Plus, Edit2, Trash2, Filter, MoreVertical, X } from 'lucide-react';
import { 
  SectionHeader, 
  StatusChip, 
  UserAvatar, 
  Card, 
  Button, 
  Input, 
  Select, 
  Modal, 
  EmptyState 
} from '../components/ui';

const STATUSES = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Converted', 'Closed'];
const SOURCES = ['LinkedIn', 'Website', 'Referral', 'Cold Call', 'Email Campaign', 'Event'];
const INDUSTRIES = ['Technology', 'Finance', 'SaaS', 'Cloud', 'Analytics', 'Manufacturing', 'Healthcare', 'Retail'];
const SALES_REPS = ['Priya Nair', 'Rahul Das', 'Ankit Joshi'];

const DEFAULT_FORM = { 
  name: '', 
  company: '', 
  email: '', 
  phone: '', 
  source: 'Website', 
  industry: 'Technology', 
  status: 'New', 
  assignedTo: 'Priya Nair', 
  notes: '', 
  followUp: '' 
};

const statusCounts = (items) => STATUSES.reduce((acc, s) => { 
  acc[s] = items.filter(l => l.status === s).length; 
  return acc; 
}, {});

export default function Leads() {
  const dispatch = useDispatch();
  const leads = useSelector(s => s.leads.items);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [confirmDel, setConfirmDel] = useState(null);

  const counts = statusCounts(leads);

  const filtered = leads.filter(l => {
    const q = search.toLowerCase();
    const nameMatch = l.name?.toLowerCase().includes(q) || false;
    const companyMatch = l.company?.toLowerCase().includes(q) || false;
    const emailMatch = l.email?.toLowerCase().includes(q) || false;
    
    return (!q || nameMatch || companyMatch || emailMatch)
      && (statusFilter === 'All' || l.status === statusFilter);
  });

  const paged = filtered.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const handleSave = () => {
    if (editItem) {
      dispatch(updateLead({ ...editItem, ...form }));
    } else {
      dispatch(addLead({ ...form, id: Date.now().toString() }));
    }
    setIsModalOpen(false);
    setEditItem(null);
    setForm(DEFAULT_FORM);
  };

  const handleDelete = (id) => {
    dispatch(deleteLead(id));
    setConfirmDel(null);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ ...item });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Leads"
        subtitle={`${leads.length} total leads · ${counts['New'] || 0} new this month`}
        action={
          <Button icon={Plus} onClick={() => { setIsModalOpen(true); setEditItem(null); setForm(DEFAULT_FORM); }}>
            Add Lead
          </Button>
        }
      />

      {/* Status Filter Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {STATUSES.map(s => (
          <div 
            key={s}
            onClick={() => setStatusFilter(statusFilter === s ? 'All' : s)}
            className={`cursor-pointer p-4 rounded-2xl border-2 transition-all duration-200 text-center ${
              statusFilter === s ? 'border-blue-500 bg-blue-50/30' : 'border-slate-100 bg-white hover:border-slate-200 shadow-sm'
            }`}
          >
            <p className="text-2xl font-black text-slate-800">{counts[s] || 0}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{s}</p>
          </div>
        ))}
      </div>

      <Card className="!p-0">
        <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Input 
              placeholder="Search leads..." 
              icon={Search} 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              className="max-w-xs"
            />
            <div className="h-10 w-px bg-slate-100 hidden sm:block mx-1" />
            <Select 
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              options={['All Statuses', ...STATUSES].map(s => ({ label: s === 'All Statuses' ? 'All Statuses' : s, value: s === 'All Statuses' ? 'All' : s }))}
              className="max-w-[160px]"
            />
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            {filtered.length} leads found
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                {['Lead Name', 'Company', 'Source', 'Status', 'Assigned To', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.length > 0 ? paged.map(lead => (
                <tr key={lead.id} className="group hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <UserAvatar name={lead.name} size={36} />
                      <div>
                        <p className="text-[13px] font-bold text-slate-800">{lead.name}</p>
                        <p className="text-[11px] font-medium text-slate-400">{lead.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-[13px] font-semibold text-slate-600">{lead.company}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">{lead.industry}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-bold">
                      {lead.source}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusChip label={lead.status} size="medium" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <UserAvatar name={lead.assignedTo} size={24} />
                      <span className="text-[12px] font-medium text-slate-600">{lead.assignedTo}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => openEdit(lead)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => setConfirmDel(lead)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="py-20">
                    <EmptyState 
                      icon="👥" 
                      message={search ? "No leads matching your search" : "No leads in this category"} 
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Custom Pagination */}
        {filtered.length > rowsPerPage && (
          <div className="px-6 py-4 border-t border-slate-50 bg-slate-50/30 flex items-center justify-between">
            <div className="text-[11px] font-bold text-slate-400 uppercase">
              Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filtered.length)} of {filtered.length}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={page === 0}
                onClick={() => setPage(p => p - 1)}
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={(page + 1) * rowsPerPage >= filtered.length}
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editItem ? 'Edit Lead' : 'Add New Lead'}
        actions={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editItem ? 'Update Lead' : 'Add Lead'}</Button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Input 
            label="Full Name" 
            value={form.name} 
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
            placeholder="John Doe"
          />
          <Input 
            label="Company Name" 
            value={form.company} 
            onChange={e => setForm(f => ({ ...f, company: e.target.value }))} 
            placeholder="Inc. Corp"
          />
          <Input 
            label="Email Address" 
            type="email"
            value={form.email} 
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))} 
            placeholder="john@example.com"
          />
          <Input 
            label="Phone Number" 
            value={form.phone} 
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} 
            placeholder="+91 ..."
          />
          <Select 
            label="Lead Source"
            value={form.source}
            onChange={e => setForm(f => ({ ...f, source: e.target.value }))}
            options={SOURCES}
          />
          <Select 
            label="Industry"
            value={form.industry}
            onChange={e => setForm(f => ({ ...f, industry: e.target.value }))}
            options={INDUSTRIES}
          />
          <Select 
            label="Status"
            value={form.status}
            onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
            options={STATUSES}
          />
          <Select 
            label="Assigned Representative"
            value={form.assignedTo}
            onChange={e => setForm(f => ({ ...f, assignedTo: e.target.value }))}
            options={SALES_REPS}
          />
          <div className="sm:col-span-2">
            <Input 
              label="Follow-up Date" 
              type="date"
              value={form.followUp} 
              onChange={e => setForm(f => ({ ...f, followUp: e.target.value }))} 
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Notes</label>
            <textarea 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all rows-3"
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Add details about the lead..."
            />
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(confirmDel)}
        onClose={() => setConfirmDel(null)}
        title="Delete Lead?"
        actions={
          <>
            <Button variant="outline" onClick={() => setConfirmDel(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => handleDelete(confirmDel.id)}>Delete Lead</Button>
          </>
        }
      >
        <p className="text-[13px] font-medium text-slate-600">
          Are you sure you want to remove <span className="font-bold text-slate-800">{confirmDel?.name}</span>? 
          This action will permanently delete all records associated with this lead.
        </p>
      </Modal>
    </div>
  );
}
