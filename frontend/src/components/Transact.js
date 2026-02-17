import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';

function Transact() {
  const navigate = useNavigate();

  const transactionItems = [
    { icon: '👤', name: 'Pay beneficiary', badge: 'New' },
    { icon: '⚡', name: 'PayShap', badge: 'New' },
    { icon: '📋', name: 'Pay bills', badge: 'New' },
    { icon: '🌍', name: 'Cross-border money transfers', badge: 'New' },
    { icon: '💱', name: 'International payments', badge: 'New' },
    { icon: '📱', name: 'Buy airtime and data', badge: 'New' },
    { icon: '💡', name: 'Buy electricity and water', badge: 'New' },
    { icon: '🎲', name: 'Play LOTTO', badge: 'New' },
    { icon: '🎫', name: 'Buy vouchers', badge: 'New' },
    { icon: '🚗', name: 'Renew licence disc', badge: 'New' },
    { icon: '💸', name: 'Transfer money', badge: 'New' }
  ];

  return (
    <div className="transact-page">
      <div className="transact-header">
        <h2>Transact</h2>
        <p>Quick and secure transactions</p>
      </div>

      <div className="transact-grid">
        {transactionItems.map((item, index) => (
          <div key={index} className="transact-item">
            <div className="transact-icon">{item.icon}</div>
            <div className="transact-name">{item.name}</div>
            {item.badge && <span className="transact-badge">{item.badge}</span>}
          </div>
        ))}
      </div>

      <BottomNav active="transact" />
    </div>
  );
}

export default Transact;