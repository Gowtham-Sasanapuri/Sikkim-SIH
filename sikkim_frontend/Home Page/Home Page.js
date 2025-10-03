document.addEventListener("DOMContentLoaded", () => {
  let navbar_toggle = document.getElementById("navbar_toggle");
  let navbar = document.getElementById("navbar");
  let registration_btn = document.querySelector(".cover_image .SignUP_Login");
  let navbar_text = document.querySelectorAll("#navbar div h4");
  let navbar_toggle_lines = document.querySelectorAll("#navbar_toggle div");
  let navbar_div = document.querySelectorAll("#navbar div");
  let pano_page_btn = document.getElementById("Pano_btn");
  let calendar = document.getElementById("Calendar");
  let Archieves = document.getElementById("Archieve");
  let map = document.getElementById("Map");
  let VrNav = document.getElementById("VrNav");
  let MapNav = document.getElementById("MapNav");
  let Arch = document.getElementById("Arch");
  let EventsNav = document.getElementById("EventsNav");
  let profile = document.querySelector(".cover_image .profile");
  let chatbot = document.getElementById("chatbot")
  let chatbot_img = document.querySelector("#chatbot img")
  let audio_nav = document.getElementById("AudioNav")
  let service_nav = document.getElementById("Services")
  let sikkimBorder;

  let user = localStorage.getItem("user");
  
  service_nav.onclick = () => {
  window.location.href = "/sikkim_frontend/services/services/services.html"
}


  profile.onclick = () => {
    window.location.href = "../Profile/profile.html"
  }

  audio_nav.onclick = () => {
    window.location.href = "../interactivemap/audio guide/guide.html"
  }

  chatbot_img.onclick = () => {
    window.location.href = "/sikkim_frontend/chatbot_2/chatbot.html"
  }

  setTimeout(() => {
    chatbot.style.right = "4%"
  },5000)

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

  // Initialize the map
  var map_home = L.map("map_div", {
    zoomControl: true,
    dragging: true,
    scrollWheelZoom: true,
    doubleClickZoom: true,
    boxZoom: true,
    keyboard: true,
    touchZoom: true,
  }).setView([27.5, 88.5], 8);

  // Add MapTiler tiles
  L.tileLayer(
    "https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=HZHxv4XsyEizNrS7LBk9",
    {
      attribution:
        '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    }
  ).addTo(map_home);

  fetch("sikkim_co_ords.json")
    .then((res) => res.json())
    .then((data) => {
      sikkimBorder = L.geoJSON(data, {
        style: {
          color: "red",
          weight: 2,
          fillColor: "orange",
          fillOpacity: 0.2,
        },
      }).addTo(map_home);
      map_home.fitBounds(sikkimBorder.getBounds());
    });

  navbar_div.forEach((ele) => {
    ele.addEventListener("mouseover", () => {
      ele.querySelector("h4").style.color = "";
    });
    ele.addEventListener("mouseleave", () => {
      if (window.scrollY > window.innerHeight - 100) {
        navbar_text.forEach((ele) => {
          ele.style.color = "#0f52ba";
        });
        navbar_toggle_lines.forEach((ele) => {
          ele.style.backgroundColor = "#0f52ba";
        });
      }
    });
  });

  map.onclick = () => {
    window.location.href = "../interactivemap/Sikkim-SIH/interactivemap.html";
  };

  MapNav.onclick = () => {
    window.location.href = "../interactivemap/Sikkim-SIH/interactivemap.html";
  };

  Archieves.onclick = () => {
    window.location.href = "../archives mmd/index.html";
  };

  Arch.onclick = () => {
    window.location.href = "../archives mmd/index.html";
  };

  pano_page_btn.onclick = () => {
    window.location.href = "../virtual Tour/VirtualTour.html";
  };

  VrNav.onclick = () => {
    window.location.href = "../virtual Tour/VirtualTour.html";
  };

  calendar.onclick = () => {
    window.location.href = "../calendar/calendar.html";
  };

  EventsNav.onclick = () => {
    window.location.href = "../calendar/calendar.html";
  };

  registration_btn.addEventListener("click", () => {
    window.location.href = "../Registration/Registration.html";
  });

  navbar_toggle.addEventListener("click", () => {
    if (navbar.style.marginLeft === "0%") {
      navbar.style.marginLeft = "100%";
      registration_btn.style.display = "none";
      registration_btn.style.opacity = "0";
    } else {
      navbar.style.marginLeft = "0%";
      registration_btn.style.display = "flex";
      registration_btn.style.opacity = "1";
    }
  });
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
    if (window.scrollY > window.innerHeight - 60) {
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
});
