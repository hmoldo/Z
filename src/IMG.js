export function srcset(arr, widths = [720, 1080]) {
    if (!arr?.length) return null;
    if (arr.length == 1) return null;
    let srcset = [];
    for (let i = 0; i < arr.length && i < widths.length; i++) {
        srcset.push(arr[i] + ' ' + widths[i] + 'w');
    }
    return srcset.join(', ');
}

export function srcAndSet(arr, widths = [720, 1080]) {
    if (!arr?.length) return null;
    return {
        src: arr[0],
        srcset: srcset(arr, widths),
    };
}
