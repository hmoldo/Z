const W = window,
    D = document,
    ROOT_El = D.documentElement;

// css helpers
export const get = (el, prop) => parseFloat(W.getComputedStyle(el, null).getPropertyValue(prop));
export const getVar = varName => getComputedStyle(ROOT_El).getPropertyValue(varName);
export const setVar = (varName, val) => ROOT_El.style.setProperty('--' + varName, val);
export const setVars = o => {
    for (let key in o) ROOT_El.style.setProperty(key, o[key]);
};
