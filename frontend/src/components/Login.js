import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { login } from '../services/api';
import { toast } from 'react-toastify';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  
  try {
    console.log('1. Login attempt with:', { email });
    console.log('2. Making API call to backend...');
    
    const data = await login({ email, password });
    
    console.log('3. API call successful!');
    console.log('4. Received data:', data);
    console.log('5. Data type:', typeof data);
    console.log('6. Data keys:', Object.keys(data));
    
    // Check if we have a successful response
    if (data && data.success === true) {
      console.log('7. Login successful!');
      
      const customerData = {
        id: data.id,
        customerId: data.customerId,
        fullName: data.fullName,
        email: data.email
      };
      
      console.log('8. Customer data:', customerData);
      localStorage.setItem('customer', JSON.stringify(customerData));
      
      const stored = localStorage.getItem('customer');
      console.log('9. Verified stored:', stored);
      
      toast.success('Login successful!');
      navigate('/dashboard');
    } else {
      console.log('7. Login failed - success flag false or missing');
      console.log('8. Response data:', data);
      setError(data?.message || 'Login failed');
      toast.error('Login failed');
    }
  } catch (err) {
    console.error('===== ERROR DETAILS =====');
    console.error('Error object:', err);
    console.error('Error type:', typeof err);
    
    if (typeof err === 'object') {
      console.error('Error keys:', Object.keys(err));
      console.error('Error message:', err.message);
      console.error('Error response:', err.response);
    }
    
    let errorMessage = 'Login failed';
    if (typeof err === 'string') {
      errorMessage = err;
    } else if (err.message) {
      errorMessage = err.message;
    } else if (err.error) {
      errorMessage = err.error;
    }
    
    setError(errorMessage);
    toast.error('Login failed');
  } finally {
    setLoading(false);
  }
};

  return (
    <Container className="mt-5">
      <Card style={{ 
        maxWidth: '400px', 
        margin: '0 auto',
        backgroundColor: '#1A1A1A',
        border: '1px solid #FFD700',
        color: '#FFFFFF'
      }}>
        <Card.Body>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <img 
              src={require('../assets/logo.png')} 
              alt="Mahlangu Capital Bank" 
              style={{ width: '80px', height: '80px', borderRadius: '12px' }}
            />
            <h2 style={{ color: '#FFD700', marginTop: '10px' }}>MAHLANGU CAPITAL BANK</h2>
            <p style={{ color: '#FFFFFF', opacity: 0.7 }}>Strength. Security. Wealth.</p>
          </div>
          
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#FFD700' }}>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                style={{
                  backgroundColor: '#000000',
                  border: '1px solid #FFD700',
                  color: '#FFFFFF',
                  borderRadius: '8px'
                }}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label style={{ color: '#FFD700' }}>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                style={{
                  backgroundColor: '#000000',
                  border: '1px solid #FFD700',
                  color: '#FFFFFF',
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
                backgroundColor: '#FFD700',
                border: 'none',
                color: '#000000',
                fontWeight: '600',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '16px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </Form>

          <div className="text-center mt-4">
            <Link 
              to="/register" 
              style={{ 
                color: '#FFD700', 
                textDecoration: 'none',
                fontSize: '14px'
              }}
            >
              Don't have an account? Register here
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Login;