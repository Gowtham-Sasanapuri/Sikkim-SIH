

document.getElementById("home").onclick = () => {
  window.history.back();
}



// ---------------- SPEECH ----------------
function speak(text) {
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  }
}

// ---------------- MONASTERY LOCATION ----------------
const urlParams = new URLSearchParams(window.location.search);
const monasteryLat = parseFloat(urlParams.get("lat")) || 27.317;
const monasteryLng = parseFloat(urlParams.get("lng")) || 88.611;
const destination = { lat: monasteryLat, lng: monasteryLng };
speak("Fetching directions to the selected monastery.");

// ---------------- INIT MAP ----------------
const map = L.map("map").setView([monasteryLat, monasteryLng], 13);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

L.marker([monasteryLat, monasteryLng])
  .addTo(map)
  .bindPopup("Selected Monastery")
  .openPopup();

let userMarker;
let routeControl;
let routePolyline;

// ---------------- TRACK USER ----------------
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;

      // Update user marker
      if (userMarker) {
        userMarker.setLatLng([userLat, userLng]);
      } else {
        userMarker = L.marker([userLat, userLng], {
          icon: L.icon({
            iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
            iconSize: [32, 32]
          })
        })
          .addTo(map)
          .bindPopup("You are here")
          .openPopup();
      }

      // Follow user
      map.setView([userLat, userLng], map.getZoom());

      // Setup routing once
      if (!routeControl) {
        routeControl = L.Routing.control({
          waypoints: [L.latLng(userLat, userLng), L.latLng(monasteryLat, monasteryLng)],
          routeWhileDragging: false,
          addWaypoints: false,
          draggableWaypoints: false,
          show: true // ✅ directions box enabled
        })
          .on("routesfound", function (e) {
            const route = e.routes[0];
            const summary = `Route is ${Math.round(route.summary.totalDistance / 1000)} km and will take approx ${Math.round(route.summary.totalTime / 60)} mins.`;
            speak(summary);

            // Draw polyline
            if (routePolyline) map.removeLayer(routePolyline);
            const latlngs = route.coordinates.map((c) => [c.lat, c.lng]);
            routePolyline = L.polyline(latlngs, { color: "blue", weight: 5 }).addTo(map);
          })
          .addTo(map);
      } else {
        // Update start point
        routeControl.setWaypoints([
          L.latLng(userLat, userLng),
          L.latLng(monasteryLat, monasteryLng)
        ]);
      }
    },
    (error) => {
      speak("Unable to get your location.");
      alert("Unable to get your location.");
      console.error(error);
    },
    { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
  );
} else {
  speak("Geolocation not supported by your browser.");
  alert("Geolocation not supported by your browser.");
}
// ---------------- MONASTERY IMAGES ----------------
const monasteries = [
  {
    name: "Dubdi Monastery",
    region: "west",
    location: "📍 West Sikkim • 33 km from Pelling",
    rating: "⭐ 4.7 • Est. 1701",
    desc: "Known as the oldest monastery in Sikkim, founded soon after the coronation of the first Chogyal.",
    highlights: ["Ancient Architecture", "Scenic Trek", "Prayer Hall"],
    attractions: ["Yuksom Village", "Khecheopalri Lake", "Kanchenjunga National Park"],
    time: "⏱ 5 hrs from Gangtok",
    lat: 27.3819,
    lng: 88.2466,
    img:"images/dubdi.jpeg"
  },
  {
    name: "Enchey Monastery",
    region: "east",
    location: "📍 East Sikkim • 3 km from Gangtok",
    rating: "⭐ 4.8 • Est. 1909",
    desc: "A small but beautiful monastery believed to be blessed by Guru Padmasambhava himself.",
    highlights: ["Cham Dance Festival", "Colorful Murals", "Peaceful Ambience"],
    attractions: ["Lachung Village","Yumthang Valley","Zero Point"],
    time: "⏱ 6 hrs from Gangtok",
    lat: 27.3427,
    lng: 88.7433,
    img:"images/enchey.jpeg"
  },
  {
    name: "Lingdum Monastery",
    region: "east",
    location: "📍 East Sikkim • 20 km from Gangtok",
    rating: "⭐ 4.9 • Est. 1999",
    desc: "A grand and modern monastery with impressive Tibetan-style architecture.",
    highlights: ["Vibrant Festivals","Huge Prayer Hall","Young Monks’ Debates"],
    attractions: ["Ranka Monastery","Ban Jhakri Falls","Rumtek Monastery"],
    time: "⏱ 40 minutes from Gangtok",
    lat: 27.3305,
    lng: 88.7023,
    img:"images/lingdum.jpeg"
  },
  {
    name: "Pemayangtse Monastery",
    region: "weat",
    location: "📍 West Sikkim • 2 km from Pelling",
    rating: "⭐ 4.9 • Est. 1705",
    desc: "One of the oldest and most prestigious monasteries in Sikkim, with panoramic views of Kanchenjunga.",
    highlights: ["Seven-Tiered Wooden Structure","Sacred Relics","Ritual Dance Festival"],
    attractions: ["Rabdentse Ruins","Sanga Choeling Monastery","Pelling Skywalk"],
    time: "⏱ 5.5 hrs from Gangtok",
    lat: 27.3017,
    lng: 88.2335,
    img:"images/pemayangtse.jpeg"
  },
  {
    name: "Phodong Monastery",
    region: "north",
    location: "📍 North Sikkim • 28 km from Gangtok",
    rating: "⭐ 4.7 • Est. 1740",
    desc: "Renowned for its annual mask dance festival and rich history in Sikkimese Buddhism.",
    highlights: ["Cham Mask Dance","Monk Debates","Mountain Views"],
    attractions: ["Labrang Monastery","Seven Sisters Waterfall","Mangan Town"],
    time: "⏱ 1 hr from Gangtok",
    lat: 27.3962,
    lng: 88.5946,
    img:"images/phodong.jpeg"
  },
  {
    name: "Ralang Monastery",
    region: "south",
    location: "📍 South Sikkim • 6 km from Ravangla",
    rating: "⭐ 4.8 • Est. 1768",
    desc: "One of the most significant monasteries of the Kagyu sect, hosting the grand Pang Lhabsol festival.",
    highlights: ["Annual Pang Lhabsol","Colorful Thangkas","Peaceful Environment"],
    attractions: ["Ravangla Buddha Park","Temi Tea Garden","Rayong Sunrise Viewpoint"],
    time: "⏱ 3.5 hrs from Gangtok",
    lat: 27.3094,
    lng: 88.3669,
    img:"images/ralong.jpeg"
  },
  {
    name: "Rumtek Monastery",
    region: "east",
    location: "📍 East Sikkim • 24 km from Gangtok",
    rating: "⭐ 4.6 • Est. 1966",
    desc: "The largest monastery in Sikkim and the main seat of the Karma Kagyu lineage.",
    highlights: ["Golden Stupa","Prayer Wheels","Monastery Museum"],
    attractions: ["YRumtek Village","Martam Village","Ranka Monastery"],
    time: "⏱ 45 minutes from Gangtok",
    lat: 27.317,
    lng: 88.611,
    img:"images/rumtek.jpg"
  },
  {
    name: "Tashiding Monastery",
    region: "west",
    location: "📍 West Sikkim • 40 km from Ravangla",
    rating: "⭐ 4.7 • Est. 1717",
    desc: "Perched on a hilltop, this sacred monastery is believed to cleanse sins of pilgrims who visit.",
    highlights: ["Holy Chorten","Bhumchu Festival","Ancient Shrines"],
    attractions: ["Ravangla","Kanchenjunga Views","Pelling"],
    time: "⏱ 4 hrs from Gangtok",
    lat: 27.2957,
    lng: 88.2816,
    img:"images/tashiding.jpeg"
  },
  {
    name: "Tsuklakhang Palace",
    region: "east",
    location: "📍 Gangtok • Within Palace Complex",
    rating: "⭐ 4.8 • Est. 1898",
    desc: "Known as the oldest monastery in Sikkim, founded soon after the coronation of the first Chogyal.",
    highlights: ["Royal Architecture","Religious Ceremonies","Historic Significance"],
    attractions: ["Palace Complex","MG Marg","Enchey Monastery"],
    time: "⏱ In Gangtok City",
    lat: 27.3281,
    lng: 88.6129,
    img:"images/tholung.jpeg"
  },
  {
    name: "Kartok Monastery",
    region: "north",
    location: "📍 North Sikkim • Near Yumthang Valley",
    rating: "⭐ 4.6 • Est. 1840",
    desc: "Famous for its colorful façade and serene setting near the village of Lachung.",
    highlights: ["Red Monastery","Traditional Mask Dance","Mountain Views"],
    attractions: ["Lachung Village","Yumthang Valley","Zero Point"],
    time: "⏱  6 hrs from Gangtok",
    lat: 27.6875,
    lng: 88.7433,
    img:"images/kartok.jpeg"
  },

];

// ---------------- MONASTERY CARD ----------------
const lat = parseFloat(monasteryLat.toFixed(4));
const lng = parseFloat(monasteryLng.toFixed(4));
const container = document.getElementById("monastery-images");
const mname = document.getElementById("mname");

// ✅ Find monastery by lat/lng
const monastery = monasteries.find(
  (m) => m.lat.toFixed(4) == lat && m.lng.toFixed(4) == lng
);

if (monastery) {
  // Set heading
  mname.textContent = monastery.name;

  // Create card div
  const card = document.createElement("div");
  card.className = "monastery-card";

  // Image
  const img = document.createElement("img");
  img.src = monastery.img;
  img.alt = monastery.name;

  // Info text
  const info = document.createElement("div");
  info.className = "monastery-info";
  info.innerHTML = `
    <p><strong>📍 Location:</strong> ${monastery.location}</p>
    <p><strong>⭐ Rating:</strong> ${monastery.rating}</p>
    <p><strong>⏱ Travel Time:</strong> ${monastery.time}</p>
    <p>${monastery.desc}</p>
  `;

  // Highlights
  const hlTitle = document.createElement("h4");
  hlTitle.textContent = "✨ Highlights:";
  const highlights = document.createElement("ul");
  monastery.highlights.forEach((h) => {
    const li = document.createElement("li");
    li.textContent = h;
    highlights.appendChild(li);
  });

  // Attractions
  const atTitle = document.createElement("h4");
  atTitle.textContent = "📍 Nearby Attractions:";
  const attractions = document.createElement("ul");
  monastery.attractions.forEach((a) => {
    const li = document.createElement("li");
    li.textContent = a;
    attractions.appendChild(li);
  });

  // Append all
  card.appendChild(img);
  card.appendChild(info);
  card.appendChild(hlTitle);
  card.appendChild(highlights);
  card.appendChild(atTitle);
  card.appendChild(attractions);

  container.appendChild(card);
} else {
  container.innerHTML = "<p>No details available for this monastery.</p>";
}

