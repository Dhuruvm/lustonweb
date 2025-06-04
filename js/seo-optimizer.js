
class SEOOptimizer {
  constructor() {
    this.init();
  }

  init() {
    this.optimizeImages();
    this.addStructuredData();
    this.optimizePerformance();
    this.trackPageViews();
  }

  optimizeImages() {
    // Add lazy loading to images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
      
      // Add alt text if missing
      if (!img.hasAttribute('alt') || img.alt === '') {
        const src = img.src || img.getAttribute('src') || '';
        if (src.includes('lustav')) {
          img.alt = 'lust Discord Bot Logo';
        } else if (src.includes('avatar') || src.includes('av')) {
          img.alt = 'User Avatar';
        } else {
          img.alt = 'lust Bot Feature Image';
        }
      }
    });
  }

  addStructuredData() {
    // Add JSON-LD structured data for better SEO
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "lust",
      "description": "The only aesthetic multi-functional Discord bot you need.",
      "url": "https://lust.bot.nu/",
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "Discord",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "author": {
        "@type": "Organization",
        "name": "lust Bot Team"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "200",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Music Playback",
        "Server Moderation",
        "Economy System",
        "Leveling System",
        "Server Analytics",
        "Community Management"
      ]
    };

    // Remove existing structured data
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }

  optimizePerformance() {
    // Preload critical resources
    this.preloadCriticalResources();
    
    // Optimize font loading
    this.optimizeFonts();
    
    // Add resource hints
    this.addResourceHints();
  }

  preloadCriticalResources() {
    const criticalResources = [
      { href: 'images/lustav.png', as: 'image' },
      { href: 'css/49f75d8d34aff450.css', as: 'style' },
      { href: 'css/030740c013ce2904.css', as: 'style' }
    ];

    criticalResources.forEach(resource => {
      if (!document.querySelector(`link[href="${resource.href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource.href;
        link.as = resource.as;
        if (resource.as === 'style') {
          link.onload = function() { this.rel = 'stylesheet'; };
        }
        document.head.appendChild(link);
      }
    });
  }

  optimizeFonts() {
    // Add font-display: swap to improve loading performance
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'Satoshi';
        font-display: swap;
      }
      @font-face {
        font-family: 'Cal Sans';
        font-display: swap;
      }
    `;
    document.head.appendChild(style);
  }

  addResourceHints() {
    const hints = [
      { rel: 'dns-prefetch', href: 'https://discord.com' },
      { rel: 'preconnect', href: 'https://cdn.discordapp.com' },
      { rel: 'preconnect', href: 'https://images.unsplash.com' }
    ];

    hints.forEach(hint => {
      if (!document.querySelector(`link[href="${hint.href}"]`)) {
        const link = document.createElement('link');
        link.rel = hint.rel;
        link.href = hint.href;
        if (hint.rel === 'preconnect') {
          link.crossOrigin = 'anonymous';
        }
        document.head.appendChild(link);
      }
    });
  }

  trackPageViews() {
    // Simple page view tracking for analytics
    const pageData = {
      url: window.location.href,
      title: document.title,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      referrer: document.referrer
    };

    // Store in localStorage for analytics (replace with your analytics service)
    try {
      const views = JSON.parse(localStorage.getItem('lust_page_views') || '[]');
      views.push(pageData);
      
      // Keep only last 100 views
      if (views.length > 100) {
        views.splice(0, views.length - 100);
      }
      
      localStorage.setItem('lust_page_views', JSON.stringify(views));
    } catch (e) {
      console.warn('Could not store page view data:', e);
    }
  }
}

// Initialize SEO optimizer
document.addEventListener('DOMContentLoaded', () => {
  window.seoOptimizer = new SEOOptimizer();
});
