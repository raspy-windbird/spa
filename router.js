// 各パスと、対応するコンテンツJSONファイルのパスのマッピング
const routes = {
    "/": "/content/home.json",
    "/about": "/content/about.json",
    "/contact": "/content/contact.json"
    // 404は後述のfetchエラーハンドリングで対応
};

// コンテンツを描画する非同期関数
const renderContent = async (path) => {
    const appElement = document.getElementById("app");
    const contentPath = routes[path];

    if (!contentPath) {
        appElement.innerHTML = "<h1>404: ページが見つかりません</h1>";
        return;
    }

    try {
        // Fetch APIを使って外部JSONファイルを非同期取得
        const response = await fetch(contentPath);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); // JSONをパース

        // 取得したデータを使ってDOMを更新
        appElement.innerHTML = `
            <h1>${data.title}</h1>
            ${data.body}
        `;

    } catch (error) {
        console.error("コンテンツの取得に失敗しました:", error);
        appElement.innerHTML = "<h1>コンテンツの読み込みエラー</h1><p>データの取得に失敗しました。</p>";
    }
};

// リンククリック時のルーティング処理（History APIを使用）
// この関数はHTMLファイルから呼び出されます
const route = (event) => {
    event.preventDefault();
    const href = event.target.getAttribute('href');

    // URLを履歴に追加し、アドレスバーの表示を変更
    window.history.pushState({}, "", href);

    // 新しいURLに基づいてコンテンツを描画
    renderContent(href);
};

// ブラウザの「戻る」「進む」ボタンが押された時の処理
window.onpopstate = () => {
    renderContent(window.location.pathname);
};

// ページ読み込み時に初期コンテンツを描画
document.addEventListener("DOMContentLoaded", () => {
    renderContent(window.location.pathname);
});
