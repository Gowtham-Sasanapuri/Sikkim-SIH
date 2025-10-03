document.addEventListener("DOMContentLoaded", () => {
  let navbar_toggle = document.getElementById("navbar_toggle");
    let registration_btn = document.querySelector(".cover_image .SignUP_Login");

  let navbar = document.getElementById("navbar");
  let navbar_text = document.querySelectorAll("#navbar div h4");
  let navbar_div = document.querySelectorAll("#navbar div");
  let navbar_toggle_lines = document.querySelectorAll("#navbar_toggle div");
  let card = document.querySelector(".cards");
  let home_btn = document.querySelector(".cover_image .monastery");
  let pano_card = document.querySelector(".virtual_tour_card");
  let VrNav = document.getElementById("VrNav")
  let MapNav = document.getElementById("MapNav")
  let Arch = document.getElementById("Arch")
  let EventsNav = document.getElementById("EventsNav")
  let audio_nav = document.getElementById("AudioNav")
  let user = localStorage.getItem("user");
  let profile = document.querySelector(".cover_image .profile");
  let service_nav = document.getElementById("Services")
  // let cross = document.querySelector(".virtual_tour_card .VT_header button")

  service_nav.onclick = () => {
  window.location.href = "/sikkim_frontend/services/services/services.html"
}


  profile.onclick = () => {
    window.location.href = "../Profile/profile.html"
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
    window.location.href = "../Registration/Registration.html";
  });

  audio_nav.onclick = () => {
    window.location.href = "../interactivemap/audio guide/guide.html"
  }

  MapNav.onclick = () => {
        window.location.href = "../interactivemap/Sikkim-SIH/interactivemap.html";
  }

  Arch.onclick = () => {
    window.location.href = "../archives mmd/index.html";
  };

  VrNav.onclick = () => {
    window.location.href = "../virtual Tour/VirtualTour.html";
  }

  EventsNav.onclick = () => {
    window.location.href = "../calendar/calendar.html";
  };
  function upload_pano(name, data) {
    data.forEach(ele => {
        if (ele.name === name) {
            // Generate iframes
            let iframesHTML = "";
            ele.sources.forEach(src => {
                iframesHTML += `
                  <iframe
                    src="${src}"
                    width="600"
                    height="450"
                    style="border:0"
                    allowfullscreen=""
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                  ></iframe>
                `;
            });

            // Build content
            let content = `
                <div class="VT_header">
                    <h1>${ele.name}</h1>
                    <button class="close">✖</button>
                </div>
                <div class="pano_content">
                    <div class="iframe">
                        ${iframesHTML}
                    </div>
                    <div class="monastery_description_in_pano_container">
                        <h1>Tour Information</h1>
                        <p><span>Location: </span>${ele.location}</p>
                        <p><span>School: </span>${ele.school}</p>
                        <p><span>Significance: </span>${ele.significance}</p>
                        <p><span>Description: </span>${ele.description}</p>
                        <div class="pano_btn">
                            <button>Documents</button>
                            <button>Routes</button>
                        </div>
                    </div>
                </div>`;

            // Replace previous content
            pano_card.innerHTML = content;

            // Attach close event
            let cross = pano_card.querySelector(".close");
            cross.addEventListener("click", () => {
                pano_card.style.display = "none"; // ✅ hides whole pano card
            });
        }
    });
}


  function CreateCard(data) {
    data.forEach((ele) => {
      console.log(">>>", ele);
      card.insertAdjacentHTML(
        "beforeend",
        `<div class="card">
            <div class="card_img">
                <img src="${ele.image}" alt="">
            </div>
            <div class="card_content">
                <h1>${ele.name}</h1>
                <p>${ele.description}</p>
                <div class="lang"></div>
                <button class="btn">▶ Explore in 360°</button>
            </div>
        </div>`
      );

      let lastCard = card.querySelector(".card:last-child");
      let btn = lastCard.querySelector(".btn");
      let name = ele.name;
      // Attach event listener
      btn.addEventListener("click", () => {
        upload_pano(name, data);
        pano_card.style.display = "block";
      });
    });
  }

  home_btn.addEventListener("click", () => {
    window.location.href = "../Home Page/Home Page.html";
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

  fetch("./virtualTour.json")
    .then((response) => response.json())
    .then((data) => {
      console.table(data);
      CreateCard(data);
    })
    .catch((err) => console.error(err));

  navbar_toggle.addEventListener("click", () => {
    if (navbar.style.marginLeft === "0%") {
      navbar.style.marginLeft = "100%";
    } else {
      navbar.style.marginLeft = "0%";
    }
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth <= 440 && navbar.style.marginLeft !== "100%") {
      navbar.style.marginLeft = "100%";
    } else if (window.innerWidth > 440 && navbar.style.marginLeft !== "0%") {
      navbar.style.marginLeft = "0%";
    }
  });
  window.addEventListener("scroll", () => {
    if (window.scrollY > window.innerHeight - 100) {
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
