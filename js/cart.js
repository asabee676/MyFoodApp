/* ===== cart.js — Cart state management ===== */

const Cart = (() => {
  const STORAGE_KEY = 'chowdash_cart';

  function _load() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { return []; }
  }

  function _save(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    _updateBadge();
  }

  function _updateBadge() {
    const badge = document.getElementById('cart-badge');
    if (!badge) return;
    const count = getCount();
    badge.textContent = count;
    badge.classList.toggle('hidden', count === 0);
  }

  function getItems() { return _load(); }

  function getCount() {
    return _load().reduce((acc, i) => acc + i.qty, 0);
  }

  function getTotal() {
    return _load().reduce((acc, i) => acc + i.price * i.qty, 0);
  }

  function add(item) {
    // item: { id, name, price, image, restaurantId, restaurantName }
    const items = _load();
    const existing = items.find(i => i.id === item.id);
    if (existing) {
      existing.qty += 1;
    } else {
      items.push({ ...item, qty: 1 });
    }
    _save(items);
    UI.toast(`${item.name} added to cart 🛒`);
  }

  function remove(id) {
    const items = _load().filter(i => i.id !== id);
    _save(items);
  }

  function setQty(id, qty) {
    const items = _load();
    const item = items.find(i => i.id === id);
    if (!item) return;
    if (qty <= 0) { remove(id); return; }
    item.qty = qty;
    _save(items);
  }

  function clear() {
    localStorage.removeItem(STORAGE_KEY);
    _updateBadge();
  }

  function init() { _updateBadge(); }

  return { getItems, getCount, getTotal, add, remove, setQty, clear, init };
})();
