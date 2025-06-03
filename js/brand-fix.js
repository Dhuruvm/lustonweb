// Comprehensive branding and error fix for lust website
(function() {
  'use strict';

  // Prevent React errors by catching them
  window.addEventListener('error', function(e) {
    if (e.message.includes('Minified React error')) {
      console.log('Caught React error, continuing with fallbacks');
      e.preventDefault();
    }
  });

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', function(e) {
    console.log('Caught promise rejection:', e.reason);
    e.preventDefault();
  });

  function fixAllBranding() {
    // Replace all text content containing "Greed" with "lust"
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
      if (node.textContent.includes('Greed')) {
        textNodes.push(node);
      }
    }

    textNodes.forEach(textNode => {
      textNode.textContent = textNode.textContent.replace(/Greed/g, 'lust');
    });

    // Fix specific elements by selector
    const elementsToFix = [
      'h1', 'h2', 'h3', 'p', 'span', 'div[class*="text"]'
    ];

    elementsToFix.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        if (el.innerHTML && el.innerHTML.includes('Greed')) {
          el.innerHTML = el.innerHTML.replace(/Greed/g, 'lust');
        }
      });
    });
  }

  function initializeStats() {
    const stats = {
      servers: 150,
      users: 200000,
      commands: 40900
    };

    // Find and update stat counters
    const statSelectors = [
      '.text-4xl.font-bold.text-white',
      '.text-xl.font-bold.text-white',
      '.text-2xl.font-bold.text-white',
      'span.inline-block'
    ];

    statSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach((el, index) => {
        if (el.textContent.trim() === '0' || el.textContent.trim() === '') {
          switch (index % 3) {
            case 0:
              el.textContent = stats.servers.toLocaleString();
              break;
            case 1:
              el.textContent = stats.users.toLocaleString();
              break;
            case 2:
              el.textContent = stats.commands.toLocaleString();
              break;
          }
        }
      });
    });
  }

  function fixImagePaths() {
    // Fix all image sources to ensure proper paths
    document.querySelectorAll('img').forEach(img => {
      const src = img.getAttribute('src');
      const srcset = img.getAttribute('srcset');
      
      if (!src && !srcset) return;

      // Fix main src attribute
      if (src) {
        // Check if it's an external URL or needs path fixing
        if (src.includes('r2.lust.bot.nu') || src.includes('_next/image') || src.startsWith('http')) {
          // Replace external URLs with local paths
          img.src = 'images/lustav.png';
        } else if (src.includes('images/') && !src.startsWith('images/')) {
          const imageName = src.split('images/').pop();
          img.src = `images/${imageName}`;
        } else if (!src.startsWith('images/') && !src.startsWith('/') && !src.startsWith('http')) {
          // Relative path, prepend images/
          img.src = `images/${src}`;
        }
      }

      // Fix srcset attributes
      if (srcset) {
        const fixedSrcset = srcset.split(',').map(item => {
          const [url, descriptor] = item.trim().split(' ');
          let fixedUrl = url;
          
          if (url.includes('r2.lust.bot.nu') || url.includes('_next/image') || url.startsWith('http')) {
            fixedUrl = 'images/lustav.png';
          } else if (url.includes('images/') && !url.startsWith('images/')) {
            const imageName = url.split('images/').pop();
            fixedUrl = `images/${imageName}`;
          }
          
          return `${fixedUrl} ${descriptor || ''}`.trim();
        }).join(', ');
        img.setAttribute('srcset', fixedSrcset);
      }

      // Enhanced error handling with multiple fallback attempts
      img.onerror = function() {
        console.log('Image failed to load:', this.src);
        
        // Try different fallbacks in order
        if (this.src.includes('r2.lust.bot.nu') || this.src.includes('_next/image')) {
          console.log('Using local fallback for external image:', this.src);
          this.src = 'images/lustav.png';
        } else if (this.src !== 'images/lustav.png') {
          console.log('Using main fallback image for:', this.src);
          this.src = 'images/lustav.png';
        } else {
          // Last resort - hide the image
          this.style.display = 'none';
        }
      };

      // Add loading state with better transition
      if (!img.complete) {
        img.style.opacity = '0.7';
        img.onload = function() {
          this.style.opacity = '1';
          this.style.transition = 'opacity 0.3s ease';
        };
      }
    });
  }


  // Run fixes when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(() => {
        fixAllBranding();
        initializeStats();
        fixImagePaths();
      }, 100);
    });
  } else {
    setTimeout(() => {
      fixAllBranding();
      initializeStats();
      fixImagePaths();
    }, 100);
  }

  // Run fixes periodically to catch dynamic content
  setInterval(fixAllBranding, 2000);
  setInterval(initializeStats, 3000);

})();