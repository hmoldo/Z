import Z from './Z';
const W = window;

let t = {
    // viewport state
    vw: 0,
    vh: 0,
    vw2: 0,
    vh2: 0,
    vr: 0, // viewport aspect ratio
    vwr: 0,

    init() {
        W.addEventListener('resize', t.onResize);
        W.addEventListener('orientationchange', t.onResize);
        rAF(() => t.onResize());
    },

    //resize --------------------------------------------
    onResize(e) {
        if (e) e.preventDefault();
        Z.vw = W.innerWidth;
        Z.vh = W.innerHeight;
        Z.vmin = Math.min(Z.vw, Z.vh);
        Z.vw2 = Z.vw / 2;
        Z.vh2 = Z.vh / 2;
        Z.vr = Z.vw / Z.vh;
        Z.vwr = Z.vr > Z.respAspectRatio ? Z.vh * Z.respAspectRatio : Z.vw;
    },
};

export default t;
