let t = {
    number: o => !isNaN(o),
    object: o => (typeof o === 'object' || o instanceof Object) && o !== null && !t.array(o) && !t.function(o),
    string: o => typeof o === 'string' || o instanceof String,
    function: o => typeof o === 'function' || o instanceof Function,
    array: o => Array.isArray(o),
    undefined: o => typeof o == 'undefined',
};

export default t;
