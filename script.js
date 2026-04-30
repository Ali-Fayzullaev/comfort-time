// ===== Comfort Time landing — interactions =====
(function () {
  'use strict';

  // Lucide icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // AOS
  if (window.AOS) {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60,
      disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    });
  }

  // Year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Header scroll state
  const header = document.getElementById('header');
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile nav
  const burger = document.getElementById('burger');
  const mobileNav = document.getElementById('mobileNav');
  if (burger && mobileNav) {
    burger.addEventListener('click', () => {
      mobileNav.classList.toggle('hidden');
    });
    mobileNav.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => mobileNav.classList.add('hidden'))
    );
  }

  // Counters
  const counters = document.querySelectorAll('[data-counter]');
  const animateCounter = (el) => {
    const target = parseInt(el.dataset.counter, 10) || 0;
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString('ru-RU');
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animateCounter(e.target);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((c) => io.observe(c));
  } else {
    counters.forEach(animateCounter);
  }

  // Phone mask (KZ format)
  const phoneInputs = document.querySelectorAll('input[type="tel"]');
  const formatPhone = (raw) => {
    let digits = raw.replace(/\D/g, '');
    if (digits.startsWith('8')) digits = '7' + digits.slice(1);
    if (!digits.startsWith('7')) digits = '7' + digits;
    digits = digits.slice(0, 11);
    const p = ['+7'];
    if (digits.length > 1) p.push(' (' + digits.slice(1, 4));
    if (digits.length >= 4) p.push(') ');
    if (digits.length >= 4) p.push(digits.slice(4, 7));
    if (digits.length >= 7) p.push('-' + digits.slice(7, 9));
    if (digits.length >= 9) p.push('-' + digits.slice(9, 11));
    return p.join('');
  };
  phoneInputs.forEach((input) => {
    input.addEventListener('input', () => {
      input.value = formatPhone(input.value);
    });
    input.addEventListener('focus', () => {
      if (!input.value) input.value = '+7 (';
    });
  });

  // Toast helper
  const toast = document.getElementById('toast');
  const showToast = (msg) => {
    if (!toast) return;
    if (msg) toast.querySelector('span').textContent = msg;
    toast.classList.add('is-visible');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove('is-visible'), 4200);
  };

  // Form handler — opens WhatsApp with prefilled message
  const buildWaLink = (data) => {
    const lines = [
      'Здравствуйте! Заявка с сайта Comfort Time:',
      data.name ? 'Имя: ' + data.name : '',
      data.phone ? 'Телефон: ' + data.phone : '',
      data.service ? 'Услуга: ' + data.service : '',
      data.message ? 'Сообщение: ' + data.message : '',
    ].filter(Boolean);
    return 'https://wa.me/77474425848?text=' + encodeURIComponent(lines.join('\n'));
  };

  const handleSubmit = (form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const data = Object.fromEntries(fd.entries());
      if (!data.name || !data.phone || data.phone.replace(/\D/g, '').length < 11) {
        showToast('Пожалуйста, заполните имя и корректный номер телефона.');
        return;
      }
      // Open WhatsApp in a new tab with prefilled message
      window.open(buildWaLink(data), '_blank', 'noopener');
      showToast('Заявка отправлена! Откроется WhatsApp для подтверждения.');
      form.reset();
    });
  };
  document.querySelectorAll('#heroForm, #contactForm').forEach(handleSubmit);

  // Smooth scroll offset for sticky header
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

  // Duplicate marquee content for seamless loop
  document.querySelectorAll('.marquee__track').forEach((track) => {
    track.innerHTML += track.innerHTML;
    if (window.lucide) window.lucide.createIcons();
  });
})();
