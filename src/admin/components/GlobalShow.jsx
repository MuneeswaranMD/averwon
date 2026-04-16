import React from 'react';

const GlobalShow = (props) => {
  const { record, resource } = props;
  return (
    <div style={{ padding: '24px', background: '#FFFFFF', borderRadius: '16px' }}>
      <h1>{resource.name} Details</h1>
      <pre>{JSON.stringify(record.params, null, 2)}</pre>
    </div>
  );
};

export default GlobalShow;
