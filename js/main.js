/* ===== main.js — App Controller ===== */

/* ---------- Router ---------- */
const Router = (() => {
  const pages = {};

  function register(name, initFn) { pages[name] = initFn; }

  function go(name, param) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.bottom-nav-item').forEach(b => b.classList.remove('active'));
    const page = document.getElementById('page-' + name);
    if (page) page.classList.add('active');
    const navBtn = document.querySelector(`.bottom-nav-item[data-page="${name}"]`);
    if (navBtn) navBtn.classList.add('active');
    if (pages[name]) pages[name](param);
    window.scrollTo(0, 0);
  }

  return { register, go };
})();

/* ---------- Home Page ---------- */
Router.register('home', async () => {
  const [restaurants, categories, promos, deals] = await Promise.all([
    API.getRestaurants(), API.getCategories(), API.getPromos(), API.getDeals()
  ]);

  // Promo carousel
  const track = document.getElementById('carousel-track');
  const dotsEl = document.getElementById('carousel-dots');
  if (track) {
    track.innerHTML = promos.map(p => `
      <div class="carousel-slide" style="background:${p.bg}">
        <img src="${p.image}" alt="${p.title}" loading="lazy" />
        <div class="slide-overlay">
          <span class="slide-tag">${p.tag}</span>
          <h2 class="slide-title">${p.title}</h2>
          <span class="slide-cta">Order Now →</span>
        </div>
      </div>`).join('');
    dotsEl.innerHTML = promos.map((_, i) =>
      `<div class="carousel-dot${i === 0 ? ' active' : ''}" data-idx="${i}"></div>`).join('');
    initCarousel(promos.length);
  }

  // Categories
  const catEl = document.getElementById('categories-scroll');
  if (catEl) {
    catEl.innerHTML = categories.map(c => `
      <div class="cat-item" data-filter="${c.filter}" id="cat-${c.id}">
        <div class="cat-icon">${c.icon}</div>
        <span class="cat-name">${c.name}</span>
      </div>`).join('');
    catEl.querySelectorAll('.cat-item').forEach(item => {
      item.addEventListener('click', () => {
        catEl.querySelectorAll('.cat-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        const filter = item.dataset.filter;
        const filtered = restaurants.filter(r => r.cuisine.some(c => c.toLowerCase().includes(filter.toLowerCase())));
        renderGrid('featured-restaurants', filtered.length ? filtered : restaurants);
      });
    });
  }

  // Restaurants
  const featured = restaurants.filter(r => r.featured);
  const popular  = [...restaurants].sort((a, b) => b.rating - a.rating);
  renderGrid('featured-restaurants', featured);
  renderGrid('popular-restaurants', popular);

  // Deals
  const dealsEl = document.getElementById('deals-scroll');
  if (dealsEl) {
    dealsEl.innerHTML = deals.map(d => UI.dealCard(d)).join('');
    dealsEl.querySelectorAll('.deal-card').forEach(card => {
      card.addEventListener('click', () => Router.go('restaurant', card.dataset.rid));
    });
  }

  // Flash timer
  initFlashTimer();
});

function renderGrid(elId, restaurants) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.innerHTML = restaurants.map(r => UI.restaurantCard(r)).join('');
  el.querySelectorAll('.rest-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.fav-btn')) return;
      Router.go('restaurant', card.dataset.id);
    });
    const favBtn = card.querySelector('.fav-btn');
    favBtn && favBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      favBtn.classList.toggle('active');
      favBtn.textContent = favBtn.classList.contains('active') ? '♥' : '♡';
      UI.toast(favBtn.classList.contains('active') ? 'Added to favourites ❤️' : 'Removed from favourites');
    });
  });
}

/* ---------- Carousel ---------- */
function initCarousel(count) {
  let cur = 0;
  const track = document.getElementById('carousel-track');
  const dots  = document.querySelectorAll('.carousel-dot');

  function go(idx) {
    cur = (idx + count) % count;
    track.style.transform = `translateX(-${cur * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === cur));
  }

  dots.forEach(d => d.addEventListener('click', () => go(+d.dataset.idx)));
  const auto = setInterval(() => go(cur + 1), 4000);
  track.addEventListener('mouseenter', () => clearInterval(auto));
}

/* ---------- Flash timer ---------- */
function initFlashTimer() {
  const el = document.getElementById('flash-timer');
  if (!el) return;
  let secs = 2 * 3600 + 45 * 60 + 30;
  function tick() {
    const h = String(Math.floor(secs / 3600)).padStart(2, '0');
    const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    el.textContent = `${h}:${m}:${s}`;
    if (secs > 0) secs--;
  }
  tick();
  setInterval(tick, 1000);
}

/* ---------- Restaurant Detail Page ---------- */
Router.register('restaurant', async (id) => {
  const el = document.getElementById('restaurant-detail');
  if (!el) return;
  const r = await API.getRestaurant(id);
  if (!r) { el.innerHTML = '<p style="padding:32px;color:var(--text2)">Restaurant not found.</p>'; return; }

  // Group menu by category
  const categories = [...new Set(r.menu.map(m => m.category))];

  el.innerHTML = `
    <div class="rest-detail-hero">
      <img src="${r.image}" alt="${r.name}" />
      <div class="hero-overlay"></div>
      <button class="rest-detail-back icon-btn" id="back-btn" aria-label="Go back">
        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 19l-7-7 7-7"/></svg>
      </button>
    </div>
    <div class="rest-detail-info">
      <h1 class="rest-detail-name">${r.name}</h1>
      <div class="rest-detail-row">
        <span class="rating">${UI.stars(r.rating)}</span>
        <span>(${r.reviews} reviews)</span>
        <span>·</span>
        <span>🕐 ${r.deliveryTime}</span>
        <span>·</span>
        <span>${UI.currency(r.deliveryFee)} delivery</span>
      </div>
      <div class="rest-detail-row">${r.cuisine.join(' • ')}</div>
    </div>
    <div class="menu-tabs" id="menu-tabs">
      ${categories.map((c, i) => `<button class="menu-tab${i === 0 ? ' active' : ''}" data-cat="${c}">${c}</button>`).join('')}
    </div>
    <div id="menu-list">
      ${categories.map(cat => `
        <p class="menu-section-title">${cat}</p>
        ${r.menu.filter(m => m.category === cat).map(item => `
          <div class="menu-item" data-item-id="${item.id}">
            <div class="menu-item-info">
              <p class="menu-item-name">${item.name}</p>
              <p class="menu-item-desc">${item.desc}</p>
              <p class="menu-item-price">${UI.currency(item.price)}</p>
            </div>
            <img class="menu-item-img" src="${item.image}" alt="${item.name}" loading="lazy" />
            <button class="add-btn" data-item-id="${item.id}" aria-label="Add ${item.name}">+</button>
          </div>`).join('')}
      `).join('')}
    </div>`;

  document.getElementById('back-btn').addEventListener('click', () => Router.go('home'));

  // Tab filter
  document.querySelectorAll('.menu-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.menu-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('.menu-section-title').forEach(title => {
        const section = title.nextElementSibling;
        const show = title.textContent.trim() === tab.dataset.cat;
        title.style.display = show ? '' : 'none';
        let el = title.nextElementSibling;
        while (el && el.classList.contains('menu-item')) {
          el.style.display = show ? '' : 'none';
          el = el.nextElementSibling;
        }
      });
    });
  });

  // Add to cart
  document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const itemId = btn.dataset.itemId;
      const menuItem = r.menu.find(m => m.id === itemId);
      if (!menuItem) return;
      Cart.add({
        id: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        image: menuItem.image,
        restaurantId: r.id,
        restaurantName: r.name
      });
      btn.textContent = '✓';
      btn.style.background = 'var(--green)';
      setTimeout(() => { btn.textContent = '+'; btn.style.background = ''; }, 1200);
    });
  });
});

/* ---------- Cart Page ---------- */
Router.register('cart', () => {
  const el = document.getElementById('cart-content');
  const items = Cart.getItems();

  if (!items.length) {
    el.innerHTML = `
      <p class="cart-title">Your Cart</p>
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <p style="font-weight:700;font-size:18px;margin-bottom:8px">Your cart is empty</p>
        <p style="font-size:14px;margin-bottom:20px">Add items from a restaurant to get started</p>
        <button class="checkout-btn" id="browse-btn" style="max-width:200px;margin:0 auto">Browse Restaurants</button>
      </div>`;
    document.getElementById('browse-btn').addEventListener('click', () => Router.go('home'));
    return;
  }

  const subtotal = Cart.getTotal();
  const delivery = 1.50;
  const service  = +(subtotal * 0.05).toFixed(2);
  const total    = +(subtotal + delivery + service).toFixed(2);

  el.innerHTML = `
    <p class="cart-title">Your Cart</p>
    <div id="cart-items-list">
      ${items.map(i => `
        <div class="cart-item" data-id="${i.id}">
          <img class="cart-item-img" src="${i.image}" alt="${i.name}" loading="lazy" />
          <div class="cart-item-info">
            <p class="cart-item-name">${i.name}</p>
            <p class="cart-item-price">${UI.currency(i.price * i.qty)}</p>
          </div>
          <div class="qty-controls">
            <button class="qty-btn qty-minus" data-id="${i.id}" aria-label="Decrease">−</button>
            <span class="qty-val">${i.qty}</span>
            <button class="qty-btn qty-plus" data-id="${i.id}" aria-label="Increase">+</button>
          </div>
        </div>`).join('')}
    </div>
    <div class="cart-summary">
      <div class="cart-row"><span>Subtotal</span><span>${UI.currency(subtotal)}</span></div>
      <div class="cart-row"><span>Delivery fee</span><span>${UI.currency(delivery)}</span></div>
      <div class="cart-row"><span>Service charge (5%)</span><span>${UI.currency(service)}</span></div>
      <div class="cart-row total"><span>Total</span><span>${UI.currency(total)}</span></div>
    </div>
    <button class="checkout-btn" id="checkout-btn">
      <span>Proceed to Checkout</span><span>${UI.currency(total)}</span>
    </button>`;

  el.querySelectorAll('.qty-plus').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const item = Cart.getItems().find(i => i.id === id);
      if (item) { Cart.setQty(id, item.qty + 1); Router.go('cart'); }
    });
  });

  el.querySelectorAll('.qty-minus').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const item = Cart.getItems().find(i => i.id === id);
      if (item) { Cart.setQty(id, item.qty - 1); Router.go('cart'); }
    });
  });

  document.getElementById('checkout-btn').addEventListener('click', () => {
    UI.toast('🎉 Order placed! Preparing your food…');
    Cart.clear();
    setTimeout(() => Router.go('tracking'), 1000);
  });
});

/* ---------- Orders Page ---------- */
Router.register('orders', async () => {
  const el = document.getElementById('orders-content');
  const orders = await API.getOrders();

  el.innerHTML = `
    <p class="orders-title">My Orders</p>
    ${orders.map(o => `
      <div class="order-card" data-oid="${o.id}">
        <div class="order-card-header">
          <strong>${o.restaurant}</strong>
          <span class="order-status ${o.status === 'ongoing' ? 'status-ongoing' : 'status-delivered'}">
            ${o.status === 'ongoing' ? '🟠 On the way' : '✅ Delivered'}
          </span>
        </div>
        <p class="order-items-preview">${o.items.join(', ')}</p>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <p class="order-total">${UI.currency(o.total)}</p>
          <span style="font-size:12px;color:var(--text2)">${o.date}</span>
        </div>
        ${o.status === 'ongoing' ? `<button class="checkout-btn" style="margin-top:12px;padding:10px 16px;font-size:13px" data-oid="${o.id}">Track Order</button>` : ''}
      </div>`).join('')}`;

  el.querySelectorAll('[data-oid]').forEach(btn => {
    if (btn.tagName === 'BUTTON') {
      btn.addEventListener('click', () => Router.go('tracking', btn.dataset.oid));
    }
  });
});

/* ---------- Tracking Page ---------- */
Router.register('tracking', async (orderId) => {
  const el = document.getElementById('tracking-content');
  const orders = await API.getOrders();
  const order = orders.find(o => o.id === orderId) || orders.find(o => o.status === 'ongoing') || orders[0];

  el.innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;padding:16px 16px 0">
      <button class="icon-btn" id="track-back">
        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 19l-7-7 7-7"/></svg>
      </button>
      <h2 style="font-family:var(--font-display);font-size:20px;font-weight:800">Track Order</h2>
    </div>
    <div style="padding:16px">
      <div class="tracking-map">🗺️
        <div style="position:absolute;bottom:12px;left:12px;background:var(--accent);color:#fff;padding:4px 10px;border-radius:999px;font-size:11px;font-weight:700;z-index:1">Live Tracking</div>
        <div class="rider-dot"></div>
      </div>
      <div style="background:var(--bg2);border-radius:14px;padding:14px;border:1px solid var(--bg4);margin-bottom:16px">
        <p style="font-size:12px;color:var(--text2);margin-bottom:2px">Estimated arrival</p>
        <p style="font-size:20px;font-weight:800;color:var(--accent)">${order.estimatedTime}</p>
        <p style="font-size:13px;color:var(--text2);margin-top:2px">📍 ${order.deliveryAddress}</p>
      </div>
      <div class="tracking-steps">
        ${renderTrackingSteps()}
      </div>
      ${order.rider ? `
        <div class="rider-card">
          <img class="rider-avatar" src="${order.rider.avatar}" alt="${order.rider.name}" />
          <div class="rider-info">
            <p class="rider-name">${order.rider.name}</p>
            <p class="rider-vehicle">${order.rider.vehicle}</p>
          </div>
          <button class="call-rider-btn" aria-label="Call rider">📞</button>
        </div>` : ''}
    </div>`;

  document.getElementById('track-back').addEventListener('click', () => Router.go('orders'));
  animateTrackingDot();
});

function renderTrackingSteps() {
  const steps = [
    { title: 'Order Confirmed', time: 'Today, 12:30 PM', state: 'done' },
    { title: 'Restaurant Preparing', time: 'Today, 12:32 PM', state: 'done' },
    { title: 'Rider Picked Up', time: 'Today, 12:45 PM', state: 'current' },
    { title: 'Out for Delivery', time: 'Estimated 1:05 PM', state: 'pending' },
    { title: 'Delivered', time: 'Estimated 1:15 PM', state: 'pending' }
  ];
  return steps.map((s, i) => `
    <div class="tracking-step">
      <div>
        <div class="step-dot ${s.state === 'done' ? 'done' : s.state === 'current' ? 'current' : ''}">
          ${i < steps.length - 1 ? '<div class="step-line"></div>' : ''}
        </div>
      </div>
      <div class="step-info">
        <p class="step-title" style="${s.state === 'pending' ? 'color:var(--text3)' : ''}">${s.title}</p>
        <p class="step-time">${s.time}</p>
      </div>
    </div>`).join('');
}

function animateTrackingDot() {
  const mapEl = document.querySelector('.tracking-map');
  if (!mapEl) return;
  const dot = document.createElement('div');
  dot.style.cssText = 'position:absolute;width:14px;height:14px;background:var(--accent);border-radius:50%;border:3px solid #fff;box-shadow:0 0 0 4px var(--accent-glow);transition:all 2s ease;z-index:2';
  dot.style.left = '30%'; dot.style.top = '60%';
  mapEl.appendChild(dot);
  setTimeout(() => { dot.style.left = '55%'; dot.style.top = '40%'; }, 500);
  setInterval(() => {
    dot.style.left = (30 + Math.random() * 40) + '%';
    dot.style.top  = (30 + Math.random() * 40) + '%';
  }, 3000);
}

/* ---------- Search ---------- */
function initSearch(restaurants) {
  const input = document.getElementById('search-input');
  const resultsEl = document.getElementById('search-results');

  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    if (!q) { resultsEl.innerHTML = ''; return; }
    const matches = restaurants.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.cuisine.some(c => c.toLowerCase().includes(q)) ||
      r.tags.some(t => t.toLowerCase().includes(q))
    );
    if (!matches.length) {
      resultsEl.innerHTML = '<p style="color:var(--text2);font-size:14px;padding:8px 0">No results found</p>';
      return;
    }
    resultsEl.innerHTML = matches.map(r => `
      <div class="rest-card" data-id="${r.id}" style="margin-bottom:12px;cursor:pointer">
        <div class="rest-card-img" style="max-height:120px">
          <img src="${r.image}" alt="${r.name}" loading="lazy" style="height:120px" />
        </div>
        <div class="rest-card-body">
          <p class="rest-card-name">${r.name}</p>
          <div class="rest-card-meta">
            <span class="rating">${UI.stars(r.rating)}</span>
            <span>· 🕐 ${r.deliveryTime}</span>
          </div>
        </div>
      </div>`).join('');

    resultsEl.querySelectorAll('.rest-card').forEach(card => {
      card.addEventListener('click', () => {
        closeSearch();
        Router.go('restaurant', card.dataset.id);
      });
    });
  });

  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      input.value = chip.dataset.query;
      input.dispatchEvent(new Event('input'));
    });
  });
}

function openSearch() {
  document.getElementById('search-overlay').classList.remove('hidden');
  document.getElementById('search-input').focus();
}

function closeSearch() {
  document.getElementById('search-overlay').classList.add('hidden');
  document.getElementById('search-input').value = '';
  document.getElementById('search-results').innerHTML = '';
}

/* ---------- Sidebar ---------- */
function openSidebar() {
  document.getElementById('sidebar').classList.remove('hidden');
  document.getElementById('sidebar-overlay').classList.remove('hidden');
}

function closeSidebar() {
  document.getElementById('sidebar').classList.add('hidden');
  document.getElementById('sidebar-overlay').classList.add('hidden');
}

/* ---------- Delivery Toggle ---------- */
function initDeliveryToggle() {
  const indicator = document.querySelector('.toggle-indicator');
  document.getElementById('toggle-delivery').addEventListener('click', function () {
    this.classList.add('active');
    document.getElementById('toggle-pickup').classList.remove('active');
    indicator.classList.remove('right');
  });
  document.getElementById('toggle-pickup').addEventListener('click', function () {
    this.classList.add('active');
    document.getElementById('toggle-delivery').classList.remove('active');
    indicator.classList.add('right');
    UI.toast('Pickup mode selected');
  });
}

/* ---------- Bootstrap ---------- */
async function init() {
  // Hide splash after short delay
  setTimeout(() => {
    const splash = document.getElementById('splash-screen');
    splash.classList.add('fade-out');
    setTimeout(() => splash.classList.add('hidden'), 500);
    document.getElementById('app').classList.remove('hidden');
  }, 1800);

  Cart.init();

  const restaurants = await API.getRestaurants();

  // Nav events
  document.querySelectorAll('.bottom-nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = btn.dataset.page;
      if (page === 'search') { openSearch(); return; }
      Router.go(page);
    });
  });

  document.getElementById('search-btn').addEventListener('click', openSearch);
  document.getElementById('search-close').addEventListener('click', closeSearch);
  document.getElementById('cart-btn').addEventListener('click', () => Router.go('cart'));
  document.getElementById('menu-btn').addEventListener('click', openSidebar);
  document.getElementById('sidebar-overlay').addEventListener('click', closeSidebar);

  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      closeSidebar();
      const page = link.dataset.page;
      Router.go(page);
    });
  });

  initSearch(restaurants);
  initDeliveryToggle();

  // Start on home
  Router.go('home');
}

document.addEventListener('DOMContentLoaded', init);
