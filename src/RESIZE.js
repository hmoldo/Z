const W = window;

export default {
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
