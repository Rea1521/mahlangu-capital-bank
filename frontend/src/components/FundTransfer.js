import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { transferFunds } from '../services/api';
import { toast } from 'react-toastify';

function FundTransfer({ fromAccount, onSuccess }) {
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
      await transferFunds(fromAccount, toAccount, amount, pin, description);
      toast.success('Transfer successful!');
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

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form.Group className="mb-3">
        <Form.Label>From Account</Form.Label>
        <Form.Control
          type="text"
          value={fromAccount}
          disabled
          readOnly
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>To Account Number</Form.Label>
        <Form.Control
          type="text"
          value={toAccount}
          onChange={(e) => setToAccount(e.target.value)}
          required
          placeholder="Enter destination account number"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Amount ($)</Form.Label>
        <Form.Control
          type="number"
          step="0.01"
          min="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
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
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Description (Optional)</Form.Label>
        <Form.Control
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g., Rent payment, Gift"
        />
      </Form.Group>

      <Button variant="primary" type="submit" disabled={loading}>
        {loading ? 'Processing...' : 'Transfer Funds'}
      </Button>
    </Form>
  );
}

export default FundTransfer;