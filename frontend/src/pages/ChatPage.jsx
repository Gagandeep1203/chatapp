import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext'; // Import theme context
import './ChatPage.css'; // Create this CSS file for styling

// Initialize socket connection (consider moving to context or a service if used elsewhere)
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5001';
let socket;

const ChatPage = () => {
  const { user, token } = useAuth(); // Get user and token from context
  const { isDarkMode } = useTheme(); // Get current theme
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const chatEndRef = useRef(null); // Ref to scroll to bottom
  const [isTyping, setIsTyping] = useState(false); // For typing indicator
  const typingTimeoutRef = useRef(null);

  // Effect for Socket connection and event listeners
  useEffect(() => {
    // Connect only if user and token are available
    if (user && token) {
      socket = io(SOCKET_URL);

      // Authenticate socket connection
      socket.emit('authenticate', token);

      // Listener for incoming messages
      socket.on('chat message', (msg) => {
        // Ensure msg has username and content
        if (msg && msg.username && msg.content) {
            setChatLog((prevChatLog) => [...prevChatLog, msg]);
        }
      });

      // Listener for user list updates
      socket.on('update user list', (users) => {
        setOnlineUsers(users);
      });

      // Optional: typing indicator
      socket.on('user typing', (username) => {
        if (username !== user.username) {
          setIsTyping(true);
          
          // Clear previous timeout
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
          }
          
          // Set new timeout to clear typing indicator
          typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
          }, 3000);
        }
      });

      // Clean up on component unmount or user change
      return () => {
        socket.off('chat message');
        socket.off('update user list');
        socket.off('user typing');
        socket.disconnect();
        setChatLog([]); // Clear chat on disconnect/reconnect
        setOnlineUsers([]);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      };
    }
  }, [user, token]); // Re-run effect if user or token changes

  // Effect to scroll chat to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog]);

  // Handle typing event
  const handleTyping = (e) => {
    setMessage(e.target.value);
    
    // Emit 'typing' event to other users
    if (socket) {
      socket.emit('user typing', user.username);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && socket) {
      socket.emit('chat message', message);
      setMessage(''); // Clear the input field
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-container">
      <aside className="sidebar">
        <h2>Online Users ({onlineUsers.length})</h2>
        <ul>
          {onlineUsers.map((username, index) => (
            <li key={index}>
              <span className="user-status"></span>
              {username} {username === user?.username ? '(You)' : ''}
            </li>
          ))}
        </ul>
      </aside>
      <main className="chat-main">
        <h1>Chat Room</h1>
        <div className="chat-log">
          {chatLog.map((msg, index) => (
            <div 
                key={index} 
                className={`chat-message ${msg.username === user?.username ? 'my-message' : 'other-message'}`}
            >
              <span className="username">{msg.username}</span> 
              <span className="content">{msg.content}</span>
              {msg.timestamp && (
                <span className="timestamp">{formatTime(msg.timestamp)}</span>
              )}
            </div>
          ))}
          {isTyping && <div className="typing-indicator">Someone is typing...</div>}
          <div ref={chatEndRef} /> {/* Element to scroll to */}
        </div>
        <form onSubmit={sendMessage} className="message-form">
          <input
            type="text"
            value={message}
            onChange={handleTyping}
            placeholder="Type your message..."
            className="message-input"
            autoComplete="off"
          />
          <button type="submit" className="send-button">Send</button>
        </form>
      </main>
    </div>
  );
};

export default ChatPage; 