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

const scheduledEngagements = [
  {
    date: '2025-06-02',
    time: '9:00 AM - 3:00 PM',
    location: 'Lekki Phase 1',
    description: 'Infant nanny shift for Mr. & Mrs. Akande',
  },
  {
    date: '2025-06-04',
    time: '12:00 PM - 6:00 PM',
    location: 'Victoria Island',
    description: 'Elderly care support for Mrs. Aina',
  },
];

const Schedule = () => {
  return (
    <DashboardLayout>
      <Box sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom>
          My Schedule
        </Typography>

        {/* Placeholder Calendar */}
        <Card sx={{ backgroundColor: '#648E87', color: 'white', mb: 3 }}>
          <CardContent>
            <Typography variant="h6">Upcoming Week</Typography>
            <Typography>
              You have {scheduledEngagements.length} scheduled engagement
              {scheduledEngagements.length !== 1 && 's'}.
            </Typography>
          </CardContent>
        </Card>

        {/* List of Engagements */}
        <Paper elevation={3}>
          <Typography variant="h6" sx={{ p: 2, borderBottom: '1px solid #ccc' }}>
            Scheduled Engagements
          </Typography>
          <List>
            {scheduledEngagements.map((eng, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemText
                    primary={`${eng.date} | ${eng.time}`}
                    secondary={`${eng.location} - ${eng.description}`}
                  />
                </ListItem>
                {index < scheduledEngagements.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Box>
    </DashboardLayout>
  );
};

export default Schedule;
