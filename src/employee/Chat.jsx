import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Search, User, Users, MessageSquare, 
  MoreVertical, Phone, Video, Info, Loader2,
  Circle
} from 'lucide-react';
import { API_ENDPOINTS } from '../api-config';

const Z = {
  primary: '#2563EB',
  secondary: '#1E293B',
  border: '#E2E8F0',
  bg: '#F8FAFC',
  card: '#FFFFFF',
  muted: '#64748B',
  success: '#10B981'
};

const getToken = () => localStorage.getItem('employeeToken');
const getMyData = () => JSON.parse(localStorage.getItem('employeeData') || '{}');

const Chat = () => {
  const [rooms, setRooms] = useState([]);
  const [recentContacts, setRecentContacts] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null); // { id, name, isGroup, avatar }
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const scrollRef = useRef(null);
  const myData = getMyData();

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchHistory();
    }
  }, [selectedChat]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchInitialData = async () => {
    try {
      const token = getToken();
      const [roomsData, recentData] = await Promise.all([
        fetch(API_ENDPOINTS.CHAT_ROOMS, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
        fetch(API_ENDPOINTS.CHAT_RECENT(myData.name), { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json())
      ]);
      
      setRooms(roomsData);
      setRecentContacts(recentData);
    } catch (err) {
      console.error('Chat data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    if (!selectedChat) return;
    setHistoryLoading(true);
    try {
      const token = getToken();
      let url = selectedChat.isGroup 
        ? API_ENDPOINTS.CHAT_HISTORY(selectedChat.id)
        : API_ENDPOINTS.CHAT_PRIVATE(myData.name, selectedChat.name);
      
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error('History error:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    const msgData = {
      sender: myData.name,
      content: newMessage,
      isGroup: selectedChat.isGroup,
      time: new Date()
    };

    if (selectedChat.isGroup) {
      msgData.roomId = selectedChat.id;
    } else {
      msgData.receiver = selectedChat.name;
    }

    // Optimistic update
    setMessages(prev => [...prev, { ...msgData, _id: Date.now() }]);
    setNewMessage('');

    try {
      const token = getToken();
      await fetch(API_ENDPOINTS.CHAT_MESSAGE, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(msgData)
      });
    } catch (err) {
      console.error('Send error:', err);
    }
  };

  if (loading) return (
    <div style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 className="animate-spin" color={Z.primary} />
    </div>
  );

  return (
    <div style={{ 
      height: 'calc(100vh - 140px)', 
      display: 'flex', 
      background: Z.card, 
      borderRadius: 16, 
      border: `1px solid ${Z.border}`,
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
    }}>
      {/* Sidebar */}
      <div style={{ width: 320, borderRight: `1px solid ${Z.border}`, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 20, borderBottom: `1px solid ${Z.border}` }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: Z.secondary, margin: '0 0 16px 0' }}>Messages</h2>
          <div style={{ position: 'relative' }}>
            <Search size={16} color={Z.muted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search chats..." 
              style={{
                width: '100%', padding: '10px 12px 10px 36px', borderRadius: 10, border: `1px solid ${Z.border}`,
                background: Z.bg, fontSize: 14, outline: 'none'
              }}
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {/* Groups section */}
          {rooms.length > 0 && (
            <div style={{ padding: '16px 20px 8px' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: Z.muted, textTransform: 'uppercase', letterSpacing: 1 }}>Groups</span>
            </div>
          )}
          {rooms.map(room => (
            <div 
              key={room._id}
              onClick={() => setSelectedChat({ id: room._id, name: room.name, isGroup: true })}
              style={{
                padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
                background: selectedChat?.id === room._id ? `${Z.primary}08` : 'transparent',
                borderLeft: `4px solid ${selectedChat?.id === room._id ? Z.primary : 'transparent'}`,
                transition: 'all 0.2s'
              }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${Z.primary}15`, color: Z.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={20} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, color: Z.secondary, fontSize: 15 }}>{room.name}</div>
                <div style={{ fontSize: 12, color: Z.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {room.description || 'Global group chat'}
                </div>
              </div>
            </div>
          ))}

          {/* Direct Messages */}
          <div style={{ padding: '24px 20px 8px' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: Z.muted, textTransform: 'uppercase', letterSpacing: 1 }}>Direct Messages</span>
          </div>
          {recentContacts.map(contact => (
            <div 
              key={contact}
              onClick={() => setSelectedChat({ id: contact, name: contact, isGroup: false })}
              style={{
                padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
                background: selectedChat?.name === contact ? `${Z.primary}08` : 'transparent',
                borderLeft: `4px solid ${selectedChat?.name === contact ? Z.primary : 'transparent'}`,
                transition: 'all 0.2s'
              }}
            >
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: `${Z.success}15`, color: Z.success, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                {contact.charAt(0)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, color: Z.secondary, fontSize: 15 }}>{contact}</div>
                <div style={{ fontSize: 12, color: Z.muted }}>Active now</div>
              </div>
              <Circle size={8} fill={Z.success} color="transparent" />
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: Z.bg }}>
        {selectedChat ? (
          <>
            {/* Header */}
            <div style={{ padding: '16px 24px', background: Z.card, borderBottom: `1px solid ${Z.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ 
                  width: 40, height: 40, borderRadius: selectedChat.isGroup ? 10 : '50%', 
                  background: selectedChat.isGroup ? `${Z.primary}15` : `${Z.success}15`,
                  color: selectedChat.isGroup ? Z.primary : Z.success,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700
                }}>
                  {selectedChat.isGroup ? <Users size={18} /> : selectedChat.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: Z.secondary }}>{selectedChat.name}</div>
                  <div style={{ fontSize: 12, color: Z.success, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Circle size={6} fill={Z.success} color="transparent" /> Online
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, color: Z.muted }}>
                <Phone size={18} style={{ cursor: 'pointer' }} />
                <Video size={18} style={{ cursor: 'pointer' }} />
                <Info size={18} style={{ cursor: 'pointer' }} />
                <MoreVertical size={18} style={{ cursor: 'pointer' }} />
              </div>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              {historyLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
                  <Loader2 className="animate-spin" size={20} color={Z.muted} />
                </div>
              ) : (
                messages.map((msg, i) => {
                  const isMe = msg.sender === myData.name;
                  return (
                    <div key={msg._id || i} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                      {!isMe && selectedChat.isGroup && (
                        <div style={{ fontSize: 11, color: Z.muted, marginLeft: 12, marginBottom: 4 }}>{msg.sender}</div>
                      )}
                      <div style={{
                        padding: '10px 16px',
                        borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        background: isMe ? Z.primary : Z.card,
                        color: isMe ? '#fff' : Z.secondary,
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                        fontSize: 14,
                        lineHeight: 1.5,
                        position: 'relative'
                      }}>
                        {msg.content}
                        <div style={{ 
                          fontSize: 10, 
                          marginTop: 4, 
                          textAlign: 'right', 
                          opacity: 0.7,
                          color: isMe ? '#fff' : Z.muted 
                        }}>
                          {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Input */}
            <form 
              onSubmit={handleSendMessage}
              style={{ padding: '20px 24px', background: Z.card, borderTop: `1px solid ${Z.border}` }}
            >
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..." 
                  style={{
                    flex: 1, padding: '12px 18px', borderRadius: 12, border: `1px solid ${Z.border}`,
                    background: Z.bg, outline: 'none', fontSize: 14
                  }}
                />
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  style={{
                    width: 44, height: 44, borderRadius: 12, background: Z.primary, color: '#fff',
                    border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'transform 0.1s', opacity: newMessage.trim() ? 1 : 0.6
                  }}
                  onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
                  onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: Z.muted }}>
            <div style={{ width: 64, height: 64, borderRadius: 20, background: `${Z.primary}10`, color: Z.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <MessageSquare size={32} />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: Z.secondary, margin: '0 0 8px 0' }}>Your Messages</h3>
            <p style={{ fontSize: 14, maxWidth: 280, textAlign: 'center', margin: 0 }}>
              Select a contact or group from the sidebar to start a conversation.
            </p>
          </div>
        )}
      </div>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
};

export default Chat;
