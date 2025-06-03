
class ConfigLoader {
  constructor() {
    this.config = null;
    this.isLoaded = false;
    this.loadPromise = null;
  }

  async load() {
    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = this._loadConfig();
    return this.loadPromise;
  }

  async _loadConfig() {
    try {
      const response = await fetch('/config.json');
      if (!response.ok) {
        throw new Error(`Failed to load config: ${response.status}`);
      }
      
      this.config = await response.json();
      this.isLoaded = true;
      
      // Apply configuration immediately
      this.applyConfig();
      
      console.log('Configuration loaded successfully');
      return this.config;
    } catch (error) {
      console.error('Failed to load configuration:', error);
      this.loadFallbackConfig();
      return this.config;
    }
  }

  loadFallbackConfig() {
    this.config = {
      site: {
        title: "lust",
        description: "The only aesthetic multi-functional Discord bot you need."
      },
      statistics: {
        counters: [
          { key: "servers", value: 150, fallback: 150, animated: true },
          { key: "users", value: 200000, fallback: 200000, animated: true },
          { key: "commands", value: 40900, fallback: 40900, animated: true }
        ]
      },
      branding: {
        colors: {
          primary: "#B3A4C8"
        }
      }
    };
    this.isLoaded = true;
    this.applyConfig();
  }

  applyConfig() {
    if (!this.config) return;

    // Update page title
    if (this.config.site?.title) {
      document.title = this.config.site.title;
    }

    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && this.config.site?.description) {
      metaDesc.setAttribute('content', this.config.site.description);
    }

    // Apply theme colors
    this.applyTheme();

    // Update statistics
    this.updateStatistics();

    // Fix broken images
    this.fixImages();
  }

  applyTheme() {
    if (!this.config.branding?.colors) return;

    const root = document.documentElement;
    Object.entries(this.config.branding.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
  }

  updateStatistics() {
    if (!this.config.statistics?.counters) return;

    this.config.statistics.counters.forEach(counter => {
      // Find elements that should display this counter
      const elements = document.querySelectorAll(`[data-counter="${counter.key}"]`);
      
      if (elements.length === 0) {
        // Try to find counter elements by looking for zero values
        this.findAndUpdateCounterElements(counter);
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

  findAndUpdateCounterElements(counter) {
    // Look for spans containing "0" that might be counter placeholders
    const spans = document.querySelectorAll('span');
    let found = false;
    
    spans.forEach(span => {
      const text = span.textContent.trim();
      if (text === '0' && !found && !span.hasAttribute('data-counter')) {
        span.setAttribute('data-counter', counter.key);
        if (counter.animated) {
          this.animateCounter(span, counter.value);
        } else {
          span.textContent = this.formatNumber(counter.value);
        }
        found = true;
      }
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

  animateCounter(element, target) {
    const start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = this.formatNumber(Math.floor(current));
    }, 16);
  }

  fixImages() {
    // Fix any broken images by setting up error handlers
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!img.hasAttribute('data-error-handled')) {
        img.addEventListener('error', () => {
          if (!img.src.includes('lustav.png')) {
            img.src = '/images/lustav.png';
          }
        });
        img.setAttribute('data-error-handled', 'true');
      }
    });
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

  async waitForLoad() {
    if (this.isLoaded) return this.config;
    return this.load();
  }
}

// Create global instance
window.configLoader = new ConfigLoader();

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.configLoader.load();
  });
} else {
  window.configLoader.load();
}
