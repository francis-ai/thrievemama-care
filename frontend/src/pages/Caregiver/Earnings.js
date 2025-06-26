import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
} from '@mui/material';
import DashboardLayout from '../../components/Caregiver/DashboardLayout';

const sampleEarnings = [
  { id: 1, amount: 15000, date: '2025-05-25', status: 'Paid' },
  { id: 2, amount: 10000, date: '2025-05-18', status: 'Paid' },
  { id: 3, amount: 12000, date: '2025-05-10', status: 'Pending' },
];

const Earnings = () => {
  const totalEarnings = sampleEarnings
    .filter((e) => e.status === 'Paid')
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <DashboardLayout>
      <Box sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom>
          My Earnings
        </Typography>

        {/* Summary Card */}
        <Card sx={{ backgroundColor: '#648E87', color: 'white', mb: 3 }}>
          <CardContent>
            <Typography variant="h6">Total Earnings</Typography>
            <Typography variant="h4">₦{totalEarnings.toLocaleString()}</Typography>
          </CardContent>
        </Card>

        {/* Payments List */}
        <Paper elevation={3}>
          <Typography variant="h6" sx={{ p: 2, borderBottom: '1px solid #ccc' }}>
            Payment History
          </Typography>
          <List>
            {sampleEarnings.map((earning, index) => (
              <React.Fragment key={earning.id}>
                <ListItem>
                  <ListItemText
                    primary={`₦${earning.amount.toLocaleString()}`}
                    secondary={`Date: ${earning.date} • Status: ${earning.status}`}
                  />
                </ListItem>
                {index < sampleEarnings.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Box>
    </DashboardLayout>
  );
};

export default Earnings;
