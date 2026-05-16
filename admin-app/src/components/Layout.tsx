import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Store, 
  ShoppingBag, 
  MenuSquare, 
  Settings,
  Bell,
  Search,
  Menu,
  X
} from 'lucide-react';

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/restaurants', icon: Store, label: 'Restaurants' },
    { path: '/orders', icon: ShoppingBag, label: 'Orders' },
    { path: '/menu', icon: MenuSquare, label: 'Menu Editor' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="app-container" data-theme="dark">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="modal-overlay" 
          style={{ zIndex: 40 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">K</div>
          <div className="logo-text">KaleDash</div>
          <button className="btn-icon" style={{ marginLeft: 'auto', display: 'none' }} onClick={toggleSidebar}>
            <X size={20} />
          </button>
        </div>

        <nav className="nav-links">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="nav-link-icon" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar">A</div>
            <div className="user-info">
              <span className="user-name">Admin User</span>
              <span className="user-role">Super Admin</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button className="btn-icon" onClick={toggleSidebar} style={{ display: 'none' /* Will manage with media queries later */ }}>
              <Menu size={20} />
            </button>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Search..." 
                style={{ paddingLeft: '36px', width: '280px', borderRadius: 'var(--radius-full)' }} 
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button className="btn-icon" style={{ position: 'relative' }}>
              <Bell size={20} />
              <span style={{ 
                position: 'absolute', top: '6px', right: '8px', 
                width: '8px', height: '8px', backgroundColor: 'var(--danger)', borderRadius: '50%' 
              }} />
            </button>
          </div>
        </header>

        <div className="page-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
