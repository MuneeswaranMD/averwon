import React from 'react'
// Note: We use the global AdminJS components if available or just basic HTML for a stable bundle.
const StatusTag = (props) => {
  const { record, property } = props
  const value = record.params[property.path]

  if (!value) return null

  const colors = {
    Active: '#10b981', // green
    Approved: '#10b981',
    Completed: '#10b981',
    Paid: '#10b981',
    Pending: '#f59e0b', // orange
    'In Progress': '#3b82f6', // blue
    Urgent: '#ef4444', // red
    Delayed: '#f97316', // orange
  }

  const color = colors[value] || '#6b7280' // gray

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
