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
    const customerData = localStorage.getItem('customer');
    if (!customerData) {
      navigate('/');
      return;
    }
    
    const customer = JSON.parse(customerData);
    setCustomer(customer);
    loadAccounts(customer.id);
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
    <div className="dashboard-page" style={{ 
      minHeight: '100vh', 
      backgroundColor: '#000000',
      padding: '20px 20px 80px'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <div>
          <h2 style={{ color: '#FFD700', fontSize: '20px' }}>GlobalOne</h2>
          <p style={{ color: '#FFFFFF', opacity: 0.7 }}>My dashboard</p>
        </div>
        <button 
          onClick={handleLogout}
          style={{
            backgroundColor: 'transparent',
            color: '#FFD700',
            border: '1px solid #FFD700',
            padding: '5px 10px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>

      {/* Main Account Widget */}
      <div className="dashboard-widget">
        <div className="widget-header">
          <span className="widget-title">Main Account</span>
          <span className="widget-edit">Edit &gt;</span>
        </div>
        <div className="widget-content">
          <div style={{ fontSize: '12px', color: '#FFD700', marginBottom: '5px' }}>
            Available balance
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#FFFFFF' }}>
            R{totalBalance.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Savings Plans Widget */}
      <div className="dashboard-widget">
        <div className="widget-header">
          <span className="widget-title">Savings Plans</span>
          <span className="widget-edit">Edit &gt;</span>
        </div>
        <div className="widget-content">
          <div style={{ fontSize: '12px', color: '#FFD700', marginBottom: '5px' }}>
            Total saved
          </div>
          <div style={{ fontSize: '24px', fontWeight: '600', color: '#FFFFFF' }}>
            R0.00
          </div>
        </div>
      </div>

      {/* Insure Widget */}
      <div className="dashboard-widget" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <div className="widget-title">Insure</div>
          <div style={{ color: '#FFFFFF', fontSize: '14px' }}>Cover for you and your family</div>
        </div>
        <button style={{
          backgroundColor: 'transparent',
          color: '#FFD700',
          border: 'none',
          fontSize: '18px',
          cursor: 'pointer'
        }}>×</button>
      </div>

      {/* Capitec Connect Widget */}
      <div className="dashboard-widget" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <div className="widget-title">Capitec Connect</div>
          <div style={{ color: '#FFFFFF', fontSize: '14px' }}>Connecting you for less</div>
        </div>
        <button style={{
          backgroundColor: 'transparent',
          color: '#FFD700',
          border: 'none',
          fontSize: '18px',
          cursor: 'pointer'
        }}>×</button>
      </div>

      {/* Rewards Section */}
      <div className="dashboard-widget">
        <div className="widget-header">
          <span className="widget-title">Rewards</span>
          <span className="widget-edit">Edit &gt;</span>
        </div>
        <div className="widget-content">
          <div style={{ fontSize: '12px', color: '#FFD700', marginBottom: '5px' }}>
            Cash back, deals and more
          </div>
          <div style={{ fontSize: '24px', fontWeight: '600', color: '#FFFFFF', marginBottom: '15px' }}>
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
      <div style={{ marginTop: '20px' }}>
        <h3 style={{ color: '#FFD700', fontSize: '18px', marginBottom: '15px' }}>Your Cards</h3>
        {accounts.map((account) => (
          <div
            key={account.id}
            className={`account-card ${account.accountType === 'SAVINGS' ? 'savings' : 'credit'}`}
            onClick={() => navigate(`/account/${account.accountNumber}`)}
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
          <div style={{ textAlign: 'center', padding: '30px' }}>
            <p style={{ color: '#FFFFFF', opacity: 0.7 }}>No accounts found</p>
            <button
              onClick={() => navigate('/create-account')}
              style={{
                backgroundColor: '#FFD700',
                color: '#000000',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: '600',
                marginTop: '10px',
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