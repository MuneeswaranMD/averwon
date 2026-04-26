import React from 'react'
// Note: We use the global AdminJS components if available or just basic HTML for a stable bundle.
const StatusTag = (props) => {
  const { record, property } = props
  const value = record.params[property.path]

  if (!value) return null

  const colors = {
    Active: '#10B981',      // Emerald
    Approved: '#0EA5E9',    // Cyan
    Completed: '#22C55E',   // Green
    Paid: '#10B981',        // Emerald
    Pending: '#F59E0B',     // Amber
    'In Progress': '#2563EB', // Blue
    Urgent: '#E11D48',      // Rose
    Delayed: '#F43F5E',     // Rose/Pink
  }

  const color = colors[value] || '#64748B' // Muted Slate default

  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: '12px',
      backgroundColor: color + '22', // light background
      color: color,
      border: `1px solid ${color}`,
      fontSize: '11px',
      fontWeight: '600',
      textTransform: 'uppercase'
    }}>
      {value}
    </span>
  )
}

export default StatusTag
