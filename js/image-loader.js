
(function() {
  'use strict';

  // Image loading configuration
  const imageConfig = {
    retryAttempts: 3,
    retryDelay: 1000,
    fallbackImage: 'images/lustav.png',
    timeout: 10000
  };

  // List of all images that should be available
  const expectedImages = [
    'images/lustav.png',
    'images/backtome.jpg',
    'images/9.png',
    'images/chanel.jpg',
    'images/fourthofjuly.jpg',
    'images/lust-auto1.jpg',
    'images/lust-auto2.jpg',
    'images/lust-auto3.jpg',
    'images/lust-auto4.jpg',
    'images/lust-cover.webp',
    'images/adam-av.png',
    'images/applications.svg',
    'images/favicon.ico'
  ];

  // Image loading utilities
  function preloadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const timeout = setTimeout(() => {
        reject(new Error(`Image load timeout: ${src}`));
      }, imageConfig.timeout);

      img.onload = () => {
        clearTimeout(timeout);
        resolve(img);
      };

      img.onerror = () => {
        clearTimeout(timeout);
        reject(new Error(`Failed to load image: ${src}`));
      };

      img.src = src;
    });
  }

  async function loadImageWithRetry(src, attempts = imageConfig.retryAttempts) {
    for (let i = 0; i < attempts; i++) {
      try {
        await preloadImage(src);
        return src;
      } catch (error) {
        console.warn(`Attempt ${i + 1} failed for ${src}:`, error.message);
        if (i < attempts - 1) {
          await new Promise(resolve => setTimeout(resolve, imageConfig.retryDelay));
        }
      }
    }
    throw new Error(`Failed to load ${src} after ${attempts} attempts`);
  }

  // Fix all images on the page
  function fixAllImages() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      // Skip if already processed
      if (img.dataset.imageFixed) return;
      
      const originalSrc = img.src || img.getAttribute('src');
      const srcset = img.getAttribute('srcset');
      
      if (!originalSrc && !srcset) return;

      // Mark as processed
      img.dataset.imageFixed = 'true';

      // Fix external URLs and Next.js image URLs
      if (originalSrc) {
        if (originalSrc.includes('r2.lust.bot.nu') || 
            originalSrc.includes('_next/image') || 
            originalSrc.includes('https://')) {
          console.log('Fixing external image URL:', originalSrc);
          img.src = imageConfig.fallbackImage;
        } else if (originalSrc.includes('images/') && !originalSrc.startsWith('images/')) {
          const imageName = originalSrc.split('images/').pop();
          if (expectedImages.includes(`images/${imageName}`)) {
            img.src = `images/${imageName}`;
          } else {
            img.src = imageConfig.fallbackImage;
          }
        }
      }

      // Fix srcset attributes
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

      // Set up error handling
      img.onerror = function() {
        console.warn('Image failed to load:', this.src);
        
        // Try fallback image
        if (this.src !== imageConfig.fallbackImage) {
          console.log('Using fallback image for:', originalSrc);
          this.src = imageConfig.fallbackImage;
        } else {
          // If even fallback fails, hide the image
          this.style.visibility = 'hidden';
        }
      };

      // Set up loading state
      img.onload = function() {
        this.style.opacity = '1';
        this.style.transition = 'opacity 0.3s ease';
        this.style.visibility = 'visible';
      };

      // Initialize with reduced opacity
      img.style.opacity = '0.7';
    });
  }

  // Fix srcset attributes
  function fixImageSrcsets() {
    const images = document.querySelectorAll('img[srcset]');
    
    images.forEach(img => {
      const srcset = img.getAttribute('srcset');
      if (srcset) {
        // Fix paths in srcset
        const fixedSrcset = srcset.replace(/images\//g, 'images/');
        img.setAttribute('srcset', fixedSrcset);
      }
    });
  }

  // Preload critical images
  async function preloadCriticalImages() {
    const criticalImages = [
      'images/lustav.png',
      'images/backtome.jpg',
      'images/9.png',
      'images/chanel.jpg',
      'images/fourthofjuly.jpg'
    ];

    const preloadPromises = criticalImages.map(src => 
      loadImageWithRetry(src).catch(error => {
        console.warn('Failed to preload critical image:', src, error.message);
      })
    );

    try {
      await Promise.allSettled(preloadPromises);
      console.log('Critical images preloaded');
    } catch (error) {
      console.warn('Some critical images failed to preload:', error);
    }
  }

  // Initialize image loading
  function initImageLoader() {
    // Fix existing images
    fixAllImages();
    fixImageSrcsets();

    // Set up mutation observer for dynamic content
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            if (node.tagName === 'IMG') {
              fixAllImages();
            } else if (node.querySelectorAll) {
              const images = node.querySelectorAll('img');
              if (images.length > 0) {
                fixAllImages();
              }
            }
          }
        });
      });
    });

    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Preload critical images
    preloadCriticalImages();
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initImageLoader);
  } else {
    initImageLoader();
  }

  // Periodic checks
  setInterval(fixAllImages, 2000);

  // Expose globally for debugging
  window.imageLoader = {
    fixAllImages,
    preloadCriticalImages,
    loadImageWithRetry
  };

})();
