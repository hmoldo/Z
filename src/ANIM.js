import anime from 'animejs/lib/anime.es.js';

const DEFAULT_EASE = 'easeOutQuad';

export function animateHeight(el) {
    // get child bounds
    let child = el.firstChild,
        { height } = child.getBoundingClientRect();
    el.style.height = height + 'px';
}

export function scrollTo(o) {
    let { el, delay = 0, x = 0, y = 0, duration = 500, easing = DEFAULT_EASE } = o;
    const pos = { left: el.scrollLeft, top: el.scrollTop };
    anime({
        targets: pos,
        left: x,
        top: y,
        duration,
        easing,
        delay,
        update: () => el.scrollTo(pos),
    });
}
