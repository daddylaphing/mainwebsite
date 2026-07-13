/**
 * Smooth Scroll Utilities
 * Enhanced scrolling with offset support for fixed headers
 */

export interface SmoothScrollOptions {
  offset?: number;
  duration?: number;
  easing?: "linear" | "easeInOut" | "easeOut" | "easeIn";
}

/**
 * Scroll to element smoothly with offset
 */
export function scrollToElement(
  elementId: string,
  options: SmoothScrollOptions = {}
): void {
  const { offset = 90, duration = 800, easing = "easeInOut" } = options;
  
  const element = document.getElementById(elementId);
  if (!element) return;

  const bodyRect = document.body.getBoundingClientRect().top;
  const elementRect = element.getBoundingClientRect().top;
  const elementPosition = elementRect - bodyRect;
  const offsetPosition = elementPosition - offset;
  const startPosition = window.pageYOffset;
  const distance = offsetPosition - startPosition;
  let startTime: number | null = null;

  // Easing functions
  const easingFunctions = {
    linear: (t: number) => t,
    easeInOut: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
    easeOut: (t: number) => t * (2 - t),
    easeIn: (t: number) => t * t,
  };

  function animation(currentTime: number) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const ease = easingFunctions[easing](progress);

    window.scrollTo(0, startPosition + distance * ease);

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }

  requestAnimationFrame(animation);
}

/**
 * Scroll to top smoothly
 */
export function scrollToTop(duration = 600): void {
  const startPosition = window.pageYOffset;
  const distance = -startPosition;
  let startTime: number | null = null;

  function animation(currentTime: number) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const ease = progress * (2 - progress); // easeOut

    window.scrollTo(0, startPosition + distance * ease);

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }

  requestAnimationFrame(animation);
}

/**
 * Check if element is in viewport
 */
export function isInViewport(element: HTMLElement, offset = 0): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= -offset &&
    rect.left >= -offset &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth) + offset
  );
}

/**
 * Get scroll progress (0-1) of an element
 */
export function getScrollProgress(element: HTMLElement): number {
  const rect = element.getBoundingClientRect();
  const elementTop = rect.top + window.pageYOffset;
  const elementHeight = rect.height;
  const windowHeight = window.innerHeight;
  const scrollTop = window.pageYOffset;

  const start = elementTop - windowHeight;
  const end = elementTop + elementHeight;
  const distance = end - start;
  const progress = (scrollTop - start) / distance;

  return Math.max(0, Math.min(1, progress));
}

/**
 * Smooth scroll hook for React components
 */
export function useSmoothScroll() {
  return {
    scrollToElement,
    scrollToTop,
    isInViewport,
    getScrollProgress,
  };
}
