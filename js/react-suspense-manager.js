
// React Suspense and Loading Management
class SuspenseManager {
  constructor() {
    this.loadingStates = new Map();
    this.init();
  }

  init() {
    this.createLoadingFallbacks();
    this.handleSuspenseErrors();
  }

  createLoadingFallbacks() {
    // Create loading skeleton for main content
    const mainContent = document.querySelector('#__next');
    if (mainContent && mainContent.innerHTML.trim() === '') {
      this.showLoadingSkeleton(mainContent);
    }

    // Handle component-level loading
    this.observeComponentLoading();
  }

  showLoadingSkeleton(container) {
    const skeleton = document.createElement('div');
    skeleton.className = 'loading-skeleton';
    skeleton.innerHTML = `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background: #0D0D0D;
        color: #fff;
        font-family: system-ui, -apple-system, sans-serif;
      ">
        <div style="
          width: 40px;
          height: 40px;
          border: 3px solid #B3A4C8;
          border-top: 3px solid transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        "></div>
        <p style="color: #B3A4C8; margin: 0;">Loading lust...</p>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;
    
    container.appendChild(skeleton);

    // Remove skeleton after timeout
    setTimeout(() => {
      if (skeleton.parentNode) {
        skeleton.remove();
      }
    }, 5000);
  }

  observeComponentLoading() {
    // Wait for document.body to be available
    if (!document.body) {
      setTimeout(() => this.observeComponentLoading(), 100);
      return;
    }

    try {
      // Watch for React components that take time to load
      const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
              if (node.nodeType === 1 && node.textContent && node.textContent.includes('Loading')) {
                this.enhanceLoadingState(node);
              }
            });
          }
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    } catch (error) {
      console.warn('Failed to initialize MutationObserver:', error.message);
    }
  }

  enhanceLoadingState(element) {
    element.style.background = '#0D0D0D';
    element.style.color = '#B3A4C8';
    element.style.display = 'flex';
    element.style.alignItems = 'center';
    element.style.justifyContent = 'center';
    element.style.minHeight = '200px';
  }

  handleSuspenseErrors() {
    // Handle React Suspense promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason && event.reason.toString().includes('Suspense')) {
        event.preventDefault();
        console.warn('Handled Suspense error, continuing...');
        
        // Force content display after suspense error
        setTimeout(() => {
          this.forceContentDisplay();
        }, 500);
      }
    });
  }

  forceContentDisplay() {
    // Remove loading skeletons and show content
    const skeletons = document.querySelectorAll('.loading-skeleton');
    skeletons.forEach(skeleton => skeleton.remove());

    // Ensure main content is visible
    const mainContent = document.querySelector('#__next');
    if (mainContent) {
      mainContent.style.opacity = '1';
      mainContent.style.visibility = 'visible';
    }

    // Trigger performance optimizer
    if (window.performanceOptimizer) {
      window.performanceOptimizer.forceContentDisplay();
    }
  }
}

// Initialize suspense manager
if (!window.suspenseManager) {
  window.suspenseManager = new SuspenseManager();
}
