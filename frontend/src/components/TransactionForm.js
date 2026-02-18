import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { deposit, withdraw } from '../services/api';
import { toast } from 'react-toastify';

function TransactionForm({ type, accountNumber, onSuccess, allAccounts = [] }) {
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [description, setDescription] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(accountNumber);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (type === 'DEPOSIT') {
        await deposit(selectedAccount, amount, description);
        toast.success(`Deposit of R${amount} to ${selectedAccount} successful!`);
      } else {
        await withdraw(selectedAccount, amount, pin, description);
        toast.success(`Withdrawal of R${amount} from ${selectedAccount} successful!`);
      }
      
      setAmount('');
      setPin('');
      setDescription('');
      onSuccess();
    } catch (err) {
      setError(err.response?.data || `Failed to process ${type.toLowerCase()}`);
      toast.error(`Failed to process ${type.toLowerCase()}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form.Group className="mb-3">
        <Form.Label>Select Card</Form.Label>
        <Form.Select
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value)}
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
            <option value={selectedAccount}>{selectedAccount}</option>
          )}
        </Form.Select>
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

      {type === 'WITHDRAWAL' && (
        <Form.Group className="mb-3">
          <Form.Label>PIN</Form.Label>
          <Form.Control
            type="password"
            maxLength="4"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            required
            placeholder="Enter 4-digit PIN"
            style={{
              backgroundColor: '#F5F5F5',
              border: '1px solid #FFD700',
              padding: '10px',
              borderRadius: '8px'
            }}
          />
        </Form.Group>
      )}

      <Form.Group className="mb-3">
        <Form.Label>Description (Optional)</Form.Label>
        <Form.Control
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g., ATM withdrawal, Cash deposit"
          style={{
            backgroundColor: '#F5F5F5',
            border: '1px solid #FFD700',
            padding: '10px',
            borderRadius: '8px'
          }}
        />
      </Form.Group>

      <Button 
        variant={type === 'DEPOSIT' ? 'success' : 'warning'} 
        type="submit"
        disabled={loading}
        style={{ 
          width: '100%',
          backgroundColor: type === 'DEPOSIT' ? '#00FF00' : '#FFD700',
          border: 'none',
          color: '#000000',
          fontWeight: '600',
          padding: '12px',
          borderRadius: '8px'
        }}
      >
        {loading ? 'Processing...' : `${type} R${amount || '0.00'} to ${selectedAccount}`}
      </Button>
    </Form>
  );
}

export default TransactionForm;