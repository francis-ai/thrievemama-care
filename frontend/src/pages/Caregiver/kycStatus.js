import React, { useEffect, useState} from 'react';

const KYCstatus = () => {
    const [caregiver, setCaregiver] = useState(null);
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('caregiver'));
        setCaregiver(stored);
    }, []);

    const fetchStatus = async () => {
        try {
        const response = await api.get(`http://localhost:5000/api/caregivers/kyc-status/${caregiverId}`);
        setStatus(response.data.status);
        } catch (err) {
        setError(err.response?.data?.message || err.message);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        if (caregiverId) fetchStatus();
    }, [caregiverId]);

   
   return { status, loading, error, refetch: fetchStatus };
}