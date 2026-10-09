function downloadBlob(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function fillList(el, items, ordered = false) {
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    el.appendChild(li);
  });
}

function renderRoute(data) {
  const { meta, geometry } = data;
  const coords = geometry.coordinates.map(([lon, lat]) => [lat, lon]);

  document.getElementById("route-summary").textContent =
    `${meta.start_address} 発着 · 約 ${meta.distance_km} km（ハーフマラソン ${(meta.target_half_marathon_m / 1000).toFixed(3)} km 想定）`;

  fillList(document.getElementById("highlights"), meta.highlights);
  fillList(
    document.getElementById("waypoints"),
    meta.waypoints.map((wp) => wp.name || `${wp.lat.toFixed(4)}, ${wp.lon.toFixed(4)}`)
  );
  fillList(document.getElementById("notes"), meta.notes);

  document.getElementById("download-gpx").addEventListener("click", (e) => {
    e.preventDefault();
    const gpx = window.ROUTE_GPX;
    if (!gpx) {
      window.location.href = "routes/ebisu-half-marathon.gpx";
      return;
    }
    downloadBlob("ebisu-half-marathon.gpx", gpx, "application/gpx+xml");
  });

  document.getElementById("download-json").addEventListener("click", (e) => {
    e.preventDefault();
    downloadBlob(
      "ebisu-half-marathon.json",
      JSON.stringify(data, null, 2),
      "application/json"
    );
  });

  document.getElementById("download-geojson").addEventListener("click", (e) => {
    e.preventDefault();
    const feature = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            name: meta.name,
            distance_km: meta.distance_km,
            start_address: meta.start_address,
          },
          geometry,
        },
      ],
    };
    downloadBlob(
      "ebisu-half-marathon.geojson",
      JSON.stringify(feature, null, 2),
      "application/geo+json"
    );
  });

  // Google Maps に開く（ウェイポイント経由）
  const mapsPts = meta.waypoints
    .map((wp) => `${wp.lat},${wp.lon}`)
    .filter((v, i, arr) => i === 0 || v !== arr[i - 1]);
  const mapsUrl =
    "https://www.google.com/maps/dir/" +
    mapsPts.map(encodeURIComponent).join("/") +
    "/data=!4m2!4m1!3e2";
  document.getElementById("open-maps").href = mapsUrl;

  if (typeof L === "undefined") {
    document.getElementById("map").innerHTML =
      '<p class="map-fallback">地図ライブラリを読み込めませんでした。<a id="maps-fallback" href="#">Google マップで開く</a></p>';
    document.getElementById("maps-fallback").href = mapsUrl;
    return;
  }

  const map = L.map("map", { scrollWheelZoom: true }).setView(
    [meta.start.lat, meta.start.lon],
    14
  );

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  const line = L.polyline(coords, {
    color: "#3d8bfd",
    weight: 5,
    opacity: 0.9,
  }).addTo(map);

  map.fitBounds(line.getBounds(), { padding: [32, 32] });

  const startIcon = L.divIcon({
    className: "start-marker",
    html: '<span aria-hidden="true">S/F</span>',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });

  L.marker([meta.start.lat, meta.start.lon], { icon: startIcon })
    .addTo(map)
    .bindPopup("<strong>スタート / フィニッシュ</strong><br>恵比寿3-4-4付近");

  meta.waypoints.slice(1, -1).forEach((wp) => {
    L.circleMarker([wp.lat, wp.lon], {
      radius: 6,
      color: "#ff6b4a",
      fillColor: "#ff6b4a",
      fillOpacity: 0.85,
      weight: 2,
    })
      .addTo(map)
      .bindPopup(wp.name);
  });
}

async function loadRouteData() {
  if (window.ROUTE_DATA) return window.ROUTE_DATA;
  const res = await fetch("routes/ebisu-half-marathon.json");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

loadRouteData()
  .then(renderRoute)
  .catch((err) => {
    console.error(err);
    document.getElementById("route-summary").textContent =
      "コースデータの読み込みに失敗しました。index.html と同じフォルダに route-data.js があるか確認するか、ローカルサーバーで開いてください。";
  });
