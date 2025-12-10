// シンプルなクライアントルーター（単一実装）
const routes = {
    '/': 'spa/content/home.html',
    '/about': 'spa/content/about.html',
    '/contact': 'spa/content/contact.html'
};

// ベースパス検出: <base> 要素優先、次にスクリプトの配置から推測
const getBase = () => {
    const baseEl = document.querySelector('base');
    if (baseEl && baseEl.getAttribute('href')) {
        return baseEl.getAttribute('href').replace(/\/$/, '');
    }
    const script = document.currentScript && document.currentScript.src;
    if (!script) return '';
    try {
        const u = new URL(script, location.href);
        const p = u.pathname.replace(/\/router\.js$/, '');
        return p === '/' ? '' : p;
    } catch (e) {
        return '';
    }
};

const base = getBase();

const normalize = (path) => {
    if (!path) path = '/';
    // base が前に付いていたら取り除く
    if (base && path.startsWith(base)) {
        path = path.slice(base.length) || '/';
    }
    if (!path.startsWith('/')) path = '/' + path;
    return path;
};

const buildFetchUrl = (contentPath) => {
    if (contentPath.startsWith('http') || contentPath.startsWith('/')) return contentPath;
    return (base ? base.replace(/\/$/, '') + '/' : '') + contentPath.replace(/^\//, '');
};

const render = async (path) => {
    const app = document.getElementById('app');
    const p = normalize(path);
    const content = routes[p];
    if (!content) {
        app.innerHTML = '<h1>404: ページが見つかりません</h1>';
        return;
    }

    const url = buildFetchUrl(content);
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        app.innerHTML = await res.text();
    } catch (err) {
        console.error('コンテンツの取得に失敗しました:', err);
        app.innerHTML = '<h1>コンテンツの読み込みエラー</h1><p>データの取得に失敗しました。</p>';
    }
};

// イベント委譲で a[data-link] を処理
document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-link]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href) return;
    // 外部リンクやターゲット指定は無視
    if (href.startsWith('http') || a.target === '_blank') return;
    e.preventDefault();
    const newPath = href.startsWith(base) ? href : (base + (href.startsWith('/') ? href : '/' + href));
    history.pushState({}, '', newPath);
    render(newPath);
});

window.addEventListener('popstate', () => render(location.pathname));

document.addEventListener('DOMContentLoaded', () => render(location.pathname));
