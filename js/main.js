const routes = {
    '/': '/content/home.html',
    '/about': '/content/about.html',
    '/contact': '/content/contact.html'
};

const app = () => document.getElementById('app');

const loadPageModule = async (path) => {
    // ページごとのjsがある場合は動的 import して init() があれば呼ぶ
    const name = path === '/' ? 'home' : path.replace(/^\//, '');
    try {
        const mod = await import(`/js/pages/${name}.js`);
        if (mod && typeof mod.init === 'function') mod.init();
    } catch (e) {
    }
};

export const render = async (path) => {
    const el = app();
    const p = (path && path.startsWith('/')) ? path : '/' + (path || '');
    const content = routes[p];
    if (!content) {
        el.innerHTML = '<h1>404: ページが見つかりません</h1>';
        return;
    }
    try {
        const res = await fetch(content);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        el.innerHTML = await res.text();
        await loadPageModule(p);
    } catch (err) {
        console.error('コンテンツの取得に失敗しました:', err);
        el.innerHTML = '<h1>コンテンツの読み込みエラー</h1><p>データの取得に失敗しました。</p>';
    }
};

// a[data-link] をクリックしたら SPA ナビゲーション
document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a[data-link]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href) return;
    if (href.startsWith('http') || a.target === '_blank') return;
    e.preventDefault();
    history.pushState({}, '', href);
    render(href);
});

window.addEventListener('popstate', () => render(location.pathname));
document.addEventListener('DOMContentLoaded', () => render(location.pathname));
