import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { moveDeal, addDeal, updateDeal, deleteDeal } from '../store';
import { 
  Plus, 
  GripVertical, 
  Edit2, 
  Trash2, 
  IndianRupee, 
  Target, 
  Calendar,
  ChevronRight
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

const STAGES = ['New', 'Qualification', 'Proposal', 'Negotiation', 'Won', 'Lost'];
const SALESREPS = ['Priya Nair', 'Rahul Das', 'Ankit Joshi'];
const DEFAULT_FORM = { title: '', client: '', value: '', stage: 'New', salesperson: 'Priya Nair', expectedClose: '', probability: 30 };

const stageColors = {
  New: 'bg-slate-500',
  Qualification: 'bg-blue-600',
  Proposal: 'bg-indigo-600',
  Negotiation: 'bg-amber-500',
  Won: 'bg-emerald-500',
  Lost: 'bg-rose-500'
};

const stageTextColors = {
  New: 'text-slate-500',
  Qualification: 'text-blue-600',
  Proposal: 'text-indigo-600',
  Negotiation: 'text-amber-600',
  Won: 'text-emerald-600',
  Lost: 'text-rose-600'
};

export default function Deals() {
  const dispatch = useDispatch();
  const deals = useSelector(s => s.deals.items);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [editItem, setEditItem] = useState(null);
  const [dragId, setDragId] = useState(null);

  const byStage = (stage) => deals.filter(d => d.stage === stage);
  const totalValue = deals.filter(d => d.stage !== 'Lost').reduce((a, c) => a + Number(c.value), 0);
  const wonValue = deals.filter(d => d.stage === 'Won').reduce((a, c) => a + Number(c.value), 0);

  const save = () => {
    if (editItem) dispatch(updateDeal({ ...editItem, ...form, value: Number(form.value) }));
    else dispatch(addDeal({ ...form, value: Number(form.value), id: Date.now() }));
    setOpen(false); setEditItem(null); setForm(DEFAULT_FORM);
  };

  const openEdit = (d) => { setEditItem(d); setForm({ ...d, value: String(d.value) }); setOpen(true); };

  const onDragOver = (e) => { e.preventDefault(); };
  const onDrop = (e, stage) => {
    e.preventDefault();
    if (dragId !== null) { dispatch(moveDeal({ id: dragId, stage })); setDragId(null); }
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Deals Pipeline"
        subtitle={`Pipeline value: ₹${totalValue.toLocaleString('en-IN')} · Won: ₹${wonValue.toLocaleString('en-IN')}`}
        action={
          <Button icon={Plus} onClick={() => { setOpen(true); setEditItem(null); setForm(DEFAULT_FORM); }}>
            Add Deal
          </Button>
        }
      />

      {/* Kanban Board */}
      <div className="flex gap-6 overflow-x-auto pb-8 snap-x">
        {STAGES.map(stage => {
          const stageDeals = byStage(stage);
          const stageValue = stageDeals.reduce((a, c) => a + Number(c.value), 0);
          return (
            <div
              key={stage}
              onDragOver={onDragOver}
              onDrop={e => onDrop(e, stage)}
              className="min-w-[300px] flex-shrink-0 space-y-4"
            >
              {/* Stage Header */}
              <div className="flex justify-between items-center px-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-6 rounded-full ${stageColors[stage]}`} />
                  <h3 className="text-[13px] font-black text-slate-800 uppercase tracking-widest">{stage}</h3>
                  <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-1.5 py-0.5 rounded-md">
                    {stageDeals.length}
                  </span>
                </div>
                <p className="text-[11px] font-bold text-slate-400">
                  ₹{(stageValue / 1000).toFixed(0)}k
                </p>
              </div>

              {/* Deal Cards */}
              <div className="space-y-3 min-h-[400px]">
                {stageDeals.map(deal => (
                  <div
                    key={deal.id}
                    draggable
                    onDragStart={() => setDragId(deal.id)}
                    className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-grab active:cursor-grabbing group relative overflow-hidden"
                  >
                    <div className={`absolute top-0 left-0 bottom-0 w-1 ${stageColors[deal.stage]}`} />
                    
                    <div className="flex justify-between items-start mb-3 pl-1">
                      <h4 className="text-[13px] font-black text-slate-800 leading-tight flex-1 pr-2">
                        {deal.title}
                      </h4>
                      <GripVertical size={14} className="text-slate-300 group-hover:text-slate-400" />
                    </div>
                    
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4 pl-1">
                      {deal.client}
                    </p>

                    <div className="flex justify-between items-end mb-3 pl-1">
                      <div className="space-y-0.5">
                        <p className={`text-sm font-black ${stageTextColors[stage]}`}>
                          ₹{Number(deal.value).toLocaleString('en-IN')}
                        </p>
                        <p className="text-[10px] font-bold text-slate-300 uppercase italic">
                          Win Probability
                        </p>
                      </div>
                      <div className={`text-[10px] font-black px-1.5 py-0.5 rounded ${stageColors[stage]} bg-opacity-10 ${stageTextColors[stage]}`}>
                        {deal.probability}%
                      </div>
                    </div>

                    <div className="h-1.5 w-full bg-slate-50 rounded-full mb-4 overflow-hidden">
                      <div 
                        className={`h-full ${stageColors[stage]} transition-all duration-500`} 
                        style={{ width: `${deal.probability}%` }}
                      />
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                      <div className="flex items-center gap-1.5">
                        <UserAvatar name={deal.salesperson} size={20} />
                        <span className="text-[11px] font-bold text-slate-500">
                          {deal.salesperson.split(' ')[0]}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openEdit(deal)}
                          className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button 
                          onClick={() => dispatch(deleteDeal(deal.id))}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {stageDeals.length === 0 && (
                  <div className="h-32 border-2 border-dashed border-slate-100 rounded-3xl flex items-center justify-center">
                    <p className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">No deals</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Deal Form Modal */}
      <Modal 
        isOpen={open} 
        onClose={() => setOpen(false)} 
        title={editItem ? 'Update Deal' : 'Create New Deal'}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input 
              label="Deal Title" 
              value={form.title} 
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))} 
              placeholder="e.g. Enterprise Software License"
            />
          </div>
          <Input 
            label="Client Name" 
            value={form.client} 
            onChange={e => setForm(f => ({ ...f, client: e.target.value }))} 
            placeholder="Search or enter client"
          />
          <Input 
            label="Expected Close" 
            type="date" 
            value={form.expectedClose} 
            onChange={e => setForm(f => ({ ...f, expectedClose: e.target.value }))} 
          />
          <Input 
            label="Deal Value (₹)" 
            type="number" 
            value={form.value} 
            onChange={e => setForm(f => ({ ...f, value: e.target.value }))} 
            placeholder="0.00"
          />
          <Input 
            label="Win Probability (%)" 
            type="number" 
            value={form.probability} 
            onChange={e => setForm(f => ({ ...f, probability: Number(e.target.value) }))} 
            placeholder="30"
          />
          <Select 
            label="Stage" 
            value={form.stage} 
            onChange={e => setForm(f => ({ ...f, stage: e.target.value }))}
            options={STAGES.map(s => ({ label: s, value: s }))}
          />
          <Select 
            label="Lead Salesperson" 
            value={form.salesperson} 
            onChange={e => setForm(f => ({ ...f, salesperson: e.target.value }))}
            options={SALESREPS.map(s => ({ label: s, value: s }))}
          />
          
          <div className="md:col-span-2 flex justify-end gap-3 mt-6 pt-6 border-t border-slate-100">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>{editItem ? 'Save Changes' : 'Create Deal'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
