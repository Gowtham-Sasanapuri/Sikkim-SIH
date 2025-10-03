// script.js
/* Handles:
   - loading language-specific JSON files
   - rendering monastery cards
   - per-monastery TTS controls (Play / Pause / Resume / Stop) using Web Speech API
   - search, filters, download, view navigation
   - simple intersection observer for animations
*/

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
let monasteriesData = [];
let collectionsData = {};
let observer;
let currentLang = localStorage.getItem("lang") || "en";

service_nav.onclick = () => {
  window.location.href = "/sikkim_frontend/services/services/services.html"
}

audio_nav.onclick = () => {
    window.location.href = "../interactivemap/audio guide/guide.html"
  }

home_btn.addEventListener("click", () => {
    window.location.href = "../Home Page/Home Page.html";
  });


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

MapNav.onclick = () => {
    window.location.href = "../interactivemap/Sikkim-SIH/interactivemap.html";
  };

  Arch.onclick = () => {
    window.location.href = "../archives mmd/index.html";
  };

  VrNav.onclick = () => {
    window.location.href = "../virtual Tour/VirtualTour.html";
  };

  EventsNav.onclick = () => {
    window.location.href = "../calendar/calendar.html";
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

// Map your language codes to SpeechSynthesis language tags (best-effort)
const ttsLangMap = {
  en: "en-US",
  hi: "hi-IN",
  te: "te-IN",
  sk: "bo",      // Tibetan — browsers may not support; fallback handled below
  ne: "ne-NP"
};

const synth = window.speechSynthesis;
let activeMonastery = null;    // name of monastery currently playing (UI)
let activeUtterance = null;    // current SpeechSynthesisUtterance

// ------------------- Load Data -------------------
function loadData(lang) {
  Promise.all([
    fetch(`monasteries_${lang}.json`).then(r => r.json()).catch(() => []),
    fetch(`collections_${lang}.json`).then(r => r.json()).catch(() => ({}))
  ]).then(([monas, cols]) => {
    monasteriesData = monas || [];
    collectionsData = cols || {};
    document.getElementById("languageSelect").value = lang;
    currentLang = lang;
    localStorage.setItem("lang", lang);
    displayMonasteries(monasteriesData);
    initObserver();
    attachFilterHandlers();
    attachSearchHandler();
  }).catch(err => {
    console.error("Failed to load JSON:", err);
    const container = document.getElementById("monastery-list");
    if (container) container.innerHTML = "<p>Could not load data.</p>";
  });
}

// initial load
loadData(currentLang);

// react to language changes from dropdown
document.getElementById("languageSelect")?.addEventListener("change", (e) => {
  const lang = e.target.value;
  loadData(lang);
});

// ------------------- Rendering -------------------
function displayMonasteries(monasteries) {
  const container = document.getElementById("monastery-list");
  if (!container) return;
  container.innerHTML = "";

  if (!monasteries || monasteries.length === 0) {
    container.innerHTML = "<p>No monasteries found.</p>";
    return;
  }

  const frag = document.createDocumentFragment();

  monasteries.forEach(monastery => {
    const card = document.createElement("div");
    card.className = "card";
    // safe values
    const safeName = escapeHtml(monastery.name || "Unknown");
    const safeLoc = escapeHtml(monastery.location || "");
    const safePeriod = escapeHtml(monastery.period || "");
    const pages = monastery.pages || "N/A";
    const shortDesc = truncate(monastery.description || monastery.mainDescription || "", 140);

    // include data attributes for TTS text and unique name
    const ttsText = `${monastery.mainDescription || ""} ${monastery.description || ""}`;
    // store tts text as data attribute (encoded)
    const encodedTts = encodeURIComponent(ttsText);

    card.innerHTML = `
      <img src="${escapeAttr(monastery.image || 'images/placeholder.jpg')}" alt="${safeName}">
      <div class="card-content">
        <h2>${safeName}</h2>
        <p><strong>Location:</strong> ${safeLoc}</p>
        <p><strong>Period:</strong> ${safePeriod}</p>
        <p><strong>Pages:</strong> ${pages}</p>
        <p class="short-desc">${escapeHtml(shortDesc)}</p>

        <div class="audio-controls" data-name="${encodeURIComponent(monastery.name)}" data-tts="${encodedTts}">
          <button class="tts-play small"><i class="fa-solid fa-play"></i> Play</button>
          <button class="tts-pause small" disabled><i class="fa-solid fa-pause"></i> Pause</button>
          <button class="tts-resume small" disabled><i class="fa-solid fa-play"></i> Resume</button>
          <button class="tts-stop small" disabled><i class="fa-solid fa-stop"></i> Stop</button>
          <span class="status">Idle</span>
        </div>

      </div>
      <div class="card-actions">
        <button class="btn view small" data-name="${encodeURIComponent(monastery.name)}">
          <i class="fa-solid fa-eye"></i> View
        </button>
        <button class="btn download small" data-name="${encodeURIComponent(monastery.name)}">
          <i class="fa-solid fa-download"></i> Download
        </button>
      </div>
    `;

    frag.appendChild(card);
  });

  container.appendChild(frag);

  // attach handlers after elements exist
  container.querySelectorAll(".btn.view").forEach(btn => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.name;
      // navigate to details page with lang
      window.location.href = `details.html?name=${name}&lang=${currentLang}`;
    });
  });

  container.querySelectorAll(".btn.download").forEach(btn => {
    btn.addEventListener("click", () => {
      const encodedName = btn.dataset.name;
      const name = decodeURIComponent(encodedName);
      downloadMonasteryData(name);
    });
  });

  // tts control handlers
  container.querySelectorAll(".audio-controls").forEach(ctrl => {
    const play = ctrl.querySelector(".tts-play");
    const pause = ctrl.querySelector(".tts-pause");
    const resume = ctrl.querySelector(".tts-resume");
    const stop = ctrl.querySelector(".tts-stop");
    const status = ctrl.querySelector(".status");
    const encodedTts = ctrl.dataset.tts || "";
    const monasteryName = decodeURIComponent(ctrl.dataset.name || "");

    // Play
    play.addEventListener("click", () => {
      const text = decodeURIComponent(encodedTts);
      if (!text || text.trim() === "") {
        status.textContent = "No text to speak.";
        return;
      }
      startTTSForMonastery(monasteryName, text, { onstart() {
        status.textContent = "Playing";
        play.setAttribute("disabled", "true");
        pause.removeAttribute("disabled");
        stop.removeAttribute("disabled");
        resume.setAttribute("disabled", "true");
      }, onend() {
        status.textContent = "Finished";
        resetAllTTSControls();
      }, onerror() {
        status.textContent = "Error speaking";
        resetAllTTSControls();
      }});
    });

    // Pause
    pause.addEventListener("click", () => {
      if (synth.speaking && !synth.paused) {
        synth.pause();
        status.textContent = "Paused";
        pause.setAttribute("disabled", "true");
        resume.removeAttribute("disabled");
      }
    });

    // Resume
    resume.addEventListener("click", () => {
      if (synth.speaking && synth.paused) {
        synth.resume();
        status.textContent = "Playing";
        resume.setAttribute("disabled", "true");
        pause.removeAttribute("disabled");
      }
    });

    // Stop
    stop.addEventListener("click", () => {
      if (synth.speaking) {
        synth.cancel();
      }
      status.textContent = "Stopped";
      resetAllTTSControls();
    });
  });
}

// ------------------- TTS Management -------------------

// Start TTS for a monastery. Cancels any currently speaking utterance first.
function startTTSForMonastery(monasteryName, text, callbacks = {}) {
  // if synth unsupported
  if (!("speechSynthesis" in window)) {
    alert("Text-to-Speech not supported in this browser.");
    return;
  }

  // If another monastery is active, cancel
  if (synth.speaking) {
    synth.cancel();
  }

  activeMonastery = monasteryName;

  const utter = new SpeechSynthesisUtterance();
  activeUtterance = utter;
  utter.text = text;
  // pick voice / lang hint
  const ttsLang = ttsLangMap[currentLang] || "en-US";
  utter.lang = ttsLang;

  // try to select a matching voice if available
  const voices = synth.getVoices();
  if (voices && voices.length) {
    // find voice with exact lang match, else fallback to first voice that contains the lang code
    let v = voices.find(x => x.lang && x.lang.toLowerCase().startsWith(ttsLang.toLowerCase()));
    if (!v) {
      v = voices.find(x => x.lang && x.lang.toLowerCase().includes((ttsLang.split("-")[0] || "").toLowerCase()));
    }
    if (v) utter.voice = v;
  }

  // attach events
  utter.onstart = () => {
    if (callbacks.onstart) callbacks.onstart();
    updateStatusForActive("Playing");
  };
  utter.onend = () => {
    activeMonastery = null;
    activeUtterance = null;
    if (callbacks.onend) callbacks.onend();
    updateStatusForActive("Finished");
    resetAllTTSControls();
  };
  utter.onerror = (e) => {
    console.error("TTS error:", e);
    activeMonastery = null;
    activeUtterance = null;
    if (callbacks.onerror) callbacks.onerror(e);
    updateStatusForActive("Error");
    resetAllTTSControls();
  };

  // speak
  synth.speak(utter);
  // Update UI states
  markControlsForMonastery(monasteryName, { playing: true });
}

// Find control row for a monastery and update its UI states
function markControlsForMonastery(monasteryName, { playing = false } = {}) {
  const container = document.getElementById("monastery-list");
  if (!container) return;
  container.querySelectorAll(".audio-controls").forEach(ctrl => {
    const name = decodeURIComponent(ctrl.dataset.name || "");
    const play = ctrl.querySelector(".tts-play");
    const pause = ctrl.querySelector(".tts-pause");
    const resume = ctrl.querySelector(".tts-resume");
    const stop = ctrl.querySelector(".tts-stop");
    const status = ctrl.querySelector(".status");
    if (name === monasteryName) {
      if (playing) {
        play.setAttribute("disabled", "true");
        pause.removeAttribute("disabled");
        stop.removeAttribute("disabled");
        resume.setAttribute("disabled", "true");
        status.textContent = "Playing";
      } else {
        // not playing
        play.removeAttribute("disabled");
        pause.setAttribute("disabled", "true");
        resume.setAttribute("disabled", "true");
        stop.setAttribute("disabled", "true");
        status.textContent = "Idle";
      }
    } else {
      // disable other cards while one is playing (optional UX)
      play.removeAttribute("disabled");
      pause.setAttribute("disabled", "true");
      resume.setAttribute("disabled", "true");
      stop.setAttribute("disabled", "true");
      status.textContent = status.textContent || "Idle";
    }
  });
}

// Reset all TTS controls to initial state
function resetAllTTSControls() {
  const container = document.getElementById("monastery-list");
  if (!container) return;
  container.querySelectorAll(".audio-controls").forEach(ctrl => {
    const play = ctrl.querySelector(".tts-play");
    const pause = ctrl.querySelector(".tts-pause");
    const resume = ctrl.querySelector(".tts-resume");
    const stop = ctrl.querySelector(".tts-stop");
    const status = ctrl.querySelector(".status");
    play.removeAttribute("disabled");
    pause.setAttribute("disabled", "true");
    resume.setAttribute("disabled", "true");
    stop.setAttribute("disabled", "true");
    if (status) status.textContent = "Idle";
  });
  activeMonastery = null;
  activeUtterance = null;
}

// update status text for active card (if present)
function updateStatusForActive(text) {
  const container = document.getElementById("monastery-list");
  if (!container || !activeMonastery) return;
  container.querySelectorAll(".audio-controls").forEach(ctrl => {
    const name = decodeURIComponent(ctrl.dataset.name || "");
    if (name === activeMonastery) {
      const status = ctrl.querySelector(".status");
      if (status) status.textContent = text;
    }
  });
}

// ------------------- Download -------------------
function downloadMonasteryData(monasteryName) {
  // monasteryName is plain text
  const monastery = monasteriesData.find(m => m.name === monasteryName);
  if (!monastery) {
    alert("Monastery not found.");
    return;
  }
  const collections = collectionsData[monasteryName] || {};
  const toDownload = { ...monastery, collections };
  const blob = new Blob([JSON.stringify(toDownload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const safeName = (monasteryName || "monastery").replace(/\s+/g, "_").replace(/[^\w\-_.]/g, "");
  a.href = url;
  a.download = `${safeName}_details.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// ------------------- Observer / Filters / Search -------------------
function initObserver() {
  if (observer) observer.disconnect();
  const cards = document.querySelectorAll(".card");
  observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.15 });
  cards.forEach(card => observer.observe(card));
}

function attachFilterHandlers() {
  const btns = document.querySelectorAll(".filter-buttons button");
  btns.forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-buttons button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;
      if (filter === "all") {
        displayMonasteries(monasteriesData);
      } else {
        const filtered = (monasteriesData || []).filter(m => Array.isArray(m.collections) && m.collections.includes(filter));
        displayMonasteries(filtered);
      }
      initObserver();
    });
  });
}

function attachSearchHandler() {
  const box = document.getElementById("searchBox");
  if (!box) return;
  box.addEventListener("input", (e) => {
    const q = (e.target.value || "").trim().toLowerCase();
    const filtered = (monasteriesData || []).filter(m => {
      return (m.name || "").toLowerCase().includes(q) || (m.location || "").toLowerCase().includes(q);
    });
    displayMonasteries(filtered);
    initObserver();
  });
}

// ------------------- Utils -------------------
function escapeHtml(str) {
  if (!str) return "";
  return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[s]);
}
function escapeAttr(str) {
  if (!str) return "";
  return String(str).replace(/"/g, "&quot;");
}
function truncate(text, n) {
  if (!text) return "";
  return text.length > n ? text.slice(0, n) + "…" : text;
}

// if page is unloaded or navigated away, stop any speaking
window.addEventListener("beforeunload", () => {
  if (synth && synth.speaking) synth.cancel();
});
