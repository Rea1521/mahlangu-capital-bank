import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { deposit, withdraw } from '../services/api';
import { toast } from 'react-toastify';

function TransactionForm({ type, accountNumber, onSuccess }) {
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
      if (type === 'DEPOSIT') {
        await deposit(accountNumber, amount, description);
        toast.success('Deposit successful!');
      } else {
        await withdraw(accountNumber, amount, pin, description);
        toast.success('Withdrawal successful!');
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

      {type === 'WITHDRAWAL' && (
        <Form.Group className="mb-3">
          <Form.Label>PIN</Form.Label>
          <Form.Control
            type="password"
            maxLength="4"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            required
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
        />
      </Form.Group>

      <Button 
        variant={type === 'DEPOSIT' ? 'success' : 'warning'} 
        type="submit"
        disabled={loading}
      >
        {loading ? 'Processing...' : type}
      </Button>
    </Form>
  );
}

export default TransactionForm;