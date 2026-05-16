
import { stats, mockOrders } from '../data/mockData';
import { DollarSign, ShoppingBag, Utensils, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export function Dashboard() {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'DollarSign': return <DollarSign size={24} className="text-primary" />;
      case 'ShoppingBag': return <ShoppingBag size={24} className="text-accent" />;
      case 'Utensils': return <Utensils size={24} className="text-warning" />;
      case 'Users': return <Users size={24} className="text-info" />;
      default: return null;
    }
  };

  const getIconBg = (iconName: string) => {
    switch (iconName) {
      case 'DollarSign': return 'var(--primary-light)';
      case 'ShoppingBag': return 'var(--accent-light)';
      case 'Utensils': return 'rgba(245, 158, 11, 0.15)';
      case 'Users': return 'rgba(59, 130, 246, 0.15)';
      default: return 'var(--bg-surface)';
    }
  };

  return (
    <div className="animate-in">
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Dashboard Overview</h1>
          <p style={{ color: 'var(--text-muted)' }}>Welcome back to KaleDash Admin.</p>
        </div>
        <button className="btn btn-primary">Download Report</button>
      </div>

      <div className="dashboard-grid">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card stat-card">
            <div className="stat-header">
              <div className="stat-icon" style={{ backgroundColor: getIconBg(stat.icon) }}>
                {getIcon(stat.icon)}
              </div>
              <div className={`stat-change ${stat.up ? 'change-up' : 'change-down'}`}>
                {stat.up ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                {stat.change}
              </div>
            </div>
            <div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px' }}>Recent Orders</h2>
          <button className="btn btn-secondary">View All</button>
        </div>
        
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Restaurant</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {mockOrders.map((order) => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 500 }}>{order.id}</td>
                  <td>{order.customerName}</td>
                  <td>{order.restaurantName}</td>
                  <td style={{ fontWeight: 600 }}>${order.amount.toFixed(2)}</td>
                  <td>
                    <span className={`badge badge-${order.status === 'delivered' ? 'success' : order.status === 'cancelled' ? 'danger' : order.status === 'processing' ? 'info' : 'warning'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
