async function init() {
  const res = await fetch("routes/ebisu-half-marathon.json");
  const data = await res.json();
  const { meta, geometry } = data;
  const coords = geometry.coordinates.map(([lon, lat]) => [lat, lon]);

  document.getElementById("route-summary").textContent =
    `${meta.start_address} 発着 · 約 ${meta.distance_km} km（ハーフマラソン ${(meta.target_half_marathon_m / 1000).toFixed(3)} km 想定）`;

  const highlights = document.getElementById("highlights");
  meta.highlights.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    highlights.appendChild(li);
  });

  const waypoints = document.getElementById("waypoints");
  meta.waypoints.forEach((wp) => {
    const li = document.createElement("li");
    li.textContent = wp.name || `${wp.lat.toFixed(4)}, ${wp.lon.toFixed(4)}`;
    waypoints.appendChild(li);
  });

  const notes = document.getElementById("notes");
  meta.notes.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    notes.appendChild(li);
  });

  const map = L.map("map", { scrollWheelZoom: true }).setView(
    [meta.start.lat, meta.start.lon],
    14
  );

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
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

init().catch((err) => {
  console.error(err);
  document.getElementById("route-summary").textContent =
    "コースデータの読み込みに失敗しました。";
});
