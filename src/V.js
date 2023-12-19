const V = {
    sv: s => ({ x: s.width, y: s.height }),

    zero: () => ({ x: 0, y: 0 }),

    // clone
    clone: s => ({ x: s.x, y: s.y }),
    sClone: s => ({ width: s.width, height: s.height }),

    // invert
    inv: s => ({ x: -s.x, y: -s.y }),
    sInv: s => ({ width: -s.width, height: -s.height }),

    // assign
    eq: (s1, s2) => s1.x == s2.x && s1.y == s2.y,
    sEq: (s1, s2) => s1.width == s2.width && s1.height == s2.height,

    // addition
    add: (...vs) => vs.reduce((n, s) => ({ x: n.x + s.x, y: n.y + s.y }), { x: 0, y: 0 }),
    sAdd: (...vs) =>
        vs.reduce((n, s) => ({ width: n.width + s.width, height: n.height + s.height }), { width: 0, height: 0 }),

    // substraction
    sub: (s1, s2) => ({ x: s1.x - s2.x, y: s1.y - s2.y }),
    sSub: (s1, s2) => ({ width: s1.width - s2.width, height: s1.height - s2.height }),

    mul: (s, m) => ({ x: s.x * m, y: s.y * m }),
    sMul: (s, m) => ({ width: s.width * m, height: s.height * m }),

    div: (s, m) => ({ x: s.x / m, y: s.y / m }),

    dot: (s1, s2) => ({ x: s1.x * s2.x, y: s1.y * s2.y }),

    ofs: (s1, s2) => ({ x: (s1.width - s2.width) / 2, y: (s1.height - s2.height) / 2 }),

    sDotInv: (s1, s2) => ({ width: s1.width / s2.width, height: s1.height / s2.height }),
    center: rect => V.add(rect, V.mul(V.sv(rect), 0.5)),

    clamp: (s, v1, v2) => ({ x: Z.math.clamp(s.x, v1.x, v2.x), y: Z.math.clamp(s.y, v1.y, v2.y) }),
};

window.V = V;
export default V;
