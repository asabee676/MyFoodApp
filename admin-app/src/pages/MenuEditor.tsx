import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import api from '../utils/api';

export function MenuEditor() {
  const [items, setItems] = useState<any[]>([]);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    restaurantId: '',
    name: '',
    category: '',
    price: 0,
    available: true
  });

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

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.restaurantId || !newItem.name || !newItem.price) return;
    
    try {
      await api.post(`/restaurants/${newItem.restaurantId}/menu`, {
        name: newItem.name,
        category: newItem.category || 'General',
        price: Number(newItem.price),
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200',
        available: newItem.available
      });
      fetchData();
      setIsModalOpen(false);
      setNewItem({ restaurantId: '', name: '', category: '', price: 0, available: true });
    } catch (err) {
      console.error('Failed to add item', err);
      alert('Error adding menu item');
    }
  };

  return (
    <div className="animate-in">
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Menu Editor</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage menu items, pricing, and availability.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
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

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-card" style={{ width: '500px', padding: '32px' }}>
            <h2 style={{ marginBottom: '24px' }}>Add New Menu Item</h2>
            <form onSubmit={handleAddItem} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Select Restaurant</label>
                <select 
                  style={{ width: '100%', padding: '10px' }} 
                  value={newItem.restaurantId} 
                  onChange={e => setNewItem({...newItem, restaurantId: e.target.value})}
                  required
                >
                  <option value="">Choose a restaurant...</option>
                  {restaurants.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Item Name</label>
                <input type="text" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} style={{ width: '100%' }} required />
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Category</label>
                  <input type="text" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} style={{ width: '100%' }} placeholder="e.g. Burgers" required />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Price (₵)</label>
                  <input type="number" min="0" step="0.01" value={newItem.price} onChange={e => setNewItem({...newItem, price: Number(e.target.value)})} style={{ width: '100%' }} required />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Item</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
