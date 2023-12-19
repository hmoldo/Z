export function tel(tel) {
    let cleaned = ('' + tel).replace(/-|\s/g, ''),
        valid = cleaned.match(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im);
    if (!valid) return null;
    if (cleaned.startsWith('+')) return cleaned.substring(0, 4) + ' ' + cleaned.substring(4).replace(/(.{2})/g, '$1 ');
    return cleaned.replace(/(.{2})/g, '$1 ');
}
