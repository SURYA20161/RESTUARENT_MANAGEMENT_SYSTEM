import { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthProvider';

export const useProfile = () => {
  const authContext = useAuth();
  if (!authContext) return { profile: null, cartCount: 0, orderCount: 0, loading: false, error: null, refresh: () => {} };
  
  const [authUser] = authContext;
  const [profile, setProfile] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!authUser) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const [profileRes, cartRes, ordersRes] = await Promise.all([
        fetch('http://localhost:3000/user/profile', { headers }),
        fetch('http://localhost:3000/cart/count', { headers }),
        fetch('http://localhost:3000/user/orders', { headers })
      ]);

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile(profileData.user);
      }

      if (cartRes.ok) {
        const cartData = await cartRes.json();
        setCartCount(cartData.count || 0);
      }

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrderCount(ordersData.orders?.length || 0);
      }

    } catch (err) {
      setError('Failed to load profile data');
      console.error('Profile data error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [authUser]);

  return {
    profile,
    cartCount,
    orderCount,
    loading,
    error,
    refresh: fetchData
  };
};