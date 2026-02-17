import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
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
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      toast.success('Registration successful! Please login.');
      navigate('/');
    } catch (err) {
      setError(err.response?.data || 'Registration failed');
      toast.error('Registration failed');
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
            <img 
              src={require('../assets/logo.png')} 
              alt="Mahlangu Capital Bank" 
              style={{ width: '60px', height: '60px', borderRadius: '10px' }}
            />
            <h2 style={{ color: '#FFD700', fontSize: '20px', marginTop: '10px' }}>
              Join Mahlangu Capital Bank
            </h2>
          </div>
          
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#FFD700' }}>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                style={{
                  backgroundColor: '#000000',
                  border: '1px solid #FFD700',
                  color: '#FFFFFF'
                }}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#FFD700' }}>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  backgroundColor: '#000000',
                  border: '1px solid #FFD700',
                  color: '#FFFFFF'
                }}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#FFD700' }}>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
                style={{
                  backgroundColor: '#000000',
                  border: '1px solid #FFD700',
                  color: '#FFFFFF'
                }}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#FFD700' }}>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                style={{
                  backgroundColor: '#000000',
                  border: '1px solid #FFD700',
                  color: '#FFFFFF'
                }}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#FFD700' }}>Address</Form.Label>
              <Form.Control
                as="textarea"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="2"
                style={{
                  backgroundColor: '#000000',
                  border: '1px solid #FFD700',
                  color: '#FFFFFF'
                }}
              />
            </Form.Group>
            
            <Button 
              variant="primary" 
              type="submit" 
              className="w-100"
              style={{
                backgroundColor: '#FFD700',
                border: 'none',
                color: '#000000',
                fontWeight: '600',
                padding: '10px'
              }}
            >
              Register
            </Button>
          </Form>
          
          <div className="text-center mt-3">
            <Link to="/" style={{ color: '#FFD700', textDecoration: 'none' }}>
              Already have an account? Login
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Register;