import $ from 'cash-dom';

$.fn.extend({
    reduce(fn, a) {
        this.each((i, el) => (a = fn(a, $(el))));
        return a;
    },
    attrs(attr) {
        return this.filter('[' + attr + ']').reduce((a, $el) => a.concat($el.attr(attr)), []);
    },
    isHidden() {
        return this.css('display') == 'none';
    },
    visible(v = true) {
        return this.css({ visibility: v ? 'visible' : 'hidden' });
    },
    focus() {
        this.trigger('focus');
    },
    cssNum(css) {
        return parseFloat(this.css(css));
    },
    ne() {
        return this.length ? this : null;
    },
    translate(o) {
        if (o.scale) o.sx = o.sy = o.scale;
        let { x, y, sx, sy, r } = o;
        let vals = Object.values({
            x: 'x' in o ? 'translateX(' + (isNaN(x) || x === 0 ? x : x + 'px') + ')' : null,
            y: 'y' in o ? 'translateY(' + (isNaN(y) || y === 0 ? y : y + 'px') + ')' : null,
            r: 'r' in o ? 'rotate(' + (isNaN(r) || r === 0 ? r : r + 'deg') + ')' : null,
            sx: 'sx' in o ? 'scaleX(' + sx + ')' : null,
            sy: 'sy' in o ? 'scaleY(' + sy + ')' : null,
        }).filter(v => v);
        return this.css({ transform: vals.join(' ') });
    },
    // Gets computed translate values
    getTransform() {
        const style = window.getComputedStyle(this[0]),
            matrix = style['transform'] || style.webkitTransform || style.mozTransform;
        // No transform property. Simply return 0 values.
        if (matrix === 'none' || typeof matrix === 'undefined') return { x: 0, y: 0, z: 0 };
        // Can either be 2d or 3d transform
        const matrixType = matrix.includes('3d') ? '3d' : '2d',
            matrixValues = matrix.match(/matrix.*\((.+)\)/)[1].split(', ');
        // 2d matrices have 6 values. Last 2 values are X and Y. 2d matrices does not have Z value.
        if (matrixType === '2d') return { x: matrixValues[4], y: matrixValues[5], z: 0 };
        // 3d matrices have 16 values. The 13th, 14th, and 15th values are X, Y, and Z
        if (matrixType === '3d') return { x: matrixValues[12], y: matrixValues[13], z: matrixValues[14] };
    },

    rect() {
        return this.length ? this[0].getBoundingClientRect() : null;
    },
    rectCss(css) {
        let a = {};
        Z.cRect.forEach(k => (a[k] = this.cssNum(css + '-' + k) || 0));
        return a;
    },
    outerRect() {
        let rect = this.rect(),
            margin = this.rectCss('margin');
        return {
            x: rect.x - margin.left,
            y: rect.y - margin.top,
            width: rect.width + margin.left + margin.right,
            height: rect.height + margin.top + margin.bottom,
        };
    },
    inView() {
        let r = this.rect();
        return r.y < Z.vh && r.x < Z.vw && r.bottom > 0 && r.right > 0;
    },

    cover(w, h, ratio = 1) {
        let { x, y, width, height } = Z.cover(w, h, ratio);
        this.each((i, el) => $(el).css({ width, height }).translate({ x, y }));
    },
    coverParent(ratio) {
        this.each((i, el) => {
            let { width, height } = $(el).parent().rect();
            $(el).cover(width, height, ratio);
        });
    },
    rectTest($target, mode) {
        const r1 = this.rect(),
            r2 = $target.rect();
        if (mode == 't<t') return r1.top < r2.top;
    },
    placeBy($el, geom) {
        let rect = $el.rect();

        this.css({
            top: rect.bottom + geom.bottom,
            // left: rect.left + geom.left,
            right: Z.vw - rect.right + geom.right,
        });
    },

    dataToProp(...keys) {
        this.each((i, el) => Z.assignElementDataToObject(el, $(el), ...keys));
    },

    async copy({ fn, msg }) {
        let range,
            el = this[0];
        try {
            let text = el.innerHTML;
            await navigator.clipboard.writeText(el.innerHTML);
            if (fn) fn(text);
        } catch (err) {
            if (document.selection) {
                range = Z.body.createTextRange();
                range.moveToElementText(el);
                range.select().createTextRange();
            } else if (window.getSelection) {
                range = document.createRange();
                range.selectNode(el);
                window.getSelection().addRange(range);
            }
            if (range) {
                document.execCommand('copy');
                if (msg) alert(msg);
                if (fn) {
                    console.log('coppied');
                    fn();
                }
            }
        }
    },

    // returns html treamed from whitespaces (removing text nodes)
    trim() {
        return this.html().trim().replace(/\n\t/g, '');
    },
    displayed() {
        return this.css('display') != 'none';
    },
    // @todo:Harry animations --------------------------
    reveal(duration = 600, o = {}) {
        let el = this.show().css({ opacity: 0 })[0];
        if (o.fromLeft)
            Z.anim.anim(el, 600, { opacity: [0, 1], translateX: ['0%', '-50%'], translateY: ['-50%', '-50%'] });
        else Z.anim.fadeIn(el, duration, o);
    },
    fadeIn(o) {
        let el = this.show().css({ opacity: 0 })[0];
        Z.anim.fadeIn(el, 400, o);
    },
    fadeOut(o) {
        Z.anim.fadeOut(this[0], 400, o);
    },
    fadeInDown() {
        this.show().css({ opacity: 0 });
        requestAnimationFrame(() => {
            let { x, y } = this.getTransform();
            Z.anim.anim(this[0], 600, { opacity: [0, 1], translateX: [x, x], translateY: ['-100%', y] });
        });
        return this;
    },
    fadeOutUp() {
        let { x } = this.getTransform();
        Z.anim.anim(this[0], 600, { opacity: 0, translateX: [x, x], translateY: '-100%' });
        return this;
    },
    fadeOutRemove(duration) {
        Z.anim.fadeOutRemove(this[0], duration);
    },

    toggleReveal() {
        let collapsed = this.data('collapsed');
        if (collapsed) {
            let $block = this.children().eq(0),
                height = $block.height();
            this.height(height);
        } else {
            this.height(0);
        }
        this.data({ collapsed: !collapsed });
        return !collapsed;
    },

    isScrollable() {
        let el = this[0];
        if (!el) return false;
        const hasScrollableContent = el.scrollHeight > el.clientHeight,
            overflowYStyle = window.getComputedStyle(el).overflowY,
            isOverflowHidden = overflowYStyle.indexOf('hidden') !== -1;

        return hasScrollableContent && !isOverflowHidden;
    },

    scrollableParent() {
        if (this.isScrollable()) return this;
        const $parent = this.parent(),
            hasParent = this.parent().length,
            isBody = this[0].tagName == 'BODY';
        if (!isBody && hasParent) return $parent.scrollableParent();
    },
    refreshClass() {
        this.removeClass('heart');
        rAF(() => this.addClass('heart'));
    },
});

let t = {
    // elements --------------------------------------------------------------

    /**
     * Assigns element data attributes to object properties.
     * Names of data attribute & props are the same.
     * Bypasses non defined attributes.
     * @param {*} obj The object to assign properties.
     * @param {*} $el Element to look for data attributes.
     * @param  {...string} props The data attrs and prop names.
     */
    assignElementDataToObject(obj, $el, ...keys) {
        keys.forEach(k => ($el[0].hasAttribute('data-' + k) ? (obj[k] = $el.data(k)) : null));
        return obj;
    },

    // TODO: DOM - Harry: Create a class for positioning elements relative to others with offset options
    putElement(el, anchor) {
        let $parent = $(el).parent().ne();
        if (!$parent) return;
        let elBB = $parent.rect(),
            anchorBB = $(anchor).rect();
        $(el).css({
            width: anchorBB.width,
            left: anchorBB.x - elBB.x,
        });
    },

    moveToPoint(el, pos, dump, p) {
        $.extend(pos, Z.pntOnLine(pos, p, dump));
        el.style.transform = `translate3d(${pos.x}px,${pos.y}px,0)`;
    },
    moveToCursor: (el, pos, dump) => t.moveToPoint(el, pos, dump, Z.mouse),
    onImageLoaded($img, cb) {
        if (!$img || !$img.length) return;
        if ($img[0].complete) cb();
        else $img.on('load', cb);
    },

    // set position (translate) of element instantly (stops transition if any)
    // optionally reapply the transition
    positionElement(el, pos, release = true) {
        let $el = $(el),
            oldTransition = $el.css('transition');
        $el.css({ transition: 'none' }).translate(pos);
        el.offsetHeight;
        if (release) $el.css({ transition: oldTransition });
    },
};

export default t;
