import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Card, Alert } from 'react-bootstrap';
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
      const data = await login({ email, password });
      
      if (data && data.success === true) {
        const customerData = {
          id: data.id,
          customerId: data.customerId,
          fullName: data.fullName,
          email: data.email
        };
        
        localStorage.setItem('customer', JSON.stringify(customerData));
        toast.success('Login successful!');
        navigate('/dashboard');
      } else {
        setError(data?.message || 'Login failed');
        toast.error('Login failed');
      }
    } catch (err) {
      let errorMessage = 'Login failed';
      if (typeof err === 'string') {
        errorMessage = err;
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card" style={{ 
        backgroundColor: '#FFFFFF',
        border: '1px solid #FFD700',
        color: '#333333',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
      }}>
        <Card.Body>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <img 
              src={require('../assets/logo.png')} 
              alt="Mahlangu Capital Bank" 
              style={{ width: '100px', height: '100px', borderRadius: '16px', marginBottom: '15px' }}
            />
            <h2 style={{ color: '#000000', fontSize: '24px', marginBottom: '5px' }}>MAHLANGU CAPITAL BANK</h2>
            <p style={{ color: '#666666', fontSize: '14px' }}>Strength. Security. Wealth.</p>
          </div>
          
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label style={{ color: '#000000', fontWeight: '500' }}>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                style={{
                  backgroundColor: '#F5F5F5',
                  border: '1px solid #E0E0E0',
                  color: '#333333',
                  borderRadius: '8px',
                  padding: '12px'
                }}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label style={{ color: '#000000', fontWeight: '500' }}>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                style={{
                  backgroundColor: '#F5F5F5',
                  border: '1px solid #E0E0E0',
                  color: '#333333',
                  borderRadius: '8px',
                  padding: '12px'
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
                padding: '14px',
                borderRadius: '8px',
                fontSize: '16px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                marginBottom: '20px'
              }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>

            <div className="text-center">
              <Link 
                to="/register" 
                style={{ 
                  color: '#000000', 
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Don't have an account? <span style={{ color: '#FFD700' }}>Register here</span>
              </Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Login;