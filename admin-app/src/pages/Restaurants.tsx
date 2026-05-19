import React, { useState, useEffect } from 'react';
import { type Restaurant } from '../data/mockData';
import { Plus, Trash2, Edit2, Search } from 'lucide-react';
import api from '../utils/api';

export function Restaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRestaurant, setNewRestaurant] = useState<Partial<Restaurant>>({
    name: '',
    category: '',
    status: 'pending',
    orders: 0,
    revenue: 0,
    rating: 0,
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=200'
  });

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const res = await api.get('/restaurants');
      setRestaurants(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch restaurants', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRestaurant.name || !newRestaurant.category) return;

    try {
      const payload = {
        name: newRestaurant.name,
        cuisine: [newRestaurant.category],
        status: newRestaurant.status,
        image: newRestaurant.image,
        address: 'Accra, Ghana', // default
        rating: 0,
        reviews: 0,
        deliveryTime: '30-45 min',
        deliveryFee: 5,
        minOrder: 10,
        featured: false,
        tags: []
      };
      await api.post('/restaurants', payload);
      fetchRestaurants();
      setIsModalOpen(false);
      setNewRestaurant({ ...newRestaurant, name: '', category: '' });
    } catch (err) {
      console.error('Failed to create restaurant', err);
      alert('Error creating restaurant');
    }
  };

  const handleRemoveRestaurant = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this restaurant?')) {
      try {
        await api.delete(`/restaurants/${id}`);
        setRestaurants(restaurants.filter(r => r.id !== id));
      } catch (err) {
        console.error('Failed to delete', err);
      }
    }
  };

  return (
    <div className="animate-in">
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Restaurants</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage all restaurants on the KaleDash platform.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          Add Restaurant
        </button>
      </div>

      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search restaurants..." 
              style={{ paddingLeft: '36px', width: '320px' }} 
            />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <select style={{ width: '150px' }}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Restaurant</th>
                <th>Category</th>
                <th>Status</th>
                <th>Orders</th>
                <th>Revenue</th>
                <th>Rating</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '24px' }}>Loading...</td></tr>
              ) : restaurants.map((restaurant: any) => (
                <tr key={restaurant.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img 
                        src={restaurant.image || 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=200'} 
                        alt={restaurant.name} 
                        style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }}
                      />
                      <span style={{ fontWeight: 600 }}>{restaurant.name}</span>
                    </div>
                  </td>
                  <td>{restaurant.cuisine?.[0] || restaurant.category}</td>
                  <td>
                    <span className={`badge badge-${restaurant.status === 'active' ? 'success' : restaurant.status === 'inactive' ? 'danger' : 'warning'}`}>
                      {restaurant.status}
                    </span>
                  </td>
                  <td>{restaurant.reviews || 0}</td>
                  <td>₵0.00</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ color: 'var(--warning)' }}>★</span>
                      <span>{(restaurant.rating || 0).toFixed(1)}</span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                      <button className="btn-icon">
                        <Edit2 size={16} />
                      </button>
                      <button className="btn-icon" style={{ color: 'var(--danger)' }} onClick={() => handleRemoveRestaurant(restaurant.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 style={{ marginBottom: '24px' }}>Add New Restaurant</h2>
            <form onSubmit={handleAddRestaurant} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Restaurant Name</label>
                <input 
                  type="text" 
                  value={newRestaurant.name}
                  onChange={e => setNewRestaurant({...newRestaurant, name: e.target.value})}
                  style={{ width: '100%' }}
                  placeholder="e.g. KFC Ghana"
                  required
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Category</label>
                <input 
                  type="text" 
                  value={newRestaurant.category}
                  onChange={e => setNewRestaurant({...newRestaurant, category: e.target.value})}
                  style={{ width: '100%' }}
                  placeholder="e.g. Fast Food"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Initial Status</label>
                <select 
                  value={newRestaurant.status}
                  onChange={e => setNewRestaurant({...newRestaurant, status: e.target.value as any})}
                  style={{ width: '100%' }}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Restaurant</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
