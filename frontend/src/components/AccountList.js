import React from 'react';
import { useNavigate } from 'react-router-dom';

function AccountList({ accounts, customerName, onSelectAccount }) {
  const navigate = useNavigate();

  const handleCardClick = (account) => {
    if (onSelectAccount) {
      onSelectAccount(account);
    } else {
      navigate(`/card/${account.accountNumber}`);
    }
  };

  // Group accounts by type
  const savingsAccounts = accounts.filter(acc => acc.accountType === 'SAVINGS');
  const creditAccounts = accounts.filter(acc => acc.accountType === 'CREDIT' || acc.accountType === 'CURRENT');

  return (
    <div className="account-list">
      {/* Savings Accounts Section */}
      {savingsAccounts.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ 
            color: '#FFD700', 
            fontSize: '16px', 
            marginBottom: '15px',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Savings Accounts
          </h3>
          {savingsAccounts.map((account) => (
            <div
              key={account.id}
              className="account-card savings"
              onClick={() => handleCardClick(account)}
              style={{ cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <span className="account-number">{account.accountNumber}</span>
                <span style={{ 
                  backgroundColor: account.status === 'ACTIVE' ? '#00FF00' : '#FFD700',
                  color: '#000000',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '600'
                }}>
                  {account.status}
                </span>
              </div>
              
              <div className="account-type">Personal debit</div>
              <div className="account-name">{customerName || 'Account Holder'}</div>
              
              <div style={{ marginTop: '15px' }}>
                <div className="balance-label">SAVINGS ACCOUNT NUMBER</div>
                <div className="balance">R{account.balance?.toFixed(2) || '0.00'}</div>
              </div>

              {/* Quick Actions */}
              <div style={{ 
                display: 'flex', 
                gap: '10px', 
                marginTop: '15px',
                borderTop: '1px solid rgba(255,215,0,0.2)',
                paddingTop: '15px'
              }}>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/transact?account=${account.accountNumber}&type=deposit`);
                  }}
                  style={{
                    flex: 1,
                    backgroundColor: 'transparent',
                    border: '1px solid #FFD700',
                    color: '#FFD700',
                    padding: '8px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Deposit
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/transact?account=${account.accountNumber}&type=withdraw`);
                  }}
                  style={{
                    flex: 1,
                    backgroundColor: '#FFD700',
                    border: 'none',
                    color: '#000000',
                    padding: '8px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Withdraw
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Credit/Current Accounts Section */}
      {creditAccounts.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ 
            color: '#FFD700', 
            fontSize: '16px', 
            marginBottom: '15px',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Credit Cards
          </h3>
          {creditAccounts.map((account) => (
            <div
              key={account.id}
              className="account-card credit"
              onClick={() => handleCardClick(account)}
              style={{ cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <span style={{ color: '#000000', fontWeight: '600' }}>{account.accountNumber}</span>
                <span style={{ 
                  backgroundColor: '#000000',
                  color: '#FFD700',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '600'
                }}>
                  {account.status}
                </span>
              </div>
              
              <div style={{ color: '#000000', fontSize: '16px', fontWeight: '600' }}>
                Credit Card
              </div>
              <div style={{ color: '#000000', fontSize: '14px', opacity: '0.8', marginBottom: '15px' }}>
                {customerName || 'Account Holder'}
              </div>
              
              <div>
                <div style={{ color: '#000000', fontSize: '12px', opacity: '0.7' }}>
                  AVAILABLE CREDIT
                </div>
                <div style={{ color: '#000000', fontSize: '24px', fontWeight: '700' }}>
                  R{account.balance?.toFixed(2) || '0.00'}
                </div>
              </div>

              {/* Credit Card Specific Info */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginTop: '15px',
                fontSize: '12px',
                color: '#000000'
              }}>
                <span>Payment due: 25 Mar 2026</span>
                <span>Min payment: R500</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {accounts.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px 20px',
          backgroundColor: '#1A1A1A',
          borderRadius: '12px',
          border: '1px dashed #FFD700'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>💳</div>
          <h3 style={{ color: '#FFD700', marginBottom: '10px' }}>No Accounts Yet</h3>
          <p style={{ color: '#FFFFFF', opacity: 0.7, marginBottom: '20px' }}>
            Open your first account to start banking with us
          </p>
          <button
            onClick={() => navigate('/create-account')}
            style={{
              backgroundColor: '#FFD700',
              color: '#000000',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Open New Account
          </button>
        </div>
      )}
    </div>
  );
}

export default AccountList;