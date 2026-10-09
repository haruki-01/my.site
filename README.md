# my.site

恵比寿3-4-4を起点とするハーフマラソン（約21.1km）周回コース。

## 開き方（重要）

GitHub 上のファイル一覧から `index.html` を開いても地図は表示されません。次のいずれかで開いてください。

### 1. ローカルで開く（いちばん簡単）

リポジトリを ZIP でダウンロードして展開し、`index.html` をダブルクリックで開く。  
コースデータは `route-data.js` に埋め込み済みなので、サーバー不要です。

### 2. ローカルサーバー

```bash
python3 -m http.server 8080
```

ブラウザで `http://localhost:8080/` を開く。

### 3. GitHub Pages（公開 URL）

`main` へマージ後、リポジトリ Settings → Pages で Source を **GitHub Actions** にすると自動公開されます。

想定 URL: `https://haruki-01.github.io/my.site/`

## コース

| 項目 | 内容 |
| --- | --- |
| 起点・終点 | 東京都渋谷区恵比寿3丁目4番4号付近 |
| 距離 | 約 21.09 km（OSRM 徒歩ルート） |
| 主な通過点 | 恵比寿 GP → 神宮外苑 → 新国立 → 広尾・有栖川 → 目黒川 → 恵比寿 |

## データファイル

| ファイル | 用途 |
| --- | --- |
| [`routes/ebisu-half-marathon.gpx`](routes/ebisu-half-marathon.gpx) | Garmin / Strava / ランニングアプリ |
| [`routes/ebisu-half-marathon.geojson`](routes/ebisu-half-marathon.geojson) | 地図アプリ・GIS |
| [`routes/ebisu-half-marathon.json`](routes/ebisu-half-marathon.json) | サイト用メタ付きデータ |
| [`route-data.js`](route-data.js) | ブラウザ埋め込み用（オフライン表示） |

GPX / GeoJSON は GitHub 上では「Raw」または「Download」から取得できます。ページ内のダウンロードボタンでも保存できます。

## ルート再生成

```bash
python3 scripts/build_route.py
```
