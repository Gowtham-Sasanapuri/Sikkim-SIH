const navLinks = document.querySelectorAll(".sidebar ul li a");

let user = JSON.parse(localStorage.getItem("user"))
let login_btn = document.getElementById("login_btn")

let logged_in = document.getElementById("logged_in")
let not_loggedin = document.getElementById("not_logged_in")
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
let audio_nav = document.getElementById("AudioNav")
// let user = localStorage.getItem("user");
let home_btn = document.querySelector(".cover_image .monastery");

home_btn.addEventListener("click", () => {
    window.location.href = "/sikkim_frontend/Home Page/Home Page.html";
});


profile.onclick = () => {
    window.location.href = "/sikkim_frontend/Profile/profile.html"
}

audio_nav.onclick = () => {
  window.location.href = "/sikkim_frontend/interactivemap/audio guide/guide.html"
}

if (user) {
    // user = JSON.parse(user);
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
    window.location.href = "/sikkim_frontend/interactivemap/Sikkim-SIH/interactivemap.html";
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
    if (window.scrollY > window.innerHeight - 220) {
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
        if (window.scrollY > window.innerHeight - 220) {
            navbar_text.forEach((ele) => {
                ele.style.color = "#0f52ba";
            });
            navbar_toggle_lines.forEach((ele) => {
                ele.style.backgroundColor = "#0f52ba";
            });
        }
    });
});



login_btn.onclick = () => {
  window.location.href = "/sikkim_frontend/Registration/Registration.html"
}

if(user && user.role === "User" ){
  logged_in.style.display = "block"
  not_loggedin.style.display = "none"
}else{
  logged_in.style.display = "none"
  not_loggedin.style.display = "flex"
}

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    navLinks.forEach(l => l.classList.remove("active"));
    link.classList.add("active");
  });
});
