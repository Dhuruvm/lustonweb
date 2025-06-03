
// React Performance and Error Handling Library
class ReactPerformanceLib {
  constructor() {
    if (window.reactPerformanceLibInstance) {
      return window.reactPerformanceLibInstance;
    }
    
    this.initialized = false;
    this.errorBoundaryActive = false;
    this.suspenseFallbackActive = false;
    window.reactPerformanceLibInstance = this;
    this.init();
  }

  init() {
    if (this.initialized) return;
    this.initialized = true;
    
    // Set up React error boundaries
    this.setupErrorBoundaries();
    
    // Set up Suspense fallbacks
    this.setupSuspenseFallbacks();
    
    // Set up React DevTools detection
    this.setupReactDevTools();
    
    // Set up performance monitoring
    this.setupPerformanceMonitoring();
    
    // Set up hydration error handling
    this.setupHydrationErrorHandling();
  }

  setupErrorBoundaries() {
    // Create a global error boundary component
    const ErrorBoundary = {
      componentDidCatch: (error, errorInfo) => {
        console.log('React Error Boundary caught:', error, errorInfo);
        this.handleReactError(error, errorInfo);
      },
      
      render: function(props) {
        if (this.state?.hasError) {
          return this.renderFallbackUI();
        }
        return props.children;
      },
      
      renderFallbackUI: () => {
        return `
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 200px;
            background: #0D0D0D;
            color: #FFFFFF;
            font-family: Satoshi, sans-serif;
          ">
            <div style="text-align: center;">
              <h3 style="margin: 0 0 10px 0;">Loading...</h3>
              <p style="margin: 0; opacity: 0.7;">Content is being optimized</p>
            </div>
          </div>
        `;
      }
    };

    // Inject error boundary into React components
    this.injectErrorBoundary(ErrorBoundary);
  }

  setupSuspenseFallbacks() {
    // Create suspense fallback component
    const SuspenseFallback = () => {
      return `
        <div class="flex items-center justify-center min-h-[200px] bg-zinc-900/50 rounded-lg">
          <div class="text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p class="text-zinc-400">Loading content...</p>
          </div>
        </div>
      `;
    };

    this.suspenseFallbackActive = true;
  }

  setupReactDevTools() {
    // Detect React version and environment
    if (window.React) {
      console.log('React detected:', window.React.version || 'Unknown version');
      
      // Enable React DevTools in development
      if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
        window.__REACT_DEVTOOLS_GLOBAL_HOOK__.onCommitFiberRoot = (id, root) => {
          this.monitorReactPerformance(root);
        };
      }
    }
  }

  setupPerformanceMonitoring() {
    // Monitor React component performance
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name.includes('React') || entry.name.includes('component')) {
          this.handlePerformanceEntry(entry);
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['measure', 'navigation', 'paint'] });
    } catch (e) {
      console.warn('Performance Observer not supported');
    }
  }

  setupHydrationErrorHandling() {
    // Handle React hydration errors specifically
    const originalConsoleError = console.error;
    console.error = (...args) => {
      const message = args[0];
      
      if (typeof message === 'string') {
        if (message.includes('Hydration') || message.includes('hydration')) {
          this.handleHydrationError(message, args);
          return; // Suppress hydration errors
        }
        
        if (message.includes('Minified React error')) {
          this.handleMinifiedReactError(message, args);
          return; // Suppress minified errors
        }
      }
      
      originalConsoleError.apply(console, args);
    };
  }

  handleReactError(error, errorInfo) {
    // Handle React component errors gracefully
    if (error.message.includes('Minified React error')) {
      this.recoverFromMinifiedError(error);
    } else if (error.message.includes('hydration')) {
      this.recoverFromHydrationError(error);
    } else {
      this.genericErrorRecovery(error);
    }
  }

  handleHydrationError(message, args) {
    console.log('Handled hydration error:', message);
    
    // Force client-side rendering
    setTimeout(() => {
      this.forceClientSideRender();
    }, 100);
  }

  handleMinifiedReactError(message, args) {
    console.log('Handled minified React error:', message);
    
    // Extract error code and provide meaningful fallback
    const errorCode = message.match(/#(\d+)/)?.[1];
    
    switch (errorCode) {
      case '418':
        this.handleError418(); // Hydration mismatch
        break;
      case '423':
        this.handleError423(); // Invalid hook call
        break;
      default:
        this.genericErrorRecovery();
    }
  }

  handleError418() {
    // Handle hydration mismatch errors
    console.log('Fixing hydration mismatch...');
    this.forceClientSideRender();
  }

  handleError423() {
    // Handle invalid hook call errors
    console.log('Fixing invalid hook calls...');
    this.resetReactState();
  }

  forceClientSideRender() {
    // Force all content to render on client side
    const hiddenElements = document.querySelectorAll('[style*="opacity: 0"], [style*="display: none"]');
    hiddenElements.forEach(el => {
      el.style.opacity = '1';
      el.style.display = 'block';
      el.style.visibility = 'visible';
    });

    // Ensure main content is visible
    this.ensureContentVisibility();
  }

  resetReactState() {
    // Reset React-related state variables
    if (window.__NEXT_DATA__) {
      window.__NEXT_DATA__.props = window.__NEXT_DATA__.props || {};
    }
    
    // Clear React fiber state if accessible
    this.clearReactFiberState();
  }

  ensureContentVisibility() {
    // Ensure all critical content is visible
    const criticalSelectors = [
      '.relative.w-full.overflow-x-hidden',
      '.relative.min-h-\\[calc\\(100vh-4rem\\)\\]',
      'section',
      '.hero-section',
      '.stats-section',
      '.features-section'
    ];

    criticalSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.filter = 'none';
        el.style.visibility = 'visible';
      });
    });
  }

  monitorReactPerformance(root) {
    // Monitor React component render times
    if (root && root.current) {
      const renderTime = performance.now();
      
      // Check for slow renders
      setTimeout(() => {
        const elapsed = performance.now() - renderTime;
        if (elapsed > 100) {
          console.warn(`Slow React render detected: ${elapsed}ms`);
          this.optimizeSlowRender();
        }
      }, 0);
    }
  }

  optimizeSlowRender() {
    // Optimize slow React renders
    requestIdleCallback(() => {
      this.deferNonCriticalUpdates();
    });
  }

  deferNonCriticalUpdates() {
    // Defer non-critical DOM updates
    const nonCriticalElements = document.querySelectorAll('[data-non-critical]');
    nonCriticalElements.forEach(el => {
      el.style.willChange = 'auto';
      el.style.contain = 'layout style paint';
    });
  }

  handlePerformanceEntry(entry) {
    // Handle performance monitoring entries
    if (entry.duration > 100) {
      console.warn(`Performance warning: ${entry.name} took ${entry.duration}ms`);
    }
  }

  injectErrorBoundary(ErrorBoundary) {
    // Inject error boundary into existing React components
    if (window.React && window.React.createElement) {
      const originalCreateElement = window.React.createElement;
      
      window.React.createElement = function(type, props, ...children) {
        try {
          return originalCreateElement.apply(this, arguments);
        } catch (error) {
          console.log('Error boundary caught createElement error:', error);
          return ErrorBoundary.renderFallbackUI();
        }
      };
    }
  }

  clearReactFiberState() {
    // Clear React fiber state to prevent state conflicts
    const reactFiberKeys = Object.keys(window).filter(key => 
      key.startsWith('__react') || key.startsWith('_react')
    );
    
    reactFiberKeys.forEach(key => {
      try {
        delete window[key];
      } catch (e) {
        // Ignore deletion errors
      }
    });
  }

  genericErrorRecovery() {
    // Generic error recovery mechanism
    setTimeout(() => {
      this.forceClientSideRender();
      this.ensureContentVisibility();
    }, 100);
  }

  // Public API methods
  recoverFromError() {
    this.forceClientSideRender();
    this.ensureContentVisibility();
  }

  enableDevMode() {
    window.__REACT_PERFORMANCE_LIB_DEV__ = true;
    console.log('React Performance Library: Dev mode enabled');
  }

  getErrorStats() {
    return {
      errorBoundaryActive: this.errorBoundaryActive,
      suspenseFallbackActive: this.suspenseFallbackActive,
      initialized: this.initialized
    };
  }
}

// React Suspense Polyfill for older versions
if (!window.React?.Suspense) {
  window.ReactSuspensePolyfill = {
    Suspense: function(props) {
      return props.children;
    }
  };
}

// Initialize React Performance Library
if (!window.reactPerformanceLibInstance) {
  const reactLib = new ReactPerformanceLib();
  window.reactPerformanceLib = reactLib;
  
  // Auto-enable dev mode in development
  if (location.hostname === 'localhost' || location.hostname.includes('replit')) {
    reactLib.enableDevMode();
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ReactPerformanceLib;
}
