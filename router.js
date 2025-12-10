const routes = {
    '/': 'content/home.html',
    '/about': 'content/about.html',
    '/contact': 'content/contact.html'
};

const fetchAndRender = async (path) => {
    const app = document.getElementById('app');
    const p = path && path.startsWith('/') ? path : '/' + (path || '');
    const content = routes[p];
    if (!content) {
        app.innerHTML = '<h1>404: ページが見つかりません</h1>';
        return;
    }
    try {
        const res = await fetch(content);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        app.innerHTML = await res.text();
    } catch (err) {
        console.error('コンテンツの取得に失敗しました:', err);
        app.innerHTML = '<h1>コンテンツの読み込みエラー</h1><p>データの取得に失敗しました。</p>';
    }
};

// a[data-link] のクリックをハンドルして履歴操作
document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-link]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href) return;
    if (href.startsWith('http') || a.target === '_blank') return;
    e.preventDefault();
    history.pushState({}, '', href);
    fetchAndRender(href);
});

window.addEventListener('popstate', () => fetchAndRender(location.pathname));
document.addEventListener('DOMContentLoaded', () => fetchAndRender(location.pathname));
