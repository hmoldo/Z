const MIME_TYPES = {
    txt: 'text/plain',
    csv: 'text/csv',
    ics: 'text/calendar',
    vcf: 'text/vcard',
    pdf: 'application/pdf',
    json: 'application/json',
};

export const get = type => (type ? 'data:' + MIME_TYPES[type] + ';charset=utf-8,' : '');
