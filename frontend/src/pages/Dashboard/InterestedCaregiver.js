import React, { useCallback, useState, useEffect } from 'react';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';
import axios from 'axios';
import { useAuthUser } from '../../context/AuthContextUser';
import { Box, Typography, Card, CardContent, Avatar, CircularProgress, Button, Divider, Grid, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Rating } from '@mui/material';
import { deepPurple } from '@mui/material/colors';

const InterestedCaregiver = () => {
  const { user } = useAuthUser();
  const userId = user?.id;
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [openReviews, setOpenReviews] = useState(false);
  const [selectedCaregiver, setSelectedCaregiver] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Group interests by service
  const groupInterestsByService = (interests) => {
    const grouped = {};
    interests.forEach(item => {
      if (!grouped[item.request.service]) {
        grouped[item.request.service] = [];
      }
      grouped[item.request.service].push(item);
    });
    return grouped;
  };

  const groupedInterests = groupInterestsByService(interests);

  const fetchInterests = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/users/interested-caregivers/${userId}`);
      
      const formattedInterests = res.data.data.map(item => ({
        ...item,
        caregiver: {
          ...item.caregiver,
          profile_image_url: item.caregiver.profile_image 
            ? `http://localhost:5000/uploads/caregivers/${item.caregiver.profile_image}`
            : null
        }
      }));

      setInterests(formattedInterests || []);
    } catch (err) {
      setError('Failed to load caregiver interests');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchCaregiverReviews = async (caregiverId) => {
    setReviewsLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/caregivers/caregiver-reviews/${caregiverId}`);
      setReviews(res.data || []);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchInterests();
    }
  }, [userId, fetchInterests]);

  const handleStatusUpdate = async (interestId, newStatus, requestId, caregiverName) => {
    try {
      // Show loading state
      setInterests(prev => prev.map(item => 
        item.interest_id === interestId 
          ? { ...item, loading: true } 
          : item
      ));

      // Update interest status
      await axios.patch(
        `http://localhost:5000/api/users/interests/${interestId}/status`,
        { status: newStatus }
      );

      // If approved:
      if (newStatus === 'Approved') {
        // 1. Close the request
        await axios.put(
          `http://localhost:5000/api/users/close-my-caregiver-request/${requestId}`
        );

        // 2. Reject all other caregivers for this request
        const otherInterests = interests.filter(
          item => item.request.id === requestId && item.interest_id !== interestId
        );
        
        // Batch update all other interests to 'Rejected'
        await Promise.all(
          otherInterests.map(async (item) => {
            await axios.patch(
              `http://localhost:5000/api/users/interests/${item.interest_id}/status`,
              { status: 'Rejected' }
            );
          })
        );

        // Update UI for all rejected interests
        setInterests(prev => prev.map(item => 
          item.request.id === requestId && item.interest_id !== interestId
            ? { ...item, status: 'Rejected', loading: false }
            : item.interest_id === interestId
              ? { ...item, status: newStatus, loading: false }
              : item
        ));
      } else {
        // For non-approval status updates
        setInterests(prev => prev.map(item => 
          item.interest_id === interestId 
            ? { ...item, status: newStatus, loading: false }
            : item
        ));
      }

      setSnackbar({
        open: true,
        message: newStatus === 'Approved' 
          ? `You've approved ${caregiverName} for this service. Other applicants have been rejected.`
          : `Status updated to ${newStatus}`,
        severity: 'success'
      });

    } catch (err) {
      // Revert on error
      setInterests(prev => prev.map(item => 
        item.interest_id === interestId 
          ? { ...item, loading: false }
          : item
      ));

      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Update failed',
        severity: 'error'
      });
      console.error('Update error:', err);
    }
  };

  const handleOpenReviews = (caregiver) => {
    setSelectedCaregiver(caregiver);
    fetchCaregiverReviews(caregiver.id);
    setOpenReviews(true);
  };

  const handleCloseReviews = () => {
    setOpenReviews(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Caregivers Interested in Your Requests
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : interests.length === 0 ? (
          <Typography variant="body1" mt={2}>
            No caregivers have shown interest yet.
          </Typography>
        ) : (
          Object.entries(groupedInterests).map(([service, serviceInterests]) => {
            const approvedCaregiver = serviceInterests.find(item => item.status === 'Approved');
            
            return (
              <Box key={service} mb={4}>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  {service}
                </Typography>
                
                {approvedCaregiver ? (
                  <Box>
                    <Typography variant="body1" color="success.main" mb={2}>
                      {`${approvedCaregiver.caregiver.name} has been selected for this request`}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleOpenReviews(approvedCaregiver.caregiver)}
                      sx={{ textTransform: 'none' }}
                    >
                      View Approved Caregiver Details
                    </Button>
                  </Box>
                ) : (
                  <Grid container spacing={3}>
                    {serviceInterests.map((item) => (
                      <Grid item xs={12} md={6} key={item.interest_id}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                          <CardContent sx={{ flexGrow: 1 }}>
                            <Box display="flex" alignItems="center" mb={2}>
                              <Avatar 
                                src={item.caregiver.profile_image_url || '/default-avatar.jpg'}
                                sx={{ 
                                  width: 56, 
                                  height: 56, 
                                  mr: 2,
                                  bgcolor: !item.caregiver.profile_image_url ? deepPurple[500] : 'transparent',
                                  fontSize: '1.5rem'
                                }}
                                imgProps={{
                                  onError: (e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/default-avatar.jpg';
                                  }
                                }}
                              >
                                {!item.caregiver.profile_image_url && item.caregiver.name?.charAt(0)}
                              </Avatar>
                              <Box>
                                <Typography variant="h6" fontWeight="bold">
                                  {item.caregiver.name}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                  {item.caregiver.gender} • {item.caregiver.phone} 
                                </Typography>
                              </Box>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Typography paragraph>
                              <strong>Service:</strong> {item.request.service}
                            </Typography>
                            <Typography paragraph>
                              <strong>Duration:</strong> {item.request.duration}
                            </Typography>
                            <Typography paragraph>
                              <strong>Location:</strong> {item.request.address}
                            </Typography>
                            <Typography paragraph>
                              <strong>offered Amount:</strong> {item.request.offer_amount}
                            </Typography>

                            <Box display="flex" alignItems="center" gap={1}>
                              <Button
                                variant="text"
                                size="small"
                                onClick={() => handleOpenReviews(item.caregiver)}
                                sx={{ textTransform: 'none' }}
                              >
                                View Reviews
                              </Button>
                            </Box>

                            <Box display="flex" justifyContent="space-between" alignItems="center" mt={3}>
                              <Box display="flex" gap={1}>
                                {/* Reject Button */}
                                {item.status !== 'Rejected' && (
                                  <Button
                                    variant="outlined"
                                    color="error"
                                    size="small"
                                    onClick={() => handleStatusUpdate(item.interest_id, 'Rejected', item.request.id, item.caregiver.name)}
                                    disabled={item.loading}
                                  >
                                    {item.loading && item.status === 'Rejected' ? (
                                      <CircularProgress size={20} />
                                    ) : (
                                      'Reject'
                                    )}
                                  </Button>
                                )}

                                {/* Shortlist Button */}
                                {!['Shortlisted', 'Approved'].includes(item.status) && (
                                  <Button
                                    variant="outlined"
                                    color="primary"
                                    size="small"
                                    onClick={() => handleStatusUpdate(item.interest_id, 'Shortlisted', item.request.id, item.caregiver.name)}
                                    disabled={item.loading}
                                  >
                                    {item.loading && item.status === 'Shortlisted' ? (
                                      <CircularProgress size={20} />
                                    ) : (
                                      'Shortlist'
                                    )}
                                  </Button>
                                )}

                                {/* Approve Button */}
                                {(item.status === 'Shortlisted' || !['Approved', 'Rejected'].includes(item.status)) && (
                                  <Button
                                    variant="contained"
                                    color="success"
                                    size="small"
                                    onClick={() => handleStatusUpdate(item.interest_id, 'Approved', item.request.id, item.caregiver.name)}
                                    disabled={item.loading}
                                  >
                                    {item.loading && item.status === 'Approved' ? (
                                      <CircularProgress size={20} />
                                    ) : (
                                      'Approve'
                                    )}
                                  </Button>
                                )}
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            );
          })
        )}

        {/* Reviews Dialog */}
        <Dialog open={openReviews} onClose={handleCloseReviews} maxWidth="sm" fullWidth>
          <DialogTitle>
            Reviews for {selectedCaregiver?.name}
          </DialogTitle>
          <DialogContent>
            {reviewsLoading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            ) : reviews.length > 0 ? (
              reviews.map(review => (
                <Box key={review.id} mb={2}>
                  <Typography variant="body2" mt={1}>
                    {review.user_name}
                  </Typography>
                  <Rating value={review.rating} readOnly />
                  <Typography variant="body2" mt={1}>
                    {review.comment}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                </Box>
              ))
            ) : (
              <Typography variant="body2">No reviews yet</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseReviews}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for status updates */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </DashboardLayout>
  );
};

export default InterestedCaregiver;