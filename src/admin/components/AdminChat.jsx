import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Text, Input, Icon, Illustration, Loader } from '@adminjs/design-system';
import { ApiClient } from 'adminjs';

const AdminChat = () => {
  const [rooms, setRooms] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const scrollRef = useRef(null);
  const api = new ApiClient();

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
      const [roomsRes, employeesRes] = await Promise.all([
        fetch('/api/chat/rooms').then(r => r.json()),
        fetch('/api/admin/tracking/employees').then(r => r.json())
      ]);
      setRooms(roomsRes);
      setEmployees(employeesRes.map(e => e.employee.name));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      let url = selectedChat.isGroup 
        ? `/api/chat/history/${selectedChat.id}`
        : `/api/chat/private/Admin/${selectedChat.name}`;
      
      const res = await fetch(url);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    const msgData = {
      sender: 'Admin',
      content: newMessage,
      isGroup: selectedChat.isGroup,
      time: new Date()
    };

    if (selectedChat.isGroup) msgData.roomId = selectedChat.id;
    else msgData.receiver = selectedChat.name;

    setMessages(prev => [...prev, { ...msgData, _id: Date.now() }]);
    setNewMessage('');

    try {
      await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msgData)
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <Box p="xl" textAlign="center"><Loader /></Box>;

  return (
    <Box flex flexDirection="row" height="calc(100vh - 120px)" bg="white" m="lg" borderRadius="lg" variant="card" overflow="hidden">
      {/* Sidebar */}
      <Box width="300px" borderRight="1px solid #eee" flexShrink={0} display="flex" flexDirection="column">
        <Box p="lg" borderBottom="1px solid #eee">
          <Text fontWeight="bold" fontSize="h4">Admin Chat</Text>
        </Box>
        <Box flex={1} overflowY="auto">
          <Box p="md">
            <Text variant="sm" color="grey60" mb="sm" fontWeight="bold">GROUPS</Text>
            {rooms.map(room => (
              <Box 
                key={room._id} p="md" borderRadius="md" cursor="pointer"
                bg={selectedChat?.id === room._id ? 'primary20' : 'transparent'}
                onClick={() => setSelectedChat({ id: room._id, name: room.name, isGroup: true })}
                _hover={{ bg: 'grey20' }}
                mb="xs"
              >
                <Text fontWeight="bold">{room.name}</Text>
              </Box>
            ))}
          </Box>
          <Box p="md">
            <Text variant="sm" color="grey60" mb="sm" fontWeight="bold">EMPLOYEES</Text>
            {employees.map(emp => (
              <Box 
                key={emp} p="md" borderRadius="md" cursor="pointer"
                bg={selectedChat?.name === emp && !selectedChat.isGroup ? 'primary20' : 'transparent'}
                onClick={() => setSelectedChat({ id: emp, name: emp, isGroup: false })}
                _hover={{ bg: 'grey20' }}
                mb="xs"
              >
                <Text>{emp}</Text>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Chat Area */}
      <Box flex={1} display="flex" flexDirection="column" bg="grey10">
        {selectedChat ? (
          <>
            <Box p="lg" bg="white" borderBottom="1px solid #eee">
              <Text fontWeight="bold">{selectedChat.name}</Text>
            </Box>
            <Box flex={1} p="lg" overflowY="auto" display="flex" flexDirection="column" ref={scrollRef}>
              {historyLoading ? <Loader /> : messages.map((msg, i) => {
                const isMe = msg.sender === 'Admin';
                return (
                  <Box 
                    key={msg._id || i}
                    alignSelf={isMe ? 'flex-end' : 'flex-start'}
                    bg={isMe ? 'primary100' : 'white'}
                    color={isMe ? 'white' : 'black'}
                    p="md" borderRadius="lg" mb="md" maxWidth="70%"
                    boxShadow="sm"
                  >
                    {!isMe && <Text variant="sm" fontWeight="bold" mb="xs" color="primary60">{msg.sender}</Text>}
                    <Text>{msg.content}</Text>
                    <Text variant="xs" textAlign="right" opacity={0.6} mt="xs">
                      {new Date(msg.time).toLocaleTimeString()}
                    </Text>
                  </Box>
                );
              })}
            </Box>
            <Box p="lg" bg="white" borderTop="1px solid #eee">
              <form onSubmit={handleSendMessage}>
                <Box display="flex" flexDirection="row">
                  <Input 
                    placeholder="Type message..." 
                    value={newMessage} 
                    onChange={e => setNewMessage(e.target.value)}
                    flex={1} mr="md"
                  />
                  <Button variant="contained" type="submit">Send</Button>
                </Box>
              </form>
            </Box>
          </>
        ) : (
          <Box flex={1} display="flex" alignItems="center" justifyContent="center" flexDirection="column">
            <Illustration name="Message" width="200px" />
            <Text mt="lg" color="grey60">Select a chat to start messaging</Text>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AdminChat;
