/* ===== api.js — data fetching wrapper ===== */

const API = (() => {
  let _data = null;

  async function load() {
    if (_data) return _data;
    const res = await fetch('data/sample-restaurants.json');
    _data = await res.json();
    return _data;
  }

  async function getRestaurants() {
    const d = await load();
    return d.restaurants;
  }

  async function getRestaurant(id) {
    const d = await load();
    return d.restaurants.find(r => r.id === id) || null;
  }

  async function getCategories() {
    const d = await load();
    return d.categories;
  }

  async function getPromos() {
    const d = await load();
    return d.promos;
  }

  async function getDeals() {
    const d = await load();
    return d.deals;
  }

  async function getOrders() {
    const d = await load();
    return d.orders;
  }

  return { load, getRestaurants, getRestaurant, getCategories, getPromos, getDeals, getOrders };
})();
