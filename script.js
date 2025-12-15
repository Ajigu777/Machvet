// Dynamically load Bootstrap bundle (if needed) then initialize carousels and mobile pop behavior.

(function () {
  const BOOTSTRAP_URL = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js';

  function initCarouselsAndHandlers() {
    try {
      // initialize hero/about carousel if present
      const heroEl = document.getElementById('aboutHeroCarousel');
      if (heroEl && window.bootstrap && typeof window.bootstrap.Carousel === 'function') {
        const heroCarousel = new bootstrap.Carousel(heroEl, { interval: 4000, ride: 'carousel' });
        if (heroCarousel && typeof heroCarousel.cycle === 'function') heroCarousel.cycle();
      }

      // mobile products carousel pop behavior (if you still use it)
      const mobileCarousel = document.getElementById('mobileProductsCarousel');
      if (mobileCarousel && window.bootstrap) {
        if (!mobileCarousel._bsCarousel && typeof bootstrap.Carousel === 'function') {
          // eslint-disable-next-line no-new
          new bootstrap.Carousel(mobileCarousel, { interval: 3000, ride: false });
        }

        const applyPop = () => {
          const activeCard = mobileCarousel.querySelector('.carousel-item.active .card');
          if (!activeCard) return;
          activeCard.classList.remove('card-pop');
          void activeCard.offsetWidth;
          activeCard.classList.add('card-pop');
        };

        mobileCarousel.addEventListener('slide.bs.carousel', () => {
          const outgoing = mobileCarousel.querySelector('.carousel-item.active .card');
          if (outgoing) outgoing.classList.remove('card-pop');
        });

        mobileCarousel.addEventListener('slid.bs.carousel', applyPop);

        window.setTimeout(() => {
          try { applyPop(); } catch (e) { /* ignore */ }
        }, 120);
      }

      // Booking form -> send booking message to WhatsApp
      const bookingForm = document.querySelector('#contact form');
      if (bookingForm) {
        bookingForm.addEventListener('submit', function (e) {
          e.preventDefault();

          const form = e.target;
          const name = (form.querySelector('[name="name"]')?.value || '').trim();
          const phone = (form.querySelector('[name="phone"]')?.value || '').trim();
          const service = (form.querySelector('[name="service"]')?.value || '').trim();
          const location = (form.querySelector('[name="location"]')?.value || '').trim();
          const date = (form.querySelector('[name="date"]')?.value || '').trim();

          // basic validation
          if (!name || !phone) {
            alert('Please enter your name and phone number.');
            return;
          }

          // TODO: replace with your WhatsApp number in international format (no +, no spaces)
          // using provided local number 0803455312 -> international format (Nigeria): 234803455312
          const whatsappNumber = '234803455312';

          const rawMessage =
            `Hello MACHVET team,\n\n` +
            `I would like to request a booking. Please find the details below:\n\n` +
            `• Name: ${name}\n` +
            `• Phone: ${phone}\n` +
            `• Service requested: ${service || 'Not specified'}\n` +
            `• Location: ${location || 'Not specified'}\n` +
            `• Preferred date: ${date || 'Not specified'}\n\n` +
            `Kindly confirm availability and any next steps. Thank you.\n\n` +
            `Best regards,\n${name}`;

          const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(rawMessage)}`;

          // open WhatsApp in new tab/window
          window.open(waUrl, '_blank');

          // optional: reset the form or provide UI feedback
          // form.reset();
        });
      }

    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('initCarouselsAndHandlers error:', err);
    }
  }

  function loadBootstrapThenInit() {
    if (window.bootstrap && typeof window.bootstrap.Carousel === 'function') {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCarouselsAndHandlers);
      } else {
        initCarouselsAndHandlers();
      }
      return;
    }

    const s = document.createElement('script');
    s.src = BOOTSTRAP_URL;
    s.async = true;
    s.onload = function () {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCarouselsAndHandlers);
      } else {
        initCarouselsAndHandlers();
      }
    };
    s.onerror = function () {
      // eslint-disable-next-line no-console
      console.error('Failed to load Bootstrap from', BOOTSTRAP_URL);
    };
    document.head.appendChild(s);
  }

  loadBootstrapThenInit();
})();