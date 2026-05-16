/* ===== ui.js — UI helpers ===== */

const UI = (() => {

  /* ---- Toast ---- */
  function toast(msg, duration = 2500) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), duration);
  }

  /* ---- Format currency ---- */
  function currency(amount) {
    return '₵' + Number(amount).toFixed(2);
  }

  /* ---- Star rating string ---- */
  function stars(rating) {
    return '⭐ ' + Number(rating).toFixed(1);
  }

  /* ---- Render a restaurant card ---- */
  function restaurantCard(r) {
    return `
      <div class="rest-card" data-id="${r.id}" tabindex="0" role="button" aria-label="View ${r.name}">
        <div class="rest-card-img">
          <img src="${r.image}" alt="${r.name}" loading="lazy" />
          <div class="rest-card-badges">
            ${r.promo ? `<span class="badge badge-promo">${r.promo}</span>` : ''}
            <span class="badge badge-time">🕐 ${r.deliveryTime}</span>
          </div>
          <button class="fav-btn" data-fav="${r.id}" aria-label="Favourite">♡</button>
        </div>
        <div class="rest-card-body">
          <p class="rest-card-name">${r.name}</p>
          <div class="rest-card-meta">
            <span class="rating">${stars(r.rating)}</span>
            <span>(${r.reviews})</span>
            <span>·</span>
            <span>${UI.currency(r.deliveryFee)} delivery</span>
          </div>
          <div class="rest-card-tags">
            ${r.tags.map(t => `<span class="tag">${t}</span>`).join('')}
          </div>
        </div>
      </div>`;
  }

  /* ---- Render a deal card ---- */
  function dealCard(d) {
    return `
      <div class="deal-card" data-rid="${d.restaurantId}" data-iid="${d.itemId}" role="button" tabindex="0">
        <img class="deal-card-img" src="${d.image}" alt="${d.name}" loading="lazy" />
        <p class="deal-name">${d.name}</p>
        <p class="deal-restaurant">${d.restaurant}</p>
        <div class="deal-prices">
          <span class="deal-old">${currency(d.oldPrice)}</span>
          <span class="deal-new">${currency(d.newPrice)}</span>
        </div>
      </div>`;
  }

  return { toast, currency, stars, restaurantCard, dealCard };
})();
