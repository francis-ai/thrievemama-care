import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
} from '@mui/material';
import DashboardLayout from '../../components/Caregiver/DashboardLayout';

const currentEngagements = [
  {
    id: 1,
    title: 'Nanny for 6-month-old',
    serviceType: 'Nanny',
    location: 'Lekki, Lagos',
    duration: '3 months',
    startDate: 'May 10, 2025',
    status: 'Ongoing',
  },
  {
    id: 2,
    title: 'Housekeeping for family',
    serviceType: 'House Help',
    location: 'Ikeja, Lagos',
    duration: '6 months',
    startDate: 'April 15, 2025',
    status: 'Ongoing',
  },
];

const MyEngagement = () => {
  return (
    <DashboardLayout>
      <Box sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom>
          My Engagements
        </Typography>

        {currentEngagements.length === 0 ? (
          <Typography variant="body1" mt={2}>
            You currently have no active engagements.
          </Typography>
        ) : (
          <Grid container spacing={2} mt={1}>
            {currentEngagements.map((engagement) => (
              <Grid item xs={12} sm={6} md={4} key={engagement.id}>
                <Card sx={{ backgroundColor: '#FAFAFA' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {engagement.title}
                    </Typography>
                    <Typography><strong>Service:</strong> {engagement.serviceType}</Typography>
                    <Typography><strong>Location:</strong> {engagement.location}</Typography>
                    <Typography><strong>Duration:</strong> {engagement.duration}</Typography>
                    <Typography><strong>Start Date:</strong> {engagement.startDate}</Typography>
                    <Box mt={2} display="flex" alignItems="center" justifyContent="space-between">
                      <Chip label={engagement.status} color="primary" size="small" />
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          backgroundColor: '#648E87',
                          '&:hover': { backgroundColor: '#4f706b' },
                        }}
                      >
                        Message Client
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </DashboardLayout>
  );
};

export default MyEngagement;
