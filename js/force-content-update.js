// Force content updates for statistics and music player
document.addEventListener('DOMContentLoaded', function() {
  // Force update statistics immediately
  function forceUpdateStats() {
    // Update hero subtitle
    const heroSubtitle = document.querySelector('p.text-lg.md\\:text-xl.leading-relaxed.text-zinc-300');
    if (heroSubtitle) {
      heroSubtitle.textContent = 'Trusted by 50+ servers and 200k+ users, seamlessly blending functionality with style.';
      heroSubtitle.style.opacity = '1';
    }

    // Update statistics counters
    const statsSpans = document.querySelectorAll('[data-counter]');
    statsSpans.forEach(span => {
      const counter = span.getAttribute('data-counter');
      switch (counter) {
        case 'servers':
          span.textContent = '50+';
          break;
        case 'users':
          span.textContent = '200k+';
          break;
        case 'commands':
          span.textContent = '40.9k+';
          break;
      }
    });

    // Alternative method - find by text content
    const allSpans = document.querySelectorAll('span.inline-block');
    allSpans.forEach((span, index) => {
      const parent = span.closest('.text-center');
      if (parent) {
        const label = parent.querySelector('.text-zinc-400');
        if (label) {
          if (label.textContent.includes('Active Servers')) {
            span.textContent = '50+';
          } else if (label.textContent.includes('Total Users')) {
            span.textContent = '200k+';
          } else if (label.textContent.includes('Daily Commands')) {
            span.textContent = '40.9k+';
          }
        }
      }
    });

    // Force music player to show Jhol by Ice (from config)
    const musicTitle = document.querySelector('.text-white.text-sm.font-medium');
    const musicArtist = document.querySelector('.text-zinc-400.text-sm');
    if (musicTitle && musicTitle.textContent !== 'Jhol') {
      musicTitle.textContent = 'Jhol';
    }
    if (musicArtist && musicArtist.textContent !== 'Ice') {
      musicArtist.textContent = 'Ice';
    }
  }

  // Run immediately
  forceUpdateStats();

  // Run once more after dynamic loader finishes
  setTimeout(forceUpdateStats, 1000);
});