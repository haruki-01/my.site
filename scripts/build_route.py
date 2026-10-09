#!/usr/bin/env python3
"""Build ~21.0975 km foot route loop from Ebisu 3-4-4 via OSRM."""
import json
import urllib.parse
import urllib.request

START = (139.71715, 35.64492)
TARGET_M = 21_097.5
OSRM = "https://router.project-osrm.org/route/v1/foot"

# OSRM 徒歩ルートで約 21.09 km（ハーフマラソン距離に最も近い組み合わせ）
WAYPOINTS = [
    START,
    (139.7108, 35.6485),   # 恵比寿ガーデンプレイス
    (139.6580, 35.6790),   # 明治神宮外苑
    (139.6620, 35.6650),   # 新国立競技場外周
    (139.6850, 35.6650),   # 広尾・有栖川公園
    (139.7050, 35.6330),   # 目黒川遊歩道
    START,
]


def route_distance(coords):
    coords_str = ";".join(f"{lon},{lat}" for lon, lat in coords)
    url = f"{OSRM}/{urllib.parse.quote(coords_str, safe=';,')}?overview=full&geometries=geojson&steps=false"
    req = urllib.request.Request(url, headers={"User-Agent": "my.site-route/1.0"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = json.load(resp)
    if data.get("code") != "Ok":
        raise RuntimeError(data)
    route = data["routes"][0]
    return route["distance"], route["geometry"]["coordinates"]


def main():
    dist, line = route_distance(WAYPOINTS)
    print(f"Distance: {dist/1000:.3f} km (delta {dist - TARGET_M:+.0f} m)")

    meta = {
        "name": "恵比寿3-4-4 ハーフマラソン周回",
        "start_address": "東京都渋谷区恵比寿3丁目4番4号付近",
        "start": {"lon": START[0], "lat": START[1]},
        "distance_m": round(dist, 1),
        "distance_km": round(dist / 1000, 3),
        "target_half_marathon_m": TARGET_M,
        "waypoints": [
            {"name": "スタート（恵比寿3-4-4付近）", "lon": START[0], "lat": START[1]},
            {"name": "恵比寿ガーデンプレイス", "lon": 139.7108, "lat": 35.6485},
            {"name": "明治神宮外苑", "lon": 139.6580, "lat": 35.6790},
            {"name": "新国立競技場（外周）", "lon": 139.6620, "lat": 35.6650},
            {"name": "広尾・有栖川公園", "lon": 139.6850, "lat": 35.6650},
            {"name": "目黒川遊歩道（中目黒方面）", "lon": 139.7050, "lat": 35.6330},
            {"name": "フィニッシュ（スタート地点）", "lon": START[0], "lat": START[1]},
        ],
        "highlights": [
            "恵比寿ガーデンプレイス",
            "明治神宮外苑",
            "新国立競技場（外周）",
            "広尾・有栖川公園",
            "中目黒・目黒川遊歩道",
        ],
        "notes": [
            "恵比寿3-4-4を起点・終点とする周回コースです。",
            "公道と遊歩道の組み合わせ。交通規則・横断歩道を守ってください。",
            "目黒川遊歩道は混雑時は徐行を。",
            "距離は OSRM 徒歩ルートの概算です（実走で±数百m程度の差が出ます）。",
        ],
    }

    out = {"meta": meta, "geometry": {"type": "LineString", "coordinates": line}}
    with open("/workspace/routes/ebisu-half-marathon.json", "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)

    gpx_lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<gpx version="1.1" creator="my.site" xmlns="http://www.topografix.com/GPX/1/1">',
        "  <metadata>",
        f"    <name>{meta['name']}</name>",
        f"    <desc>{meta['start_address']} 発着 / {meta['distance_km']} km</desc>",
        "  </metadata>",
        "  <trk>",
        f"    <name>{meta['name']}</name>",
        "    <trkseg>",
    ]
    for lon, lat in line:
        gpx_lines.append(f'      <trkpt lat="{lat:.7f}" lon="{lon:.7f}"></trkpt>')
    gpx_lines += ["    </trkseg>", "  </trk>", "</gpx>"]
    with open("/workspace/routes/ebisu-half-marathon.gpx", "w", encoding="utf-8") as f:
        f.write("\n".join(gpx_lines) + "\n")

    print(f"Points: {len(line)}")


if __name__ == "__main__":
    main()
