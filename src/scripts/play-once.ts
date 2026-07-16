/**
 * Play a one-shot animation WHEN THE VISITOR CAN ACTUALLY SEE IT — once.
 *
 * History, because it went wrong twice and the reason matters:
 *  1. v1 fired on a setTimeout ~370ms after paint. Measured on the live
 *     deployment, the diagram sat 785px down on desktop and 1213px down on
 *     mobile, so it played at 13% visibility or entirely off-screen and was
 *     static before anyone scrolled to it.
 *  2. v2 fired at `intersectionRatio >= 0.25`, which on a ~700px diagram means
 *     the top ~175px sliver. Same failure, milder — the transformation ran
 *     while the departments and findings were still below the fold.
 *
 * So the rule is not a ratio. It is: **the middle of the diagram is on screen**
 * — i.e. you are looking at it, not at its top edge — with a fallback for
 * diagrams taller than the viewport, whose midpoint may never comfortably sit
 * inside it.
 *
 * Also: fires once, never on scroll-back, and is inert under reduced motion
 * (the base state is already the resolved diagram, so doing nothing is right).
 */

export interface PlayOnceOptions {
  /** How long the sequence runs before `.play` is removed. */
  duration?: number;
  /** Settle time once the condition is met, so it starts after the eye lands. */
  delay?: number;
}

export function playOnce(el: HTMLElement, opts: PlayOnceOptions = {}) {
  const { duration = 1500, delay = 140 } = opts;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  let timer: number | undefined;

  function run() {
    if (reduce.matches) return;
    window.clearTimeout(timer);
    el.classList.remove('play');
    void el.offsetWidth; // reflow, so a replay genuinely restarts
    el.classList.add('play');
    timer = window.setTimeout(() => el.classList.remove('play'), duration);
  }

  if (reduce.matches) return { run };

  function readyToPlay(): boolean {
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;
    if (r.bottom <= 0 || r.top >= vh) return false;

    const visible = Math.min(r.bottom, vh) - Math.max(r.top, 0);
    // The element's own midpoint has entered the viewport…
    const mid = r.top + r.height / 2;
    const midOnScreen = mid > 0 && mid < vh * 0.9;
    // …or it is taller than the screen and now dominates it.
    const dominates = visible >= vh * 0.6;
    return midOnScreen || dominates;
  }

  let done = false;
  const fire = () => {
    if (done || !readyToPlay()) return;
    done = true;
    io.disconnect();
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
    window.setTimeout(run, delay);
  };

  // Scroll listener does the real evaluation (a ratio threshold is unreliable
  // on tall elements); the observer just wakes it up and covers the case where
  // the element is already in place on load. Both detach after the single fire.
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; fire(); });
  };

  const io = new IntersectionObserver(() => fire(), { threshold: [0, 0.25, 0.5, 0.75, 1] });
  io.observe(el);
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  return { run };
}
