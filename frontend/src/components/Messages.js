import React from 'react';
import BottomNav from './BottomNav';

function Messages() {
  const messages = [
    {
      sender: 'Mahlangu Capital Bank',
      time: '10:30 AM',
      preview: 'Your monthly statement is ready to view',
      unread: true
    },
    {
      sender: 'Security Alert',
      time: 'Yesterday',
      preview: 'New device logged into your account',
      unread: true
    },
    {
      sender: 'Rewards',
      time: 'Yesterday',
      preview: 'You earned R0.63 cashback this week',
      unread: false
    },
    {
      sender: 'Transaction Alert',
      time: '2 days ago',
      preview: 'Purchase of R150.00 at Checkers',
      unread: false
    },
    {
      sender: 'Mahlangu Capital Bank',
      time: '3 days ago',
      preview: 'Special offer: 15% off at Dis-Chem',
      unread: false
    }
  ];

  return (
    <div className="messages-page">
      <div className="transact-header">
        <h2>Messages</h2>
        <p>Stay updated with your banking</p>
      </div>

      {messages.map((msg, index) => (
        <div key={index} className="message-item" style={{
          borderLeft: msg.unread ? '3px solid #FFD700' : 'none'
        }}>
          <div className="message-header">
            <span className="message-sender">{msg.sender}</span>
            <span className="message-time">{msg.time}</span>
          </div>
          <div className="message-preview">{msg.preview}</div>
          {msg.unread && (
            <div style={{
              width: '8px',
              height: '8px',
              backgroundColor: '#FFD700',
              borderRadius: '50%',
              marginTop: '8px'
            }}></div>
          )}
        </div>
      ))}

      <BottomNav active="messages" />
    </div>
  );
}

export default Messages;