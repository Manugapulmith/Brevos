/**
 * Brevos - Main Interactive Controller
 * Smooth scroll, GSAP animations, 3D card tilt, portfolio modal, audio fx & WhatsApp integration
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Smooth Scroll (Lenis with fallback)
  initSmoothScroll();

  // 2. Custom Glowing Cursor (Desktop only)
  initCustomCursor();

  // 3. Audio Synthesizer (Web Audio API - Optional subtle soundscapes)
  initAudioFeedback();

  // 4. GSAP & ScrollTrigger Staggered Reveals
  initScrollAnimations();

  // 5. 3D Tilt on Cards
  initCardTilts();

  // 6. Portfolio Filtering & Modal Preview
  initPortfolio();

  // 7. Pricing Tier Selector & Quick CTA Linking
  initPricingActions();

  // 8. Contact Form & WhatsApp Integration
  initContactForm();

  // 9. Mobile Navigation
  initMobileNav();
});

/* ==========================================================================
   1. Smooth Scroll
   ========================================================================== */
let lenis = null;
function initSmoothScroll() {
  if (typeof Lenis !== 'undefined' && window.innerWidth >= 768) {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
      infinite: false
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync with GSAP ScrollTrigger if available
    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }
  }

  // Smooth anchor navigation
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        if (lenis) {
          lenis.scrollTo(targetElement, { offset: -60 });
        } else {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
        // Close mobile nav if open
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
          toggleMobileNav();
        }
      }
    });
  });
}

/* ==========================================================================
   2. Custom Glowing Cursor
   ========================================================================== */
function initCustomCursor() {
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorGlow = document.querySelector('.cursor-glow');
  if (!cursorDot || !cursorGlow || window.innerWidth < 1024 || 'ontouchstart' in window) {
    if (cursorDot) cursorDot.style.display = 'none';
    if (cursorGlow) cursorGlow.style.display = 'none';
    return;
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let glowX = mouseX;
  let glowY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  }, { passive: true });

  function renderCursor() {
    glowX += (mouseX - glowX) * 0.15;
    glowY += (mouseY - glowY) * 0.15;
    cursorGlow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0)`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Hover states on clickable elements
  const interactiveEls = document.querySelectorAll('a, button, .interactive-card, input, select, textarea');
  interactiveEls.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursorGlow.classList.add('cursor-hover');
      cursorDot.classList.add('cursor-hover-dot');
    });
    el.addEventListener('mouseleave', () => {
      cursorGlow.classList.remove('cursor-hover');
      cursorDot.classList.remove('cursor-hover-dot');
    });
  });
}

/* ==========================================================================
   3. Subtle Audio Feedback (Web Audio API)
   ========================================================================== */
let audioCtx = null;
let soundEnabled = false;

function initAudioFeedback() {
  const soundToggle = document.getElementById('sound-toggle');
  if (!soundToggle) return;

  soundToggle.addEventListener('click', () => {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    soundEnabled = !soundEnabled;
    soundToggle.classList.toggle('active', soundEnabled);
    soundToggle.setAttribute('aria-pressed', soundEnabled);
    const label = soundToggle.querySelector('.sound-label');
    if (label) label.textContent = soundEnabled ? 'Audio: ON' : 'Audio: OFF';
    showToast(soundEnabled ? 'Ambient micro-sound activated' : 'Sound muted');
    if (soundEnabled) playTone(520, 'sine', 0.12, 0.08);
  });

  // Attach subtle click tone to interactive buttons
  document.querySelectorAll('.btn-primary, .btn-secondary, .pricing-card-btn, .filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (soundEnabled) playTone(440, 'triangle', 0.08, 0.04);
    });
  });
}

function playTone(freq, type = 'sine', duration = 0.1, volume = 0.05) {
  if (!soundEnabled || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(volume, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Ignore audio errors
  }
}

/* ==========================================================================
   4. GSAP & ScrollTrigger Animations
   ========================================================================== */
function initScrollAnimations() {
  if (typeof gsap === 'undefined') return;

  // Hero entrance animation
  const tlHero = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });
  tlHero
    .from('.hero-badge', { y: 20, opacity: 0, delay: 0.2 })
    .from('.hero-title .title-line', { y: 60, opacity: 0, stagger: 0.15 }, '-=0.6')
    .from('.hero-tagline', { y: 30, opacity: 0 }, '-=0.6')
    .from('.hero-cta-group', { y: 25, opacity: 0 }, '-=0.6')
    .from('.hero-stats', { y: 30, opacity: 0, stagger: 0.1 }, '-=0.5')
    .from('.scroll-indicator', { opacity: 0 }, '-=0.4');

  // Register ScrollTrigger if available
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Fade up section headers
    document.querySelectorAll('.section-header').forEach((header) => {
      gsap.from(header.children, {
        scrollTrigger: {
          trigger: header,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out'
      });
    });

    // Stagger services cards
    gsap.from('.service-card', {
      scrollTrigger: {
        trigger: '.services-grid',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out'
    });

    // Stagger pricing cards
    gsap.from('.pricing-card', {
      scrollTrigger: {
        trigger: '.pricing-grid',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      y: 60,
      opacity: 0,
      duration: 0.9,
      stagger: 0.15,
      ease: 'power3.out'
    });

    // Stagger portfolio items
    gsap.from('.portfolio-card', {
      scrollTrigger: {
        trigger: '.portfolio-grid',
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out'
    });
  }
}

/* ==========================================================================
   5. 3D Tilt Effect on Cards
   ========================================================================== */
function initCardTilts() {
  if (window.innerWidth < 1024 || 'ontouchstart' in window) return;

  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

      // Dynamic light reflection hotspot
      const glare = card.querySelector('.card-glare');
      if (glare) {
        glare.style.opacity = '1';
        glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(229, 192, 123, 0.15), transparent 70%)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      const glare = card.querySelector('.card-glare');
      if (glare) {
        glare.style.opacity = '0';
      }
    });
  });
}

/* ==========================================================================
   6. Portfolio Filtering & Modal
   ========================================================================== */
const portfolioData = {
  maalaka: {
    title: 'Travel with Maalaka',
    category: 'Live Client • Hospitality & Tourism Platform',
    badge: 'Live Production',
    link: 'https://travelwithmaalaka.com',
    linkText: 'Visit Live Website',
    image: './assets/images/travel-with-maalaka.jpg',
    description: 'An editorial-grade travel discovery and boutique booking platform celebrating authentic Sri Lankan destinations. Features curated scenic hill-country rail tours, private sanctuary villas, and custom itinerary booking flow.',
    tech: ['Custom Web Architecture', 'Next-Gen Mobile UX', 'Direct Booking Flow', 'Speed & SEO Mastered'],
    highlights: [
      'Engineered for international European & Asian travelers booking bespoke excursions.',
      'Optimized image pipeline serving crisp 4K visuals with sub-second page loads.',
      'Integrated WhatsApp instant concierge reservation system.'
    ]
  },
  manuga: {
    title: 'Manuga Pulmith — Portfolio',
    category: 'Live Client • Creative Developer Showcase',
    badge: 'Live Production',
    link: 'https://manugapulmith.github.io/Portfolio',
    linkText: 'Visit Live Portfolio',
    image: './assets/images/manuga-pulmith.jpg',
    description: 'A cybernetic, dark-mode personal brand platform engineered for an elite creative developer. Packed with WebGL particle visualizers, 3D reactive cards, futuristic glowing typography, and interactive code laboratory showcases.',
    tech: ['WebGL & Three.js', 'Futuristic Motion UI', 'Dynamic Glassmorphism', 'Zero-Jank 60FPS'],
    highlights: [
      'Showcases deep technical expertise and high-end aesthetic sensibility.',
      'Responsive interactive canvas widgets running smoothly across mobile and 4K displays.',
      'Custom kinetic typography and fluid theme transitions.'
    ]
  },
  hotel: {
    title: 'The Grand Azure Hotel & Suites',
    category: 'Flagship Concept • 5-Star Luxury Resort',
    badge: 'Hotel Demo Concept',
    link: '#contact',
    linkText: 'Request This Architecture',
    image: './assets/images/hotel-grand-azure.jpg',
    description: 'A monumental digital destination tailored for 5-star oceanfront hotels and grand estates. Includes a multi-step suite booking engine, 360° suite virtual tour previews, fine-dining reservation system, and luxury spa booking.',
    tech: ['Suite Booking Engine', 'Virtual Room Walkthroughs', 'Curated Dining Reservation', 'Global Currency Support'],
    highlights: [
      'Tailored specifically to convert high-net-worth international guests.',
      'Seamless multi-room availability checker with instant date range pricing.',
      'Architectural visual layout showcasing twilight infinity pools and suites.'
    ]
  },
  cafe: {
    title: 'Roast & Bloom Artisanal Roastery',
    category: 'Hospitality Concept • Specialty Coffee & Roastery',
    badge: 'Café Demo Concept',
    link: '#contact',
    linkText: 'Request This Architecture',
    image: './assets/images/cafe-roast-bloom.jpg',
    description: 'Warm, tactile digital experience crafted for artisanal coffee bars, roasteries, and urban bistros. Combines specialty single-origin bean e-commerce with real-time table reservations, daily roast notes, and Instagram integration.',
    tech: ['Artisanal Menu Showcase', 'Table Reservation Engine', 'Bean Subscription E-Commerce', 'Instagram Live Feed'],
    highlights: [
      'Drives weekend foot-traffic and online bean orders simultaneously.',
      'Interactive roast profile visualizer (notes of dark chocolate, berry & caramel).',
      'One-tap reservation integration directly via WhatsApp and Google Maps.'
    ]
  },
  villa: {
    title: 'Serenia Cliffside Sanctuary & Villas',
    category: 'Luxury Concept • Boutique Cliffside Villa',
    badge: 'Villa Demo Concept',
    link: '#contact',
    linkText: 'Request This Architecture',
    image: './assets/images/villa-serenia.jpg',
    description: 'An ethereal, high-fashion sanctuary web presence engineered for ultra-private cliffside boutique villas and tropical retreats. Features plunge pool sunrise floorplans, private chef reservation flows, and VIP concierge integration.',
    tech: ['Private Villa Floorplans', 'Chef & Wellness Booking', 'VIP WhatsApp Concierge', 'High-Fashion Editorial Layout'],
    highlights: [
      'Crafted to highlight exclusivity, serenity, and panoramic cliffside views.',
      'Interactive villa selector displaying amenities, floor areas, and private staff inclusions.',
      'Zero-friction reservation inquiry with instant WhatsApp and Telegram routing.'
    ]
  }
};

function initPortfolio() {
  // Category Filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      portfolioCards.forEach((card) => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat.includes(filter)) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px) scale(0.96)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // Modal Setup
  const modal = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close');
  const modalBackdrop = document.querySelector('.modal-backdrop');

  if (!modal) return;

  document.querySelectorAll('.open-modal-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectKey = btn.getAttribute('data-project');
      const data = portfolioData[projectKey];
      if (data) {
        populateAndOpenModal(data);
      }
    });
  });

  function populateAndOpenModal(data) {
    document.getElementById('modal-title').textContent = data.title;
    document.getElementById('modal-category').textContent = data.category;
    document.getElementById('modal-badge').textContent = data.badge;
    document.getElementById('modal-img').src = data.image;
    document.getElementById('modal-img').alt = data.title;
    document.getElementById('modal-description').textContent = data.description;

    const linkEl = document.getElementById('modal-link');
    linkEl.href = data.link;
    linkEl.textContent = data.linkText;
    if (data.link.startsWith('http')) {
      linkEl.target = '_blank';
      linkEl.rel = 'noopener noreferrer';
    } else {
      linkEl.removeAttribute('target');
      linkEl.addEventListener('click', () => closeModal());
    }

    // Render Tech tags
    const techContainer = document.getElementById('modal-tech');
    techContainer.innerHTML = '';
    data.tech.forEach((t) => {
      const tag = document.createElement('span');
      tag.className = 'tech-tag';
      tag.textContent = t;
      techContainer.appendChild(tag);
    });

    // Render Highlights
    const highlightsContainer = document.getElementById('modal-highlights');
    highlightsContainer.innerHTML = '';
    data.highlights.forEach((h) => {
      const li = document.createElement('li');
      li.textContent = h;
      highlightsContainer.appendChild(li);
    });

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   7. Pricing Tier Selector & Quick CTA Linking
   ========================================================================== */
function initPricingActions() {
  const getStartedBtns = document.querySelectorAll('.pricing-card-btn');
  const serviceSelect = document.getElementById('contact-service');
  const tierRadios = document.querySelectorAll('input[name="budget-tier"]');

  getStartedBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const tier = btn.getAttribute('data-tier'); // 'basic', 'standard', 'premium'

      // Preselect in contact form
      if (tierRadios) {
        tierRadios.forEach((radio) => {
          if (radio.value.toLowerCase().includes(tier)) {
            radio.checked = true;
          }
        });
      }

      // Pre-fill message area if empty
      const msgArea = document.getElementById('contact-message');
      if (msgArea && (!msgArea.value || msgArea.value.includes('Tier'))) {
        const tierName = tier.charAt(0).toUpperCase() + tier.slice(1);
        msgArea.value = `Hi Brevos team, I am interested in getting started with the ${tierName} Tier package for my property/venture.`;
      }

      // Smooth scroll to contact
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        if (lenis) {
          lenis.scrollTo(contactSection, { offset: -60 });
        } else {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      }

      showToast(`Selected ${tier.toUpperCase()} Tier. Complete the form to launch!`);
    });
  });
}

/* ==========================================================================
   8. Contact Form & WhatsApp Integration
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('brevos-contact-form');
  const waBtn = document.getElementById('btn-send-whatsapp');

  if (!form) return;

  // WhatsApp quick builder button
  if (waBtn) {
    waBtn.addEventListener('click', () => {
      const name = document.getElementById('contact-name').value.trim() || 'Prospective Client';
      const property = document.getElementById('contact-property').value.trim() || 'Hospitality Venture';
      const service = document.getElementById('contact-service').value;
      const selectedTier = document.querySelector('input[name="budget-tier"]:checked')?.value || 'Standard (LKR 50,000)';
      const notes = document.getElementById('contact-message').value.trim() || 'I would like to discuss a project.';

      const waText = encodeURIComponent(
        `*New Project Inquiry - Brevos Studio*\n\n` +
        `👤 *Name:* ${name}\n` +
        `🏨 *Property / Business:* ${property}\n` +
        `🛠️ *Service Required:* ${service}\n` +
        `💼 *Package Tier:* ${selectedTier}\n` +
        `📝 *Project Overview:*\n${notes}\n\n` +
        `_Sent via brevos.studio website_`
      );

      // WhatsApp official routing URL
      const waUrl = `https://wa.me/94771234567?text=${waText}`;
      window.open(waUrl, '_blank');
      showToast('Opening WhatsApp with your project inquiry...');
    });
  }

  // Regular form submit handler (simulated client-side with feedback)
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10"></path>
      </svg>
      <span>Transmitting Inquiry...</span>
    `;

    setTimeout(() => {
      submitBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e5c07b" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>Inquiry Received!</span>
      `;

      showToast('Thank you! Your inquiry has been dispatched to Brevos. We will respond within 2 hours.');

      setTimeout(() => {
        form.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }, 3500);
    }, 1200);
  });
}

/* ==========================================================================
   9. Mobile Navigation
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (!toggleBtn || !mobileMenu) return;

  toggleBtn.addEventListener('click', toggleMobileNav);
}

function toggleMobileNav() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const isOpen = mobileMenu.classList.toggle('active');
  toggleBtn.classList.toggle('active', isOpen);
  toggleBtn.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

/* ==========================================================================
   Helper: Toast Notification
   ========================================================================== */
function showToast(message) {
  let toast = document.getElementById('brevos-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'brevos-toast';
    toast.className = 'brevos-toast';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('visible');

  clearTimeout(toast.timeout);
  toast.timeout = setTimeout(() => {
    toast.classList.remove('visible');
  }, 4000);
}
