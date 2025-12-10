// js/components/nav.js
export function highlightCurrent() {
    const links = document.querySelectorAll('a[data-link]');
    links.forEach(a => {
        if (a.getAttribute('href') === location.pathname) a.classList.add('active');
        else a.classList.remove('active');
    });
}
