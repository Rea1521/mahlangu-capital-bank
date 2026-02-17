import React from 'react';
import BottomNav from './BottomNav';

function Explore() {
  const offers = [
    {
      title: 'Dis-Chem',
      discount: '15% off',
      description: 'Get 15% off on all health and beauty products',
      expiry: 'Valid until 31 March 2026'
    },
    {
      title: 'Checkers',
      discount: '10% cashback',
      description: 'Earn 10% cashback on groceries',
      expiry: 'Valid until 15 March 2026'
    },
    {
      title: 'Shell',
      discount: 'R2 off per liter',
      description: 'Fuel discount at all Shell stations',
      expiry: 'Valid until 30 April 2026'
    }
  ];

  return (
    <div className="explore-page">
      <div className="transact-header">
        <h2>Explore</h2>
        <p>Exclusive offers and rewards</p>
      </div>

      <div className="reward-card">
        <span className="reward-badge">NEW</span>
        <div className="reward-amount">R0.63</div>
        <div className="reward-label">Cash back available</div>
        
        <div className="reward-offer">
          <div className="offer-title">Get 15% off at Dis-Chem</div>
          <div className="offer-description">On all health and beauty products</div>
          <button className="offer-button">Learn more</button>
        </div>
      </div>

      <h3 style={{ color: '#FFD700', fontSize: '18px', marginBottom: '15px', marginTop: '20px' }}>
        More Offers
      </h3>

      {offers.map((offer, index) => (
        <div key={index} className="dashboard-widget">
          <div className="widget-header">
            <span className="widget-title">{offer.title}</span>
            <span className="widget-edit">{offer.discount}</span>
          </div>
          <div className="widget-content">
            <p style={{ marginBottom: '10px', fontSize: '14px' }}>{offer.description}</p>
            <p style={{ color: '#FFD700', fontSize: '12px' }}>{offer.expiry}</p>
          </div>
        </div>
      ))}

      <BottomNav active="explore" />
    </div>
  );
}

export default Explore;