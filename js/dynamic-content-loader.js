
class DynamicContentLoader {
  constructor() {
    this.config = null;
    this.isLoaded = false;
  }

  async init() {
    try {
      const response = await fetch('/config.json');
      if (!response.ok) throw new Error(`Failed to load config: ${response.status}`);
      
      this.config = await response.json();
      this.isLoaded = true;
      
      await this.loadContent();
      console.log('Dynamic content loaded successfully');
    } catch (error) {
      console.error('Failed to load dynamic content:', error);
      this.loadFallbackContent();
    }
  }

  async loadContent() {
    if (!this.config) return;

    // Update meta tags
    this.updateMetaTags();
    
    // Update page title
    this.updatePageTitle();
    
    // Update statistics
    this.updateStatistics();
    
    // Update hero section
    this.updateHeroSection();
    
    // Update navigation
    this.updateNavigation();
    
    // Update features
    this.updateFeatures();
    
    // Update performance metrics
    this.updatePerformanceMetrics();
    
    // Update monitoring features
    this.updateMonitoringFeatures();
    
    // Update CTA section
    this.updateCTASection();
    
    // Update footer
    this.updateFooter();
    
    // Apply theme colors
    this.applyThemeColors();
    
    // Setup image error handling
    this.setupImageErrorHandling();
  }

  updateMetaTags() {
    const { site, branding } = this.config;
    
    // Update title
    document.title = site.title;
    
    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = site.description;
    
    // Update theme color
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.content = site.themeColor;
    
    // Update Open Graph tags
    this.updateMetaTag('property', 'og:title', site.title);
    this.updateMetaTag('property', 'og:description', site.description);
    this.updateMetaTag('property', 'og:url', site.url);
    this.updateMetaTag('property', 'og:site_name', site.siteName);
    this.updateMetaTag('property', 'og:image', branding.logo.primary);
    
    // Update Twitter tags
    this.updateMetaTag('name', 'twitter:title', site.title);
    this.updateMetaTag('name', 'twitter:description', site.description);
    this.updateMetaTag('name', 'twitter:image', branding.logo.primary);
    this.updateMetaTag('name', 'twitter:site', site.url);
  }

  updateMetaTag(attribute, value, content) {
    let meta = document.querySelector(`meta[${attribute}="${value}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attribute, value);
      document.head.appendChild(meta);
    }
    meta.content = content;
  }

  updatePageTitle() {
    const titleElement = document.querySelector('h1, .hero-title, [data-content="title"]');
    if (titleElement && this.config.hero?.title) {
      titleElement.textContent = this.config.hero.title;
    }
  }

  updateStatistics() {
    if (!this.config.statistics?.counters) return;
    
    this.config.statistics.counters.forEach(counter => {
      // Find elements by data attribute first
      let elements = document.querySelectorAll(`[data-counter="${counter.key}"]`);
      
      // If no elements found, try to find by content
      if (elements.length === 0) {
        elements = this.findElementsByContent(counter);
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

  findElementsByContent(counter) {
    const spans = document.querySelectorAll('span, div, p');
    const matchingElements = [];
    
    spans.forEach(span => {
      const text = span.textContent.trim();
      if (text === '0' || text === counter.label || text.includes(counter.key)) {
        span.setAttribute('data-counter', counter.key);
        matchingElements.push(span);
      }
    });
    
    return matchingElements;
  }

  updateHeroSection() {
    const { hero } = this.config;
    if (!hero) return;
    
    // Update hero title
    const heroTitle = document.querySelector('[data-content="hero-title"], .hero-title, h1');
    if (heroTitle) heroTitle.textContent = hero.title;
    
    // Update hero subtitle
    const heroSubtitle = document.querySelector('[data-content="hero-subtitle"], .hero-subtitle');
    if (heroSubtitle) heroSubtitle.textContent = hero.subtitle;
    
    // Update hero buttons
    this.updateButtons(hero.buttons, '.hero-buttons, .hero-cta');
  }

  updateNavigation() {
    const { navigation } = this.config;
    if (!navigation) return;
    
    // Update main navigation
    this.updateNavLinks(navigation.main, '.nav-main, .main-nav');
    
    // Update secondary navigation
    this.updateNavLinks(navigation.secondary, '.nav-secondary, .secondary-nav');
    
    // Update CTA buttons
    this.updateButtons(navigation.cta, '.nav-cta, .cta-nav');
  }

  updateNavLinks(links, selector) {
    const container = document.querySelector(selector);
    if (!container || !links) return;
    
    const existingLinks = container.querySelectorAll('a');
    links.forEach((link, index) => {
      if (existingLinks[index]) {
        existingLinks[index].href = link.href;
        existingLinks[index].textContent = link.label;
        if (link.icon) existingLinks[index].setAttribute('data-icon', link.icon);
      }
    });
  }

  updateButtons(buttons, selector) {
    const container = document.querySelector(selector);
    if (!container || !buttons) return;
    
    const existingButtons = container.querySelectorAll('a, button');
    buttons.forEach((button, index) => {
      if (existingButtons[index]) {
        existingButtons[index].href = button.href;
        existingButtons[index].textContent = button.label;
        if (button.type) existingButtons[index].className = `btn btn-${button.type}`;
        if (button.icon) existingButtons[index].setAttribute('data-icon', button.icon);
      }
    });
  }

  updateFeatures() {
    const { features } = this.config;
    if (!features?.showcase) return;
    
    features.showcase.forEach((feature, index) => {
      const featureElement = document.querySelector(`[data-feature="${feature.id}"], .feature-${index}`);
      if (featureElement) {
        const title = featureElement.querySelector('.feature-title, h3, h4');
        const description = featureElement.querySelector('.feature-description, p');
        
        if (title) title.textContent = feature.title;
        if (description) description.textContent = feature.description;
        
        // Update feature-specific data
        if (feature.data) {
          this.updateFeatureData(featureElement, feature.data);
        }
      }
    });
  }

  updateFeatureData(element, data) {
    // Update music player data
    if (data.currentSong) {
      const songTitle = element.querySelector('.text-white.text-sm.font-medium');
      const songArtist = element.querySelector('.text-zinc-400.text-sm');
      const songCover = element.querySelector('img[alt*="-"]');
      
      if (songTitle) songTitle.textContent = data.currentSong.title;
      if (songArtist) songArtist.textContent = data.currentSong.artist;
      if (songCover) {
        songCover.src = data.currentSong.cover;
        songCover.alt = `${data.currentSong.title} - ${data.currentSong.artist}`;
      }
    }
    
    // Update level data
    if (data.currentLevel) {
      const level = element.querySelector('.current-level');
      const xp = element.querySelector('.current-xp');
      
      if (level) level.textContent = data.currentLevel;
      if (xp) xp.textContent = this.formatNumber(data.xp);
    }
    
    // Update analytics data
    if (data.chartData) {
      const chart = element.querySelector('.chart-data');
      if (chart) chart.setAttribute('data-values', data.chartData.join(','));
    }
  }

  updatePerformanceMetrics() {
    const { performance } = this.config;
    if (!performance?.metrics) return;
    
    performance.metrics.forEach((metric, index) => {
      const metricElement = document.querySelector(`[data-metric="${index}"], .metric-${index}`);
      if (metricElement) {
        const value = metricElement.querySelector('.metric-value, .performance-value');
        const unit = metricElement.querySelector('.metric-unit, .performance-unit');
        const title = metricElement.querySelector('.metric-title, .performance-title');
        const description = metricElement.querySelector('.metric-description, .performance-description');
        
        if (value) value.textContent = metric.value;
        if (unit) unit.textContent = metric.unit;
        if (title) title.textContent = metric.title;
        if (description) description.textContent = metric.description;
      }
    });
  }

  updateMonitoringFeatures() {
    const { monitoring } = this.config;
    if (!monitoring?.features) return;
    
    monitoring.features.forEach((feature, index) => {
      const featureElement = document.querySelector(`[data-monitoring="${feature.id}"], .monitoring-${index}`);
      if (featureElement) {
        const title = featureElement.querySelector('.monitoring-title, h3, h4');
        const description = featureElement.querySelector('.monitoring-description, p');
        
        if (title) title.textContent = feature.title;
        if (description) description.textContent = feature.description;
        
        // Update monitoring-specific data
        if (feature.sampleLogs) {
          this.updateSampleLogs(featureElement, feature.sampleLogs);
        }
        
        if (feature.images) {
          this.updateImageGallery(featureElement, feature.images);
        }
      }
    });
  }

  updateSampleLogs(element, logs) {
    const logContainer = element.querySelector('.sample-logs, .logs-container');
    if (!logContainer || !logs) return;
    
    logContainer.innerHTML = '';
    logs.forEach(log => {
      const logElement = document.createElement('div');
      logElement.className = 'log-entry';
      logElement.innerHTML = `
        <div class="log-icon ${log.type}"></div>
        <div class="log-content">
          <div class="log-title">${log.title}</div>
          <div class="log-description">${log.description}</div>
        </div>
        <div class="log-time">${log.time}</div>
      `;
      logContainer.appendChild(logElement);
    });
  }

  updateImageGallery(element, images) {
    const gallery = element.querySelector('.image-gallery, .auto-pfps-gallery');
    if (!gallery || !images) return;
    
    gallery.innerHTML = '';
    images.forEach(image => {
      const img = document.createElement('img');
      img.src = image;
      img.className = 'gallery-image';
      img.onerror = () => img.src = this.config.errorHandling?.fallbackImage || '/images/lustav.png';
      gallery.appendChild(img);
    });
  }

  updateCTASection() {
    const { cta } = this.config;
    if (!cta) return;
    
    const ctaTitle = document.querySelector('.cta-title, [data-content="cta-title"]');
    const ctaDescription = document.querySelector('.cta-description, [data-content="cta-description"]');
    
    if (ctaTitle) ctaTitle.textContent = cta.title;
    if (ctaDescription) ctaDescription.textContent = cta.description;
    
    this.updateButtons(cta.buttons, '.cta-buttons');
  }

  updateFooter() {
    const { footer } = this.config;
    if (!footer) return;
    
    const copyright = document.querySelector('.footer-copyright, [data-content="copyright"]');
    if (copyright) copyright.textContent = footer.copyright;
    
    this.updateNavLinks(footer.links, '.footer-links');
  }

  applyThemeColors() {
    const { branding } = this.config;
    if (!branding?.colors) return;
    
    const root = document.documentElement;
    Object.entries(branding.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
      root.style.setProperty(`--${key}`, value);
    });
  }

  setupImageErrorHandling() {
    const fallbackImage = this.config.errorHandling?.fallbackImage || '/images/lustav.png';
    
    document.addEventListener('error', (event) => {
      if (event.target.tagName === 'IMG' && !event.target.src.includes('lustav.png')) {
        event.target.src = fallbackImage;
      }
    }, true);
    
    // Fix existing broken images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!img.complete || img.naturalHeight === 0) {
        img.src = fallbackImage;
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

  loadFallbackContent() {
    // Set basic fallback values
    document.title = 'lust';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = 'The only aesthetic multi-functional Discord bot you need.';
    
    // Set fallback statistics
    const spans = document.querySelectorAll('span');
    const fallbackStats = [50, 200000, 40900];
    let statIndex = 0;
    
    spans.forEach(span => {
      if (span.textContent.trim() === '0' && statIndex < fallbackStats.length) {
        this.animateCounter(span, fallbackStats[statIndex]);
        statIndex++;
      }
    });
  }

  // Public method to refresh content
  async refresh() {
    await this.init();
  }
}

// Initialize when DOM is ready
const dynamicLoader = new DynamicContentLoader();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    dynamicLoader.init();
  });
} else {
  dynamicLoader.init();
}

// Make available globally
window.dynamicLoader = dynamicLoader;
