
// Enhanced Error Handler for React and API Issues
class EnhancedErrorHandler {
  constructor() {
    if (window.enhancedErrorHandlerInstance) {
      return window.enhancedErrorHandlerInstance;
    }
    
    this.retryAttempts = 3;
    this.retryDelay = 1000;
    window.enhancedErrorHandlerInstance = this;
    this.initializeErrorHandling();
  }

  initializeErrorHandling() {
    // Handle React errors
    window.addEventListener('error', (event) => {
      console.warn('Handled error:', event.error?.message || 'Unknown error');
      if (event.error?.message?.includes('Minified React error')) {
        this.handleReactError(event);
      }
    });

    // Handle promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.warn('Handled promise rejection:', event.reason);
      event.preventDefault();
      this.handleApiFailure();
    });

    // Fallback content loader
    this.initializeFallbackContent();
  }

  handleReactError(event) {
    // Prevent error propagation
    event.preventDefault();
    
    // Attempt to reload critical components
    setTimeout(() => {
      this.reloadCriticalContent();
    }, 500);
  }

  async handleApiFailure() {
    // Use fallback data when API fails
    if (window.configManager) {
      const fallbackStats = {
        servers: 50,
        users: 200000,
        commands: 40900
      };
      
      this.updateStatsWithFallback(fallbackStats);
    }
  }

  updateStatsWithFallback(stats) {
    // Update counter elements with fallback values
    const serverElements = document.querySelectorAll('[data-counter="servers"], .text-xl.sm\\:text-2xl.lg\\:text-4xl');
    const userElements = document.querySelectorAll('[data-counter="users"]');
    const commandElements = document.querySelectorAll('[data-counter="commands"]');

    if (serverElements.length > 0) {
      serverElements[0].textContent = stats.servers.toLocaleString();
    }
    
    if (userElements.length > 0) {
      userElements[0].textContent = stats.users.toLocaleString();
    }
    
    if (commandElements.length > 0) {
      commandElements[0].textContent = stats.commands.toLocaleString();
    }

    // Update hero subtitle counters specifically
    const heroSubtitle = document.querySelector('p.text-lg.text-zinc-300');
    if (heroSubtitle && heroSubtitle.textContent.includes('Trusted by')) {
      heroSubtitle.textContent = 'Trusted by 50+ servers and 200k+ users, seamlessly blending functionality with style.';
    }
  }

  reloadCriticalContent() {
    // Ensure critical content is visible
    const heroSection = document.querySelector('.relative.min-h-\\[calc\\(100vh-4rem\\)\\]');
    if (heroSection) {
      heroSection.style.opacity = '1';
      heroSection.style.filter = 'none';
      heroSection.style.transform = 'none';
    }

    // Ensure statistics section is visible
    const statsSection = document.querySelector('.flex.gap-4.sm\\:gap-8.lg\\:gap-12');
    if (statsSection) {
      statsSection.style.opacity = '1';
      this.animateCounters();
    }
  }

  animateCounters() {
    const counters = [
      { element: document.querySelector('.text-xl.sm\\:text-2xl.lg\\:text-4xl'), target: 50 },
      { element: document.querySelectorAll('.text-xl.sm\\:text-2xl.lg\\:text-4xl')[1], target: 200000 },
      { element: document.querySelectorAll('.text-xl.sm\\:text-2xl.lg\\:text-4xl')[2], target: 40900 }
    ];

    counters.forEach(({ element, target }) => {
      if (element) {
        this.animateValue(element, 0, target, 2000);
      }
    });
  }

  animateValue(element, start, end, duration) {
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const current = Math.floor(start + (end - start) * this.easeOutQuart(progress));
      element.textContent = current.toLocaleString();
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    animate();
  }

  easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  initializeFallbackContent() {
    // Ensure page loads even if React fails
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        this.ensureContentVisibility();
      }, 1000);
    });
  }

  ensureContentVisibility() {
    // Make sure all content is visible
    const hiddenElements = document.querySelectorAll('[style*="opacity:0"]');
    hiddenElements.forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.filter = 'none';
    });

    // Music player data is now handled by config.json
    // No override needed since config already has correct values
  }
}

// Initialize error handler (prevent duplicate initialization)
if (!window.enhancedErrorHandlerInstance) {
  const errorHandler = new EnhancedErrorHandler();
  window.enhancedErrorHandler = errorHandler;
}
