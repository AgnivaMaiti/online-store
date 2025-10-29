import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Customized() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: '',
    price: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.description.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const { data, error } = await supabase
        .from('custom_products')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            description: formData.description,
            price: parseFloat(formData.price) || 0,
            status: 'pending',
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        description: '',
        price: ''
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error) {
      console.error('Error submitting request:', error);
      setError(error.message || 'Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '40px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '90%',
      maxWidth: '600px'
    }}>
        <div className="text-green-500 text-5xl mb-4">✓</div>
        <h2 className="text-2xl font-bold mb-4">Request Submitted Successfully!</h2>
        <p className="text-gray-600">We've received your custom artwork request. Our team will review it and get back to you soon.</p>
        <p className="text-gray-500 text-sm mt-4">Redirecting to homepage...</p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      padding: '20px',
      backgroundColor: '#f9fafb',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Left Image */}
      <div style={{
        flex: '1',
        display: 'flex',
        justifyContent: 'center',
        padding: '20px',
        maxWidth: '30%'
      }}>
        <img 
          src="/images/imgb1.jpg" 
          alt="Custom Artwork Example 1" 
          style={{
            maxWidth: '100%',
            maxHeight: '600px',
            objectFit: 'contain',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}
        />
      </div>

      {/* Form */}
      <div className="max-w-2xl w-full p-8 bg-white rounded-lg shadow-lg" style={{
        zIndex: 1,
        maxWidth: '600px',
        margin: '0 20px'
      }}>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Request a Customized Artwork</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="John Doe"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="your@email.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Budget (₹)
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 5000"
            min="0"
            step="0.01"
          />
        </div>

<div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Describe your custom artwork <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Please describe in detail what you're looking for in your custom artwork..."
            required
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
      </div>

      {/* Right Image */}
      <div style={{
        flex: '1',
        display: 'flex',
        justifyContent: 'center',
        padding: '20px',
        maxWidth: '30%'
      }}>
        <img 
          src="/images/imgb2.jpg" 
          alt="Custom Artwork Example 2" 
          style={{
            maxWidth: '100%',
            maxHeight: '600px',
            objectFit: 'contain',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}
        />
      </div>
    </div>
  );
};
