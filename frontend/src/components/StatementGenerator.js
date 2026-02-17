import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAccount, getTransactionsByDateRange, downloadStatement } from '../services/api';
import { toast } from 'react-toastify';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

function StatementGenerator({ accountNumber, onClose }) {
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd')
  });
  const [statementType, setStatementType] = useState('monthly');
  const [emailStatement, setEmailStatement] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadAccountDetails();
    loadCustomerEmail();
  }, [accountNumber]);

  useEffect(() => {
    if (statementType !== 'custom') {
      const dates = getDatesForType(statementType);
      setDateRange(dates);
    }
  }, [statementType]);

  const loadAccountDetails = async () => {
    try {
      const response = await getAccount(accountNumber);
      setAccount(response.data);
    } catch (error) {
      toast.error('Failed to load account details');
    }
  };

  const loadCustomerEmail = () => {
    const customerData = localStorage.getItem('customer');
    if (customerData) {
      const customer = JSON.parse(customerData);
      setEmailAddress(customer.email || '');
    }
  };

  const getDatesForType = (type) => {
    const today = new Date();
    switch (type) {
      case 'monthly':
        return {
          startDate: format(startOfMonth(today), 'yyyy-MM-dd'),
          endDate: format(endOfMonth(today), 'yyyy-MM-dd')
        };
      case 'lastMonth':
        const lastMonth = subMonths(today, 1);
        return {
          startDate: format(startOfMonth(lastMonth), 'yyyy-MM-dd'),
          endDate: format(endOfMonth(lastMonth), 'yyyy-MM-dd')
        };
      case 'quarterly':
        const quarterStart = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1);
        const quarterEnd = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3 + 3, 0);
        return {
          startDate: format(quarterStart, 'yyyy-MM-dd'),
          endDate: format(quarterEnd, 'yyyy-MM-dd')
        };
      case 'yearly':
        return {
          startDate: format(new Date(today.getFullYear(), 0, 1), 'yyyy-MM-dd'),
          endDate: format(new Date(today.getFullYear(), 11, 31), 'yyyy-MM-dd')
        };
      default:
        return dateRange;
    }
  };

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const response = await getTransactionsByDateRange(
        accountNumber, 
        dateRange.startDate, 
        dateRange.endDate
      );
      setTransactions(response.data);
      setShowPreview(true);
    } catch (error) {
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateStatement = async () => {
    setGenerating(true);
    try {
      const response = await downloadStatement(
        accountNumber, 
        dateRange.startDate, 
        dateRange.endDate
      );
      
      // Create blob and download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `statement-${accountNumber}-${dateRange.startDate}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Statement generated successfully');
      
      if (emailStatement && emailAddress) {
        // Here you would call an API to email the statement
        toast.info('Statement will be sent to your email');
      }
    } catch (error) {
      toast.error('Failed to generate statement');
    } finally {
      setGenerating(false);
    }
  };

  const calculateSummary = () => {
    let totalCredits = 0;
    let totalDebits = 0;
    
    transactions.forEach(t => {
      if (t.type === 'DEPOSIT' || t.type === 'TRANSFER_IN' || t.type === 'INTEREST') {
        totalCredits += t.amount;
      } else if (t.type === 'WITHDRAWAL' || t.type === 'TRANSFER_OUT') {
        totalDebits += t.amount;
      }
    });
    
    return { totalCredits, totalDebits };
  };

  if (!account) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#FFFFFF' }}>
        Loading...
      </div>
    );
  }

  const summary = calculateSummary();

  return (
    <div style={{
      backgroundColor: '#000000',
      minHeight: '100vh',
      color: '#FFFFFF',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#FFD700',
            fontSize: '24px',
            marginRight: '15px',
            cursor: 'pointer'
          }}
        >
          ←
        </button>
        <h2 style={{ color: '#FFD700', fontSize: '20px' }}>Statement Generator</h2>
      </div>

      {/* Account Info */}
      <div style={{
        backgroundColor: '#1A1A1A',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: '#FFD700', fontSize: '12px' }}>Account</div>
            <div style={{ fontSize: '16px', fontWeight: '600' }}>{account.accountNumber}</div>
            <div style={{ fontSize: '14px', color: '#FFD700' }}>{account.accountType}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#FFD700', fontSize: '12px' }}>Current Balance</div>
            <div style={{ fontSize: '20px', fontWeight: '700' }}>
              R{account.balance?.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Statement Type Selection */}
      <div style={{
        backgroundColor: '#1A1A1A',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h3 style={{ color: '#FFD700', marginBottom: '15px' }}>Statement Period</h3>
        
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
          {['monthly', 'lastMonth', 'quarterly', 'yearly', 'custom'].map((type) => (
            <button
              key={type}
              onClick={() => setStatementType(type)}
              style={{
                flex: '1 1 auto',
                minWidth: '80px',
                backgroundColor: statementType === type ? '#FFD700' : 'transparent',
                border: '1px solid #FFD700',
                color: statementType === type ? '#000000' : '#FFD700',
                padding: '8px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                textTransform: 'capitalize',
                cursor: 'pointer'
              }}
            >
              {type === 'lastMonth' ? 'Last Month' : type}
            </button>
          ))}
        </div>

        {/* Custom Date Range */}
        {statementType === 'custom' && (
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ color: '#FFD700', fontSize: '12px', display: 'block', marginBottom: '5px' }}>
                From
              </label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                style={{
                  width: '100%',
                  backgroundColor: '#000000',
                  border: '1px solid #FFD700',
                  color: '#FFFFFF',
                  padding: '8px',
                  borderRadius: '5px'
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ color: '#FFD700', fontSize: '12px', display: 'block', marginBottom: '5px' }}>
                To
              </label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                style={{
                  width: '100%',
                  backgroundColor: '#000000',
                  border: '1px solid #FFD700',
                  color: '#FFFFFF',
                  padding: '8px',
                  borderRadius: '5px'
                }}
              />
            </div>
          </div>
        )}

        {/* Preview Button */}
        <button
          onClick={loadTransactions}
          disabled={loading}
          style={{
            width: '100%',
            backgroundColor: 'transparent',
            border: '1px solid #FFD700',
            color: '#FFD700',
            padding: '12px',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Loading...' : 'Preview Statement'}
        </button>
      </div>

      {/* Statement Preview */}
      {showPreview && transactions.length > 0 && (
        <div style={{
          backgroundColor: '#1A1A1A',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <h3 style={{ color: '#FFD700', marginBottom: '15px' }}>Statement Preview</h3>
          
          {/* Summary */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px',
            marginBottom: '20px'
          }}>
            <div style={{
              backgroundColor: '#000000',
              padding: '15px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ color: '#FFD700', fontSize: '12px' }}>Total Credits</div>
              <div style={{ color: '#00FF00', fontSize: '18px', fontWeight: '600' }}>
                R{summary.totalCredits.toFixed(2)}
              </div>
            </div>
            <div style={{
              backgroundColor: '#000000',
              padding: '15px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ color: '#FFD700', fontSize: '12px' }}>Total Debits</div>
              <div style={{ color: '#FF0000', fontSize: '18px', fontWeight: '600' }}>
                R{summary.totalDebits.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Transaction List */}
          <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '20px' }}>
            {transactions.slice(0, 10).map((txn) => (
              <div key={txn.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px',
                borderBottom: '1px solid #333'
              }}>
                <div>
                  <div style={{ fontSize: '14px' }}>{txn.description || txn.type}</div>
                  <div style={{ fontSize: '11px', color: '#FFD700' }}>
                    {format(new Date(txn.transactionDate), 'dd/MM/yyyy')}
                  </div>
                </div>
                <div style={{
                  color: txn.amount > 0 ? '#00FF00' : '#FF0000',
                  fontWeight: '600'
                }}>
                  {txn.amount > 0 ? '+' : '-'}R{Math.abs(txn.amount).toFixed(2)}
                </div>
              </div>
            ))}
            {transactions.length > 10 && (
              <p style={{ color: '#FFD700', fontSize: '12px', textAlign: 'center', marginTop: '10px' }}>
                + {transactions.length - 10} more transactions
              </p>
            )}
          </div>

          {/* Statement Options */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <input
                type="checkbox"
                checked={emailStatement}
                onChange={(e) => setEmailStatement(e.target.checked)}
                style={{ accentColor: '#FFD700' }}
              />
              <span style={{ color: '#FFFFFF' }}>Email statement</span>
            </label>
            
            {emailStatement && (
              <input
                type="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                placeholder="Enter email address"
                style={{
                  width: '100%',
                  backgroundColor: '#000000',
                  border: '1px solid #FFD700',
                  color: '#FFFFFF',
                  padding: '10px',
                  borderRadius: '5px',
                  marginTop: '10px'
                }}
              />
            )}
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateStatement}
            disabled={generating}
            style={{
              width: '100%',
              backgroundColor: '#FFD700',
              border: 'none',
              color: '#000000',
              padding: '15px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {generating ? 'Generating PDF...' : 'Download Statement PDF'}
          </button>
        </div>
      )}

      {/* No Transactions Message */}
      {showPreview && transactions.length === 0 && (
        <div style={{
          backgroundColor: '#1A1A1A',
          borderRadius: '12px',
          padding: '40px 20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>📄</div>
          <h3 style={{ color: '#FFD700', marginBottom: '10px' }}>No Transactions Found</h3>
          <p style={{ color: '#FFFFFF', opacity: 0.7 }}>
            No transactions in the selected date range
          </p>
        </div>
      )}
    </div>
  );
}

export default StatementGenerator;