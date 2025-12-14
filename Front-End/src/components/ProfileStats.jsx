import React from 'react';
import { useProfile } from '../hooks/useProfile';

const ProfileStats = () => {
  const { cartCount, orderCount, loading } = useProfile();

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 animate-pulse">
        <div className="bg-gray-200 rounded-lg h-16"></div>
        <div className="bg-gray-200 rounded-lg h-16"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-orange-50 rounded-lg p-4 text-center border border-orange-200">
        <div className="text-2xl font-bold text-orange-600">{cartCount}</div>
        <div className="text-sm text-gray-600">Cart Items</div>
      </div>
      <div className="bg-green-50 rounded-lg p-4 text-center border border-green-200">
        <div className="text-2xl font-bold text-green-600">{orderCount}</div>
        <div className="text-sm text-gray-600">Total Orders</div>
      </div>
    </div>
  );
};

export default ProfileStats;