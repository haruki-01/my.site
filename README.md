# my.site

恵比寿3-4-4を起点とするハーフマラソン（約21.1km）周回コース。

## コース

| 項目 | 内容 |
| --- | --- |
| 起点・終点 | 東京都渋谷区恵比寿3丁目4番4号付近 |
| 距離 | 約 21.09 km（OSRM 徒歩ルート） |
| 主な通過点 | 恵比寿ガーデンプレイス → 明治神宮外苑 → 新国立競技場 → 広尾・有栖川 → 目黒川 → 恵比寿 |

## ファイル

- [`routes/ebisu-half-marathon.gpx`](routes/ebisu-half-marathon.gpx) — ランニングアプリ用 GPX
- [`routes/ebisu-half-marathon.json`](routes/ebisu-half-marathon.json) — 地図表示用 GeoJSON
- [`index.html`](index.html) — ブラウザでコースを確認

## ローカル表示

```bash
python3 -m http.server 8080
```

ブラウザで `http://localhost:8080/` を開く。

## ルート再生成

```bash
python3 scripts/build_route.py
```

OpenStreetMap / OSRM の徒歩ルーティングで距離を算出しています。
