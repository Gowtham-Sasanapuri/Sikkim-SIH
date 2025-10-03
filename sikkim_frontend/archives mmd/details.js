function getQueryParam(key) {
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
}

const monasteryNameParam = decodeURIComponent(getQueryParam('name') || '');
const monasteryName = monasteryNameParam || '';
const lang = getQueryParam("lang") || localStorage.getItem("lang") || "en";

const monasteryTitleEl = document.getElementById('monasteryName');
const overviewEl = document.getElementById('overview');
const collectionsContainer = document.getElementById('collectionsContainer');
const backBtn = document.getElementById('backBtn');
const downloadAllBtn = document.getElementById('downloadAll');

backBtn.addEventListener('click', () => history.back());

let monasteriesData = [];
let collectionsData = {};

// Audio management
let currentUtterance = null;
let currentAudioBtnGroup = null;

function playAudio(text, btnGroup) {
  stopAudio(); // stop any previous audio
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang === 'en' ? 'en-US' : lang; 
  utterance.onend = () => updateAudioStatus(btnGroup, 'Stopped');
  currentUtterance = utterance;
  currentAudioBtnGroup = btnGroup;
  speechSynthesis.speak(utterance);
  updateAudioStatus(btnGroup, 'Playing');
}

function pauseAudio() {
  if (currentUtterance) {
    speechSynthesis.pause();
    updateAudioStatus(currentAudioBtnGroup, 'Paused');
  }
}

function resumeAudio() {
  if (currentUtterance) {
    speechSynthesis.resume();
    updateAudioStatus(currentAudioBtnGroup, 'Playing');
  }
}

function stopAudio() {
  if (currentUtterance) {
    speechSynthesis.cancel();
    updateAudioStatus(currentAudioBtnGroup, 'Stopped');
    currentUtterance = null;
    currentAudioBtnGroup = null;
  }
}

function updateAudioStatus(btnGroup, status) {
  if (!btnGroup) return;
  const statusEl = btnGroup.querySelector('.status');
  if (statusEl) statusEl.innerText = status;
}

// Fetch monastery & collection data
Promise.all([
  fetch(`monasteries_${lang}.json`).then(r => r.json()).catch(()=>[]),
  fetch(`collections_${lang}.json`).then(r => r.json()).catch(()=>({}))
]).then(([monas, cols]) => {
  monasteriesData = monas;
  collectionsData = cols;

  const monastery = monasteriesData.find(m => m.name === monasteryName);
  if (!monastery) {
    monasteryTitleEl.innerText = 'Monastery not found';
    overviewEl.innerHTML = '<p>No monastery found for that name.</p>';
    return;
  }

  monasteryTitleEl.innerText = monastery.name;
  overviewEl.innerHTML = `
    <img src="${monastery.image}" alt="${monastery.name}" style="width:90%;margin:20px auto;display:block;border-radius:8px;object-fit:cover;">
    <div style="max-width:720px;margin:15px auto">
      <p><strong>Location:</strong> ${monastery.location}</p>
      <p><strong>Period:</strong> ${monastery.period}</p>
      <p><strong>Pages:</strong> ${monastery.pages || 'N/A'}</p>
    </div>
    <p style="margin:20px auto;max-width:90%">${monastery.mainDescription}</p>
  `;

  const types = monastery.collections || ['Manuscripts','Murals','Documents'];
  collectionsContainer.innerHTML = '';

  types.forEach(type => {
    const items = (collectionsData[monastery.name] && collectionsData[monastery.name][type]) || [];
    const section = document.createElement('section');
    section.innerHTML = `<h2>${type} (${items.length})</h2>`;

    if (items.length === 0) {
      section.innerHTML += `<p>No ${type.toLowerCase()} available.</p>`;
    } else {
      const grid = document.createElement('div');
      grid.style.display = 'grid';
      grid.style.gridTemplateColumns = 'repeat(auto-fit,minmax(240px,1fr))';
      grid.style.gap = '12px';

      items.forEach(it => {
        const card = document.createElement('div');
        card.classList.add("card");
        card.innerHTML = `
          <img src="${it.image}" alt="${it.title}">
          <h3>${it.title}</h3>
          <p>${it.description}</p>

          <div class="audio-controls" style="margin:8px 0;">
            <button class="play-btn btn small">Play</button>
            <button class="pause-btn btn small">Pause</button>
            <button class="resume-btn btn small">Resume</button>
            <button class="stop-btn btn small">Stop</button>
            <span class="status">Stopped</span>
          </div>

          <div style="margin-top:8px;display:flex;gap:8px;">
            <button class="btn small view-item" data-title="${escapeHtml(it.title)}" data-image="${it.image}"><i class="fa-solid fa-eye"></i> View</button>
            <button class="btn small download-item" data-json='${JSON.stringify(it).replace(/'/g,"\\'")}'>
              <i class="fa-solid fa-download"></i> Download
            </button>
          </div>
        `;
        grid.appendChild(card);

        // Audio buttons
        const audioControls = card.querySelector('.audio-controls');
        audioControls.querySelector('.play-btn').addEventListener('click', () => playAudio(it.description, audioControls));
        audioControls.querySelector('.pause-btn').addEventListener('click', pauseAudio);
        audioControls.querySelector('.resume-btn').addEventListener('click', resumeAudio);
        audioControls.querySelector('.stop-btn').addEventListener('click', stopAudio);
      });

      section.appendChild(grid);
    }
    collectionsContainer.appendChild(section);
  });

  // View button (lightbox)
  collectionsContainer.querySelectorAll('.view-item').forEach(b => {
    b.addEventListener('click', () => showLightbox(b.dataset.title, b.dataset.image));
  });

  // Download individual item
  collectionsContainer.querySelectorAll('.download-item').forEach(b => {
    b.addEventListener('click', () => {
      try {
        const item = JSON.parse(b.getAttribute('data-json'));
        const blob = new Blob([JSON.stringify(item, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const safe = (item.title || 'item').replace(/\s+/g,'_').replace(/[^\w\-_.]/g,'');
        a.href = url; a.download = `${safe}.json`; document.body.appendChild(a); a.click(); a.remove();
        URL.revokeObjectURL(url);
      } catch(err) { alert('Could not download item.'); }
    });
  });

  // Download all button
  downloadAllBtn.addEventListener('click', () => {
    const dataToDownload = { monastery, collections: collectionsData[monastery.name] || {} };
    const blob = new Blob([JSON.stringify(dataToDownload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeName = monastery.name.replace(/\s+/g,'_').replace(/[^\w\-_.]/g,'');
    a.href = url; a.download = `${safeName}_full.json`; document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  });

}).catch(err => {
  console.error("Error loading details:", err);
  monasteryTitleEl.innerText = 'Error';
  overviewEl.innerHTML = '<p>Could not load monastery details.</p>';
});

// Lightbox to view images
function showLightbox(title, imageUrl) {
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.background = "rgba(0,0,0,0.8)";
  overlay.style.display = "flex";
  overlay.style.flexDirection = "column";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.zIndex = "1000";
  overlay.innerHTML = `
    <div style="max-width:90%;max-height:80%;text-align:center;">
      <h2 style="color:white;margin-bottom:10px;">${escapeHtml(title)}</h2>
      <img src="${imageUrl}" alt="${escapeHtml(title)}" style="max-width:100%;max-height:70vh;border-radius:8px;">
      <br>
      <button class="btn small" style="margin-top:10px;background:#fff;color:#000;">Close</button>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.querySelector("button").addEventListener("click", () => overlay.remove());
  overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.remove(); });
}

// Escape HTML helper
function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/[&<>"']/g, (s) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[s]);
}
