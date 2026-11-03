import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/Common/Input';
import Button from '../../components/Common/Button';
import './Auth.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setServerError('');
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setFormData({
      email: 'demo@moneytrack.com',
      password: 'Demo@123',
    });
    setErrors({});
    setServerError('');
  };

  return (
    <div className="auth-container">
      <div className="auth-card animate-fade">
        <div className="auth-header">
          <div className="auth-logo">💰</div>
          <h1 className="auth-title">Welcome to MoneyTrack</h1>
          <p className="auth-subtitle">Track Your Money, Manage Your Future.</p>
        </div>

        {serverError && (
          <div className="auth-alert auth-alert--error" role="alert">
            <span className="auth-alert-icon">⚠️</span>
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            error={errors.email}
            icon="✉️"
            required
            autoComplete="email"
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            error={errors.password}
            icon="🔒"
            required
            autoComplete="current-password"
          />

          <div className="auth-actions">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
            >
              Sign In
            </Button>
          </div>
        </form>

        <div className="auth-demo-box">
          <p className="auth-demo-text">Want to try it without signing up?</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={fillDemo}
            fullWidth
          >
            Use Demo Account (demo@moneytrack.com)
          </Button>
        </div>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

