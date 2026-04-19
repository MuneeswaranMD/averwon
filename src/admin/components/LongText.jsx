import React, { useState } from 'react'

const LongText = (props) => {
  const { record, property } = props
  const value = record.params[property.path]
  const [isExpanded, setIsExpanded] = useState(false)

  if (!value) return null

  const maxLength = 100
  const isLong = value.length > maxLength

  if (!isLong) return <span>{value}</span>

  const displayText = isExpanded ? value : `${value.substring(0, maxLength)}...`

  return (
    <div>
      <span style={{ fontSize: '13px', lineHeight: '1.5' }}>
        {displayText}
      </span>
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setIsExpanded(!isExpanded)
        }}
        style={{
          display: 'block',
          background: 'none',
          border: 'none',
          color: '#1A73E8',
          padding: '4px 0',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: '600'
        }}
      >
        {isExpanded ? 'Show less' : 'Show more'}
      </button>
    </div>
  )
}

export default LongText
