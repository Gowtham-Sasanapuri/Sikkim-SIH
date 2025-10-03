
let navbar = document.getElementById("navbar");
  let registration_btn = document.querySelector(".cover_image .SignUP_Login");
  let navbar_text = document.querySelectorAll("#navbar div h4");
  let navbar_toggle_lines = document.querySelectorAll("#navbar_toggle div");
  let navbar_div = document.querySelectorAll("#navbar div");
  let VrNav = document.getElementById("VrNav");
  let MapNav = document.getElementById("MapNav");
  let Arch = document.getElementById("Arch");
  let EventsNav = document.getElementById("EventsNav");
  let profile = document.querySelector(".cover_image .profile");
  let user = localStorage.getItem("user");
  let home_btn = document.querySelector(".cover_image .monastery");
  let audio_nav = document.getElementById("AudioNav")
  let service_nav = document.getElementById("Services")

  service_nav.onclick = () => {
  window.location.href = "/sikkim_frontend/services/services/services.html"
}


  audio_nav.onclick = () => {
    window.location.href = "../audio guide/guide.html"
  }

home_btn.addEventListener("click", () => {
    window.location.href = "/sikkim_frontend/Home Page/Home Page.html";
  });


profile.onclick = () => {
    window.location.href = "/sikkim_frontend/Profile/profile.html"
  }

  if (user) {
    user = JSON.parse(user);
    if (user.role === "User") {
      profile.style.display = "flex";
      registration_btn.style.display = "none";
    } else {
      profile.style.display = "none";
      registration_btn.style.display = "flex";
    }
  } else {
    // No user in localStorage (not logged in)
    profile.style.display = "none";
    registration_btn.style.display = "flex";
  }

registration_btn.addEventListener("click", () => {
    window.location.href = "/sikkim_frontend/Registration/Registration.html";
  });

MapNav.onclick = () => {
    window.location.href = "../Sikkim-SIH/interactivemap.html";
  };

  Arch.onclick = () => {
    window.location.href = "/sikkim_frontend/archives mmd/index.html";
  };

  VrNav.onclick = () => {
    window.location.href = "/sikkim_frontend/virtual Tour/VirtualTour.html";
  };

  EventsNav.onclick = () => {
    window.location.href = "/sikkim_frontend/calendar/calendar.html";
  };

  window.addEventListener("resize", () => {
    if (window.innerWidth <= 440 && navbar.style.marginLeft !== "100%") {
      navbar.style.marginLeft = "100%";
      registration_btn.style.display = "none";
      registration_btn.style.opacity = "0";
    } else if (window.innerWidth > 440 && navbar.style.marginLeft !== "0%") {
      navbar.style.marginLeft = "0%";
      registration_btn.style.display = "flex";
      registration_btn.style.opacity = "1";
    }
  });
  window.addEventListener("scroll", () => {
    if (window.scrollY > window.innerHeight - 320) {
      navbar_text.forEach((ele) => {
        ele.style.color = "#0f52ba";
      });
      navbar_toggle_lines.forEach((ele) => {
        ele.style.backgroundColor = "#0f52ba";
      });
    } else {
      navbar_text.forEach((ele) => {
        ele.style.color = "";
      });
      navbar_toggle_lines.forEach((ele) => {
        ele.style.backgroundColor = "";
      });
    }
  });

  navbar_div.forEach((ele) => {
    ele.addEventListener("mouseover", () => {
      ele.querySelector("h4").style.color = "";
    });
    ele.addEventListener("mouseleave", () => {
      if (window.scrollY > window.innerHeight - 320) {
        navbar_text.forEach((ele) => {
          ele.style.color = "#0f52ba";
        });
        navbar_toggle_lines.forEach((ele) => {
          ele.style.backgroundColor = "#0f52ba";
        });
      }
    });
  });


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
function renderMonasteries(list) {
  const container = document.getElementById("monastery-container");
  container.innerHTML = ""; // clear previous cards

  list.forEach(m => {
    const card = document.createElement("div");
    card.className = "card";
    card.setAttribute("data-region", m.region);

    card.innerHTML = `
      <img src="${m.img}" alt="${m.name}" class="card-image" />
      <h2>${m.name}</h2>
      <p class="location">${m.location}</p>
      <p class="rating">${m.rating}</p>
      <p class="desc">${m.desc}</p>

      <div class="row">
        <div class="col">
          <h4>Highlights</h4>
          <ul>${m.highlights.map(h => `<li>${h}</li>`).join("")}</ul>
        </div>
        <div class="col">
          <h4>Nearby Attractions</h4>
          <ul>${m.attractions.map(a => `<li>${a}</li>`).join("")}</ul>
        </div>
      </div>

      <p class="time">${m.time}</p>
      <div class="buttons">
        <button onclick="getdirections(${m.lat}, ${m.lng})" class="directions">Get Directions</button>
        <button class="tour">Virtual Tour</button>
      </div>
    `;

    container.appendChild(card);
  });
}

// initial render
renderMonasteries(monasteries);

document.getElementById("regionfilter").addEventListener("change", function() {
  const val = this.value;
  if (val === "all") {
    renderMonasteries(monasteries);
  } else {
    renderMonasteries(monasteries.filter(m => m.region === val));
  }
});


function getdirections(lat,lng){
    window.location.href=`getdirection.html?lat=${lat}&lng=${lng}`;
}






