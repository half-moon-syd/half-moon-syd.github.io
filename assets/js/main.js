/**
 * Half Moon Yemeni Restaurant - Interactive Features
 * Location: Shop 1, 168-172 Merrylands Road, Merrylands NSW 2160, Sydney
 * Features:
 * - Live Opening Hours Indicator (Sydney Timezone Aware)
 * - Accessible Menu Category Filter
 * - Mobile Navigation Drawer Toggle
 * - Keyboard & Screen Reader Accessibility
 */

document.addEventListener('DOMContentLoaded', () => {
  initLiveHoursStatus();
  initMenuFilter();
  initMobileNav();
});

/* ==========================================================================
   1. LIVE OPEN / CLOSED STATUS (SYDNEY LOCAL TIME)
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

      const dayOfWeek = sydneyDate.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
      const hours = sydneyDate.getHours();
      const minutes = sydneyDate.getMinutes();
      const currentDecimalTime = hours + minutes / 60;

      // Define schedule in decimal hours:
      // Mon (1) - Thu (4): 11:00 to 23:00 (11:00 AM - 11:00 PM)
      // Fri (5) - Sat (6): 11:00 to 24:00 (11:00 AM - Midnight)
      // Sun (0): 11:00 to 23.99 (11:00 AM - 11:59 PM)
      let openTime = 11.0;
      let closeTime = 23.0;
      let closeTimeLabel = "11:00 PM";

      if (dayOfWeek === 5 || dayOfWeek === 6) {
        closeTime = 24.0;
        closeTimeLabel = "Midnight";
      } else if (dayOfWeek === 0) {
        closeTime = 23.99;
        closeTimeLabel = "11:59 PM";
      }

      const isOpen = currentDecimalTime >= openTime && currentDecimalTime < closeTime;

      if (isOpen) {
        statusContainer.innerHTML = `
          <span class="status-dot" aria-hidden="true"></span>
          <span>Open Now • Closes ${closeTimeLabel}</span>
        `;
        statusContainer.setAttribute('title', `Half Moon is currently open. Closes at ${closeTimeLabel} Sydney time.`);
      } else {
        statusContainer.innerHTML = `
          <span class="status-dot closed" aria-hidden="true"></span>
          <span>Closed • Opens 11:00 AM</span>
        `;
        statusContainer.setAttribute('title', 'Half Moon is currently closed. Re-opens at 11:00 AM.');
      }
    } catch (e) {
      console.warn('Status calculator fallback:', e);
      statusContainer.innerHTML = `
        <span class="status-dot" aria-hidden="true"></span>
        <span>Open 7 Days • 11 AM 'Til Late</span>
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
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !drawer) return;

  function toggleDrawer() {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', !isExpanded);
    drawer.classList.toggle('active');
    document.body.style.overflow = !isExpanded ? 'hidden' : '';
  }

  toggleBtn.addEventListener('click', toggleDrawer);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (drawer.classList.contains('active')) {
        toggleDrawer();
      }
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('active')) {
      toggleDrawer();
    }
  });
}
