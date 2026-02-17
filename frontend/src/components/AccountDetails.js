import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Tabs, Tab } from 'react-bootstrap';
import { getAccount, getTransactions } from '../services/api';
import TransactionForm from './TransactionForm';
import TransactionHistory from './TransactionHistory';
import FundTransfer from './FundTransfer';
import { toast } from 'react-toastify';
import AccountSettings from './AccountSettings';
import StatementGenerator from './StatementGenerator';

function AccountDetails() {
  const { accountNumber } = useParams();
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
const [showStatement, setShowStatement] = useState(false);

  useEffect(() => {
    loadAccountDetails();
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

  const handleTransactionComplete = () => {
    loadAccountDetails();
    setActiveTab('transactions');
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <p>Loading account details...</p>
      </Container>
    );
  }

  if (!account) {
    return (
      <Container className="mt-5 text-center">
        <p>Account not found</p>
        <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <Button variant="link" onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </Button>
          <h2>Account Details</h2>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Account Information</Card.Title>
              <Card.Text>
                <strong>Account Number:</strong> {account.accountNumber}<br />
                <strong>Account Type:</strong> {account.accountType}<br />
                <strong>Status:</strong> 
                <span className={
                  account.status === 'ACTIVE' ? 'text-success' : 
                  account.status === 'SUSPENDED' ? 'text-warning' : 'text-danger'
                }> {account.status}</span><br />
                <strong>Current Balance:</strong> 
                <h3 className="mt-2">${account.balance?.toFixed(2)}</h3>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Quick Actions</Card.Title>
              <div className="d-grid gap-2">
                <Col md={6}>
  <Card style={{
    backgroundColor: '#1A1A1A',
    border: '1px solid #FFD700'
  }}>
    <Card.Body>
      <Card.Title style={{ color: '#FFD700' }}>Quick Actions</Card.Title>
      <div className="d-grid gap-2">
        <Button 
          variant="success" 
          onClick={() => setActiveTab('deposit')}
          style={{
            backgroundColor: '#00FF00',
            border: 'none',
            color: '#000000',
            fontWeight: '600'
          }}
        >
          Deposit
        </Button>
        <Button 
          variant="warning" 
          onClick={() => setActiveTab('withdraw')}
          style={{
            backgroundColor: '#FFD700',
            border: 'none',
            color: '#000000',
            fontWeight: '600'
          }}
        >
          Withdraw
        </Button>
        <Button 
          variant="info" 
          onClick={() => setActiveTab('transfer')}
          style={{
            backgroundColor: '#FFA500',
            border: 'none',
            color: '#000000',
            fontWeight: '600'
          }}
        >
          Transfer
        </Button>
        <Button 
          variant="secondary" 
          onClick={() => setShowSettings(true)}
          style={{
            backgroundColor: '#333333',
            border: '1px solid #FFD700',
            color: '#FFD700',
            fontWeight: '600'
          }}
        >
          Account Settings
        </Button>
        <Button 
          variant="secondary" 
          onClick={() => setShowStatement(true)}
          style={{
            backgroundColor: '#333333',
            border: '1px solid #FFD700',
            color: '#FFD700',
            fontWeight: '600'
          }}
        >
          Generate Statement
        </Button>
      </div>
    </Card.Body>
  </Card>
</Col>
                <Button 
                  variant="success" 
                  onClick={() => setActiveTab('deposit')}
                >
                  Deposit
                </Button>
                <Button 
                  variant="warning" 
                  onClick={() => setActiveTab('withdraw')}
                >
                  Withdraw
                </Button>
                <Button 
                  variant="info" 
                  onClick={() => setActiveTab('transfer')}
                >
                  Transfer
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-3"
          >
            <Tab eventKey="overview" title="Overview">
              <Row>
                <Col>
                  <h4>Recent Transactions</h4>
                  <TransactionHistory 
                    transactions={transactions.slice(0, 5)} 
                    accountNumber={account.accountNumber}
                  />
                </Col>
              </Row>
            </Tab>
            <Tab eventKey="deposit" title="Deposit">
              <TransactionForm 
                type="DEPOSIT"
                accountNumber={account.accountNumber}
                onSuccess={handleTransactionComplete}
              />
            </Tab>
            <Tab eventKey="withdraw" title="Withdraw">
              <TransactionForm 
                type="WITHDRAWAL"
                accountNumber={account.accountNumber}
                onSuccess={handleTransactionComplete}
              />
            </Tab>
            <Tab eventKey="transfer" title="Transfer">
              <FundTransfer 
                fromAccount={account.accountNumber}
                onSuccess={handleTransactionComplete}
              />
            </Tab>
            <Tab eventKey="transactions" title="All Transactions">
              <TransactionHistory 
                transactions={transactions} 
                accountNumber={account.accountNumber}
              />
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </Container>
  );

  {/* Account Settings Modal */}
{showSettings && (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000',
    zIndex: 1000,
    overflowY: 'auto'
  }}>
    <AccountSettings 
      accountNumber={account.accountNumber}
      onClose={() => setShowSettings(false)}
    />
  </div>
)}

{/* Statement Generator Modal */}
{showStatement && (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000',
    zIndex: 1000,
    overflowY: 'auto'
  }}>
    <StatementGenerator 
      accountNumber={account.accountNumber}
      onClose={() => setShowStatement(false)}
    />
  </div>
)}
}

export default AccountDetails;