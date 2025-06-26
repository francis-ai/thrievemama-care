import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Card, CardContent } from '@mui/material';
import DashboardLayout from '../../components/Caregiver/DashboardLayout';
import { AssignmentTurnedIn, 
  // Work, CheckCircle, MonetizationOn, Event
 } from '@mui/icons-material';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Tooltip } from '@mui/material';

const dashboardItems = [
  {
    title: 'My Interests',
    // count: 8, // Replace with dynamic value
    icon: <AssignmentTurnedIn fontSize="large" color="primary" />,
    bgColor: '#E3F2FD',
    path: '/caregiver/my-interests',
  },
  // {
  //   title: 'Current Engagements',
  //   count: 2, // Replace with dynamic value
  //   icon: <Work fontSize="large" color="primary" />,
  //   bgColor: '#FFF3E0',
  //   path: '/caregiver/my-engagements',
  // },
  // {
  //   title: 'Completed Services',
  //   count: 12, // Replace with dynamic value
  //   icon: <CheckCircle fontSize="large" color="primary" />,
  //   bgColor: '#E8F5E9',
  //   path: '/caregiver/completed',
  // },
  // {
  //   title: 'Earnings',
  //   count: '₦250,000', // Replace with dynamic value
  //   icon: <MonetizationOn fontSize="large" color="primary" />,
  //   bgColor: '#FFF0F0',
  //   path: '/caregiver/earnings',
  // },
  // {
  //   title: 'My Schedule',
  //   count: 'View',
  //   icon: <Event fontSize="large" color="primary" />,
  //   bgColor: '#EDE7F6',
  //   path: '/caregiver/schedule',
  // },
];

const CaregiverDashboard = () => {
  const [caregiver, setCaregiver] = useState(null);
  const [kycStatus, setKycStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('caregiver'));
    setCaregiver(stored);
    
    if (stored?.id) {
      fetchKycStatus(stored.id);
    }
  }, []);

  const fetchKycStatus = async (caregiverId) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/caregivers/kyc-status/${caregiverId}`);
      setKycStatus(response.data.status);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch KYC status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography variant="h5" gutterBottom>
            Welcome Back, {caregiver?.name || 'Guest'}
          </Typography>
          
          {loading ? (
            <Typography variant="caption">Checking verification...</Typography>
          ) : kycStatus === 'verified' ? (
            <Tooltip title="KYC Verified" arrow>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 1 }}>
                <VerifiedUserIcon color="success" fontSize="small" />
                <Typography variant="caption" color="text.secondary">
                  KYC Verified
                </Typography>
              </Box>
            </Tooltip>
          ) : null}
        </Box>
        { error && (
          <p>Error</p>
        )}

        <Grid container spacing={2} mt={1}>
          {dashboardItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Link to={item.path} style={{ textDecoration: 'none' }}>
                <Card sx={{ 
                  backgroundColor: item.bgColor,
                  width: '300px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.03)' }
                }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2}>
                      {item.icon}
                      <Box>
                        <Typography variant="h6" color="textPrimary">
                          {item.title}
                        </Typography>
                        <Typography variant="subtitle1" fontWeight="bold" color="textPrimary">
                          {/* {item.count} */}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Box>
    </DashboardLayout>
  );
};

export default CaregiverDashboard;