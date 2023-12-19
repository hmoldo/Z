const d = document;

export function getWheelDelta(e) {
    let delta = e.originalEvent ? e.originalEvent.wheelDelta : e.deltaY;
    if (delta === undefined) delta = e.originalEvent.detail;
    return Math.max(-1, Math.min(1, delta)); // cap the delta to [-1,1] for cross browser consistency
}

// Mouse drag -------------------------------------
const momentumFactor = 0.95,
    momentumThreshold = 0.5;
let momentumID, mouse;

export function mouseStartDrag(e, m) {
    cancelAnimationFrame(momentumID);
    Z.io.mouseOn({ move: mouseDrag, up: mouseStopDrag });

    let { $el } = m;
    mouse = Object.assign(m, {
        startX: e.clientX,
        startY: e.clientY,
        dx: 0,
        dy: 0,
        scrollX: $el.scrollLeft,
        scrollY: $el.scrollTop,
        isDown: true,
        isScroll: true,
    });
    return mouse;
}

export function mouseDrag(e) {
    let { $el } = mouse,
        prevScroll = {
            x: $el.scrollLeft,
            y: $el.scrollTop,
        };
    $el.addEventListener('click', e => e.stopPropagation(), { once: true });
    Object.assign(mouse, {
        dx: e.clientX - mouse.startX,
        dy: e.clientY - mouse.startY,
    });
    $el.scrollLeft = mouse.scrollX - mouse.dx;
    $el.scrollTop = mouse.scrollY - mouse.dy;
    mouse.v = {
        x: $el.scrollLeft - prevScroll.x,
        y: $el.scrollTop - prevScroll.y,
    };
}

export function mouseStopDrag(e) {
    e.stopPropagation();
    let { free, onRelease } = mouse;
    Z.io.mouseOff({ move: mouseDrag, up: mouseStopDrag });
    mouse.isDown = false;
    mouse.assign?.();
    if (free) {
        beginMomentumTracking();
    } else {
        onRelease?.(mouse);
    }
}

// momentum nanagement
function beginMomentumTracking() {
    cancelAnimationFrame(momentumID);
    momentumID = rAF(() => momentumLoop());
}

function momentumLoop() {
    let { v, onStop } = mouse;
    if (!v) return;
    mouse.$el.scrollLeft += v.x;
    v.x *= momentumFactor;
    if (Math.abs(v.x) > momentumThreshold) {
        momentumID = requestAnimationFrame(momentumLoop);
    } else {
        mouse.isScroll = false;
        if (onStop) onStop(mouse);
    }
    mouse.assign?.();
}

export function touchStart(e, pan) {
    Object.assign(pan, getEvent(e));
    pan.startX = pan.screenX;
    pan.startY = pan.screenY;
    pan.started = pan.isX = pan.isY = false;
    // console.log('touchstart ---------------------');
    // console.log(pan);
}

export function touchMove(e, pan) {
    Object.assign(pan, getEvent(e));
    pan.x = pan.screenX;
    pan.y = pan.screenY;
    pan.dx = pan.x - pan.startX;
    pan.dy = pan.y - pan.startY;
    if (!pan.started) {
        pan.started = true;
        pan.isX = Math.abs(pan.dx) > Math.abs(pan.dy);
        pan.isY = !pan.isX;
    }
    // console.log('touchmove ---------------------');
    // console.log(pan);
}

function getEvent(e) {
    const { pageX, pageY, screenX, screenY } = e.targetTouches ? e.targetTouches[0] : e;
    return { pageX, pageY, screenX, screenY };
}

export function mouseOn({ down, up, move }) {
    if (down) d.addEventListener('mousedown', down);
    if (up) d.addEventListener('mouseup', up);
    if (move) d.addEventListener('mousemove', move);
}

export function mouseOff({ down, up, move }) {
    if (down) d.removeEventListener('mousedown', down);
    if (up) d.removeEventListener('mouseup', up);
    if (move) d.removeEventListener('mousemove', move);
}

export async function copy(text, plain = true) {
    if (plain) {
        text = text
            .replace(/<br\s*[/]?>/gi, '\n')
            .replace(/&nbsp;/gi, ' ')
            .replace(/<[^>]+>/g, '');
    }
    return await navigator.clipboard.writeText(text);
}
