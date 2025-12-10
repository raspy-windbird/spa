# Simple SPA サンプル

ローカルで動作確認するための簡単な Single Page Application のサンプルです。

起動方法（簡易サーバ）:

```bash
# 作業ディレクトリをワークスペースのルートにして起動
python3 -m http.server 8000

# ブラウザで開く
# 例: http://localhost:8000/ (配置によっては /spa/ を付ける)
```

注意:
- サイトを `https://example.com/spa/` のようなサブパスでホストする場合、`<base href="/spa/">` を `index.html` の `<head>` に追加して運用すると安定します。
# spa