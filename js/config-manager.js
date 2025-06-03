
class ConfigManager {
  constructor() {
    this.config = null;
    this.cache = new Map();
    this.observers = new Map();
  }

  async loadConfig() {
    try {
      const response = await fetch('/config.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.config = await response.json();
      this.notifyObservers('configLoaded', this.config);
      return this.config;
    } catch (error) {
      console.error('Failed to load configuration:', error);
      this.loadFallbackConfig();
      return null;
    }
  }

  loadFallbackConfig() {
    this.config = {
      site: {
        title: "lust",
        description: "The only aesthetic multi-functional Discord bot you need."
      },
      branding: {
        colors: {
          primary: "#B3A4C8"
        }
      },
      errorHandling: {
        fallbackImage: "/images/lustav.png"
      }
    };
  }

  get(path, defaultValue = null) {
    if (!this.config) return defaultValue;
    
    const keys = path.split('.');
    let current = this.config;
    
    for (const key of keys) {
      if (current[key] === undefined) {
        return defaultValue;
      }
      current = current[key];
    }
    
    return current;
  }

  getNavigation() {
    return {
      main: this.get('navigation.main', []),
      secondary: this.get('navigation.secondary', []),
      cta: this.get('navigation.cta', [])
    };
  }

  getFeatures() {
    return {
      showcase: this.get('features.showcase', []),
      detailed: this.get('detailedFeatures', [])
    };
  }

  getStatistics() {
    return this.get('statistics', {});
  }

  getPerformanceMetrics() {
    return this.get('performance.metrics', []);
  }

  getMonitoringFeatures() {
    return this.get('monitoring.features', []);
  }

  getBranding() {
    return this.get('branding', {});
  }

  getApiConfig() {
    return this.get('api', {});
  }

  subscribe(event, callback) {
    if (!this.observers.has(event)) {
      this.observers.set(event, []);
    }
    this.observers.get(event).push(callback);
  }

  unsubscribe(event, callback) {
    if (this.observers.has(event)) {
      const callbacks = this.observers.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  notifyObservers(event, data) {
    if (this.observers.has(event)) {
      this.observers.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in observer callback for ${event}:`, error);
        }
      });
    }
  }

  async updateStatistics() {
    const apiConfig = this.getApiConfig();
    const statistics = this.getStatistics();
    
    // If API is offline or unavailable, use fallback values
    if (apiConfig.offline || !apiConfig.baseUrl) {
      const fallbackStats = {};
      if (statistics.counters) {
        statistics.counters.forEach(counter => {
          fallbackStats[counter.key] = counter.fallback || counter.value;
        });
      }
      this.notifyObservers('statisticsUpdated', fallbackStats);
      return fallbackStats;
    }

    try {
      const response = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.stats}`);
      if (response.ok) {
        const stats = await response.json();
        this.notifyObservers('statisticsUpdated', stats);
        return stats;
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      // Use fallback values on error
      const fallbackStats = {};
      if (statistics.counters) {
        statistics.counters.forEach(counter => {
          fallbackStats[counter.key] = counter.fallback || counter.value;
        });
      }
      this.notifyObservers('statisticsUpdated', fallbackStats);
      return fallbackStats;
    }
    return null;
  }

  renderTemplate(template, data) {
    return template.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
      const value = this.get(path.trim(), '');
      return typeof value === 'string' ? value : JSON.stringify(value);
    });
  }

  validateImageUrl(url) {
    const fallback = this.get('errorHandling.fallbackImage', '/images/lustav.png');
    
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = () => resolve(fallback);
      img.src = url;
    });
  }

  formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  animateCounter(element, target, duration = 2000) {
    const start = parseInt(element.textContent) || 0;
    const increment = (target - start) / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if ((increment > 0 && current >= target) || (increment < 0 && current <= target)) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = this.formatNumber(Math.floor(current));
    }, 16);
  }

  initializeCounters() {
    const statistics = this.getStatistics();
    if (statistics.counters) {
      statistics.counters.forEach(counter => {
        const elements = document.querySelectorAll(`[data-counter="${counter.key}"]`);
        if (elements.length === 0) {
          // Try to find elements by content for fallback
          const spans = document.querySelectorAll('span');
          spans.forEach(span => {
            const text = span.textContent.trim();
            if (text === '0' || text === counter.label) {
              span.setAttribute('data-counter', counter.key);
              if (counter.animated) {
                this.animateCounter(span, counter.value);
              } else {
                span.textContent = this.formatNumber(counter.value);
              }
            }
          });
        } else {
          elements.forEach(element => {
            if (counter.animated) {
              this.animateCounter(element, counter.value);
            } else {
              element.textContent = this.formatNumber(counter.value);
            }
          });
        }
      });
    }
  }

  handleImageError(event) {
    const fallback = this.get('errorHandling.fallbackImage', '/images/lustav.png');
    event.target.src = fallback;
  }

  applyTheme() {
    const colors = this.get('branding.colors', {});
    const root = document.documentElement;
    
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
  }

  setupErrorHandling() {
    // Global image error handling
    document.addEventListener('error', (event) => {
      if (event.target.tagName === 'IMG') {
        this.handleImageError(event);
      }
    }, true);

    // Global fetch error handling
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
    });
  }

  async init() {
    await this.loadConfig();
    this.applyTheme();
    this.setupErrorHandling();
    this.initializeCounters();
    
    // Set up periodic statistics updates
    const updateInterval = this.get('api.refreshInterval', 30000);
    setInterval(() => {
      this.updateStatistics();
    }, updateInterval);

    return this.config;
  }
}

// Global instance
window.configManager = new ConfigManager();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.configManager.init();
  });
} else {
  window.configManager.init();
}

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ConfigManager;
}
