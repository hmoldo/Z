const regEmail =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    regTel = new RegExp(/^[0-9-+\s()]*$/);

export const email = v => !v || v.toLowerCase().match(regEmail);
export const tel = v => !v || regTel.test(v);
export const required = (v, force) => {
    if (v?.trim) return force ? v.trim().length > 0 : !v || v.trim().length > 0;
    return !!v;
};
export const between = (v, min, max) => (Z.is.undefined(v) ? true : v >= min && v <= max);
