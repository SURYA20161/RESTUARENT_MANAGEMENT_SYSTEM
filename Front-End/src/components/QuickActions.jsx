import React from 'react';
import { useAuth } from '../Context/AuthProvider';
import { useProfile } from '../hooks/useProfile';

const QuickActions = () => {
  const authContext = useAuth();
  if (!authContext) return null;
  
  const [authUser] = authContext;
  const { cartCount, orderCount } = useProfile();

  if (!authUser) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div className="bg-white rounded-full shadow-lg p-2 flex space-x-2">
        <button 
          onClick={() => window.location.href = '/cart'}
          className="relative bg-orange-500 text-white p-3 rounded-full hover:bg-orange-600 transition-colors"
          title="View Cart"
        >
          🛒
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
        
        <button 
          onClick={() => window.location.href = '/orders'}
          className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition-colors"
          title="My Orders"
        >
          📦
        </button>
        
        <button 
          onClick={() => window.location.href = '/profile'}
          className="bg-gray-500 text-white p-3 rounded-full hover:bg-gray-600 transition-colors"
          title="Profile"
        >
          👤
        </button>
      </div>
    </div>
  );
};

export default QuickActions;