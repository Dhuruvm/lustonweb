
(function() {
  'use strict';
  
  // Wait for DOM to be ready
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }
  
  // Initialize dynamic content system
  ready(function() {
    // Add data attributes to common elements for easier targeting
    addDataAttributes();
    
    // Initialize performance monitoring
    if (window.performance && window.performance.mark) {
      window.performance.mark('dynamic-content-start');
    }
    
    // Removed periodic refresh to prevent content conflicts
    
    console.log('Dynamic content system initialized');
  });
  
  function addDataAttributes() {
    // Add data attributes to statistics elements
    const statsElements = document.querySelectorAll('span');
    const statKeys = ['servers', 'users', 'commands'];
    let keyIndex = 0;
    
    statsElements.forEach(function(span) {
      const text = span.textContent.trim();
      if ((text === '0' || /^\d+$/.test(text)) && keyIndex < statKeys.length) {
        span.setAttribute('data-counter', statKeys[keyIndex]);
        keyIndex++;
      }
    });
    
    // Add data attributes to feature sections
    const features = document.querySelectorAll('.feature, [class*="feature"]');
    features.forEach(function(feature, index) {
      if (!feature.hasAttribute('data-feature')) {
        feature.setAttribute('data-feature', 'feature-' + index);
      }
    });
    
    // Add data attributes to performance metrics
    const metrics = document.querySelectorAll('.metric, [class*="metric"]');
    metrics.forEach(function(metric, index) {
      if (!metric.hasAttribute('data-metric')) {
        metric.setAttribute('data-metric', index);
      }
    });
    
    // Add fallback error handling for images
    const images = document.querySelectorAll('img');
    images.forEach(function(img) {
      if (!img.hasAttribute('data-error-handled')) {
        img.addEventListener('error', function() {
          if (!this.src.includes('lustav.png')) {
            this.src = '/images/lustav.png';
          }
        });
        img.setAttribute('data-error-handled', 'true');
      }
    });
  }
})();
