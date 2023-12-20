const W = window,
    N = W.navigator;

export function detectStandalone() {
    const { hash } = W.location;
    if (N.standalone) return true;
    if (W.matchMedia('(display-mode: standalone)').matches) return true;
    if (hash === '#:standalone:') {
        // first run (open app) in standalone mode cache state in sessionStorage
        sessionStorage.setItem(':standalone:', '1');
        // remove hash part from the url before actual app start, in case if your app uses hash (#) routing
        history.replaceState(history.state, '', '/');
        return true;
    } else if (sessionStorage.getItem(':standalone:')) {
        // Second and subsequent runs (reloads) sessionStorage is unique per tab
        // and Home Screen app is just a chrome-less tab.
        // So it's safe to assume that user is still in standalone mode
        return true;
    }
    return false;
}
