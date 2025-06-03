// Stats counter and branding fix script
document.addEventListener('DOMContentLoaded', function() {
  // Define the correct stats values
  const statsData = {
    servers: 150,
    users: 200000,
    commands: 40900
  };

  function formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  function animateCounter(element, target, duration = 2000) {
    const start = parseInt(element.textContent) || 0;
    const increment = (target - start) / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if ((increment > 0 && current >= target) || (increment < 0 && current <= target)) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = formatNumber(Math.floor(current));
    }, 16);
  }

  function fixBranding() {
    // Fix all instances of "Greed" to "lust"
    const textElements = document.querySelectorAll('h1, h2, h3, p, span, div');
    textElements.forEach(element => {
      if (element.textContent && element.textContent.includes('Greed')) {
        element.innerHTML = element.innerHTML.replace(/Greed/g, 'lust');
      }
    });

    // Specifically fix the hero title
    const heroTitle = document.querySelector('h1');
    if (heroTitle) {
      heroTitle.innerHTML = 'Elevate your Server with <span class="text-lust-primary">lust</span>';
    }

    // Fix CTA text
    const ctaText = document.querySelector('p[children*="Greed"]');
    if (ctaText) {
      ctaText.textContent = ctaText.textContent.replace(/Greed/g, 'lust');
    }
  }

  function fixStats() {
    // Fix stats counters in hero section
    const statElements = document.querySelectorAll('.text-4xl.font-bold.text-white, .text-xl.sm\\:text-2xl.lg\\:text-4xl.font-bold.text-white span');

    statElements.forEach((element, index) => {
      const text = element.textContent.trim();
      if (text === '0' || text === '' || parseInt(text) === 0) {
        switch (index) {
          case 0:
            animateCounter(element, statsData.servers);
            break;
          case 1:
            animateCounter(element, statsData.users);
            break;
          case 2:
            animateCounter(element, statsData.commands);
            break;
        }
      }
    });

    // Fix bottom stats section
    const bottomStats = document.querySelectorAll('.text-xl.sm\\:text-2xl.lg\\:text-4xl.font-bold.text-white .inline-block');
    bottomStats.forEach((element, index) => {
      if (element.textContent === '0' || parseInt(element.textContent) === 0) {
        switch (index) {
          case 0:
            animateCounter(element, statsData.servers);
            break;
          case 1:
            animateCounter(element, statsData.users);
            break;
          case 2:
            animateCounter(element, statsData.commands);
            break;
        }
      }
    });
  }

  // Run fixes immediately and on intervals
  fixBranding();
  fixStats();

  // Set up periodic checks
  setInterval(fixBranding, 1000);
  setInterval(fixStats, 2000);
});