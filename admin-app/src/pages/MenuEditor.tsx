import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import api from '../utils/api';

export function MenuEditor() {
  const [items, setItems] = useState<any[]>([]);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/restaurants');
      const rests = res.data.data || [];
      setRestaurants(rests);

      // Flatten menu items
      const allItems: any[] = [];
      rests.forEach((r: any) => {
        if (r.menu) {
          r.menu.forEach((m: any) => {
            allItems.push({ ...m, restaurantId: r.id, restaurantName: r.name });
          });
        }
      });
      setItems(allItems);
    } catch (err) {
      console.error('Failed to fetch menus', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (restaurantId: string, itemId: string, currentAvail: boolean) => {
    // optimistic update
    setItems(items.map(item => item.id === itemId ? { ...item, available: !currentAvail } : item));
    try {
      await api.put(`/restaurants/${restaurantId}/menu/${itemId}`, { available: !currentAvail });
    } catch (err) {
      console.error('Failed to update availability', err);
      fetchData(); // revert
    }
  };

  return (
    <div className="animate-in">
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Menu Editor</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage menu items, pricing, and availability.</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={18} />
          Add Item
        </button>
      </div>

      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search items..." 
              style={{ paddingLeft: '36px', width: '300px' }} 
            />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <select style={{ width: '180px' }}>
              <option value="all">All Restaurants</option>
              {restaurants.map((r: any) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Restaurant</th>
                <th>Category</th>
                <th>Price</th>
                <th>Availability</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '24px' }}>Loading...</td></tr>
              ) : items.map((item) => (
                <tr key={`${item.restaurantId}-${item.id}`}>
                  <td style={{ fontWeight: 600 }}>{item.name}</td>
                  <td>{item.restaurantName}</td>
                  <td>{item.category}</td>
                  <td style={{ fontWeight: 600 }}>₵{item.price.toFixed(2)}</td>
                  <td>
                    <button 
                      onClick={() => toggleAvailability(item.restaurantId, item.id, item.available ?? true)}
                      className={`badge ${(item.available ?? true) ? 'badge-success' : 'badge-danger'}`}
                      style={{ cursor: 'pointer', border: 'none' }}
                    >
                      {(item.available ?? true) ? 'In Stock' : 'Out of Stock'}
                    </button>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                      <button className="btn-icon">
                        <Edit2 size={16} />
                      </button>
                      <button className="btn-icon" style={{ color: 'var(--danger)' }} onClick={async () => {
                        if (confirm('Are you sure?')) {
                          await api.delete(`/restaurants/${item.restaurantId}/menu/${item.id}`);
                          fetchData();
                        }
                      }}>
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
    </div>
  );
}
