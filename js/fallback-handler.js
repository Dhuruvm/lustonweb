
// Fallback content handler for when config.json fails to load
class FallbackHandler {
  constructor() {
    this.fallbackConfig = {
      site: {
        title: "lust",
        description: "The only aesthetic multi-functional Discord bot you need.",
        themeColor: "B3A4C8"
      },
      statistics: {
        counters: [
          { key: "servers", value: 50, label: "Active Servers", animated: true },
          { key: "users", value: 200000, label: "Total Users", animated: true },
          { key: "commands", value: 40900, label: "Daily Commands", animated: true }
        ]
      },
      branding: {
        colors: {
          primary: "#B3A4C8",
          secondary: "#1E1F1F",
          background: "#0D0D0D",
          text: "#FFFFFF"
        },
        logo: {
          primary: "/images/lustav.png"
        }
      },
      hero: {
        title: "Elevate your Server with lust",
        subtitle: "Trusted by 50+ servers and 200k+ users, seamlessly blending functionality with style."
      },
      errorHandling: {
        fallbackImage: "/images/lustav.png"
      }
    };
  }

  applyFallbackConfig() {
    // Apply basic meta information
    document.title = this.fallbackConfig.site.title;
    
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.content = this.fallbackConfig.site.description;
    }

    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
      themeColor.content = this.fallbackConfig.site.themeColor;
    }

    // Apply fallback statistics
    this.applyFallbackStatistics();
    
    // Apply fallback theme
    this.applyFallbackTheme();
    
    // Apply fallback hero content
    this.applyFallbackHero();
    
    console.log('Fallback configuration applied');
  }

  applyFallbackStatistics() {
    const counters = this.fallbackConfig.statistics.counters;
    
    counters.forEach((counter, index) => {
      // Find elements that should display this counter
      let elements = document.querySelectorAll(`[data-counter="${counter.key}"]`);
      
      if (elements.length === 0) {
        // Try to find by content
        const spans = document.querySelectorAll('span');
        let found = false;
        
        spans.forEach(span => {
          const text = span.textContent.trim();
          if ((text === '0' || text === counter.label) && !found) {
            span.setAttribute('data-counter', counter.key);
            elements = [span];
            found = true;
          }
        });
      }
      
      elements.forEach(element => {
        if (counter.animated) {
          this.animateCounter(element, counter.value);
        } else {
          element.textContent = this.formatNumber(counter.value);
        }
      });
    });
  }

  applyFallbackTheme() {
    const root = document.documentElement;
    const colors = this.fallbackConfig.branding.colors;
    
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
      root.style.setProperty(`--${key}`, value);
    });
  }

  applyFallbackHero() {
    const heroTitle = document.querySelector('h1, .hero-title, [data-content="hero-title"]');
    if (heroTitle) {
      heroTitle.textContent = this.fallbackConfig.hero.title;
    }
    
    const heroSubtitle = document.querySelector('.hero-subtitle, [data-content="hero-subtitle"]');
    if (heroSubtitle) {
      heroSubtitle.textContent = this.fallbackConfig.hero.subtitle;
    }
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
    const start = parseInt(element.textContent) || 0;
    const duration = 2000;
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
}

// Make available globally
window.fallbackHandler = new FallbackHandler();

// Auto-apply if main loader fails
setTimeout(() => {
  if (!window.dynamicLoader || !window.dynamicLoader.isLoaded) {
    console.warn('Main config loader failed, applying fallback configuration');
    window.fallbackHandler.applyFallbackConfig();
  }
}, 5000);
