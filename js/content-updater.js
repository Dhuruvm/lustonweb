
class ContentUpdater {
  constructor(configManager) {
    this.config = configManager;
    this.updateQueue = [];
    this.isProcessing = false;
  }

  async updateHero() {
    const hero = this.config.get('hero');
    if (!hero) return;

    const titleElement = document.querySelector('h1');
    const subtitleElement = document.querySelector('p.text-lg.text-zinc-300');
    
    if (titleElement && hero.title) {
      titleElement.innerHTML = hero.title;
    }
    
    if (subtitleElement && hero.subtitle) {
      subtitleElement.textContent = hero.subtitle;
    }

    // Update CTA buttons
    if (hero.buttons) {
      const buttonContainer = document.querySelector('.flex.gap-3');
      if (buttonContainer) {
        this.updateButtons(buttonContainer, hero.buttons);
      }
    }
  }

  updateButtons(container, buttons) {
    const existingButtons = container.querySelectorAll('a');
    
    buttons.forEach((button, index) => {
      const existingButton = existingButtons[index];
      if (existingButton) {
        existingButton.href = button.href;
        existingButton.innerHTML = this.generateButtonContent(button);
        existingButton.className = this.getButtonClasses(button.type);
      }
    });
  }

  generateButtonContent(button) {
    const iconHtml = button.icon ? this.getIconHtml(button.icon) : '';
    return `<span>${button.label}</span>${iconHtml}`;
  }

  getButtonClasses(type) {
    const baseClasses = 'group w-full px-6 py-3 rounded-2xl font-medium transition-all flex items-center justify-center gap-3';
    
    switch (type) {
      case 'primary':
        return `${baseClasses} bg-lust-primary hover:bg-opacity-90 shadow-lg shadow-lust-primary/20`;
      case 'secondary':
        return `${baseClasses} bg-black/20 backdrop-blur-sm hover:bg-black/30 border border-lust-primary/20`;
      default:
        return baseClasses;
    }
  }

  getIconHtml(iconType) {
    const icons = {
      external: `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" class="w-5 h-5 group-hover:translate-x-0.5 transition-transform" height="1em" width="1em"><path d="M10 6V8H5V19H16V14H18V20C18 20.5523 17.5523 21 17 21H4C3.44772 21 3 20.5523 3 20V7C3 6.44772 3.44772 6 4 6H10ZM21 3V11H19L18.9999 6.413L11.2071 14.2071L9.79289 12.7929L17.5849 5H13V3H21Z"></path></svg>`,
      terminal: `<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" class="w-5 h-5 group-hover:rotate-3 transition-transform" height="1em" width="1em"><path stroke-linecap="round" stroke-linejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>`,
      discord: `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" class="w-5 h-5"><path d="M19.3034 5.33716C17.9344 4.71103 16.4805 4.2547 14.9629 4C14.7719 4.32899 14.5596 4.77471 14.411 5.12492C12.7969 4.89144 11.1944 4.89144 9.60255 5.12492C9.45397 4.77471 9.2311 4.32899 9.05068 4C7.52251 4.2547 6.06861 4.71103 4.70915 5.33716C1.96053 9.39111 1.21766 13.3495 1.5891 17.2549C3.41443 18.5815 5.17612 19.388 6.90701 19.9187C7.33151 19.3456 7.71356 18.73 8.04255 18.0827C7.41641 17.8492 6.82211 17.5627 6.24904 17.2231C6.39762 17.117 6.5462 17.0003 6.68416 16.8835C10.1438 18.4648 13.8911 18.4648 17.3082 16.8835C17.4568 17.0003 17.5948 17.117 17.7434 17.2231C17.1703 17.5627 16.576 17.8492 15.9499 18.0827C16.2789 18.73 16.6609 19.3456 17.0854 19.9187C18.8152 19.388 20.5875 18.5815 22.4033 17.2549C22.8596 12.7341 21.6806 8.80747 19.3034 5.33716ZM8.5201 14.8459C7.48007 14.8459 6.63107 13.9014 6.63107 12.7447C6.63107 11.5879 7.45884 10.6434 8.5201 10.6434C9.57071 10.6434 10.4303 11.5879 10.4091 12.7447C10.4091 13.9014 9.57071 14.8459 8.5201 14.8459ZM15.4936 14.8459C14.4535 14.8459 13.6034 13.9014 13.6034 12.7447C13.6034 11.5879 14.4323 10.6434 15.4936 10.6434C16.5442 10.6434 17.4038 11.5879 17.3825 12.7447C17.3825 13.9014 16.5548 14.8459 15.4936 14.8459Z"></path></svg>`
    };
    
    return icons[iconType] || '';
  }

  async updateNavigation() {
    const navigation = this.config.getNavigation();
    
    // Update main navigation
    const mainNav = document.querySelector('.hidden.md\\:flex.items-center.gap-6');
    if (mainNav && navigation.main) {
      this.updateNavigationLinks(mainNav, navigation.main);
    }

    // Update CTA buttons in header
    const ctaSection = document.querySelector('.hidden.md\\:flex.items-center.gap-4');
    if (ctaSection && navigation.cta) {
      this.updateHeaderCTA(ctaSection, navigation.cta);
    }
  }

  updateNavigationLinks(container, links) {
    const linkElements = container.querySelectorAll('a');
    
    links.forEach((link, index) => {
      const element = linkElements[index];
      if (element) {
        element.href = link.href;
        const textElement = element.querySelector('.relative.px-4.py-2 span');
        if (textElement) {
          textElement.textContent = link.label;
        }
      }
    });
  }

  updateHeaderCTA(container, buttons) {
    buttons.forEach((button, index) => {
      const selector = index === 0 ? 'a[href*="login"]' : 'a[href*="invite"]';
      const element = container.querySelector(selector);
      
      if (element) {
        element.href = button.href;
        const textElement = element.querySelector('span');
        if (textElement) {
          textElement.textContent = button.label;
        }
      }
    });
  }

  async updateStatistics() {
    const stats = await this.config.updateStatistics();
    if (stats) {
      // Update existing counter elements
      const counterElements = document.querySelectorAll('[data-counter]');
      counterElements.forEach(element => {
        const key = element.dataset.counter;
        if (stats[key] !== undefined) {
          this.config.animateCounter(element, stats[key]);
        }
      });
      
      // Initialize counters if none were found
      if (counterElements.length === 0) {
        this.config.initializeCounters();
      }
    }
  }

  async updatePerformanceMetrics() {
    const metrics = this.config.getPerformanceMetrics();
    if (!metrics.length) return;

    metrics.forEach((metric, index) => {
      const metricCards = document.querySelectorAll('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3.gap-2 > div');
      const card = metricCards[index];
      
      if (card) {
        const valueElement = card.querySelector('.text-6xl.font-bold');
        const unitElement = card.querySelector('.text-xl.text-lust-primary');
        const titleElement = card.querySelector('.text-xl.font-semibold');
        const descElement = card.querySelector('p.text-zinc-400');
        
        if (valueElement) valueElement.textContent = metric.value;
        if (unitElement) unitElement.textContent = metric.unit;
        if (titleElement) titleElement.textContent = metric.title;
        if (descElement) descElement.textContent = metric.description;
      }
    });
  }

  async updateFooter() {
    const footer = this.config.get('footer');
    if (!footer) return;

    const copyrightElement = document.querySelector('#lust-footer .text-white\\/70');
    if (copyrightElement && footer.copyright) {
      copyrightElement.textContent = footer.copyright;
    }

    const footerLinks = document.querySelectorAll('#lust-footer nav a');
    if (footer.links) {
      footer.links.forEach((link, index) => {
        const element = footerLinks[index];
        if (element) {
          element.href = link.href;
          const textElement = element.querySelector('.relative.px-3.py-1\\.5 span, .relative div span');
          if (textElement) {
            textElement.textContent = link.label;
          }
        }
      });
    }
  }

  queueUpdate(updateFunction) {
    this.updateQueue.push(updateFunction);
    this.processQueue();
  }

  async processQueue() {
    if (this.isProcessing || this.updateQueue.length === 0) return;
    
    this.isProcessing = true;
    
    while (this.updateQueue.length > 0) {
      const updateFunction = this.updateQueue.shift();
      try {
        await updateFunction();
      } catch (error) {
        console.error('Error processing update:', error);
      }
    }
    
    this.isProcessing = false;
  }

  async updateAll() {
    const updates = [
      () => this.updateHero(),
      () => this.updateNavigation(),
      () => this.updateStatistics(),
      () => this.updatePerformanceMetrics(),
      () => this.updateFooter()
    ];

    for (const update of updates) {
      this.queueUpdate(update);
    }
  }

  init() {
    // Listen for config updates
    this.config.subscribe('configLoaded', () => {
      this.updateAll();
    });

    this.config.subscribe('statisticsUpdated', () => {
      this.updateStatistics();
    });

    // Initial update
    if (this.config.config) {
      this.updateAll();
    }
  }
}

// Auto-initialize when config manager is ready
if (window.configManager) {
  const contentUpdater = new ContentUpdater(window.configManager);
  contentUpdater.init();
} else {
  document.addEventListener('DOMContentLoaded', () => {
    if (window.configManager) {
      const contentUpdater = new ContentUpdater(window.configManager);
      contentUpdater.init();
    }
  });
}
