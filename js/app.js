// ===== PRODUCT DATABASE =====
const PRODUCTS = [
  {
    id: 'lehenga',
    name: 'Royal Lehenga',
    meta: 'Velvet zardozi · 22k gold thread',
    price: 185000,
    priceFormatted: '₹1,85,000',
    category: 'lehenga',
    badge: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=90',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=90',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=90',
      'https://images.unsplash.com/photo-1620890461431-e981e90d6af6?w=800&q=90',
    ],
    description: 'This exquisite lehenga is a masterpiece of Rajasthani craftsmanship, featuring intricate zardozi embroidery with 22k gold threads. The deep red velvet base symbolizes prosperity and passion, perfect for royal weddings. Handcrafted by master artisans with centuries of tradition.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 'saree',
    name: 'Heritage Saree',
    meta: 'Handloom Banarasi · tissue pallu',
    price: 95000,
    priceFormatted: '₹95,000',
    category: 'saree',
    badge: 'New Arrival',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=90',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=90',
      'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800&q=90',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=90',
    ],
    description: 'A heritage masterpiece woven on handlooms in Varanasi, this Banarasi saree features a luxurious tissue pallu adorned with traditional motifs. Each thread tells a story of centuries-old weaving tradition, making this piece a true heirloom.',
    sizes: ['Free Size'],
  },
  {
    id: 'dupatta',
    name: 'Rani Haar Dupatta',
    meta: 'Organza · pearl and gold border',
    price: 145000,
    priceFormatted: '₹1,45,000',
    category: 'dupatta',
    badge: null,
    image: 'https://images.unsplash.com/photo-1620890461431-e981e90d6af6?w=800&q=90',
    images: [
      'https://images.unsplash.com/photo-1620890461431-e981e90d6af6?w=800&q=90',
      'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800&q=90',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=90',
    ],
    description: 'The Rani Haar Dupatta is a statement piece of unparalleled elegance. Crafted from the finest organza silk, it features an intricate hand-stitched border of seed pearls and 22k gold thread. A versatile piece that completes any royal ensemble.',
    sizes: ['Free Size'],
  },
  {
    id: 'ensemble',
    name: 'Suryagarh Ensemble',
    meta: 'Gajji silk bandhani · couture fit',
    price: 220000,
    priceFormatted: '₹2,20,000',
    category: 'ensemble',
    badge: 'Limited Edition',
    image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&q=90',
    images: [
      'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&q=90',
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=90',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=90',
    ],
    description: 'The Suryagarh Ensemble embodies the spirit of the Thar desert at golden hour. Crafted from the finest Gajji silk with traditional bandhani tie-dye technique, this piece is a celebration of Rajasthani artistry. The couture fit ensures a silhouette that flatters every form.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
];

// ===== CART MANAGER =====
class CartManager {
  constructor() {
    this.cart = this._load();
    this._syncBadge();
  }

  _load() {
    try { return JSON.parse(localStorage.getItem('maharani-cart')) || []; }
    catch { return []; }
  }

  _save() {
    localStorage.setItem('maharani-cart', JSON.stringify(this.cart));
    this._syncBadge();
  }

  _syncBadge() {
    const el = document.querySelector('.cart-count');
    if (!el) return;
    const count = this.cart.reduce((s, i) => s + i.qty, 0);
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  }

  add(product, size, qty = 1) {
    const key = `${product.id}__${size}`;
    const existing = this.cart.find(i => i.key === key);
    if (existing) {
      existing.qty += qty;
    } else {
      this.cart.push({ key, id: product.id, name: product.name, meta: product.meta, size, priceFormatted: product.priceFormatted, price: product.price, image: product.image, qty });
    }
    this._save();
  }

  remove(key) {
    this.cart = this.cart.filter(i => i.key !== key);
    this._save();
  }

  updateQty(key, qty) {
    const item = this.cart.find(i => i.key === key);
    if (!item) return;
    if (qty <= 0) { this.remove(key); return; }
    item.qty = qty;
    this._save();
  }

  total() {
    return this.cart.reduce((s, i) => s + i.price * i.qty, 0);
  }

  totalFormatted() {
    return '₹' + this.total().toLocaleString('en-IN');
  }
}

// ===== WISHLIST MANAGER =====
class WishlistManager {
  constructor() {
    this.list = this._load();
  }

  _load() {
    try { return JSON.parse(localStorage.getItem('maharani-wishlist')) || []; }
    catch { return []; }
  }

  _save() {
    localStorage.setItem('maharani-wishlist', JSON.stringify(this.list));
  }

  has(id) { return this.list.some(i => i.id === id); }

  toggle(product) {
    if (this.has(product.id)) {
      this.list = this.list.filter(i => i.id !== product.id);
    } else {
      this.list.push({ id: product.id, name: product.name, meta: product.meta, priceFormatted: product.priceFormatted, price: product.price, image: product.image });
    }
    this._save();
    return this.has(product.id);
  }

  remove(id) {
    this.list = this.list.filter(i => i.id !== id);
    this._save();
  }
}

// ===== LINKS (resolved from data-root on body) =====
let LINKS = {};

function computeLinks() {
  const root = document.body.dataset.root || '';
  const prefix = root === '../' ? '' : 'pages/';
  LINKS = {
    home:          root + 'index.html',
    shop:          prefix + 'shop.html',
    productDetail: prefix + 'product-detail.html',
  };
}

// ===== NAV =====
function initNav() {
  const navbar      = document.querySelector('.navbar');
  const menuBtn     = document.getElementById('menu-btn');
  const mobileMenu  = document.getElementById('mobile-menu');
  const searchBtn   = document.getElementById('search-btn');
  const searchOverlay = document.getElementById('search-overlay');
  const searchClose = document.getElementById('search-close');

  window.addEventListener('scroll', () => {
    navbar && navbar.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('active');
      menuBtn.classList.toggle('active', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobileMenu.addEventListener('click', e => {
      if (e.target === mobileMenu) closeMenu();
    });
  }

  if (searchBtn && searchOverlay) {
    searchBtn.addEventListener('click', () => {
      searchOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      setTimeout(() => document.getElementById('search-input')?.focus(), 280);
    });
    searchClose?.addEventListener('click', closeSearch);
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeMenu(); closeSearch(); }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) { closeMenu(); closeSearch(); }
  }, { passive: true });

  function closeMenu() {
    mobileMenu?.classList.remove('active');
    menuBtn?.classList.remove('active');
    document.body.style.overflow = '';
  }
  function closeSearch() {
    searchOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  const searchInput   = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  if (searchInput && searchResults) {
    let t;
    searchInput.addEventListener('input', () => {
      clearTimeout(t);
      const q = searchInput.value.trim().toLowerCase();
      if (q.length < 2) { searchResults.innerHTML = ''; return; }
      t = setTimeout(() => {
        const hits = PRODUCTS.filter(p => p.name.toLowerCase().includes(q) || p.category.includes(q));
        searchResults.innerHTML = hits.length
          ? hits.map(p => `<a href="${LINKS.productDetail}?id=${p.id}" class="search-result-item"><div class="search-result-title">${p.name}</div><div class="search-result-type">${p.priceFormatted}</div></a>`).join('')
          : '<div class="search-no-results">No results found</div>';
      }, 280);
    });
  }
}

function initScrollReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('[data-reveal]').forEach(el => obs.observe(el));
}

function initLoading() {
  const overlay = document.getElementById('loading');
  if (!overlay) return;
  setTimeout(() => overlay.classList.add('hidden'), 2800);
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 100, behavior: 'smooth' });
    });
  });
}

// ===== SHOP PAGE =====
function initShopPage() {
  const grid = document.getElementById('shop-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (!grid) return;

  bindWishlistBtns(grid);

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const active = btn.dataset.filter;
      grid.querySelectorAll('.product-card').forEach(card => {
        card.style.display = (active === 'all' || card.dataset.category === active) ? '' : 'none';
      });
    });
  });
}

// ===== PRODUCT DETAIL PAGE =====
function productCardHTML(product) {
  const wishlisted = wishlist.has(product.id);
  return `
    <article class="product-card" data-id="${product.id}">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <div class="product-overlay">
          <button class="wishlist-btn${wishlisted ? ' wishlisted' : ''}" data-id="${product.id}" aria-label="Add to wishlist">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="${wishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>
        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
      </div>
      <div class="product-info">
        <h3 class="product-title">${product.name}</h3>
        <p class="product-meta">${product.meta}</p>
        <p class="product-price">${product.priceFormatted}</p>
        <a href="${LINKS.productDetail}?id=${product.id}" class="product-link">View Details</a>
      </div>
    </article>`;
}

function initProductDetailPage() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const product = PRODUCTS.find(p => p.id === id);
  const container = document.getElementById('product-detail-root');
  if (!container) return;

  if (!product) {
    container.innerHTML = '<p style="text-align:center;padding:4rem;font-family:var(--font-primary);color:var(--color-gray);">Product not found. <a href="shop.html" style="color:var(--color-gold);">Back to Shop</a></p>';
    return;
  }

  document.title = `${product.name} — MAHARANI`;

  const wishlisted = wishlist.has(product.id);
  const sizeBtns = product.sizes.map((s, i) =>
    `<button class="size-btn${i === 0 ? ' active' : ''}" data-size="${s}">${s}</button>`
  ).join('');

  const thumbs = product.images.map((img, i) =>
    `<div class="product-thumb${i === 0 ? ' active' : ''}" data-index="${i}"><img src="${img.replace('w=800', 'w=200')}" alt="${product.name} view ${i + 1}" loading="lazy"></div>`
  ).join('');

  container.innerHTML = `
    <div class="product-detail-container">
      <div class="product-gallery-wrap">
        <div class="product-gallery-main" id="main-img-wrap">
          <img id="main-img" src="${product.images[0]}" alt="${product.name}">
        </div>
        <div class="product-thumbs">${thumbs}</div>
      </div>
      <div class="product-detail-info">
        <nav class="product-breadcrumb">
          <a href="${LINKS.home}">Home</a><span>/</span>
          <a href="${LINKS.shop}">Shop</a><span>/</span>
          <span>${product.name}</span>
        </nav>
        ${product.badge ? `<span class="product-detail-badge">${product.badge}</span>` : ''}
        <h1 class="product-detail-name">${product.name}</h1>
        <p class="product-detail-meta">${product.meta}</p>
        <p class="product-detail-price">${product.priceFormatted}</p>
        <div class="product-detail-divider"></div>
        <p class="product-detail-desc">${product.description}</p>
        <label class="size-label">Select Size</label>
        <div class="size-options" id="size-options">${sizeBtns}</div>
        <div class="product-detail-actions">
          <button class="btn-add-cart" id="add-to-cart-btn">Add to Cart</button>
          <button class="btn-wishlist-detail${wishlisted ? ' wishlisted' : ''}" id="detail-wish-btn" aria-label="Add to wishlist">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="${wishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>
        <div class="product-detail-perks">
          <span class="perk-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12l5 5L20 7"/></svg> Free white-glove delivery</span>
          <span class="perk-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12l5 5L20 7"/></svg> Lifetime authenticity cert.</span>
          <span class="perk-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12l5 5L20 7"/></svg> Custom fit available</span>
          <span class="perk-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12l5 5L20 7"/></svg> 30-day easy returns</span>
        </div>
      </div>
    </div>`;

  const mainImg = document.getElementById('main-img');
  container.querySelectorAll('.product-thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      container.querySelectorAll('.product-thumb').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      mainImg.src = product.images[parseInt(thumb.dataset.index)];
    });
  });

  let selectedSize = product.sizes[0];
  container.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedSize = btn.dataset.size;
    });
  });

  document.getElementById('add-to-cart-btn').addEventListener('click', () => {
    cart.add(product, selectedSize);
    showToast(`${product.name} added to cart`);
  });

  document.getElementById('detail-wish-btn').addEventListener('click', function () {
    const inWish = wishlist.toggle(product);
    this.classList.toggle('wishlisted', inWish);
    this.querySelector('svg').setAttribute('fill', inWish ? 'currentColor' : 'none');
    showToast(inWish ? 'Added to wishlist' : 'Removed from wishlist');
  });

  const relatedGrid = document.getElementById('related-grid');
  if (relatedGrid) {
    relatedGrid.innerHTML = PRODUCTS.filter(p => p.id !== product.id).slice(0, 3).map(p => productCardHTML(p)).join('');
    bindWishlistBtns(relatedGrid);
  }
}

// ===== CART PAGE =====
function initCartPage() {
  const itemsEl   = document.getElementById('cart-items');
  const summaryEl = document.getElementById('cart-summary');
  if (!itemsEl) return;

  function render() {
    if (cart.cart.length === 0) {
      itemsEl.innerHTML = `
        <div class="cart-empty-state">
          <h2 class="cart-heading" style="margin-bottom:1rem;">Your cart is empty</h2>
          <p>Discover our luxury couture collections</p>
          <a href="${LINKS.shop}" class="continue-link">Browse Shop →</a>
        </div>`;
      if (summaryEl) summaryEl.style.display = 'none';
      return;
    }

    if (summaryEl) summaryEl.style.display = '';

    itemsEl.innerHTML = cart.cart.map(item => `
      <div class="cart-item-row" data-key="${item.key}">
        <div class="cart-item-img">
          <img src="${item.image.replace('w=800', 'w=300')}" alt="${item.name}">
        </div>
        <div class="cart-item-details">
          <h3 class="cart-item-name">${item.name}</h3>
          <p class="cart-item-meta">${item.meta} · Size: ${item.size}</p>
          <p class="cart-item-price">${item.priceFormatted}</p>
          <div class="qty-control">
            <button class="qty-btn" data-action="dec" data-key="${item.key}">−</button>
            <span class="qty-value">${item.qty}</span>
            <button class="qty-btn" data-action="inc" data-key="${item.key}">+</button>
          </div>
        </div>
        <button class="remove-btn" data-key="${item.key}" aria-label="Remove">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>`).join('');

    if (summaryEl) {
      const subtotal = cart.totalFormatted();
      summaryEl.querySelector('#summary-subtotal').textContent = subtotal;
      summaryEl.querySelector('#summary-total').textContent = subtotal;
    }

    itemsEl.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = cart.cart.find(i => i.key === btn.dataset.key);
        if (!item) return;
        cart.updateQty(btn.dataset.key, item.qty + (btn.dataset.action === 'inc' ? 1 : -1));
        render();
      });
    });

    itemsEl.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', () => { cart.remove(btn.dataset.key); render(); });
    });
  }

  render();
}

// ===== WISHLIST PAGE =====
function initWishlistPage() {
  const grid = document.getElementById('wishlist-grid');
  if (!grid) return;

  function render() {
    if (wishlist.list.length === 0) {
      grid.innerHTML = `
        <div class="wishlist-empty-state" style="grid-column:1/-1">
          <h2 class="section-title" style="font-size:2rem;margin-bottom:1rem;">Your wishlist is empty</h2>
          <p>Save pieces you love and come back to them later.</p>
          <a href="${LINKS.shop}" class="continue-link" style="margin-top:1.5rem;display:inline-flex;">Browse Shop →</a>
        </div>`;
      return;
    }

    grid.innerHTML = wishlist.list.map(item => `
      <article class="product-card" data-id="${item.id}">
        <div class="product-image">
          <img src="${item.image}" alt="${item.name}" loading="lazy">
        </div>
        <div class="product-info">
          <h3 class="product-title">${item.name}</h3>
          <p class="product-meta">${item.meta}</p>
          <p class="product-price">${item.priceFormatted}</p>
        </div>
        <div class="wishlist-card-actions">
          <button class="btn-move-cart" data-id="${item.id}">Move to Cart</button>
          <button class="btn-remove-wish" data-id="${item.id}">Remove</button>
        </div>
      </article>`).join('');

    grid.querySelectorAll('.btn-move-cart').forEach(btn => {
      btn.addEventListener('click', () => {
        const product = PRODUCTS.find(p => p.id === btn.dataset.id);
        if (product) {
          cart.add(product, product.sizes[0]);
          wishlist.remove(btn.dataset.id);
          showToast(`${product.name} moved to cart`);
          render();
        }
      });
    });

    grid.querySelectorAll('.btn-remove-wish').forEach(btn => {
      btn.addEventListener('click', () => { wishlist.remove(btn.dataset.id); render(); });
    });
  }

  render();
}

// ===== WISHLIST BUTTONS ON PRODUCT CARDS =====
function bindWishlistBtns(root) {
  root.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const product = PRODUCTS.find(p => p.id === btn.dataset.id);
      if (!product) return;
      const inWish = wishlist.toggle(product);
      btn.classList.toggle('wishlisted', inWish);
      btn.querySelector('svg').setAttribute('fill', inWish ? 'currentColor' : 'none');
      showToast(inWish ? 'Added to wishlist' : 'Removed from wishlist');
    });
  });
}

// ===== TOAST =====
function showToast(msg) {
  let toast = document.getElementById('maharani-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'maharani-toast';
    toast.style.cssText = `position:fixed;bottom:2rem;left:50%;transform:translateX(-50%) translateY(20px);background:#1a1208;color:#fff;padding:0.85rem 1.75rem;border-radius:999px;font-family:var(--font-primary);font-size:0.85rem;letter-spacing:0.05em;opacity:0;transition:all 0.3s ease;z-index:9999;white-space:nowrap;border:1px solid rgba(212,175,55,0.3);`;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';
  clearTimeout(toast._t);
  toast._t = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
  }, 2600);
}

// ===== HOME PAGE =====
function initHomePage() {
  bindWishlistBtns(document);

  const heroVideo    = document.querySelector('.hero-video');
  const heroFallback = document.querySelector('.hero-fallback img');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.pageYOffset;
        if (heroVideo)    heroVideo.style.transform    = `translateY(${y * 0.1}px) scale(1.05)`;
        if (heroFallback) heroFallback.style.transform = `translateY(${y * 0.1}px) scale(1.05)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// ===== CONTACT PAGE =====
function initContactPage() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    showToast('Message sent — our concierge will be in touch shortly.');
    form.reset();
  });
}

// ===== BOOTSTRAP =====
let cart, wishlist;

document.addEventListener('DOMContentLoaded', () => {
  computeLinks();
  cart     = new CartManager();
  wishlist = new WishlistManager();

  initNav();
  initScrollReveal();
  initSmoothScroll();
  initLoading();

  const page = document.body.dataset.page;
  if (page === 'shop')           initShopPage();
  if (page === 'product-detail') initProductDetailPage();
  if (page === 'cart')           initCartPage();
  if (page === 'wishlist')       initWishlistPage();
  if (page === 'home')           initHomePage();
  if (page === 'contact')        initContactPage();
});
