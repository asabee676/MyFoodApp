import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Restaurants } from './pages/Restaurants';
import { Orders } from './pages/Orders';
import { MenuEditor } from './pages/MenuEditor';
import { Settings } from './pages/Settings';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="restaurants" element={<Restaurants />} />
          <Route path="orders" element={<Orders />} />
          <Route path="menu" element={<MenuEditor />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
