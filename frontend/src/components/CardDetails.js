import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAccount, getTransactions, updateAccountStatus } from '../services/api';
import { toast } from 'react-toastify';
import BottomNav from './BottomNav';

function CardDetails() {
  const { accountNumber } = useParams();
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [cardFrozen, setCardFrozen] = useState(false);
  const [onlinePurchases, setOnlinePurchases] = useState(true);
  const [internationalTxns, setInternationalTxns] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadAccountDetails();
  }, [accountNumber]);

  const loadAccountDetails = async () => {
    try {
      const accountResponse = await getAccount(accountNumber);
      setAccount(accountResponse.data);
      
      const transactionsResponse = await getTransactions(accountNumber);
      setTransactions(transactionsResponse.data.slice(0, 5));
    } catch (error) {
      toast.error('Failed to load account details');
    }
  };

  const handleFreezeCard = async () => {
    try {
      const newStatus = cardFrozen ? 'ACTIVE' : 'SUSPENDED';
      await updateAccountStatus(accountNumber, newStatus);
      setCardFrozen(!cardFrozen);
      toast.success(cardFrozen ? 'Card unfrozen' : 'Card frozen');
    } catch (error) {
      toast.error('Failed to update card status');
    }
  };

  const maskCardNumber = (number) => {
    if (!number) return '';
    if (showCardNumber) return number;
    return '•••• •••• •••• ' + number.slice(-4);
  };

  if (!account) {
    return (
      <div className="card-details">
        <p style={{ color: '#333333', textAlign: 'center' }}>Loading...</p>
        <BottomNav active="cards" />
      </div>
    );
  }

  return (
    <div className="card-details">
      {/* Header */}
      <div className="card-details-header">
        <span className="back-button" onClick={() => navigate('/dashboard')}>←</span>
        <h1 className="card-details-title">Cards</h1>
      </div>

      {/* Card Preview - Preserved black/gold theme */}
      <div className={`card-preview ${account.accountType === 'CREDIT' ? 'credit' : ''}`}>
        <div className="card-chip"></div>
        <div className="card-number">{maskCardNumber(account.accountNumber)}</div>
        <div className="card-footer">
          <div className="card-holder">{account.customer?.fullName || 'CARD HOLDER'}</div>
          <div className="card-expiry">12/28</div>
        </div>
      </div>

      {/* Card Status Badge */}
      <div style={{ 
        backgroundColor: account.status === 'ACTIVE' ? '#00FF00' : '#FFD700',
        color: '#000000',
        padding: '4px 12px',
        borderRadius: '20px',
        display: 'inline-block',
        fontSize: '12px',
        fontWeight: '600',
        marginBottom: '20px'
      }}>
        {account.status}
      </div>

      {/* Daily Limit */}
      <div className="limit-section">
        <div className="limit-header">
          <span className="limit-title">Your daily online limit is</span>
          <span className="limit-value">R1 500</span>
        </div>
        <div className="limit-progress">
          <div className="limit-progress-bar" style={{ width: '45%' }}></div>
        </div>
        <a href="#" className="limit-manage" style={{ color: '#000000' }}>Manage</a>
      </div>

      {/* Card Actions */}
      <div className="card-actions">
        <div className="card-action" onClick={() => setShowCardNumber(!showCardNumber)}>
          <div className="action-icon">👁️</div>
          <div className="action-text">Show Card Details</div>
        </div>
        <div className="card-action" onClick={handleFreezeCard}>
          <div className="action-icon">{cardFrozen ? '🔓' : '🔒'}</div>
          <div className="action-text">{cardFrozen ? 'Unfreeze Card' : 'Freeze Card'}</div>
        </div>
      </div>

      {/* Card Settings */}
      <div className="card-settings">
        <div className="setting-item" onClick={() => setOnlinePurchases(!onlinePurchases)}>
          <div className="setting-left">
            <span className="setting-icon">🛒</span>
            <div className="setting-info">
              <h4>Online purchases</h4>
              <p>Use your card to shop online</p>
            </div>
          </div>
          <div className={`toggle-switch ${onlinePurchases ? 'active' : ''}`}>
            <div className="toggle-slider"></div>
          </div>
        </div>

        <div className="setting-item" onClick={() => setInternationalTxns(!internationalTxns)}>
          <div className="setting-left">
            <span className="setting-icon">🌍</span>
            <div className="setting-info">
              <h4>International transactions</h4>
              <p>{internationalTxns ? 'New' : 'Off'}</p>
            </div>
          </div>
          <div className={`toggle-switch ${internationalTxns ? 'active' : ''}`}>
            <div className="toggle-slider"></div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div style={{ marginTop: '30px' }}>
        <h3 style={{ color: '#000000', fontSize: '18px', marginBottom: '15px' }}>
          Recent Transactions
        </h3>
        {transactions.map((txn) => (
          <div key={txn.id} style={{
            backgroundColor: '#F5F5F5',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            border: '1px solid #E0E0E0'
          }}>
            <div>
              <div style={{ color: '#000000', fontSize: '14px' }}>{txn.description}</div>
              <div style={{ color: '#666666', fontSize: '12px' }}>
                {new Date(txn.transactionDate).toLocaleDateString()}
              </div>
            </div>
            <div style={{
              color: txn.amount > 0 ? '#00FF00' : '#FF0000',
              fontSize: '16px',
              fontWeight: '600'
            }}>
              {txn.amount > 0 ? '+' : '-'}R{Math.abs(txn.amount).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {/* View Full Account Button */}
      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
        <button
          onClick={() => navigate(`/account/${accountNumber}`)}
          style={{
            backgroundColor: '#000000',
            color: '#FFD700',
            border: 'none',
            padding: '15px',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            width: '100%',
            fontSize: '16px'
          }}
        >
          🔍 View Full Account Details (Deposit/Withdraw/Transfer)
        </button>
      </div>

      <BottomNav active="cards" />
    </div>
  );
}

export default CardDetails;