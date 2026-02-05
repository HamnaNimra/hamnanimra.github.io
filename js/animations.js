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

    // "Currently" rotating line (hero) – only on home
    const currentlyEl = document.getElementById('currently-rotating');
    if (currentlyEl) {
      const phrases = [
        'added easter eggs to the website',
        'suggest you try to click on the footer name 7 times',
        'suggest you try to click on the name "Hamna Nimra" 3 times',
        'suggest you try to press the Konami code',
        'suggest you try to click on the Mimo highlight',
        'build things because I like them',
        'have fun doing what I do',
        'love cars and sports',
        'find peace in quiet corners',
        'notice patterns everywhere',
        'learn as I go',
        'ask why things work the way they do',
        'explore new places',
        'pay attention to small details',
        'get distracted by shiny things',
        'share projects I care about',
        'get lost in my own thoughts',
        'pause for reasons that usually make sense later',
        'find joy in simple things',
        'love to eat and sleep',
        'love my cat Mimo',
        'balance imbalanced situations',
      ];
      let idx = 0;
      currentlyEl.textContent = phrases[0];
      if (!prefersReducedMotion()) {
        setInterval(() => {
          idx = (idx + 1) % phrases.length;
          currentlyEl.style.opacity = '0';
          setTimeout(() => {
            currentlyEl.textContent = phrases[idx];
            currentlyEl.style.opacity = '1';
          }, 200);
        }, 3200);
      }
    }

    // Mimo easter egg: click to show a fun message
    document.querySelectorAll('.mimo-highlight').forEach(el => {
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
      el.setAttribute('aria-label', 'Mimo says something');
      el.addEventListener('click', showMimoMessage);
      el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showMimoMessage(e); } });
    });

    // Easter egg: 7 clicks on footer name
    const footerName = document.getElementById('footer-name');
    if (footerName) {
      let footerClicks = 0;
      let footerReset = null;
      footerName.addEventListener('click', (e) => {
        e.preventDefault();
        footerClicks++;
        clearTimeout(footerReset);
        footerReset = setTimeout(() => { footerClicks = 0; }, 1500);
        if (footerClicks >= 7) {
          footerClicks = 0;
          showEasterEggToast([
            "You found the secret! 🎉",
            "Nice clicking. Have a great day! ✨",
            "Welcome to the inner circle. 🫡",
            "Plot twist: you're the real boss here.",
            "7/7 would click again."
          ]);
        }
      });
    }

    // Easter egg: triple-click on hero name
    const heroName = document.querySelector('h1.hero-name');
    if (heroName) {
      let heroClicks = 0;
      let heroReset = null;
      heroName.addEventListener('click', () => {
        heroClicks++;
        clearTimeout(heroReset);
        heroReset = setTimeout(() => { heroClicks = 0; }, 600);
        if (heroClicks >= 3) {
          heroClicks = 0;
          showEasterEggToast([
            "Hey, that's me! 👋",
            "Thanks for visiting!",
            "You've got a sharp cursor."
          ]);
        }
      });
    }

    // Easter egg: Konami code (↑↑↓↓←→←→BA)
    const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    let konamiIndex = 0;
    document.addEventListener('keydown', (e) => {
      konamiIndex = e.code === konami[konamiIndex] ? konamiIndex + 1 : 0;
      if (konamiIndex === konami.length) {
        konamiIndex = 0;
        showEasterEggToast([
          "+30 lives. Just kidding. 🎮",
          "Konami code activated! You're a legend.",
          "Cheat code: good taste in websites. ✅"
        ]);
      }
    });

    // Scroll progress: chapter-style “how far through” indicator (throttled, respects reduced motion)
    const progressBar = document.getElementById('scroll-progress-bar');
    const progressText = document.getElementById('scroll-progress-text');
    if ((progressBar || progressText) && !prefersReducedMotion()) {
      const getMessage = (pct) => {
        if (pct < 10) return "Welcome in 👋";
        if (pct < 25) return "Getting to know me...";
        if (pct < 40) return "You're " + Math.round(pct) + "% through my brain";
        if (pct < 60) return "Halfway there!";
        if (pct < 75) return "You're " + Math.round(pct) + "% through my brain";
        if (pct < 90) return "The good stuff ✨";
        return "You made it! 🎉";
      };
      let rafId = null;
      let lastMsg = null;
      const update = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = scrollHeight <= 0 ? 0 : Math.min(100, (scrollTop / scrollHeight) * 100);
        if (progressBar) progressBar.style.width = pct + "%";
        const msg = getMessage(pct);
        if (progressText && msg !== lastMsg) {
          progressText.textContent = msg;
          lastMsg = msg;
        }
        rafId = null;
      };
      const onScroll = () => {
        if (rafId == null) rafId = requestAnimationFrame(update);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      update();
    }
  });

  function showEasterEggToast(messages) {
    const existing = document.getElementById('easter-egg-toast');
    if (existing) existing.remove();
    const msg = Array.isArray(messages) ? messages[Math.floor(Math.random() * messages.length)] : messages;
    const toast = document.createElement('div');
    toast.id = 'easter-egg-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.textContent = msg;
    toast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#1f2937;color:#f3f4f6;padding:12px 20px;border-radius:12px;font-size:14px;font-weight:500;box-shadow:0 10px 40px rgba(0,0,0,0.2);z-index:9999;max-width:90vw;text-align:center;opacity:0;';
    if (!document.getElementById('mimo-toast-style')) {
      const s = document.createElement('style');
      s.id = 'mimo-toast-style';
      s.textContent = '@keyframes mimoToast{0%{opacity:0;transform:translateX(-50%) translateY(12px)}100%{opacity:1;transform:translateX(-50%) translateY(0)}}';
      document.head.appendChild(s);
    }
    toast.style.animation = 'mimoToast 0.3s ease forwards';
    document.body.appendChild(toast);
    setTimeout(() => { if (toast.parentNode) toast.remove(); }, 3500);
  }

  function showMimoMessage() {
    const existing = document.getElementById('mimo-toast');
    if (existing) {
      existing.remove();
      return;
    }
    const messages = [
      "Mimo says: I'm the real boss here.",
      "Mimo says: Treats, then we talk.",
      "Mimo says: This human writes code. I run the house.",
      "Mimo says: *stares* You're still here?",
      "Mimo says: I'm not a fan of loud noises.",
      "Mimo purrs: Hello hooman bean",
      "Mimo says: Salmon is my favorite food.",
      "Mimo says: Give me scratchies, then I'll be your best friend.",
      "fun cat facts: Mimo's birthday is in May",
      "fun cat facts: Mimo is a girl cat.",
      "fun cat facts: Mimo's favorite toy is her laser pointer",
      "fun cat facts: Mimo's favorite place to eat is on the couch",
      "fun cat facts: Mimo's favorite place to sleep is on the bed",
    ];
    const msg = messages[Math.floor(Math.random() * messages.length)];
    const toast = document.createElement('div');
    toast.id = 'mimo-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.textContent = msg;
    toast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#1f2937;color:#f3f4f6;padding:12px 20px;border-radius:12px;font-size:14px;font-weight:500;box-shadow:0 10px 40px rgba(0,0,0,0.2);z-index:9999;max-width:90vw;text-align:center;opacity:0;';
    if (!document.getElementById('mimo-toast-style')) {
      const s = document.createElement('style');
      s.id = 'mimo-toast-style';
      s.textContent = '@keyframes mimoToast{0%{opacity:0;transform:translateX(-50%) translateY(12px)}100%{opacity:1;transform:translateX(-50%) translateY(0)}}';
      document.head.appendChild(s);
    }
    toast.style.animation = 'mimoToast 0.1s ease forwards';
    document.body.appendChild(toast);
    setTimeout(() => {
      if (toast.parentNode) toast.remove();
    }, 4000);
  }

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
