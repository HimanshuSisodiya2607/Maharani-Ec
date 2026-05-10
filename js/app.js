/**
 * MAHARANI - Luxury Rajasthani Heritage Couture
 * Main JavaScript Application
 */

// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function() {
  init();
});

function init() {
  // Initialize all components
  initLoading();
  initNavigation();
  initScrollReveal();
  initSearch();
  initSmoothScroll();
  initParallax();

  // Hide loading after initialization
  setTimeout(() => {
    const loading = document.getElementById('loading');
    if (loading) {
      loading.classList.add('hidden');
    }
  }, 3500);
}

// ===== LOADING ANIMATION =====
function initLoading() {
  // Loading animation is handled by CSS
  // This function can be extended for additional loading logic
}

// ===== NAVIGATION =====
function initNavigation() {
  const navbar = document.querySelector('.navbar');
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const searchBtn = document.getElementById('search-btn');
  const searchOverlay = document.getElementById('search-overlay');
  const searchClose = document.getElementById('search-close');

  // Navbar scroll effect
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScrollY = currentScrollY;
  });

  // Mobile menu toggle
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isActive = mobileMenu.classList.contains('active');
      menuBtn.classList.toggle('active');
      mobileMenu.classList.toggle('active');

      // Prevent body scroll when menu is open
      document.body.style.overflow = isActive ? 'auto' : 'hidden';
    });

    // Close mobile menu when clicking outside
    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) {
        menuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
  }

  // Search overlay
  if (searchBtn && searchOverlay) {
    searchBtn.addEventListener('click', () => {
      searchOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';

      // Focus search input
      const searchInput = document.getElementById('search-input');
      if (searchInput) {
        setTimeout(() => searchInput.focus(), 300);
      }
    });

    if (searchClose) {
      searchClose.addEventListener('click', () => {
        searchOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
      });
    }

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
        searchOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
  }

  // Close overlays on resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      if (mobileMenu) mobileMenu.classList.remove('active');
      if (menuBtn) menuBtn.classList.remove('active');
      if (searchOverlay) searchOverlay.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  });
}

// ===== SCROLL REVEAL =====
function initScrollReveal() {
  const revealElements = document.querySelectorAll('[data-reveal]');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });
}

// ===== SEARCH FUNCTIONALITY =====
function initSearch() {
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');

  if (!searchInput || !searchResults) return;

  let searchTimeout;

  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    const query = e.target.value.trim().toLowerCase();

    if (query.length < 2) {
      searchResults.innerHTML = '';
      return;
    }

    searchTimeout = setTimeout(() => {
      performSearch(query);
    }, 300);
  });

  function performSearch(query) {
    // Mock search results - in a real app, this would call an API
    const mockResults = [
      { title: 'Royal Lehenga', type: 'Product', url: 'pages/product-detail.html?id=lehenga' },
      { title: 'Bridal Collection', type: 'Collection', url: 'pages/collections.html#bridal' },
      { title: 'Zardozi Collection', type: 'Collection', url: 'pages/collections.html#zardozi' },
      { title: 'Heritage Saree', type: 'Product', url: 'pages/product-detail.html?id=saree' },
    ].filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.type.toLowerCase().includes(query)
    );

    displaySearchResults(mockResults);
  }

  function displaySearchResults(results) {
    if (results.length === 0) {
      searchResults.innerHTML = '<div class="search-no-results">No results found</div>';
      return;
    }

    const resultsHTML = results.map(result => `
      <a href="${result.url}" class="search-result-item">
        <div class="search-result-title">${result.title}</div>
        <div class="search-result-type">${result.type}</div>
      </a>
    `).join('');

    searchResults.innerHTML = resultsHTML;
  }
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();

      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerOffset = 100;
        const elementPosition = target.offsetTop;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Smooth scroll for hero scroll indicator
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      const nextSection = document.querySelector('.featured-collections');
      if (nextSection) {
        const headerOffset = 100;
        const elementPosition = nextSection.offsetTop;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  }
}

// ===== PARALLAX EFFECTS =====
function initParallax() {
  const heroSection = document.querySelector('.hero-section');
  const heroVideo = document.querySelector('.hero-video');
  const heroFallback = document.querySelector('.hero-fallback img');
  const heroPanel = document.querySelector('.hero-panel');
  const parallaxElements = document.querySelectorAll('.collection-image img, .product-image img, .story-image img, .category-banner img, .gallery-item img');

  let latestScroll = window.pageYOffset;
  let ticking = false;

  const updateParallax = () => {
    const scrolled = latestScroll;

    if (heroVideo) {
      heroVideo.style.transform = `translateY(${scrolled * 0.12}px) scale(1.05)`;
    }
    if (heroFallback) {
      heroFallback.style.transform = `translateY(${scrolled * 0.12}px) scale(1.05)`;
    }
    if (heroPanel) {
      heroPanel.style.transform = `translateY(${scrolled * 0.02}px)`;
    }

    parallaxElements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const elementTop = rect.top + scrolled;
      const elementHeight = rect.height;

      if (scrolled + window.innerHeight > elementTop && scrolled < elementTop + elementHeight) {
        const rate = (scrolled - elementTop) * 0.08;
        element.style.transform = `translateY(${rate}px) scale(1.05)`;
      }
    });

    ticking = false;
  };

  const onScroll = () => {
    latestScroll = window.pageYOffset;
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll);
  updateParallax();
}

// ===== UTILITY FUNCTIONS =====

// Debounce function for performance optimization
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for performance optimization
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

// ===== PERFORMANCE OPTIMIZATION =====

// Lazy load images
function initLazyLoading() {
  const images = document.querySelectorAll('img[loading="lazy"]');

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for browsers without IntersectionObserver
    images.forEach(img => {
      img.src = img.dataset.src || img.src;
    });
  }
}

// ===== CART FUNCTIONALITY =====
class CartManager {
  constructor() {
    this.cart = this.loadCart();
    this.updateCartDisplay();
  }

  loadCart() {
    const cart = localStorage.getItem('maharani-cart');
    return cart ? JSON.parse(cart) : [];
  }

  saveCart() {
    localStorage.setItem('maharani-cart', JSON.stringify(this.cart));
    this.updateCartDisplay();
  }

  addItem(item) {
    const existingItem = this.cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cart.push({ ...item, quantity: 1 });
    }
    this.saveCart();
  }

  removeItem(itemId) {
    this.cart = this.cart.filter(item => item.id !== itemId);
    this.saveCart();
  }

  updateQuantity(itemId, quantity) {
    const item = this.cart.find(item => item.id === itemId);
    if (item) {
      item.quantity = Math.max(0, quantity);
      if (item.quantity === 0) {
        this.removeItem(itemId);
      } else {
        this.saveCart();
      }
    }
  }

  getTotal() {
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getItemCount() {
    return this.cart.reduce((count, item) => count + item.quantity, 0);
  }

  updateCartDisplay() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
      const count = this.getItemCount();
      cartCount.textContent = count;
      cartCount.style.display = count > 0 ? 'flex' : 'none';
    }
  }
}

// Initialize cart when DOM is ready
let cartManager;
document.addEventListener('DOMContentLoaded', () => {
  cartManager = new CartManager();
});

// ===== WISHLIST FUNCTIONALITY =====
class WishlistManager {
  constructor() {
    this.wishlist = this.loadWishlist();
    this.updateWishlistDisplay();
  }

  loadWishlist() {
    const wishlist = localStorage.getItem('maharani-wishlist');
    return wishlist ? JSON.parse(wishlist) : [];
  }

  saveWishlist() {
    localStorage.setItem('maharani-wishlist', JSON.stringify(this.wishlist));
    this.updateWishlistDisplay();
  }

  addItem(item) {
    if (!this.wishlist.find(wishlistItem => wishlistItem.id === item.id)) {
      this.wishlist.push(item);
      this.saveWishlist();
    }
  }

  removeItem(itemId) {
    this.wishlist = this.wishlist.filter(item => item.id !== itemId);
    this.saveWishlist();
  }

  isInWishlist(itemId) {
    return this.wishlist.some(item => item.id === itemId);
  }

  updateWishlistDisplay() {
    // Update wishlist buttons
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
      const itemId = btn.dataset.itemId;
      if (itemId && this.isInWishlist(itemId)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
}

// Initialize wishlist when DOM is ready
let wishlistManager;
document.addEventListener('DOMContentLoaded', () => {
  wishlistManager = new WishlistManager();

  // Add wishlist button event listeners
  document.addEventListener('click', (e) => {
    if (e.target.closest('.wishlist-btn')) {
      e.preventDefault();
      const btn = e.target.closest('.wishlist-btn');
      const itemId = btn.dataset.itemId;
      const itemData = btn.dataset.item;

      if (itemId) {
        if (wishlistManager.isInWishlist(itemId)) {
          wishlistManager.removeItem(itemId);
        } else {
          if (itemData) {
            wishlistManager.addItem(JSON.parse(itemData));
          }
        }
      }
    }
  });
});

// ===== ANALYTICS & TRACKING =====
// Basic event tracking for user interactions
function trackEvent(eventName, eventData = {}) {
  // In a real application, this would send data to analytics service
  console.log('Event tracked:', eventName, eventData);

  // Example: Google Analytics
  // if (typeof gtag !== 'undefined') {
  //   gtag('event', eventName, eventData);
  // }
}

// Track page views
document.addEventListener('DOMContentLoaded', () => {
  trackEvent('page_view', {
    page_title: document.title,
    page_location: window.location.href
  });
});

// Track button clicks
document.addEventListener('click', (e) => {
  const target = e.target.closest('a, button');
  if (target) {
    const eventData = {
      element_type: target.tagName.toLowerCase(),
      element_text: target.textContent.trim(),
      element_href: target.href || null
    };

    if (target.classList.contains('cta-primary')) {
      trackEvent('cta_click', { ...eventData, cta_type: 'primary' });
    } else if (target.classList.contains('cta-secondary')) {
      trackEvent('cta_click', { ...eventData, cta_type: 'secondary' });
    } else if (target.classList.contains('product-link')) {
      trackEvent('product_click', eventData);
    }
  }
});

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
  console.error('JavaScript error:', e.error);
  // In production, send error to logging service
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
  // In production, send error to logging service
});

// ===== ACCESSIBILITY =====

// Keyboard navigation for mobile menu
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    // Close any open overlays
    const mobileMenu = document.getElementById('mobile-menu');
    const searchOverlay = document.getElementById('search-overlay');

    if (mobileMenu && mobileMenu.classList.contains('active')) {
      document.getElementById('menu-btn').click();
    }

    if (searchOverlay && searchOverlay.classList.contains('active')) {
      searchOverlay.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  }
});

// Focus management
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  element.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  });
}

// Apply focus trap to search overlay
document.addEventListener('DOMContentLoaded', () => {
  const searchOverlay = document.getElementById('search-overlay');
  if (searchOverlay) {
    trapFocus(searchOverlay);
  }
});

// ===== PERFORMANCE MONITORING =====
function initPerformanceMonitoring() {
  // Monitor Core Web Vitals
  if ('web-vitals' in window) {
    // In a real app, import web-vitals library
    // import {onCLS, onFID, onFCP, onLCP, onTTFB} from 'web-vitals';
  }

  // Monitor page load performance
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      if (perfData) {
        trackEvent('performance', {
          load_time: perfData.loadEventEnd - perfData.loadEventStart,
          dom_content_loaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart
        });
      }
    }, 0);
  });
}

// Initialize performance monitoring
initPerformanceMonitoring();

// ===== EXPORT FOR MODULE USAGE =====
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CartManager,
    WishlistManager,
    init,
    trackEvent
  };
}