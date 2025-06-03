
// React Error Handler (without requiring React to be loaded)
class ReactErrorHandler {
  constructor() {
    this.handleReactErrors();
  }

  handleReactErrors() {
    // Handle React hydration errors specifically
    window.addEventListener('error', (event) => {
      const message = event.error?.message || '';
      
      if (message.includes('418') || message.includes('423') || 
          message.includes('Hydration') || message.includes('hydration')) {
        console.warn('Handled React hydration error:', message);
        event.preventDefault();
        
        // Force content display after hydration error
        this.forceContentDisplay();
      }
    });

    // Handle promise rejections from React
    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason && event.reason.toString().includes('React')) {
        event.preventDefault();
        console.warn('Handled React promise rejection');
        this.forceContentDisplay();
      }
    });
  }

  forceContentDisplay() {
    setTimeout(() => {
      // Remove all opacity restrictions
      const hiddenElements = document.querySelectorAll('[style*="opacity:0"], [style*="opacity: 0"]');
      hiddenElements.forEach(el => {
        el.style.opacity = '1';
        el.style.visibility = 'visible';
        el.style.transform = 'translateY(0px)';
        el.style.filter = 'none';
      });

      // Specifically show main content
      const mainContent = document.querySelector('.relative.w-full.overflow-x-hidden');
      if (mainContent) {
        mainContent.style.opacity = '1';
        mainContent.style.visibility = 'visible';
      }

      // Show hero section
      const heroSection = document.querySelector('.relative.min-h-\\[calc\\(100vh-4rem\\)\\]');
      if (heroSection) {
        heroSection.style.opacity = '1';
        heroSection.style.filter = 'none';
        heroSection.style.transform = 'none';
      }

      // Show all sections
      const sections = document.querySelectorAll('section');
      sections.forEach(section => {
        section.style.opacity = '1';
        section.style.transform = 'translateY(0px)';
      });

      console.log('Forced content display after React error');
    }, 100);
  }
}

// Initialize immediately without waiting for React
if (!window.reactErrorHandler) {
  window.reactErrorHandler = new ReactErrorHandler();
}
