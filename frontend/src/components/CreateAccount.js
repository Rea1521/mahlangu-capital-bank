import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { createAccount } from '../services/api';
import { toast } from 'react-toastify';

function CreateAccount() {
  const [formData, setFormData] = useState({
    accountType: 'SAVINGS',
    pin: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const customerData = localStorage.getItem('customer');
      console.log('Customer data from localStorage:', customerData);
      
      if (!customerData) {
        console.log('No customer data, redirecting to login');
        navigate('/');
        return;
      }
      
      const parsedCustomer = JSON.parse(customerData);
      console.log('Parsed customer:', parsedCustomer);
      
      if (!parsedCustomer || !parsedCustomer.id) {
        console.log('Invalid customer data, redirecting to login');
        localStorage.removeItem('customer');
        navigate('/');
        return;
      }
      
      setCustomer(parsedCustomer);
    } catch (err) {
      console.error('Error parsing customer data:', err);
      localStorage.removeItem('customer');
      navigate('/');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      console.log('1. Starting account creation...');
      console.log('2. Customer:', customer);
      console.log('3. Customer ID:', customer?.id);
      console.log('4. Form data:', formData);
      
      if (!customer || !customer.id) {
        throw new Error('No customer data found. Please login again.');
      }
      
      const response = await createAccount(customer.id, formData);
      console.log('5. Account created successfully:', response);
      
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error('===== ACCOUNT CREATION ERROR =====');
      console.error('Error object:', err);
      console.error('Error response:', err.response);
      console.error('Error status:', err.response?.status);
      console.error('Error data:', err.response?.data);
      console.error('Error message:', err.message);
      
      let errorMessage = 'Failed to create account';
      
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else {
          errorMessage = JSON.stringify(err.response.data);
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      toast.error('Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Card style={{ 
        maxWidth: '500px', 
        margin: '0 auto',
        backgroundColor: '#1A1A1A',
        border: '1px solid #FFD700',
        color: '#FFFFFF'
      }}>
        <Card.Body>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h2 style={{ color: '#FFD700' }}>Open New Account</h2>
            {customer && (
              <p style={{ color: '#FFFFFF', opacity: 0.7 }}>
                For: {customer.fullName}
              </p>
            )}
          </div>
          
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#FFD700' }}>Account Type</Form.Label>
              <Form.Select
                name="accountType"
                value={formData.accountType}
                onChange={handleChange}
                required
                disabled={loading}
                style={{
                  backgroundColor: '#000000',
                  border: '1px solid #FFD700',
                  color: '#FFFFFF'
                }}
              >
                <option value="SAVINGS">Savings Account (Black Card)</option>
                <option value="CURRENT">Credit Account (Gold Card)</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#FFD700' }}>Set PIN (Optional)</Form.Label>
              <Form.Control
                type="password"
                name="pin"
                value={formData.pin}
                onChange={handleChange}
                maxLength="4"
                placeholder="4-digit PIN"
                disabled={loading}
                style={{
                  backgroundColor: '#000000',
                  border: '1px solid #FFD700',
                  color: '#FFFFFF'
                }}
              />
              <Form.Text style={{ color: '#FFD700', opacity: 0.7 }}>
                PIN is required for withdrawals and transfers
              </Form.Text>
            </Form.Group>
            
            <Button 
              variant="primary" 
              type="submit" 
              className="w-100"
              disabled={loading}
              style={{
                backgroundColor: '#FFD700',
                border: 'none',
                color: '#000000',
                fontWeight: '600',
                padding: '12px',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default CreateAccount;