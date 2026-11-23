/**
 * Half Moon Yemeni Restaurant - Interactive Features
 * Location: Shop 1, 168-172 Merrylands Road, Merrylands NSW 2160, Sydney
 * Features:
 * - Live Opening Hours Indicator (Sydney Timezone Aware - 11:00 AM to 11:00 PM Daily)
 * - Accessible Menu Category Filter (with mobile horizontal scroll)
 * - Mobile Navigation Drawer Toggle
 * - Mobile Delivery Platform Modal (Uber Eats & DoorDash)
 * - Keyboard & Screen Reader Accessibility
 */

document.addEventListener('DOMContentLoaded', () => {
  initLiveHoursStatus();
  initMenuFilter();
  initMobileNav();
  initOrderModal();
});

/* ==========================================================================
   1. LIVE OPEN / CLOSED STATUS (SYDNEY LOCAL TIME - 11 AM TO 11 PM DAILY)
   ========================================================================== */
function initLiveHoursStatus() {
  const statusContainer = document.getElementById('live-status-pill');
  if (!statusContainer) return;

  function updateStatus() {
    try {
      // Get current date/time in Sydney, Australia timezone
      const now = new Date();
      const sydneyTimeStr = now.toLocaleString('en-US', { timeZone: 'Australia/Sydney' });
      const sydneyDate = new Date(sydneyTimeStr);

      const hours = sydneyDate.getHours();
      const minutes = sydneyDate.getMinutes();
      const currentDecimalTime = hours + minutes / 60;

      // Trading Schedule: 11:00 AM to 11:00 PM every single day (Monday to Sunday)
      const openTime = 11.0;
      const closeTime = 23.0; // 11:00 PM
      const closeTimeLabel = "11:00 PM";

      const isOpen = currentDecimalTime >= openTime && currentDecimalTime < closeTime;

      if (isOpen) {
        statusContainer.innerHTML = `
          <span class="status-dot" aria-hidden="true"></span>
          <span>Open Now</span>
        `;
        statusContainer.setAttribute('title', 'Half Moon is open today 11:00 AM – 11:00 PM');
      } else {
        statusContainer.innerHTML = `
          <span class="status-dot closed" aria-hidden="true"></span>
          <span>Closed</span>
        `;
        statusContainer.setAttribute('title', 'Half Moon opens at 11:00 AM');
      }
    } catch (e) {
      console.warn('Status calculator fallback:', e);
      statusContainer.innerHTML = `
        <span class="status-dot" aria-hidden="true"></span>
        <span>Open Now</span>
      `;
    }
  }

  // Update immediately and refresh every 60 seconds
  updateStatus();
  setInterval(updateStatus, 60000);
}

/* ==========================================================================
   2. ACCESSIBLE MENU FILTER TABS
   ========================================================================== */
function initMenuFilter() {
  const tabs = document.querySelectorAll('.menu-tab-btn');
  const items = document.querySelectorAll('.menu-card');

  if (!tabs.length || !items.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const category = tab.getAttribute('data-filter');

      // Update active states
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Filter cards
      items.forEach(card => {
        const itemCategory = card.getAttribute('data-category');
        if (category === 'all' || itemCategory === category) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   3. MOBILE NAVIGATION DRAWER TOGGLE
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const closeBtn = document.querySelector('.drawer-close-btn');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !drawer) return;

  function openDrawer() {
    toggleBtn.setAttribute('aria-expanded', 'true');
    drawer.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    toggleBtn.setAttribute('aria-expanded', 'false');
    drawer.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeDrawer);
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('active')) {
      closeDrawer();
    }
  });
}

/* ==========================================================================
   4. DELIVERY PLATFORM MODAL (UBER EATS & DOORDASH)
   ========================================================================== */
function initOrderModal() {
  const modal = document.getElementById('delivery-modal');
  const openButtons = document.querySelectorAll('.open-order-modal');
  const closeButtons = document.querySelectorAll('.close-order-modal');

  if (!modal) return;

  function openModal(e) {
    if (e) e.preventDefault();
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openButtons.forEach(btn => btn.addEventListener('click', openModal));
  closeButtons.forEach(btn => btn.addEventListener('click', closeModal));

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}
