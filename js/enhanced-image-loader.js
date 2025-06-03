
(function() {
  'use strict';

  const imageConfig = {
    fallbackImage: 'images/lustav.png',
    maxRetries: 3,
    retryDelay: 1000,
    preloadImages: [
      'images/lustav.png',
      'images/backtome.jpg',
      'images/9.png',
      'images/chanel.jpg',
      'images/fourthofjuly.jpg',
      'images/lust-auto1.jpg',
      'images/lust-auto2.jpg',
      'images/lust-auto3.jpg',
      'images/lust-auto4.jpg',
      'images/adam-av.png',
      'images/applications.svg',
      'images/lust-cover.webp'
    ]
  };

  // Image retry mechanism
  function retryImage(img, originalSrc, retryCount = 0) {
    if (retryCount >= imageConfig.maxRetries) {
      console.warn('Max retries reached for image:', originalSrc);
      img.src = imageConfig.fallbackImage;
      return;
    }

    setTimeout(() => {
      const newImg = new Image();
      newImg.onload = function() {
        img.src = originalSrc;
        img.style.opacity = '1';
      };
      newImg.onerror = function() {
        retryImage(img, originalSrc, retryCount + 1);
      };
      newImg.src = originalSrc;
    }, imageConfig.retryDelay * (retryCount + 1));
  }

  // Fix all images on the page
  function fixAllImages() {
    document.querySelectorAll('img').forEach(img => {
      const src = img.getAttribute('src');
      const srcset = img.getAttribute('srcset');

      // Skip if already processed
      if (img.hasAttribute('data-enhanced-loader-processed')) {
        return;
      }
      img.setAttribute('data-enhanced-loader-processed', 'true');

      // Fix external or problematic URLs
      if (src) {
        if (src.includes('r2.lust.bot.nu') || 
            src.includes('_next/image') || 
            src.includes('https://') ||
            src.includes('songs/') ||
            src.includes('content/')) {
          
          // Extract filename and use local path
          const filename = src.split('/').pop().split('?')[0];
          const localPath = `images/${filename}`;
          
          if (imageConfig.preloadImages.includes(localPath)) {
            img.src = localPath;
          } else {
            img.src = imageConfig.fallbackImage;
          }
        }
      }

      // Fix srcset
      if (srcset) {
        const fixedSrcset = srcset.split(',').map(item => {
          const [url, descriptor] = item.trim().split(' ');
          if (url.includes('r2.lust.bot.nu') || url.includes('_next/image')) {
            return `${imageConfig.fallbackImage} ${descriptor || ''}`.trim();
          }
          return item;
        }).join(', ');
        img.setAttribute('srcset', fixedSrcset);
      }

      // Enhanced error handling
      img.onerror = function() {
        if (this.src !== imageConfig.fallbackImage) {
          console.log('Image failed, using fallback:', this.src);
          this.src = imageConfig.fallbackImage;
        }
      };

      // Loading state
      if (!img.complete) {
        img.style.opacity = '0.7';
        img.onload = function() {
          this.style.opacity = '1';
          this.style.transition = 'opacity 0.3s ease';
        };
      }
    });
  }

  // Preload critical images
  function preloadImages() {
    imageConfig.preloadImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
    console.log('Critical images preloaded');
  }

  // Remove "View Commands" links
  function removeCommandsLinks() {
    // Remove from navigation
    document.querySelectorAll('a[href="/commands"]').forEach(link => {
      const text = link.textContent.toLowerCase();
      if (text.includes('commands') || text.includes('view commands')) {
        link.style.display = 'none';
      }
    });

    // Remove "View All Features" link that points to commands
    document.querySelectorAll('a[href="/commands"]').forEach(link => {
      if (link.textContent.includes('View All Features') || 
          link.textContent.includes('View Commands')) {
        link.style.display = 'none';
      }
    });
  }

  // Initialize
  function init() {
    preloadImages();
    fixAllImages();
    removeCommandsLinks();

    // Set up mutation observer for dynamic content
    const observer = new MutationObserver((mutations) => {
      let shouldProcess = false;
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          shouldProcess = true;
        }
      });
      
      if (shouldProcess) {
        setTimeout(() => {
          fixAllImages();
          removeCommandsLinks();
        }, 100);
      }
    });

    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }

    // Periodic cleanup
    setInterval(() => {
      fixAllImages();
      removeCommandsLinks();
    }, 5000);
  }

  // Run when ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
