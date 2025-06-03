// Performance Optimizer for Website Loading Issues
class PerformanceOptimizer {
  constructor() {
    if (window.performanceOptimizerInstance) {
      return window.performanceOptimizerInstance;
    }

    this.initialized = false;
    this.criticalResourcesLoaded = false;
    window.performanceOptimizerInstance = this;
    this.init();
  }

  init() {
    if (this.initialized) return;
    this.initialized = true;

    // Fix existing conflicts first
    this.fixScriptConflicts();

    // Preload critical resources
    this.preloadCriticalResources();

    // Optimize script loading
    this.optimizeScriptLoading();

    // Handle viewport optimizations
    this.optimizeViewport();

    // Monitor performance
    this.monitorPerformance();

    // Force content display
    this.forceContentDisplay();
  }

  fixScriptConflicts() {
    // Remove duplicate script tags
    const scriptSources = ['config-loader.js', 'enhanced-error-handler.js', 'config-manager.js'];
    scriptSources.forEach(src => {
      const scripts = document.querySelectorAll(`script[src*="${src}"]`);
      if (scripts.length > 1) {
        // Keep only the first one
        for (let i = 1; i < scripts.length; i++) {
          scripts[i].remove();
        }
      }
    });
  }

  preloadCriticalResources() {
    const criticalImages = [
      'images/lustav.png',
      'images/backtome.jpg',
      'images/9.png',
      'images/chanel.jpg',
      'images/fourthofjuly.jpg'
    ];

    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });

    console.log('Critical images preloaded');
  }

  optimizeScriptLoading() {
    // Defer non-critical scripts
    const scripts = document.querySelectorAll('script[src]');
    scripts.forEach(script => {
      if (!script.src.includes('config-loader') && 
          !script.src.includes('enhanced-error-handler')) {
        script.loading = 'lazy';
      }
    });

    // Ensure critical scripts load first
    this.loadCriticalScripts();
  }

  loadCriticalScripts() {
    const criticalScripts = [
      'js/config-loader.js',
      'js/enhanced-error-handler.js',
      'js/config-manager.js'
    ];

    let loadedCount = 0;
    criticalScripts.forEach(src => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        loadedCount++;
        if (loadedCount === criticalScripts.length) {
          this.criticalResourcesLoaded = true;
          this.initializeAfterCriticalLoad();
        }
      };
      script.onerror = () => {
        console.warn(`Failed to load critical script: ${src}`);
        this.handleScriptFailure(src);
      };
      document.head.appendChild(script);
    });
  }

  handleScriptFailure(src) {
    // Fallback for failed scripts
    if (src.includes('config-manager')) {
      this.createFallbackConfigManager();
    }
  }

  createFallbackConfigManager() {
    window.configManager = {
      config: {
        hero: {
          title: "Elevate your Server with lust",
          subtitle: "Trusted by 50+ servers and 200k+ users, seamlessly blending functionality with style."
        },
        statistics: {
          counters: [
            { label: "Active Servers", value: 50 },
            { label: "Total Users", value: 200000 },
            { label: "Daily Commands", value: 40900 }
          ]
        }
      },
      get: function(key) { return this.config[key]; },
      getNavigation: function() { return this.config.navigation || {}; }
    };
  }

  optimizeViewport() {
    // Optimize for mobile loading
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.content = 'width=device-width, initial-scale=1, viewport-fit=cover';
    }

    // Add preconnect for external resources
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = 'https://static.cloudflareinsights.com';
    document.head.appendChild(preconnect);
  }

  initializeAfterCriticalLoad() {
    // Initialize content after critical resources load
    setTimeout(() => {
      this.ensureContentDisplay();
      this.updateMusicPlayer();
      this.updateStatistics();
    }, 100);
  }

  ensureContentDisplay() {
    // Force display of hidden content
    const mainContent = document.querySelector('.relative.w-full.overflow-x-hidden');
    if (mainContent) {
      mainContent.style.opacity = '1';
    }

    const heroSection = document.querySelector('.relative.min-h-\\[calc\\(100vh-4rem\\)\\]');
    if (heroSection) {
      heroSection.style.opacity = '1';
      heroSection.style.filter = 'none';
      heroSection.style.transform = 'none';
    }
  }

  updateMusicPlayer() {
    // Music player data is now handled by config.json
    // No override needed since config already has correct values
  }

  updateStatistics() {
    // Use fallback stats if API fails
    const fallbackStats = {
      servers: 50,
      users: 200000,
      commands: 40900
    };

    // Update stats displays with fallback data
    const statsElements = document.querySelectorAll('.text-xl.sm\\:text-2xl.lg\\:text-4xl.font-bold.text-white span');
    if (statsElements.length >= 3) {
      statsElements[0].textContent = fallbackStats.servers.toLocaleString();
      statsElements[1].textContent = fallbackStats.users.toLocaleString();
      statsElements[2].textContent = fallbackStats.commands.toLocaleString();
    }

    }, 100);

    // Emergency content display if nothing is visible after 3 seconds
    setTimeout(() => {
      this.emergencyContentDisplay();
    }, 3000);
  }

  emergencyContentDisplay() {
    // Check if main content is visible
    const mainContent = document.querySelector('.relative.w-full.overflow-x-hidden');
    const heroSection = document.querySelector('h1');

    if (!mainContent || !heroSection || 
        getComputedStyle(mainContent).opacity === '0' ||
        getComputedStyle(heroSection).opacity === '0') {

      console.warn('Emergency content display activated');

      // Force display everything
      document.body.style.opacity = '1';
      document.body.style.visibility = 'visible';

      // Remove all inline opacity styles
      const allElements = document.querySelectorAll('*');
      allElements.forEach(el => {
        if (el.style.opacity === '0' || el.style.opacity === '0.0') {
          el.style.opacity = '1';
          el.style.visibility = 'visible';
          el.style.transform = 'none';
          el.style.filter = 'none';
        }
      });

      // Update stats
      this.updateStatistics();
    }
  }
}

// Initialize performance optimizer (prevent duplicate initialization)
if (!window.performanceOptimizerInstance) {
  document.addEventListener('DOMContentLoaded', () => {
    if (!window.performanceOptimizerInstance) {
      const optimizer = new PerformanceOptimizer();
      window.performanceOptimizer = optimizer;
    }
  });

  // Also initialize immediately for faster loading
  if (!window.performanceOptimizerInstance) {
    const optimizer = new PerformanceOptimizer();
    window.performanceOptimizer = optimizer;
  }
}