import React, { useState } from 'react';
import { useNotice, ApiClient } from 'adminjs';

const C = {
  bg: '#F3F6F9',
  white: '#FFFFFF',
  border: '#E8EDF3',
  primary: '#1A73E8',
  primaryDark: '#1557B0',
  primaryLight: '#E8F0FE',
  textBase: '#2C3E50',
  textMuted: '#7F8C8D',
  textHeading: '#1B2631',
  red: '#D93025',
  inputBg: '#F8FAFC',
};

const GlobalEdit = (props) => {
  const { record: initialRecord, resource } = props;
  const [params, setParams] = useState(initialRecord.params);
  const [loading, setLoading] = useState(false);
  const sendNotice = useNotice();
  const api = new ApiClient();

  const properties = resource.editProperties;
  
  const handleChange = (name, value) => {
    setParams(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      // Build a clean JSON payload
      const payloadParams = {};
      Object.keys(params).forEach(key => {
        // Filter out internal fields that should not be updated directly
        if (['_id', 'createdAt', 'updatedAt', '__v', 'id'].includes(key)) return;
        
        // Skip password if empty
        if (key === 'password' && !params[key]) return;
        
        payloadParams[key] = params[key];
      });

      console.log('[GlobalEdit] Sending update via ApiClient...', payloadParams);

      // Using official ApiClient ensures CSRF tokens and correct headers are sent
      const response = await api.recordAction({
        resourceId: resource.id,
        actionName: 'edit',
        recordId: initialRecord.id,
        data: payloadParams,
      });

      const data = response.data;
      console.log('[GlobalEdit] Server response:', data);

      const fieldErrors = data?.record?.errors;
      const hasErrors = fieldErrors && Object.keys(fieldErrors).length > 0;

      if (!hasErrors && (data?.notice?.type === 'success' || data?.redirectUrl)) {
        sendNotice({ message: 'Record updated successfully!', type: 'success' });
        setTimeout(() => {
          const redirect = data?.redirectUrl || `/admin/resources/${resource.id}/records/${initialRecord.id}/show`;
          window.location.href = redirect;
        }, 800);
      } else {
        // Handle errors
        let errorMsg = 'Failed to save. ';
        if (hasErrors) {
          errorMsg += Object.entries(fieldErrors)
            .map(([field, err]) => `${field}: ${err?.message || err}`)
            .join(' | ');
        } else if (data?.notice?.message) {
          errorMsg += data.notice.message;
        } else if (data?.error?.message) {
            errorMsg += data.error.message;
        }
        sendNotice({ message: errorMsg, type: 'error' });
      }
    } catch (err) {
      console.error('[GlobalEdit] API Error:', err);
      // AdminJS ApiClient throws on non-200 responses sometimes
      const errorMsg = err.response?.data?.notice?.message || err.message;
      sendNotice({ message: `Save failed: ${errorMsg}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: C.bg, 
      fontFamily: "'Inter', sans-serif",
      padding: '40px'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        <div style={{ marginBottom: '24px' }}>
          <a href={`/admin/resources/${resource.id}/records/${initialRecord.id}/show`} style={{ 
            color: C.textMuted, 
            textDecoration: 'none', 
            fontSize: '14px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px' 
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
            Back to Detailed View
          </a>
        </div>

        <div style={{ 
          background: C.white, 
          borderRadius: '16px', 
          border: `1px solid ${C.border}`,
          boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
          overflow: 'hidden'
        }}>
          <div style={{ 
            padding: '32px', 
            borderBottom: `1px solid ${C.border}`,
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            background: `linear-gradient(to right, ${C.white}, ${C.inputBg})`
          }}>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 700, color: C.textHeading, margin: '0 0 4px 0' }}>
                Update {resource.name}
              </h1>
              <p style={{ fontSize: '14px', color: C.textMuted, margin: 0 }}>
                Modifying record system ID: <span style={{ fontFamily: 'monospace', color: C.primary }}>{initialRecord.id}</span>
              </p>
            </div>
            <div style={{
               width: '56px',
               height: '56px',
               borderRadius: '12px',
               background: C.primaryLight,
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               color: C.primary
            }}>
               <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ padding: '40px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              {properties.map(prop => {
                const name = prop.name;
                if (['_id', 'createdAt', 'updatedAt', '__v', 'id'].includes(name)) return null;
                
                const isTextArea = prop.type === 'textarea' || name.toLowerCase().includes('description') || name.toLowerCase().includes('notes');
                const isSelect = !!prop.availableValues;
                const isBoolean = prop.type === 'boolean' || typeof params[name] === 'boolean';

                return (
                  <div key={name} style={{ gridColumn: isTextArea ? 'span 2' : 'span 1' }}>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '13px', 
                      fontWeight: 700, 
                      color: C.textHeading, 
                      marginBottom: '8px' 
                    }}>
                      {prop.label}
                      {prop.isRequired && <span style={{ color: C.red, marginLeft: '4px' }}>*</span>}
                    </label>

                    {isBoolean ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', height: '44px' }}>
                            <input 
                                type="checkbox" 
                                checked={params[name] === true || params[name] === 'true'} 
                                onChange={(e) => handleChange(name, e.target.checked)}
                                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                            />
                            <span style={{ fontSize: '14px', color: C.textSecondary }}>Enable / Active</span>
                        </div>
                    ) : isTextArea ? (
                      <textarea
                        name={name}
                        value={params[name] || ''}
                        onChange={(e) => handleChange(name, e.target.value)}
                        rows={5}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          borderRadius: '10px',
                          border: `1px solid ${C.border}`,
                          background: C.inputBg,
                          fontSize: '14px',
                          outline: 'none',
                          resize: 'vertical'
                        }}
                      />
                    ) : isSelect ? (
                      <select
                        name={name}
                        value={params[name] || ''}
                        onChange={(e) => handleChange(name, e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          borderRadius: '10px',
                          border: `1px solid ${C.border}`,
                          background: C.inputBg,
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      >
                        <option value="">Select an option</option>
                        {prop.availableValues.map(v => (
                          <option key={v.value} value={v.value}>{v.label}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={name === 'password' || prop.type === 'password' ? 'password' : (prop.type === 'number' ? 'number' : prop.type === 'date' ? 'date' : 'text')}
                        name={name}
                        value={params[name] || ''}
                        onChange={(e) => handleChange(name, e.target.value)}
                        autoComplete={name === 'password' ? 'new-password' : 'off'}
                        placeholder={name === 'password' ? 'Leave blank to keep unchanged' : ''}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          borderRadius: '10px',
                          border: `1px solid ${C.border}`,
                          background: C.inputBg,
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{ 
              marginTop: '48px', 
              paddingTop: '32px', 
              borderTop: `1px solid ${C.border}`,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '16px'
            }}>
              <a href={`/admin/resources/${resource.id}/records/${initialRecord.id}/show`}>
                <button type="button" style={{ 
                  padding: '12px 24px', 
                  borderRadius: '10px', 
                  border: `1px solid ${C.border}`, 
                  background: C.white, 
                  color: C.textBase, 
                  fontWeight: 600, 
                  cursor: 'pointer' 
                }}>
                  Cancel
                </button>
              </a>
              <button 
                type="submit" 
                disabled={loading}
                style={{ 
                  padding: '12px 40px', 
                  borderRadius: '10px', 
                  border: 'none', 
                  background: C.primary, 
                  color: C.white, 
                  fontWeight: 700, 
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  boxShadow: '0 4px 12px rgba(26, 115, 232, 0.3)'
                }}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GlobalEdit;
