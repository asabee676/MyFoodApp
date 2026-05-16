import { Save } from 'lucide-react';

export function Settings() {
  return (
    <div className="animate-in">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Platform Settings</h1>
        <p style={{ color: 'var(--text-muted)' }}>Configure global platform settings and admin preferences.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="glass-card">
          <h2 style={{ fontSize: '18px', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            General Configuration
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Platform Name</label>
              <input type="text" defaultValue="KaleDash Admin" style={{ width: '100%' }} />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Support Email</label>
              <input type="email" defaultValue="support@kaledash.com" style={{ width: '100%' }} />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Currency</label>
              <select style={{ width: '100%' }}>
                <option value="usd">USD ($)</option>
                <option value="ghs">GHS (GH₵)</option>
                <option value="eur">EUR (€)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="glass-card">
          <h2 style={{ fontSize: '18px', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            Fees & Delivery
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Base Delivery Fee</label>
              <input type="number" defaultValue="5.00" style={{ width: '100%' }} />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Platform Service Fee (%)</label>
              <input type="number" defaultValue="15" style={{ width: '100%' }} />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Max Delivery Radius (km)</label>
              <input type="number" defaultValue="20" style={{ width: '100%' }} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn btn-primary">
          <Save size={18} />
          Save Changes
        </button>
      </div>
    </div>
  );
}
