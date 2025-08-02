let map = document.getElementById("map");
coordinates.reverse();
map = L.map('map').setView(coordinates, 12);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 16,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

let marker = L.marker(coordinates).addTo(map).bindPopup('<p>Exact Location provided after booking!</p>').openPopup();

let circle = L.circle(coordinates, {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.3,
    radius: 1200
}).addTo(map);