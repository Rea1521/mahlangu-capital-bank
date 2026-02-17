import React from 'react';
import { useNavigate } from 'react-router-dom';

function BottomNav({ active }) {
  const navigate = useNavigate();

  const navItems = [
    { id: 'home', icon: '🏠', label: 'Home', path: '/dashboard' },
    { id: 'cards', icon: '💳', label: 'Cards', path: '/dashboard' },
    { id: 'transact', icon: '💸', label: 'Transact', path: '/transact' },
    { id: 'messages', icon: '💬', label: 'Messages', path: '/messages' },
    { id: 'explore', icon: '🔍', label: 'Explore', path: '/explore' }
  ];

  return (
    <div className="bottom-nav">
      {navItems.map((item) => (
        <div
          key={item.id}
          className={`nav-item ${active === item.id ? 'active' : ''}`}
          onClick={() => navigate(item.path)}
        >
          <i>{item.icon}</i>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export default BottomNav;