// js/lib/api.js — 小さな fetch ラッパー
export async function getJson(url, opts) {
    const res = await fetch(url, opts);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
}
