
// Navbar image fix script - runs immediately to fix navbar images
(function() {
  'use strict';

  function fixNavbarImages() {
    // Target navbar specifically
    const navbar = document.querySelector('.fixed.top-0');
    if (!navbar) return;

    const navbarImages = navbar.querySelectorAll('img');
    
    navbarImages.forEach(img => {
      const src = img.getAttribute('src');
      const srcset = img.getAttribute('srcset');

      // Fix external or Next.js image URLs
      if (src && (src.includes('r2.lust.bot.nu') || src.includes('_next/image') || src.includes('https://'))) {
        console.log('Fixing navbar image:', src);
        img.src = 'images/lustav.png';
      }

      // Fix srcset
      if (srcset && (srcset.includes('r2.lust.bot.nu') || srcset.includes('_next/image'))) {
        img.setAttribute('srcset', 'images/lustav.png 1x, images/lustav.png 2x');
      }

      // Immediate error handling
      img.onerror = function() {
        console.log('Navbar image failed, using fallback:', this.src);
        this.src = 'images/lustav.png';
        this.setAttribute('srcset', 'images/lustav.png 1x, images/lustav.png 2x');
      };

      // Ensure image is visible
      img.style.opacity = '1';
    });
  }

  // Run immediately
  fixNavbarImages();

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixNavbarImages);
  }

  // Run periodically for dynamic content
  setInterval(fixNavbarImages, 1000);

  // Also run on any mutations
  const observer = new MutationObserver(() => {
    fixNavbarImages();
  });

  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['src', 'srcset']
    });
  }

})();
