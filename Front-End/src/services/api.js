const API_BASE_URL = 'http://localhost:3000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const userAPI = {
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  getOrders: async () => {
    const response = await fetch(`${API_BASE_URL}/user/orders`, {
      headers: getAuthHeaders()
    });
    return response.json();
  }
};

export const cartAPI = {
  getCount: async () => {
    const response = await fetch(`${API_BASE_URL}/cart/count`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  getCart: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/cart/${userId}`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  updateQuantity: async (productId, quantity) => {
    const response = await fetch(`${API_BASE_URL}/cart/${productId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ quantity })
    });
    return response.json();
  },

  removeItem: async (productId) => {
    const response = await fetch(`${API_BASE_URL}/cart/remove`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId })
    });
    return response.json();
  }
};

export default { userAPI, cartAPI };