import { useState } from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  restaurant: string;
  available: boolean;
}

const mockMenu: MenuItem[] = [
  { id: 'm1', name: 'Zinger Burger', category: 'Burgers', price: 45.00, restaurant: 'KFC Ghana', available: true },
  { id: 'm2', name: 'Streetwise 2', category: 'Chicken', price: 65.00, restaurant: 'KFC Ghana', available: true },
  { id: 'm3', name: 'Whopper Meal', category: 'Burgers', price: 85.00, restaurant: 'Burger King', available: true },
  { id: 'm4', name: 'Fried Rice & Chicken', category: 'Local', price: 55.00, restaurant: 'Papaye', available: false },
];

export function MenuEditor() {
  const [items, setItems] = useState<MenuItem[]>(mockMenu);

  const toggleAvailability = (id: string) => {
    setItems(items.map(item => item.id === id ? { ...item, available: !item.available } : item));
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
              <option value="kfc">KFC Ghana</option>
              <option value="bk">Burger King</option>
              <option value="papaye">Papaye</option>
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
              {items.map((item) => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 600 }}>{item.name}</td>
                  <td>{item.restaurant}</td>
                  <td>{item.category}</td>
                  <td style={{ fontWeight: 600 }}>${item.price.toFixed(2)}</td>
                  <td>
                    <button 
                      onClick={() => toggleAvailability(item.id)}
                      className={`badge ${item.available ? 'badge-success' : 'badge-danger'}`}
                      style={{ cursor: 'pointer', border: 'none' }}
                    >
                      {item.available ? 'In Stock' : 'Out of Stock'}
                    </button>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                      <button className="btn-icon">
                        <Edit2 size={16} />
                      </button>
                      <button className="btn-icon" style={{ color: 'var(--danger)' }}>
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
