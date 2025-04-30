import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Removed useNavigate
import authService from '../services/authService';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '' // For confirmation
  });
  const [error, setError] = useState(''); // State for error messages
  const { login } = useAuth(); // Get login function from context
  // const navigate = useNavigate(); // Removed: Let PublicRoute handle redirect

  const { username, email, password, password2 } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error on change
  };

  const onSubmit = async e => {
    e.preventDefault();
    setError(''); // Clear previous errors

    if (password !== password2) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
    }

    try {
      const response = await authService.register(username, email, password);
       if (response.data && response.data.token) {
        login(response.data.token); // Automatically log in the user after registration
        // navigate('/'); // Removed: Let PublicRoute handle redirect
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration Error:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div>
      <h1>Register</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            required
            minLength="6"
          />
        </div>
        <div>
          <label htmlFor="password2">Confirm Password</label>
          <input
            type="password"
            name="password2"
            value={password2}
            onChange={onChange}
            required
            minLength="6"
          />
        </div>
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default RegisterPage; 