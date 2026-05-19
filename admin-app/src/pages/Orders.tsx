import { useState, useEffect } from 'react';
import { type Order } from '../data/mockData';
import { Search, Filter, Clock, CheckCircle2, XCircle, Truck } from 'lucide-react';
import api from '../utils/api';

export function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={16} className="text-warning" />;
      case 'processing': return <Clock size={16} className="text-warning" />;
      case 'heading_to_restaurant': return <Truck size={16} className="text-info" />;
      case 'at_restaurant': return <Truck size={16} className="text-info" />;
      case 'heading_to_customer': return <Truck size={16} className="text-info" />;
      case 'at_customer': return <Truck size={16} className="text-info" />;
      case 'delivered': return <CheckCircle2 size={16} className="text-success" />;
      case 'cancelled': return <XCircle size={16} className="text-danger" />;
      default: return null;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    // optimistic update
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    try {
      await api.put(`/orders/${id}`, { status: newStatus });
    } catch (err) {
      console.error('Status update failed', err);
      fetchOrders(); // revert on failure
    }
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="animate-in">
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Order Tracking</h1>
          <p style={{ color: 'var(--text-muted)' }}>Monitor and manage live orders across all restaurants.</p>
        </div>
      </div>

      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search by Order ID or Customer..." 
              style={{ paddingLeft: '36px', width: '320px' }} 
            />
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Filter size={18} style={{ color: 'var(--text-muted)' }} />
            <select style={{ width: '150px' }} value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date & Time</th>
                <th>Customer</th>
                <th>Restaurant</th>
                <th>Amount</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '24px' }}>Loading...</td></tr>
              ) : filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 600 }}>{order.id.slice(0,8)}...</td>
                  <td style={{ color: 'var(--text-muted)' }}>{new Date(order.date).toLocaleString()}</td>
                  <td>{order.customerName}</td>
                  <td>{order.restaurantName}</td>
                  <td style={{ fontWeight: 600 }}>₵{order.total.toFixed(2)}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {getStatusIcon(order.status)}
                      <span style={{ textTransform: 'capitalize', fontWeight: 500 }}>{order.status.replace(/_/g, ' ')}</span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <select 
                      className="btn-secondary"
                      style={{ padding: '6px 10px', fontSize: '13px', borderRadius: '4px' }}
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    >
                      <option value="pending">Mark Pending</option>
                      <option value="processing">Mark Processing</option>
                      <option value="heading_to_restaurant">Rider En Route</option>
                      <option value="delivered">Mark Delivered</option>
                      <option value="cancelled">Cancel Order</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No orders found for the selected filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
