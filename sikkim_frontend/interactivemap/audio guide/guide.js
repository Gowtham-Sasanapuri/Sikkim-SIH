

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
let service_nav = document.getElementById("Services")

service_nav.onclick = () => {
    window.location.href = "/sikkim_frontend/services/services/services.html"
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






const monasteries = [
    {
        "name": { "en": "Dubdi Monastery", "hi": "दुबदी मठ" },
        "latitude": 27.3819,
        "longitude": 88.2466,
        "introduction": {
            "en": "Nestled atop a gentle hill about 3 km from Yuksom, Dubdi Monastery (sometimes called Yuksom Monastery) is often regarded as the oldest functioning monastery in Sikkim. Its name in the local dialect means “the retreat,” and it was established as a hermitage-like sanctuary by Lhatsun Namkha Jigme with strong spiritual intent. The monastery is built in a modest two-storey stone structure with a tapering roof, and features painted interiors, religious iconography, and ancient manuscripts preserved in its side chambers. Its quiet surroundings, forested paths, and Himalayan vistas lend it an aura of peaceful seclusion.",
            "hi": "युकसोम से लगभग 3 किमी की दूरी पर एक शांत पहाड़ी पर स्थित, दुबदी मठ (जिसे कभी-कभी युकसोम मठ भी कहा जाता है) को सिक्किम का सबसे पुराना कार्यरत मठ माना जाता है। स्थानीय भाषा में इसका अर्थ है 'संन्यास स्थान', और इसे ल्हात्सुन नामखा जिगमे द्वारा एक साधु आश्रम जैसी शरणस्थली के रूप में स्थापित किया गया था। यह मठ एक साधारण दो-मंजिला पत्थर की संरचना में बना है, जिसमें चढ़ती छत और चित्रित आंतरिक हिस्से, धार्मिक चित्र और प्राचीन पांडुलिपियाँ शामिल हैं। इसके शांत वातावरण, जंगल से भरे रास्ते और हिमालयी दृश्य इसे शांति का अनुभव कराते हैं।"
        },
        "history": {
            "en": "Dubdi was founded in 1701 under the patronage of the Namgyal monarchy (Chogyal Namgyal) in order to establish a formal Buddhist monastic presence in the emerging kingdom of Sikkim...",
            "hi": "दुबदी की स्थापना 1701 में नामग्याल राजशाही (छोग्याल नामग्याल) के संरक्षण में हुई थी, ताकि उभरते हुए सिक्किम राज्य में बौद्ध मठ की आधिकारिक उपस्थिति स्थापित की जा सके..."
        },
        "closing": {
            "en": "As you depart from Dubdi Monastery, take a moment to absorb the silence, the gentle wind stirring prayer flags, and the ancient walls that have witnessed centuries of devotion...",
            "hi": "दुबदी मठ से प्रस्थान करते समय, शांति को महसूस करने के लिए एक क्षण लें, प्रार्थना झंडों को हल्की हवा में हिलते हुए देखें और उन प्राचीन दीवारों को याद करें जिन्होंने सदियों की भक्ति देखी है..."
        }
    },
    {
        "name": { "en": "Enchey Monastery", "hi": "एन्चे मठ" },
        "latitude": 27.3427,
        "longitude": 88.6132,
        "introduction": {
            "en": "Perched on a ridge overlooking Gangtok, Enchey Monastery is small in scale but rich in spiritual resonance...",
            "hi": "गंगटोक को निहारते हुए एक पहाड़ी की कगार पर स्थित, एन्चे मठ आकार में छोटा है लेकिन आध्यात्मिक ऊर्जा में समृद्ध है..."
        },
        "history": {
            "en": "According to tradition, the founder was Lama Druptob Karpo, a Tibetan yogi believed to have had the power to fly...",
            "hi": "परंपरा के अनुसार, इसके संस्थापक लामा ड्रुपटॉब कारपो थे, एक तिब्बती योगी जिनमें उड़ने की शक्ति होने की मान्यता थी..."
        },
        "closing": {
            "en": "Let the solemn chants and fluttering flags at Enchey accompany your reverence as you descend toward the city...",
            "hi": "जैसे ही आप शहर की ओर उतरते हैं, एन्चे मठ में गूंजती गंभीर मंत्रोच्चारण और लहराते झंडों के साथ अपनी श्रद्धा का अनुभव करें..."
        }
    },
    {
        "name": { "en": "Kartok Monastery", "hi": "कार्टोक मठ" },
        "latitude": 27.6875,
        "longitude": 88.7433,
        "introduction": {
            "en": "Kartok Monastery sits opposite the serene Kartok Lake in the Yuksom region, offering a visual harmony between water and sacred architecture...",
            "hi": "कार्टोक मठ युकसोम क्षेत्र में शांत कार्टोक झील के सामने स्थित है, जो पानी और पवित्र वास्तुकला के बीच दृश्य सामंजस्य प्रदान करता है..."
        },
        "history": {
            "en": "Kartok Monastery is part of the monastic circuit around Yuksom and is said to have grown in prominence as the region developed spiritual institutions...",
            "hi": "कार्टोक मठ युकसोम के मठ परिसर का हिस्सा है और कहा जाता है कि जैसे-जैसे क्षेत्र में आध्यात्मिक संस्थाओं का विकास हुआ, इसका महत्व बढ़ा..."
        },
        "closing": {
            "en": "Pause here by Kartok Lake to breathe in the stillness and sense how the monastery and water reflect each other in silent dialogue...",
            "hi": "कार्टोक झील के पास यहाँ रुकें, शांति में साँस लें और महसूस करें कि मठ और पानी एक मौन संवाद में कैसे एक-दूसरे को प्रतिबिंबित करते हैं..."
        }
    },
    {
        "name": { "en": "Lingdum (Ranka) Monastery", "hi": "लिंगडुम (रांका) मठ" },
        "latitude": 27.3305,
        "longitude": 88.7023,
        "introduction": {
            "en": "Located about 20 km from Gangtok in East Sikkim, Lingdum Monastery (also known as Ranka Monastery) is one of the newer monasteries in the state...",
            "hi": "पूर्व सिक्किम में गंगटोक से लगभग 20 किमी की दूरी पर स्थित, लिंगडुम मठ (जिसे रांका मठ भी कहा जाता है) राज्य के नए मठों में से एक है..."
        },
        "history": {
            "en": "Lingdum was built to serve the spiritual needs of the East Sikkim region and to provide a fresh center of Buddhist practice...",
            "hi": "लिंगडुम को पूर्व सिक्किम क्षेत्र की आध्यात्मिक जरूरतों को पूरा करने और बौद्ध अभ्यास का एक नया केंद्र प्रदान करने के लिए बनाया गया था..."
        },
        "closing": {
            "en": "Amid the forest whispers and fluttering saffron fabrics here at Lingdum, let your spirit pause...",
            "hi": "लिंगडुम में जंगल की फुसफुसाहट और लहराते केसरिया वस्त्रों के बीच, अपने मन को शांति के लिए एक क्षण दें..."
        }
    },
    {
        "name": { "en": "Pemayangtse Monastery", "hi": "पेमायांगट्से मठ" },
        "latitude": 27.3017,
        "longitude": 88.2335,
        "introduction": {
            "en": "Pemayangtse Monastery lies near Pelling in West Sikkim, approximately 6 km from Gyalshing...",
            "hi": "पेमायांगट्से मठ पश्चिम सिक्किम में पे्लिंग के पास स्थित है, जो ग्याल्शिंग से लगभग 6 किमी की दूरी पर है..."
        },
        "history": {
            "en": "Though the earliest small temple (lhakhang) was reportedly built in 1647 by Lama Lhatsun Chempo...",
            "hi": "हालांकि सबसे पहला छोटा मंदिर (ल्हाखांग) कथित रूप से 1647 में लामा ल्हात्सुन चेम्पो द्वारा बनाया गया था..."
        },
        "closing": {
            "en": "As you depart Pemayangtse, feel how its calm dignity and the mountain vistas infused in its walls accompany your inner journey...",
            "hi": "पेमायांगट्से से प्रस्थान करते समय महसूस करें कि इसकी शांत गरिमा और पहाड़ी दृश्य आपकी आंतरिक यात्रा के साथ कैसे चलते हैं..."
        }
    },
    {
        "name": { "en": "Phodong Monastery", "hi": "फोडोंग मठ" },
        "latitude": 27.3962,
        "longitude": 88.5946,
        "introduction": {
            "en": "Perched in North Sikkim about 28 km from Gangtok, Phodong Monastery (also spelled Phodang or Podong) is an important center of the Kagyupa order...",
            "hi": "उत्तर सिक्किम में गंगटोक से लगभग 28 किमी की दूरी पर स्थित, फोडोंग मठ (जिसे फोडांग या पोडोंग भी कहा जाता है) काग्युपा पंथ का एक महत्वपूर्ण केंद्र है..."
        },
        "history": {
            "en": "Phodong’s founding is attributed to Chogyal Gyurmed Namgyal in the mid-18th century...",
            "hi": "फोडोंग की स्थापना 18वीं सदी के मध्य में छोग्याल गुरमेद नामग्याल को बताया जाता है..."
        },
        "closing": {
            "en": "Pause at Phodong’s threshold and let the painted walls, chanting voices, and mountain air remind you of the long lineage of devotion...",
            "hi": "फोडोंग के प्रांगण में रुकें और पेंटेड दीवारों, मंत्रोच्चारण की आवाजों और पहाड़ी हवा के माध्यम से भक्ति की लंबी परंपरा को याद करें..."
        }
    },
    {
        "name": { "en": "Ralang Monastery", "hi": "रालांग मठ" },
        "latitude": 27.3094,
        "longitude": 88.3669,
        "introduction": {
            "en": "Located near Ravangla in South Sikkim, Ralang Monastery is a vibrant center of Tibetan Buddhist culture...",
            "hi": "दक्षिण सिक्किम के रवांगला के पास स्थित, रालांग मठ तिब्बती बौद्ध संस्कृति का एक जीवंत केंद्र है..."
        },
        "history": {
            "en": "Though precise early records are sparse, a newer monastery branch was built around 1995...",
            "hi": "हालांकि शुरुआती रिकॉर्ड कम हैं, लगभग 1995 के आसपास एक नया मठ शाखा बनाया गया..."
        },
        "closing": {
            "en": "Let the vivid hues and festival echoes of Ralang linger in your spirit as you depart...",
            "hi": "रालांग के जीवंत रंग और त्योहार की गूँज को अपने मन में महसूस करें जब आप प्रस्थान करें..."
        }
    },
    {
        "name": { "en": "Rumtek Monastery (Dharma Chakra Centre)", "hi": "रुमटेक मठ (धर्म चक्र केंद्र)" },
        "latitude": 27.33194,
        "longitude": 88.60194,
        "introduction": {
            "en": "Rumtek Monastery, officially known as the Dharma Chakra Centre, is perhaps the most globally recognized monastic site in Sikkim...",
            "hi": "रुमटेक मठ, जिसे आधिकारिक रूप से धर्म चक्र केंद्र कहा जाता है, शायद सिक्किम का सबसे अधिक विश्व स्तर पर पहचाना जाने वाला मठ स्थल है..."
        },
        "history": {
            "en": "Rumtek’s early origin traces back to a 16th-century foundation by the 9th Karmapa...",
            "hi": "रुमटेक की शुरुआती उत्पत्ति 16वीं सदी में 9वें कर्मपा द्वारा स्थापित आधार से जुड़ी है..."
        },
        "closing": {
            "en": "As you walk the courtyards and corridors of Rumtek, sense the convergence of exile, devotion, learning, and tradition...",
            "hi": "जैसे ही आप रुमटेक के आंगनों और गलियारों में चलते हैं, निर्वासन, भक्ति, शिक्षा और परंपरा के संगम को महसूस करें..."
        }
    },
    {
        "name": { "en": "Tashiding Monastery", "hi": "ताशिदिंग मठ" },
        "latitude": 27.2957,
        "longitude": 88.2816,
        "introduction": {
            "en": "Tashiding Monastery is considered among the holiest monasteries in Sikkim — often referred to as the “Heart of Sikkim / Denzong.” It sits atop a hill between the Rathong and Rangeet rivers...",
            "hi": "ताशिदिंग मठ को सिक्किम के सबसे पवित्र मठों में से एक माना जाता है — अक्सर इसे 'सिक्किम का हृदय / डेंज़ॉंग' कहा जाता है। यह राथोंग और रेंजेट नदियों के बीच एक पहाड़ी पर स्थित है..."
        },
        "history": {
            "en": "The origins of Tashiding trace back to the 17th century, when a small lhakhang (temple) was built under the guidance of Guru Padmasambhava...",
            "hi": "ताशिदिंग की उत्पत्ति 17वीं सदी में हुई, जब गुरु पद्मसंभव के मार्गदर्शन में एक छोटा ल्हाखांग (मंदिर) बनाया गया था..."
        },
        "closing": {
            "en": "From these chortens and prayer flags at Tashiding, let your spirit draw deep from the sacred rivers below...",
            "hi": "ताशिदिंग के इन चोर्टेनों और प्रार्थना झंडों से, अपने मन को नीचे पवित्र नदियों से ऊर्जा लेने दें..."
        }
    },
    {
        "name": { "en": "Tsuklakhang Palace (Royal Chapel & Monastery)", "hi": "त्सुक्लाखांग पैलेस (रॉयल चैपल और मठ)" },
        "latitude": 27.3281,
        "longitude": 88.6129,
        "introduction": {
            "en": "Tsuklakhang Palace (or Tsuklakhang Royal Chapel and Monastery) in Gangtok serves dually as the royal chapel of the Sikkim Chogyals and as a Buddhist monastery...",
            "hi": "त्सुक्लाखांग पैलेस (या त्सुक्लाखांग रॉयल चैपल और मठ) गंगटोक में सिक्किम छोग्याल के शाही चैपल और एक बौद्ध मठ दोनों के रूप में कार्य करता है..."
        },
        "history": {
            "en": "Tsuklakhang was founded circa 1898 to function as both royal and spiritual center...",
            "hi": "त्सुक्लाखांग की स्थापना लगभग 1898 में शाही और आध्यात्मिक केंद्र दोनों के रूप में हुई..."
        },
        "closing": {
            "en": "As your footsteps echo through the halls of Tsuklakhang, sense the intertwining of royal memory and spiritual devotion embedded in its walls...",
            "hi": "जैसे ही आपके कदम त्सुक्लाखांग के हॉल में गूंजते हैं, इसके दीवारों में बसी शाही स्मृति और आध्यात्मिक भक्ति को महसूस करें..."
        }
    }
];
let lastLat = null, lastLon = null;
// ---- UTILITY: Distance in meters ----
function distance(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ---- LANGUAGE HANDLING ----
const langSelect = document.getElementById("langSelect");
let currentLang = langSelect.value;
function updateLanguageContent() {
    // Header
    document.querySelector(".header-title").textContent = currentLang === "hi" ? "📍 मठ ऑडियो गाइड" : "📍 Monastery Audio Guide";
    document.querySelector(".header-sub").textContent = currentLang === "hi" ? "सिक्किम के मठों की आध्यात्मिक विरासत की खोज करें" : "Discover the spiritual heritage of Sikkim's monasteries";

    // Location Panel
    document.querySelectorAll(".location-label").forEach(label => {
        if (label.textContent === "Your Location") label.textContent = currentLang === "hi" ? "आपका स्थान" : "Your Location";
        if (label.textContent === "Nearest Monastery") label.textContent = currentLang === "hi" ? "निकटतम मठ" : "Nearest Monastery";
    });

    // Audio Status Panel
    document.getElementById("audioMainMsg").textContent = currentLang === "hi" ? "कोई ऑडियो नहीं चल रहा" : "No audio playing";
    document.getElementById("audioHelpMsg").textContent = currentLang === "hi" ? "ऑडियो गाइड शुरू करने के लिए किसी मठ के 100 मीटर के भीतर जाएं" : "Get within 100m of a monastery to start the audio guide";
    document.getElementById("pauseBtn").textContent = currentLang === "hi" ? "रोकें" : "Pause";
    document.getElementById("resumeBtn").textContent = currentLang === "hi" ? "पुनः शुरू करें" : "Resume";
    document.getElementById("nextBtn").textContent = currentLang === "hi" ? "आगे" : "Forward";
    document.querySelector("label[for='langSelect']").textContent = currentLang === "hi" ? "🌐 भाषा:" : "🌐 Language:";

    // Cards Section
    document.querySelector(".section-title").textContent = currentLang === "hi" ? "🎧 उपलब्ध ऑडियो गाइड" : "🎧 Available Audio Guides";

    // Footer
    const footerText = document.querySelector(".footer-box b");
    footerText.textContent = currentLang === "hi" ? "इस गाइड का उपयोग कैसे करें:" : "How to use this guide:";
    const footerList = document.querySelectorAll(".footer-box ul li");
    footerList[0].textContent = currentLang === "hi" ? "जब संकेत मिले तो स्थान तक पहुँच की अनुमति दें" : "Allow location access when prompted";
    footerList[1].textContent = currentLang === "hi" ? "किसी सूचीबद्ध मठ के पास जाएँ ताकि उसका ऑडियो गाइड स्वचालित रूप से सुना जा सके" : "Move near any listed monastery to hear its audio guide automatically";
    footerList[2].textContent = currentLang === "hi" ? "आप मैन्युअल रूप से गाइड क्लिप भी चला सकते हैं" : "You may also play guide clips manually";
    footerList[3].textContent = currentLang === "hi" ? "ऑडियो को रोकने, फिर से शुरू करने या छोड़ने के लिए ऊपर के नियंत्रणों का उपयोग करें" : "Use the controls above to pause, resume, or skip audio";

    // Re-render cards to reflect language change
    renderCards();
}
langSelect.addEventListener("change", () => {
    currentLang = langSelect.value;
    updateLanguageContent();
    if (lastLat !== null && lastLon !== null) updateLocation(lastLat, lastLon); // refresh distances & nearest
});

// ---- AUDIO STATE ----
let playingGuide = false;
let playingIdx = null;
let sectionIdx = null;
let guideSections = ["introduction", "history", "closing"];
let currentUtterance = null;

// ---- RENDER MONASTERY CARDS ----
function renderCards() {
    const cardsDiv = document.getElementById("monasteryCards");
    cardsDiv.innerHTML = "";
    monasteries.forEach((m, idx) => {
        const card = document.createElement("div");
        card.className = "monastery-card";
        card.innerHTML = `
      <div class="card-title">${m.name[currentLang]}</div>
      <div class="card-desc">${m.introduction[currentLang].slice(0, 120)}...</div>
      <div class="audio-clip-list">
        <button class="audio-clip-btn" data-idx="${idx}" data-type="introduction">Intro</button>
        <button class="audio-clip-btn" data-idx="${idx}" data-type="history">History</button>
        <button class="audio-clip-btn" data-idx="${idx}" data-type="closing">Closing</button>
      </div>
      <div class="card-footer">
        <span class="card-coord">📍 ${m.latitude.toFixed(4)}, ${m.longitude.toFixed(4)}</span>
        <span class="distance-badge" id="badge${idx}">--</span>
        <button class="play-guide-btn" data-idx="${idx}">Play Guide</button>
      </div>
    `;
        cardsDiv.appendChild(card);
    });

    document.querySelectorAll(".audio-clip-btn").forEach(btn => {
        btn.onclick = function () { playClip(+this.dataset.idx, this.dataset.type); };
    });
    document.querySelectorAll(".play-guide-btn").forEach(btn => {
        btn.onclick = function () { playGuide(+this.dataset.idx); };
    });
}

// ---- PLAY A SINGLE CLIP ----
function playClip(idx, type) {
    window.speechSynthesis.cancel();
    const txt = monasteries[idx][type][currentLang];
    currentUtterance = new SpeechSynthesisUtterance(txt);
    currentUtterance.lang = currentLang === "hi" ? "hi-IN" : "en-US";
    currentUtterance.rate = 0.96;
    window.speechSynthesis.speak(currentUtterance);
    document.getElementById("audioMainMsg").innerText =
        `Now playing: ${type} - ${monasteries[idx].name[currentLang]}`;
}

// ---- PLAY FULL GUIDE ----
function playGuide(idx) {
    if (playingGuide && playingIdx === idx) return; // already playing
    window.speechSynthesis.cancel();
    playingGuide = true;
    playingIdx = idx;
    sectionIdx = 0;
    playCurrentClip();
}

function playCurrentClip() {
    if (!playingGuide || sectionIdx === null || playingIdx === null) return;
    const txt = monasteries[playingIdx][guideSections[sectionIdx]][currentLang];
    currentUtterance = new SpeechSynthesisUtterance(txt);
    currentUtterance.lang = currentLang === "hi" ? "hi-IN" : "en-US";
    currentUtterance.rate = 0.96;

    document.getElementById("audioMainMsg").innerText =
        `Now playing: ${guideSections[sectionIdx]} - ${monasteries[playingIdx].name[currentLang]}`;

    currentUtterance.onend = function () {
        if (playingGuide && sectionIdx < guideSections.length - 1) {
            sectionIdx++;
            playCurrentClip();
        } else {
            playingGuide = false;
            playingIdx = null;
            sectionIdx = null;
            document.getElementById("audioHelpMsg").innerText = "Guide finished.";
        }
    };
    window.speechSynthesis.speak(currentUtterance);
}

// ---- AUDIO CONTROLS ----
document.getElementById("pauseBtn").onclick = () => {
    window.speechSynthesis.pause();
    document.getElementById("audioHelpMsg").innerText = "Audio paused.";
};
document.getElementById("resumeBtn").onclick = () => {
    window.speechSynthesis.resume();
    document.getElementById("audioHelpMsg").innerText = "Audio resumed.";
};
document.getElementById("nextBtn").onclick = () => {
    if (playingGuide && sectionIdx < guideSections.length - 1) {
        window.speechSynthesis.cancel();
        sectionIdx++;
        playCurrentClip();
    }
};

// ---- UPDATE LOCATION & AUTO-PLAY ----
function updateLocation(lat, lon) {
    lastLat = lat;
    lastLon = lon;
    document.getElementById("locationVal").innerText = `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
    let minD = Infinity, minIdx = -1;
    monasteries.forEach((m, i) => {
        const dist = distance(lat, lon, m.latitude, m.longitude);
        const badge = document.getElementById("badge" + i);
        badge.innerText = dist < 1000 ? `${Math.round(dist)}m` : `${(dist / 1000).toFixed(1)}km`;
        badge.style.background = dist < 100 ? "#d4fbd4" : "#ffdbdb";
        if (dist < minD) { minD = dist; minIdx = i; }
    });
    document.getElementById("nearestMonName").innerText = minIdx >= 0 ? monasteries[minIdx].name[currentLang] : "--";
    document.getElementById("distVal").innerText = minD < 1000 ? `${Math.round(minD)}m` : `${(minD / 1000).toFixed(1)}km`;
    document.getElementById("distVal").className = minD < 100 ? "location-distance distance-near" : "location-distance distance-far";

    // AUTO-PLAY if within 100m
    if (minD < 100 && (!playingGuide || playingIdx !== minIdx)) {
        document.getElementById("audioHelpMsg").innerText = "You are in range! Audio guide active.";
        playGuide(minIdx);
    } else if (minD >= 100 && !playingGuide) {
        document.getElementById("audioHelpMsg").innerText = "Get within 100m of a monastery to start the audio guide";
    }
}

// ---- GEOLOCATION WATCH ----
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        pos => updateLocation(pos.coords.latitude, pos.coords.longitude),
        () => { document.getElementById("locationVal").innerText = "Location not available"; }
    );
    navigator.geolocation.watchPosition(
        pos => updateLocation(pos.coords.latitude, pos.coords.longitude),
        () => { document.getElementById("locationVal").innerText = "Location not available"; }
    );
}

// INITIAL RENDER
renderCards();
