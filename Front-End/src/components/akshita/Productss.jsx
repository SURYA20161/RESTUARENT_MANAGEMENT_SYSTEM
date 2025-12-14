import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Head from './Head';
import ItemSection from './ItemSection';
import Header from '../home/Header';
import { useAuth } from '../../Context/AuthProvider';

const Productss = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [authUser] = useAuth();
  const navigate = useNavigate();

  const API_LINK = 'http://localhost:3000/product/all';

  useEffect(() => {
    if (!authUser) {
      navigate('/login');
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await fetch(API_LINK);
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [authUser, navigate]);

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(product =>
        product.category &&
        product.category.toLowerCase().trim() === selectedCategory.toLowerCase().trim()
      );

  if (loading) return <div className="text-center text-lg">Loading products...</div>;
  if (error) return <div className="text-center text-lg text-red-500">Error: {error}</div>;

  return (
    <div className="bg-beige overflow-x-hidden font-serif bg-white text-black">
      <Header />
      <div className="mt-4 flex justify-center space-x-4 pr-4">
        <button
          onClick={() => setSelectedCategory('all')}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          All
        </button>
        <button
          onClick={() => setSelectedCategory('Vegetarian')}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          VEG
        </button>
        <button
          onClick={() => setSelectedCategory('Non-Vegetarian')}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          NON-VEG
        </button>
        <button
          onClick={() => setSelectedCategory('Vegan')}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
        >
          VEGAN
        </button>
      </div>
      <ItemSection
        title="Our Menu"
        description="Freshly added products from our kitchen, available for you to enjoy."
        products={filteredProducts}
      />
    </div>
  );
};

export default Productss;
