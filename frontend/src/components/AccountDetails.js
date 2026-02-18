import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAccount, getTransactions, getCustomerAccounts } from '../services/api';
import TransactionForm from './TransactionForm';
import TransactionHistory from './TransactionHistory';
import FundTransfer from './FundTransfer';
import { toast } from 'react-toastify';
import AccountSettings from './AccountSettings';
import StatementGenerator from './StatementGenerator';
import BottomNav from './BottomNav';

function AccountDetails() {
  const { accountNumber } = useParams();
  const [account, setAccount] = useState(null);
  const [allAccounts, setAllAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showSettings, setShowSettings] = useState(false);
  const [showStatement, setShowStatement] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(accountNumber);
  const [showAccountSelector, setShowAccountSelector] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadAccountDetails();
    loadAllAccounts();
  }, [accountNumber]);

  const loadAccountDetails = async () => {
    try {
      const accountResponse = await getAccount(accountNumber);
      setAccount(accountResponse.data);
      
      const transactionsResponse = await getTransactions(accountNumber);
      setTransactions(transactionsResponse.data);
    } catch (error) {
      toast.error('Failed to load account details');
    } finally {
      setLoading(false);
    }
  };

  const loadAllAccounts = async () => {
    try {
      const customerData = localStorage.getItem('customer');
      if (customerData) {
        const customer = JSON.parse(customerData);
        const response = await getCustomerAccounts(customer.id);
        setAllAccounts(response.data);
      }
    } catch (error) {
      console.error('Failed to load accounts:', error);
    }
  };

  const handleTransactionComplete = () => {
    loadAccountDetails();
    setActiveTab('transactions');
  };

  const handleAccountChange = (newAccountNumber) => {
    setSelectedAccount(newAccountNumber);
    setShowAccountSelector(false);
    navigate(`/account/${newAccountNumber}`);
  };

  if (loading) {
    return (
      <div className="card-details">
        <p style={{ color: '#333333', textAlign: 'center' }}>Loading...</p>
        <BottomNav active="cards" />
      </div>
    );
  }

  if (!account) {
    return (
      <div className="card-details">
        <p style={{ color: '#333333', textAlign: 'center' }}>Account not found</p>
        <button 
          onClick={() => navigate('/dashboard')}
          style={{
            backgroundColor: '#000000',
            color: '#FFD700',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            margin: '20px auto',
            display: 'block',
            cursor: 'pointer'
          }}
        >
          Back to Dashboard
        </button>
        <BottomNav active="cards" />
      </div>
    );
  }

  return (
    <div className="card-details">
      {/* Header with navigation and account selector */}
      <div className="card-details-header">
        <span className="back-button" onClick={() => navigate('/dashboard')}>←</span>
        <h1 className="card-details-title">Account Details</h1>
        <div style={{ position: 'relative', marginLeft: 'auto' }}>
          <button
            onClick={() => setShowAccountSelector(!showAccountSelector)}
            style={{
              backgroundColor: '#000000',
              color: '#FFD700',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            Switch Card 💳
          </button>
          {showAccountSelector && (
            <div style={{
              position: 'absolute',
              top: '40px',
              right: '0',
              backgroundColor: '#FFFFFF',
              border: '1px solid #FFD700',
              borderRadius: '8px',
              padding: '10px',
              zIndex: 1000,
              minWidth: '200px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}>
              {allAccounts.map(acc => (
                <div
                  key={acc.id}
                  onClick={() => handleAccountChange(acc.accountNumber)}
                  style={{
                    padding: '10px',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    backgroundColor: acc.accountNumber === selectedAccount ? '#FFD700' : 'transparent',
                    color: acc.accountNumber === selectedAccount ? '#000000' : '#333333',
                    marginBottom: '5px'
                  }}
                >
                  <div style={{ fontSize: '12px', fontWeight: '600' }}>{acc.accountNumber}</div>
                  <div style={{ fontSize: '10px' }}>{acc.accountType} - R{acc.balance?.toFixed(2)}</div>
                </div>
              ))}
              <div
                onClick={() => {
                  setShowAccountSelector(false);
                  navigate('/create-account');
                }}
                style={{
                  padding: '10px',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  backgroundColor: '#000000',
                  color: '#FFD700',
                  textAlign: 'center',
                  marginTop: '5px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}
              >
                + Create New Card
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card Preview - Preserved black/gold theme */}
      <div className={`card-preview ${account.accountType === 'CREDIT' ? 'credit' : ''}`}>
        <div className="card-chip"></div>
        <div className="card-number">{account.accountNumber}</div>
        <div className="card-footer">
          <div className="card-holder">{account.customer?.fullName || 'CARD HOLDER'}</div>
          <div className="card-expiry">12/28</div>
        </div>
      </div>

      {/* Status and Balance */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ 
          backgroundColor: account.status === 'ACTIVE' ? '#00FF00' : '#FFD700',
          color: '#000000',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600'
        }}>
          {account.status}
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: '#666666', fontSize: '12px' }}>Current Balance</div>
          <div style={{ color: '#000000', fontSize: '24px', fontWeight: '700' }}>
            R{account.balance?.toFixed(2)} {/* Changed from $ to R */}
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '10px', 
        marginBottom: '20px'
      }}>
        <button
          onClick={() => setActiveTab('deposit')}
          style={{
            backgroundColor: '#00FF00',
            color: '#000000',
            border: 'none',
            padding: '15px 5px',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          💰 Deposit
        </button>
        <button
          onClick={() => setActiveTab('withdraw')}
          style={{
            backgroundColor: '#FFD700',
            color: '#000000',
            border: 'none',
            padding: '15px 5px',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          💸 Withdraw
        </button>
        <button
          onClick={() => setActiveTab('transfer')}
          style={{
            backgroundColor: '#FFA500',
            color: '#000000',
            border: 'none',
            padding: '15px 5px',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          ↔️ Transfer
        </button>
      </div>

      {/* Secondary Action Buttons */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: '10px', 
        marginBottom: '20px'
      }}>
        <button
          onClick={() => setShowSettings(true)}
          style={{
            backgroundColor: '#FFFFFF',
            color: '#000000',
            border: '1px solid #000000',
            padding: '12px 5px',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          ⚙️ Account Settings
        </button>
        <button
          onClick={() => setShowStatement(true)}
          style={{
            backgroundColor: '#FFFFFF',
            color: '#000000',
            border: '1px solid #000000',
            padding: '12px 5px',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          📄 Generate Statement
        </button>
      </div>

      {/* Create New Card Button - Always visible */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => navigate('/create-account')}
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
          ➕ Create New Card
        </button>
      </div>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #E0E0E0',
        marginBottom: '20px',
        overflowX: 'auto'
      }}>
        {['overview', 'deposit', 'withdraw', 'transfer', 'transactions'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: '0 0 auto',
              background: 'none',
              border: 'none',
              padding: '10px 15px',
              color: activeTab === tab ? '#000000' : '#666666',
              borderBottom: activeTab === tab ? '2px solid #000000' : 'none',
              cursor: 'pointer',
              textTransform: 'capitalize',
              fontWeight: activeTab === tab ? '600' : '400'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ marginBottom: '80px' }}>
        {activeTab === 'overview' && (
          <div>
            <h3 style={{ color: '#000000', fontSize: '16px', marginBottom: '15px' }}>
              Recent Transactions
            </h3>
            {transactions.slice(0, 5).map((txn) => (
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
                  {txn.amount > 0 ? '+' : '-'}R{Math.abs(txn.amount).toFixed(2)} {/* Changed from $ to R */}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'deposit' && (
          <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E0E0E0' }}>
            <h3 style={{ color: '#000000', marginBottom: '15px' }}>Make a Deposit</h3>
            <TransactionForm 
              type="DEPOSIT"
              accountNumber={account.accountNumber}
              onSuccess={handleTransactionComplete}
              allAccounts={allAccounts}
            />
          </div>
        )}

        {activeTab === 'withdraw' && (
          <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E0E0E0' }}>
            <h3 style={{ color: '#000000', marginBottom: '15px' }}>Make a Withdrawal</h3>
            <TransactionForm 
              type="WITHDRAWAL"
              accountNumber={account.accountNumber}
              onSuccess={handleTransactionComplete}
              allAccounts={allAccounts}
            />
          </div>
        )}

        {activeTab === 'transfer' && (
          <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E0E0E0' }}>
            <h3 style={{ color: '#000000', marginBottom: '15px' }}>Transfer Funds</h3>
            <FundTransfer 
              fromAccount={account.accountNumber}
              onSuccess={handleTransactionComplete}
              allAccounts={allAccounts}
            />
          </div>
        )}

        {activeTab === 'transactions' && (
          <div>
            <h3 style={{ color: '#000000', marginBottom: '15px' }}>All Transactions</h3>
            <TransactionHistory 
              transactions={transactions} 
              accountNumber={account.accountNumber}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      {showSettings && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#FFFFFF',
          zIndex: 1000,
          overflowY: 'auto'
        }}>
          <AccountSettings 
            accountNumber={account.accountNumber}
            onClose={() => setShowSettings(false)}
          />
        </div>
      )}

      {showStatement && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#FFFFFF',
          zIndex: 1000,
          overflowY: 'auto'
        }}>
          <StatementGenerator 
            accountNumber={account.accountNumber}
            onClose={() => setShowStatement(false)}
          />
        </div>
      )}

      <BottomNav active="cards" />
    </div>
  );
}

export default AccountDetails;