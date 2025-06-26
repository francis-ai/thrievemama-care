import React, { useState } from 'react';
import {
  Grid, Box, Typography, TextField, Button, Alert, Paper,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // adjust path as needed


const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState({ text: '', type: '' });
  const { login } = useAuth(); // get login from context

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      const user = res.data.user;

      if (!user || !user.type) {
        return setMessage({ text: 'Invalid login response.', type: 'error' });
      }

      login(user, user.type); // ✅ update AuthContext state

      if (user.type === 'caregiver') {
        navigate('/caregiver/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Login failed.',
        type: 'error',
      });
    }
  };


  return (
    <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: '100vh', backgroundColor: '#f4f6f8' }}>
      <Grid item xs={12} md={6} lg={5}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" mb={3} color="#648E87">
              Welcome Back
            </Typography>

            {message.text && <Alert severity={message.type} sx={{ mb: 2 }}>{message.text}</Alert>}

            <form noValidate onSubmit={handleSubmit}>
              <TextField
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, backgroundColor: '#648E87' }}>
                Login
              </Button>
            </form>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Login;
