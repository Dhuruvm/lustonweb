
class SmoothRedirects {
  constructor() {
    this.isNavigating = false;
    this.fadeOutDuration = 300;
    this.fadeInDuration = 300;
    this.init();
  }

  init() {
    // Handle all internal links
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link && this.isInternalLink(link)) {
        e.preventDefault();
        this.smoothNavigate(link.href);
      }
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', (e) => {
      if (e.state && e.state.smoothRedirect) {
        this.loadPage(window.location.href, false);
      }
    });

    // Add initial state
    if (window.history.replaceState) {
      window.history.replaceState({ smoothRedirect: true }, '', window.location.href);
    }
  }

  isInternalLink(link) {
    try {
      const url = new URL(link.href);
      const currentUrl = new URL(window.location.href);
      
      // Check if it's the same origin and not an external link
      return url.origin === currentUrl.origin && 
             !link.hasAttribute('target') &&
             !link.href.includes('discord.com') &&
             !link.href.includes('mailto:') &&
             !link.href.includes('tel:');
    } catch (e) {
      return false;
    }
  }

  async smoothNavigate(href) {
    if (this.isNavigating) return;
    this.isNavigating = true;

    try {
      // Add fade out effect
      await this.fadeOut();
      
      // Load new page
      await this.loadPage(href, true);
      
      // Add fade in effect
      await this.fadeIn();
    } catch (error) {
      console.error('Smooth navigation failed:', error);
      window.location.href = href; // Fallback to normal navigation
    } finally {
      this.isNavigating = false;
    }
  }

  async loadPage(href, addToHistory = true) {
    try {
      const response = await fetch(href);
      if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
      
      const html = await response.text();
      const parser = new DOMParser();
      const newDoc = parser.parseFromString(html, 'text/html');
      
      // Update title
      document.title = newDoc.title;
      
      // Update meta tags
      this.updateMetaTags(newDoc);
      
      // Update main content
      const newMain = newDoc.querySelector('main');
      const currentMain = document.querySelector('main');
      if (newMain && currentMain) {
        currentMain.innerHTML = newMain.innerHTML;
      } else {
        // Fallback: replace body content
        document.body.innerHTML = newDoc.body.innerHTML;
      }
      
      // Update history
      if (addToHistory && window.history.pushState) {
        window.history.pushState({ smoothRedirect: true }, '', href);
      }
      
      // Reinitialize dynamic content if available
      if (window.dynamicContentLoader) {
        window.dynamicContentLoader.init();
      }
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    } catch (error) {
      throw error;
    }
  }

  updateMetaTags(newDoc) {
    // Update description
    const oldDesc = document.querySelector('meta[name="description"]');
    const newDesc = newDoc.querySelector('meta[name="description"]');
    if (oldDesc && newDesc) {
      oldDesc.content = newDesc.content;
    }

    // Update keywords
    const oldKeywords = document.querySelector('meta[name="keywords"]');
    const newKeywords = newDoc.querySelector('meta[name="keywords"]');
    if (oldKeywords && newKeywords) {
      oldKeywords.content = newKeywords.content;
    }

    // Update canonical
    const oldCanonical = document.querySelector('link[rel="canonical"]');
    const newCanonical = newDoc.querySelector('link[rel="canonical"]');
    if (oldCanonical && newCanonical) {
      oldCanonical.href = newCanonical.href;
    }
  }

  fadeOut() {
    return new Promise((resolve) => {
      const body = document.body;
      body.style.transition = `opacity ${this.fadeOutDuration}ms ease-out`;
      body.style.opacity = '0.7';
      
      setTimeout(() => {
        resolve();
      }, this.fadeOutDuration);
    });
  }

  fadeIn() {
    return new Promise((resolve) => {
      const body = document.body;
      body.style.transition = `opacity ${this.fadeInDuration}ms ease-in`;
      body.style.opacity = '1';
      
      setTimeout(() => {
        body.style.transition = '';
        resolve();
      }, this.fadeInDuration);
    });
  }
}

// Initialize smooth redirects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.smoothRedirects = new SmoothRedirects();
});
