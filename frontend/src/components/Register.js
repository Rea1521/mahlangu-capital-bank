import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { register } from '../services/api';
import { toast } from 'react-toastify';

function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      const response = await register(formData);
      toast.success('Registration successful! Please login.');
      navigate('/');
    } catch (err) {
      let errorMessage = 'Registration failed';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data) {
        errorMessage = err.response.data;
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      toast.error('Registration failed');
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
              style={{ width: '80px', height: '80px', borderRadius: '12px', marginBottom: '15px' }}
            />
            <h2 style={{ color: '#000000', fontSize: '22px', marginBottom: '5px' }}>Create Account</h2>
            <p style={{ color: '#666666', fontSize: '14px' }}>Join Mahlangu Capital Bank</p>
          </div>
          
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#000000', fontWeight: '500' }}>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                disabled={loading}
                style={{
                  backgroundColor: '#F5F5F5',
                  border: '1px solid #E0E0E0',
                  color: '#333333',
                  borderRadius: '8px',
                  padding: '10px'
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#000000', fontWeight: '500' }}>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                style={{
                  backgroundColor: '#F5F5F5',
                  border: '1px solid #E0E0E0',
                  color: '#333333',
                  borderRadius: '8px',
                  padding: '10px'
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#000000', fontWeight: '500' }}>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
                disabled={loading}
                style={{
                  backgroundColor: '#F5F5F5',
                  border: '1px solid #E0E0E0',
                  color: '#333333',
                  borderRadius: '8px',
                  padding: '10px'
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#000000', fontWeight: '500' }}>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                disabled={loading}
                style={{
                  backgroundColor: '#F5F5F5',
                  border: '1px solid #E0E0E0',
                  color: '#333333',
                  borderRadius: '8px',
                  padding: '10px'
                }}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label style={{ color: '#000000', fontWeight: '500' }}>Address</Form.Label>
              <Form.Control
                as="textarea"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="2"
                disabled={loading}
                style={{
                  backgroundColor: '#F5F5F5',
                  border: '1px solid #E0E0E0',
                  color: '#333333',
                  borderRadius: '8px',
                  padding: '10px'
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
                borderRadius: '8px',
                fontSize: '16px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                marginBottom: '15px'
              }}
            >
              {loading ? 'Creating Account...' : 'Register'}
            </Button>

            <div className="text-center">
              <Link 
                to="/" 
                style={{ 
                  color: '#666666', 
                  textDecoration: 'none',
                  fontSize: '14px'
                }}
              >
                Already have an account? <span style={{ color: '#FFD700' }}>Login</span>
              </Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Register;