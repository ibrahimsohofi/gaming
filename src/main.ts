// Initialize any interactive elements
document.addEventListener('DOMContentLoaded', () => {
  console.log('Gaming Content Locker Page Loaded');

  // Add smooth scrolling for anchor links
  const anchors = document.querySelectorAll('a[href^="#"]');
  for (const anchor of anchors) {
    anchor.addEventListener('click', function(this: HTMLAnchorElement, e: Event) {
      e.preventDefault();
      const href = this.getAttribute('href') || '';
      if (href.startsWith('#') && href.length > 1) {
        const targetId = href.substring(1); // Remove the # character
        const target = document.getElementById(targetId);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }
    });
  }
});
