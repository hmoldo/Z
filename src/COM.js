export function vcf(vcf) {
    if (!vcf) return null;
    if (Blob) {
        let blob = new Blob([vcf], { type: 'text/vcard' });
        return URL.createObjectURL(blob);
    }
    return 'data:text/vcard;base64,' + btoa(vcf);
}
