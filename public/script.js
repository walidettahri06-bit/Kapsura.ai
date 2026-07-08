/* ============================================
   KAPSURA — Main JavaScript v2
   Premium animations, particles, scroll effects
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ── Preloader animation ──
  const preloader = document.getElementById('preloader');
  if (preloader) {
    const status1 = document.getElementById('status1');
    const status2 = document.getElementById('status2');
    const status3 = document.getElementById('status3');

    // Staggered status activations (very fast: within 1.5 seconds)
    setTimeout(() => {
      status1.classList.add('active');
    }, 300);

    setTimeout(() => {
      status2.classList.add('active');
    }, 650);

    setTimeout(() => {
      status3.classList.add('active');
    }, 1000);

    // Hide preloader and unlock landing page
    setTimeout(() => {
      preloader.classList.add('fade-out');
      document.body.classList.remove('loading');
    }, 1500);
  }

  // ── Navbar scroll effect ──
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── Mobile nav toggle ──
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ── Scroll reveal with staggered entrance ──
  const reveals = document.querySelectorAll('.reveal');
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  reveals.forEach(el => revealObserver.observe(el));

  // ── ROI counter animation ──
  const roiCards = document.querySelectorAll('.roi-value[data-target]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  roiCards.forEach(card => counterObserver.observe(card));

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out quartic for smoother deceleration
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = Math.round(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  // ── Hero Particle Field ──
  const heroParticles = document.getElementById('heroParticles');
  if (heroParticles) {
    createParticles(heroParticles, 20);
  }

  function createParticles(container, count) {
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'data-particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.animationDuration = (2 + Math.random() * 4) + 's';
      particle.style.animationDelay = (Math.random() * 5) + 's';
      particle.style.width = (1 + Math.random() * 2) + 'px';
      particle.style.height = particle.style.width;
      particle.style.opacity = 0.3 + Math.random() * 0.4;
      container.appendChild(particle);
    }
  }

  // ── Interactive cursor glow on hero ──
  const hero = document.getElementById('hero');
  let cursorGlow = null;

  if (hero && window.innerWidth > 768) {
    cursorGlow = document.createElement('div');
    cursorGlow.style.cssText = `
      position: fixed;
      width: 400px;
      height: 400px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%);
      pointer-events: none;
      z-index: 1;
      transition: transform 0.15s ease-out, opacity 0.3s;
      transform: translate(-50%, -50%);
      opacity: 0;
    `;
    document.body.appendChild(cursorGlow);

    document.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top = e.clientY + 'px';
      cursorGlow.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
      cursorGlow.style.opacity = '0';
    });
  }

  // ── Live Demo Chat Simulation ──
  const demoBody = document.getElementById('demoBody');
  const btnReplay = document.getElementById('btnReplay');

  const demoMessages = [
    {
      type: 'customer',
      avatar: 'C',
      label: 'Customer',
      text: 'I want to reserve a table for Friday evening.'
    },
    {
      type: 'ai',
      avatar: 'K',
      label: 'Kapsura AI',
      text: 'I can help with that! What time would you prefer, and how many guests?'
    },
    {
      type: 'customer',
      avatar: 'C',
      label: 'Customer',
      text: '7:30 PM for 6 people.'
    },
    {
      type: 'ai',
      avatar: 'K',
      label: 'Kapsura AI',
      text: 'Perfect — 7:30 PM, 6 guests on Friday. Your reservation is confirmed!'
    },
    {
      type: 'system',
      items: [
        'Reservation created — Friday 7:30 PM, 6 guests',
        'Confirmation SMS sent to customer',
        'Calendar updated for restaurant owner'
      ]
    }
  ];

  function buildMsg(msg) {
    if (msg.type === 'system') {
      const div = document.createElement('div');
      div.className = 'system-block demo-msg';
      div.innerHTML = `
        <div class="sys-title">System Actions</div>
        ${msg.items.map(item => `
          <div class="sys-item">
            <span class="sys-check">✓</span>
            ${item}
          </div>
        `).join('')}
      `;
      return div;
    }

    const div = document.createElement('div');
    div.className = 'demo-msg';
    const avatarClass = msg.type === 'customer' ? 'customer' : 'ai';
    const bubbleClass = msg.type === 'customer' ? 'customer-bubble' : 'ai-bubble';
    const labelClass = msg.type === 'customer' ? 'customer-label' : 'ai-label';
    div.innerHTML = `
      <span class="chat-avatar ${avatarClass}">${msg.avatar}</span>
      <div>
        <div class="chat-label ${labelClass}">${msg.label}</div>
        <div class="chat-bubble ${bubbleClass}">${msg.text}</div>
      </div>
    `;
    return div;
  }

  let demoTimeouts = [];

  function runDemo() {
    // Clear
    demoBody.innerHTML = '';
    demoTimeouts.forEach(clearTimeout);
    demoTimeouts = [];

    demoMessages.forEach((msg, i) => {
      const el = buildMsg(msg);
      demoBody.appendChild(el);
      const timeout = setTimeout(() => {
        el.classList.add('show');
      }, 700 * (i + 1));
      demoTimeouts.push(timeout);
    });
  }

  // Observe demo section
  const demoSection = document.getElementById('demo');
  let demoPlayed = false;

  const demoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !demoPlayed) {
        demoPlayed = true;
        runDemo();
      }
    });
  }, { threshold: 0.3 });

  demoObserver.observe(demoSection);

  btnReplay.addEventListener('click', () => {
    demoPlayed = true;
    runDemo();
  });

  // ── Contact Form ──
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const btnSubmit = document.getElementById('btnSubmit');

  // Input elements
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const businessInput = document.getElementById('business');
  const messageInput = document.getElementById('message');

  const formFields = [nameInput, emailInput, phoneInput, businessInput, messageInput];

  // Helper: Show validation error
  function showError(input, message) {
    const group = input.closest('.form-group');
    if (!group) return;

    let errorEl = group.querySelector('.error-message');
    if (!errorEl) {
      errorEl = document.createElement('span');
      errorEl.className = 'error-message';
      group.appendChild(errorEl);
    }
    errorEl.textContent = message;
    input.classList.add('invalid');
  }

  // Helper: Clear validation error
  function clearError(input) {
    const group = input.closest('.form-group');
    if (!group) return;

    const errorEl = group.querySelector('.error-message');
    if (errorEl) {
      errorEl.remove();
    }
    input.classList.remove('invalid');
  }

  // Helper: Validate a single field
  function validateField(input) {
    const val = input.value.trim();
    const id = input.id;

    // Check required
    if (input.hasAttribute('required') && val === '') {
      const labelEl = input.previousElementSibling;
      const labelText = labelEl ? labelEl.textContent : 'This field';
      showError(input, `${labelText} is required.`);
      return false;
    }

    // Email format validation
    if (id === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val)) {
        showError(input, 'Please enter a valid email address.');
        return false;
      }
    }

    // Phone format validation
    if (id === 'phone') {
      const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
      if (!phoneRegex.test(val)) {
        showError(input, 'Please enter a valid phone number (7-20 digits).');
        return false;
      }
    }

    clearError(input);
    return true;
  }

  // Attach dynamic real-time validation listeners
  formFields.forEach(input => {
    if (!input) return;

    // Trim whitespace and validate on blur
    input.addEventListener('blur', () => {
      input.value = input.value.trim();
      validateField(input);
    });

    // Clear errors or validate dynamically on input once marked invalid
    input.addEventListener('input', () => {
      if (input.classList.contains('invalid')) {
        validateField(input);
      }
    });
  });

  // Direct fallback submission to n8n webhook
  async function submitDirectlyToN8n(data) {
    try {
      await fetch('https://sbiixla.app.n8n.cloud/webhook/contact-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (err) {
      console.warn('Direct n8n webhook submission failed:', err);
    }
    // Transition to success screen
    contactForm.style.display = 'none';
    formSuccess.classList.add('show');
  }

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Prevent submission if already sending
    if (btnSubmit.disabled) return;

    // Trim whitespace and validate all fields before submission
    let isFormValid = true;
    let firstInvalidInput = null;

    formFields.forEach(input => {
      if (!input) return;
      input.value = input.value.trim();
      if (!validateField(input)) {
        isFormValid = false;
        if (!firstInvalidInput) {
          firstInvalidInput = input;
        }
      }
    });

    // If validation fails, focus the first invalid field and stop submission
    if (!isFormValid) {
      if (firstInvalidInput) {
        firstInvalidInput.focus();
      }
      return;
    }

    // Disable button to prevent double-submit
    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Sending...';

    const data = {
      name: nameInput.value,
      email: emailInput.value,
      phone: phoneInput.value,
      business: businessInput.value,
      message: messageInput.value
    };

    try {
      // Step 1: Submit to server-side validation API endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        // Success via server endpoint
        contactForm.style.display = 'none';
        formSuccess.classList.add('show');
      } else if (response.status === 400) {
        // Server-side validation failed (client bypass attempt)
        const errData = await response.json();
        if (errData && errData.errors) {
          Object.keys(errData.errors).forEach(fieldId => {
            const inputEl = document.getElementById(fieldId);
            if (inputEl) {
              showError(inputEl, errData.errors[fieldId]);
            }
          });
          
          // Focus the first failed server-validated field
          const failedFieldId = Object.keys(errData.errors)[0];
          const failedEl = document.getElementById(failedFieldId);
          if (failedEl) failedEl.focus();
        }
        btnSubmit.disabled = false;
        btnSubmit.textContent = 'Get My Free Automation Analysis';
      } else {
        // Non-400 error (e.g. 500 internal server error or 404 endpoint not found).
        // Fall back to direct webhook submission to ensure zero downtime.
        console.warn(`Server validation returned status ${response.status}. Falling back to direct webhook.`);
        await submitDirectlyToN8n(data);
      }
    } catch (err) {
      // Network error or local file environment -> Fall back to direct submission
      console.warn('Network error or local static context detected. Falling back to direct webhook:', err);
      await submitDirectlyToN8n(data);
    }
  });

  // ── Smooth scroll for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = 80;
        const y = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  // ── Parallax effect for hero elements ──
  if (window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const gridBg = document.querySelector('.grid-bg');
      if (gridBg && scrollY < window.innerHeight) {
        gridBg.style.transform = `translateY(${scrollY * 0.3}px)`;
        gridBg.style.opacity = 1 - (scrollY / window.innerHeight);
      }
    }, { passive: true });
  }

});
