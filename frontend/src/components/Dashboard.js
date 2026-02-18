import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCustomerAccounts } from '../services/api';
import { toast } from 'react-toastify';
import BottomNav from './BottomNav';

function Dashboard() {
  const [accounts, setAccounts] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [rewards, setRewards] = useState(0.63);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const customerData = localStorage.getItem('customer');
      if (!customerData) {
        navigate('/');
        return;
      }
      
      const customer = JSON.parse(customerData);
      setCustomer(customer);
      loadAccounts(customer.id);
    } catch (error) {
      console.error('Error parsing customer data:', error);
      localStorage.removeItem('customer');
      navigate('/');
    }
  }, [navigate]);

  const loadAccounts = async (customerId) => {
    try {
      const response = await getCustomerAccounts(customerId);
      setAccounts(response.data);
    } catch (error) {
      toast.error('Failed to load accounts');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('customer');
    navigate('/');
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <div>
          <h2 style={{ color: '#000000', fontSize: '24px', fontWeight: '700' }}>GlobalOne</h2>
          <p style={{ color: '#666666', fontSize: '14px' }}>My dashboard</p>
        </div>
        <button 
          onClick={handleLogout}
          className="logout-button"
        >
          Logout
        </button>
      </div>

      {/* Main Account Widget */}
      <div className="dashboard-widget">
        <div className="widget-header">
          <span className="widget-title">Main Account</span>
          <span className="widget-edit">Edit ›</span>
        </div>
        <div className="widget-content">
          <div style={{ fontSize: '14px', color: '#666666', marginBottom: '5px' }}>
            Available balance
          </div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#000000' }}>
            R{totalBalance.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Savings Plans Widget */}
      <div className="dashboard-widget">
        <div className="widget-header">
          <span className="widget-title">Savings Plans</span>
          <span className="widget-edit">Edit ›</span>
        </div>
        <div className="widget-content">
          <div style={{ fontSize: '14px', color: '#666666', marginBottom: '5px' }}>
            Total saved
          </div>
          <div style={{ fontSize: '24px', fontWeight: '600', color: '#000000' }}>
            R0.00
          </div>
        </div>
      </div>

      {/* Insure Widget */}
      <div className="dashboard-widget" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <div className="widget-title">Insure</div>
          <div style={{ color: '#666666', fontSize: '14px' }}>Cover for you and your family</div>
        </div>
        <button style={{
          backgroundColor: 'transparent',
          color: '#000000',
          border: '1px solid #000000',
          borderRadius: '50%',
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}>×</button>
      </div>

      {/* Capitec Connect Widget */}
      <div className="dashboard-widget" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <div className="widget-title">Capitec Connect</div>
          <div style={{ color: '#666666', fontSize: '14px' }}>Connecting you for less</div>
        </div>
        <button style={{
          backgroundColor: 'transparent',
          color: '#000000',
          border: '1px solid #000000',
          borderRadius: '50%',
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}>×</button>
      </div>

      {/* Rewards Section */}
      <div className="dashboard-widget">
        <div className="widget-header">
          <span className="widget-title">Rewards</span>
          <span className="widget-edit">Edit ›</span>
        </div>
        <div className="widget-content">
          <div style={{ fontSize: '14px', color: '#666666', marginBottom: '5px' }}>
            Cash back, deals and more
          </div>
          <div className="reward-amount">
            R{rewards.toFixed(2)}
          </div>
          
          <div className="reward-offer">
            <div className="offer-title">New</div>
            <div className="offer-description">Get 15% off at Dis-Chem</div>
            <button className="offer-button">Learn more</button>
          </div>
        </div>
      </div>

      {/* Accounts Section */}
      <div style={{ marginTop: '30px' }}>
        <h3 className="your-cards-title">Your Cards</h3>
        {accounts.map((account) => (
          <div
            key={account.id}
            className={`account-card ${account.accountType === 'SAVINGS' ? 'savings' : 'credit'}`}
            onClick={() => navigate(`/card/${account.accountNumber}`)}
          >
            <div className="account-number">{account.accountNumber}</div>
            <div className="account-type">
              {account.accountType === 'SAVINGS' ? 'Personal debit' : 'Credit Card'}
            </div>
            <div className="account-name">{customer?.fullName}</div>
            <div className="balance-label">SAVINGS ACCOUNT NUMBER</div>
            <div className="balance">R{account.balance?.toFixed(2)}</div>
          </div>
        ))}
        
        {accounts.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px 20px',
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '2px dashed #FFD700'
          }}>
            <p style={{ color: '#666666', fontSize: '16px' }}>No accounts found</p>
            <button
              onClick={() => navigate('/create-account')}
              style={{
                backgroundColor: '#000000',
                color: '#FFD700',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: '600',
                marginTop: '15px',
                cursor: 'pointer'
              }}
            >
              Open New Account
            </button>
          </div>
        )}
      </div>

      <BottomNav active="home" />
    </div>
  );
}

export default Dashboard;