// Smooth scroll animations and interactive elements
(function() {
  'use strict';

  // Intersection Observer for fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Disabled animations that cause layout shifts - sections stay static
  document.addEventListener('DOMContentLoaded', () => {
    // Sections remain static - no animations that cause layout shifts
    // Removed fade-in animations to prevent content jumping

    // Add hover effects to cards
    const cards = document.querySelectorAll('a[class*="block"], .group');
    cards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-4px) scale(1.02)';
      });
      card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
      });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    // Typing effect for hero text (optional enhancement)
    const heroTitle = document.querySelector('h1.font-display');
    if (heroTitle && window.innerWidth > 768) {
      const text = heroTitle.textContent;
      heroTitle.textContent = '';
      heroTitle.style.opacity = '1';
      let i = 0;
      const typeWriter = () => {
        if (i < text.length) {
          heroTitle.textContent += text.charAt(i);
          i++;
          setTimeout(typeWriter, 50);
        }
      };
      setTimeout(typeWriter, 500);
    }
  });

  // Add cursor trail effect (subtle, professional)
  let cursorTrail = [];
  const maxTrailLength = 10;

  document.addEventListener('mousemove', (e) => {
    if (window.innerWidth > 768) { // Only on desktop
      cursorTrail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
      if (cursorTrail.length > maxTrailLength) {
        cursorTrail.shift();
      }
    }
  });

  // Add subtle gradient animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes gradient-shift {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }
    
    .gradient-animate {
      background-size: 200% 200%;
      animation: gradient-shift 8s ease infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }

    .float-animation {
      animation: float 6s ease-in-out infinite;
    }

    /* Smooth transitions for all interactive elements */
    a, button {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* Enhanced card hover effects */
    .group:hover {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
  `;
  document.head.appendChild(style);
})();
