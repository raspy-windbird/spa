const routes = {
    "/": "/content/home.html",
    "/about": "/content/about.html",
};

const renderContent = async (path) => {
    const app = document.getElementById("app");
    const contentPath = routes[path];

    if (!contentPath) {
        app.innerHTML = "<h1>404: ページが見つかりません</h1>";
        return;
    }

    try {
        const response = await fetch(contentPath);

        if (!response.ok) {
            throw new Error(`HTTP error status: ${response.status}`);
        }
        const data = await response.text();
        app.innerHTML = data;

    } catch (error) {
        console.error("コンテンツの取得に失敗しました:", error);
        app.innerHTML = "<h1>コンテンツの読み込みエラー</h1><p>データの取得に失敗しました。</p>";
    }
};

const route = (event) => {
    event.preventDefault();
    const href = event.target.getAttribute('href');
    window.history.pushState({}, "", href);

    renderContent(href);
};

window.onpopstate = () => {
    renderContent(window.location.pathname);
};

document.addEventListener("DOMContentLoaded", () => {
    renderContent(window.location.pathname);
});
