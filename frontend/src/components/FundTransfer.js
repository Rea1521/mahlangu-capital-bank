import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { transferFunds } from '../services/api';
import { toast } from 'react-toastify';

function FundTransfer({ fromAccount, onSuccess, allAccounts = [] }) {
  const [selectedFromAccount, setSelectedFromAccount] = useState(fromAccount);
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await transferFunds(selectedFromAccount, toAccount, amount, pin, description);
      toast.success(`Transfer of R${amount} successful!`);
      setToAccount('');
      setAmount('');
      setPin('');
      setDescription('');
      onSuccess();
    } catch (err) {
      setError(err.response?.data || 'Failed to process transfer');
      toast.error('Failed to process transfer');
    } finally {
      setLoading(false);
    }
  };

  // Filter out the selected from account from the to account options
  const availableToAccounts = allAccounts.filter(acc => acc.accountNumber !== selectedFromAccount);

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form.Group className="mb-3">
        <Form.Label>From Account (Select Card)</Form.Label>
        <Form.Select
          value={selectedFromAccount}
          onChange={(e) => setSelectedFromAccount(e.target.value)}
          required
          style={{
            backgroundColor: '#F5F5F5',
            border: '1px solid #FFD700',
            padding: '10px',
            borderRadius: '8px'
          }}
        >
          {allAccounts.length > 0 ? (
            allAccounts.map(acc => (
              <option key={acc.id} value={acc.accountNumber}>
                {acc.accountNumber} - {acc.accountType} (R{acc.balance?.toFixed(2)})
              </option>
            ))
          ) : (
            <option value={selectedFromAccount}>{selectedFromAccount}</option>
          )}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>To Account Number</Form.Label>
        {availableToAccounts.length > 0 ? (
          <Form.Select
            value={toAccount}
            onChange={(e) => setToAccount(e.target.value)}
            required
            style={{
              backgroundColor: '#F5F5F5',
              border: '1px solid #FFD700',
              padding: '10px',
              borderRadius: '8px'
            }}
          >
            <option value="">Select destination account</option>
            {availableToAccounts.map(acc => (
              <option key={acc.id} value={acc.accountNumber}>
                {acc.accountNumber} - {acc.accountType} (R{acc.balance?.toFixed(2)})
              </option>
            ))}
          </Form.Select>
        ) : (
          <Form.Control
            type="text"
            value={toAccount}
            onChange={(e) => setToAccount(e.target.value)}
            required
            placeholder="Enter destination account number"
            style={{
              backgroundColor: '#F5F5F5',
              border: '1px solid #FFD700',
              padding: '10px',
              borderRadius: '8px'
            }}
          />
        )}
        {availableToAccounts.length === 0 && allAccounts.length > 1 && (
          <Form.Text style={{ color: '#FF0000' }}>
            No other accounts available for transfer. Create another card first.
          </Form.Text>
        )}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Amount (R)</Form.Label>
        <Form.Control
          type="number"
          step="0.01"
          min="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          placeholder="Enter amount in Rands"
          style={{
            backgroundColor: '#F5F5F5',
            border: '1px solid #FFD700',
            padding: '10px',
            borderRadius: '8px'
          }}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>PIN</Form.Label>
        <Form.Control
          type="password"
          maxLength="4"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          required
          placeholder="Enter your 4-digit PIN"
          style={{
            backgroundColor: '#F5F5F5',
            border: '1px solid #FFD700',
            padding: '10px',
            borderRadius: '8px'
          }}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Description (Optional)</Form.Label>
        <Form.Control
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g., Rent payment, Gift"
          style={{
            backgroundColor: '#F5F5F5',
            border: '1px solid #FFD700',
            padding: '10px',
            borderRadius: '8px'
          }}
        />
      </Form.Group>

      <Button 
        variant="primary" 
        type="submit" 
        disabled={loading}
        style={{ 
          width: '100%',
          backgroundColor: '#000000',
          border: 'none',
          color: '#FFD700',
          fontWeight: '600',
          padding: '12px',
          borderRadius: '8px'
        }}
      >
        {loading ? 'Processing...' : `Transfer R${amount || '0.00'}`}
      </Button>
    </Form>
  );
}

export default FundTransfer;