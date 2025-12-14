import React from 'react';
import { useAuth } from '../Context/AuthProvider';
import { useProfile } from '../hooks/useProfile';
import ProfileStats from './ProfileStats';

const ProfileCard = () => {
  const authContext = useAuth();
  if (!authContext) return null;
  
  const [authUser, setAuthUser] = authContext;
  const { profile, cartCount, orderCount, loading, error, refresh } = useProfile();



  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthUser(null);
    window.location.href = '/';
  };

  if (!authUser) {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
        <div className="animate-pulse">
          <div className="h-16 w-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
          <div className="h-4 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 bg-gray-300 rounded mb-4"></div>
          <div className="space-y-2">
            <div className="h-8 bg-gray-300 rounded"></div>
            <div className="h-8 bg-gray-300 rounded"></div>
            <div className="h-8 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto border border-gray-200">
      {/* Profile Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
          {profile?.firstName?.charAt(0) || authUser.firstName?.charAt(0) || 'U'}
        </div>
        <h2 className="text-xl font-bold text-gray-800">
          {profile?.firstName || authUser.firstName} {profile?.lastName || authUser.lastName}
        </h2>
        <p className="text-gray-600 text-sm">{profile?.email || authUser.email}</p>
        {profile?.phoneNumber && (
          <p className="text-gray-600 text-sm">{profile.phoneNumber}</p>
        )}
      </div>

      {/* Stats Section */}
      <div className="mb-6">
        <ProfileStats />
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button 
          onClick={() => window.location.href = '/cart'}
          className="w-full flex items-center justify-between p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors duration-200"
        >
          <div className="flex items-center">
            <span className="text-orange-600 mr-3">🛒</span>
            <span className="text-gray-800 font-medium">View Cart</span>
          </div>
          <span className="text-orange-600 font-bold">{cartCount}</span>
        </button>

        <button 
          onClick={() => window.location.href = '/orders'}
          className="w-full flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
        >
          <div className="flex items-center">
            <span className="text-blue-600 mr-3">📦</span>
            <span className="text-gray-800 font-medium">My Orders</span>
          </div>
          <span className="text-blue-600">→</span>
        </button>

        <button 
          onClick={() => window.location.href = '/profile'}
          className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <div className="flex items-center">
            <span className="text-gray-600 mr-3">⚙️</span>
            <span className="text-gray-800 font-medium">Profile Settings</span>
          </div>
          <span className="text-gray-600">→</span>
        </button>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center p-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors duration-200 font-medium"
        >
          <span className="mr-2">🚪</span>
          Logout
        </button>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-500">
            Member since {new Date(profile?.createdAt || authUser.createdAt || Date.now()).toLocaleDateString()}
          </p>
          <button 
            onClick={refresh}
            className="text-xs text-orange-600 hover:text-orange-700"
            title="Refresh data"
          >
            🔄
          </button>
        </div>
        {error && (
          <p className="text-xs text-red-500 mt-1">{error}</p>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;