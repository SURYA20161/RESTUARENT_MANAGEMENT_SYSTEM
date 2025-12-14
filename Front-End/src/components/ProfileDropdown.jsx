import React, { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthProvider';

const ProfileDropdown = ({ isOpen, onClose }) => {
  const authContext = useAuth();
  if (!authContext) return null;
  
  const [authUser, setAuthUser] = authContext;
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (authUser && isOpen) {
      fetchCartCount();
    }
  }, [authUser, isOpen]);

  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/cart/count', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCartCount(data.count);
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthUser(null);
    onClose();
    window.location.href = '/';
  };

  if (!isOpen || !authUser) return null;

  return (
    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      {/* Profile Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
            {authUser.firstName?.charAt(0) || 'U'}
          </div>
          <div>
            <p className="font-semibold text-gray-800">{authUser.firstName} {authUser.lastName}</p>
            <p className="text-sm text-gray-600">{authUser.email}</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-3 border-b border-gray-200">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Cart Items:</span>
          <span className="font-semibold text-orange-600">{cartCount}</span>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-2">
        <button 
          onClick={() => { window.location.href = '/profile'; onClose(); }}
          className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3"
        >
          <span>👤</span>
          <span>Profile</span>
        </button>
        <button 
          onClick={() => { window.location.href = '/cart'; onClose(); }}
          className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3"
        >
          <span>🛒</span>
          <span>Cart ({cartCount})</span>
        </button>
        <button 
          onClick={() => { window.location.href = '/orders'; onClose(); }}
          className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3"
        >
          <span>📦</span>
          <span>My Orders</span>
        </button>
      </div>

      {/* Logout */}
      <div className="border-t border-gray-200 py-2">
        <button 
          onClick={handleLogout}
          className="w-full px-4 py-2 text-left hover:bg-red-50 text-red-600 flex items-center space-x-3"
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;