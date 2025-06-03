
// React Intersection Observer for Performance
class IntersectionObserverManager {
  constructor() {
    this.observers = new Map();
    this.init();
  }

  init() {
    // Create observer for fade-in animations
    this.createFadeInObserver();
    // Create observer for lazy loading
    this.createLazyLoadObserver();
  }

  createFadeInObserver() {
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
          fadeObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '50px'
    });

    // Observe all sections
    setTimeout(() => {
      const sections = document.querySelectorAll('section, .feature-card, .stat-item');
      sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        fadeObserver.observe(section);
      });
    }, 100);

    this.observers.set('fade', fadeObserver);
  }

  createLazyLoadObserver() {
    const lazyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            lazyObserver.unobserve(img);
          }
        }
      });
    });

    // Observe lazy images
    setTimeout(() => {
      const lazyImages = document.querySelectorAll('img[data-src]');
      lazyImages.forEach(img => lazyObserver.observe(img));
    }, 100);

    this.observers.set('lazy', lazyObserver);
  }
}

// Initialize intersection observer
if (!window.intersectionObserverManager) {
  window.intersectionObserverManager = new IntersectionObserverManager();
}
