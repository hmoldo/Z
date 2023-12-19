export function setLinks(el, router) {
    el.querySelectorAll('a[href]').forEach(a =>
        a.addEventListener('click', e => {
            let href = a.getAttribute('href');
            if (href.startsWith('http')) return;
            e.preventDefault();
            router.push(href);
        })
    );
}
