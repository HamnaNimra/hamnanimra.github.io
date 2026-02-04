// Smooth scroll animations and interactive elements
(function() {
  'use strict';

  const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const revealOptions = {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  };
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, revealOptions);

  document.addEventListener('DOMContentLoaded', () => {
    if (!prefersReducedMotion()) {
      document.querySelectorAll('.scroll-reveal, .scroll-reveal-card').forEach(el => {
        revealObserver.observe(el);
      });
    } else {
      document.querySelectorAll('.scroll-reveal, .scroll-reveal-card').forEach(el => {
        el.classList.add('revealed');
      });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    const heroTitle = document.querySelector('h1.hero-name');
    if (heroTitle && window.innerWidth > 768 && !prefersReducedMotion()) {
      const text = heroTitle.textContent.trim();
      if (text.length > 0 && text.length < 30) {
        heroTitle.textContent = '';
        heroTitle.style.opacity = '1';
        let i = 0;
        const typeWriter = () => {
          if (i < text.length) {
            heroTitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 60);
          }
        };
        setTimeout(typeWriter, 400);
      }
    }
  });

  const style = document.createElement('style');
  style.textContent = `
    a, button {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .group:hover {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
  `;
  document.head.appendChild(style);
})();
