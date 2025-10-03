let festivalsData = [];
let currentHighlightedCard = null;
let sikkimCalendar = null;
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

  audio_nav.onclick = () => {
    window.location.href = "../interactivemap/audio guide/guide.html"
  }
  service_nav.onclick = () => {
  window.location.href = "/sikkim_frontend/services/services/services.html"
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

async function loadFestivals() {
  try {
    const response = await fetch("data.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    festivalsData = data.festivals;
    window.festivalsData = data;
    
    // Load details.json to merge monasteryInvolvement and booking details
    const detailsResponse = await fetch("details.json");
    if (!detailsResponse.ok) {
      throw new Error(`HTTP error! status: ${detailsResponse.status}`);
    }
    const detailsData = await detailsResponse.json();
    window.festivalsData.details = detailsData;
    
    // Merge monasteryInvolvement into festivalsData
    festivalsData.forEach(festival => {
      const detail = detailsData.find(d => d.name === festival.name);
      if (detail) {
        festival.monasteryInvolvement = detail.monasteryInvolvement;
      } else {
        festival.monasteryInvolvement = "No";
      }
    });
    
    renderFestivals(festivalsData);
    updateEventCount(festivalsData.length);
    updateCalendarTitle();
    
    setTimeout(() => {
      initializeCalendar(festivalsData);
      setupCalendarToggle();
      setupFilterListeners();
    }, 100);
    
  } catch (error) {
    console.error("Error loading festivals:", error);
    const container = document.getElementById("festival-container");
    if (container) {
      container.innerHTML = '<div class="error-message">Failed to load festivals. Please check your connection and try again.</div>';
    }
  }
}

function setupCalendarToggle() {
  const toggleBtn = document.getElementById('toggleCalendar');
  const calendarContainer = document.getElementById('calendarContainer');
  
  if (toggleBtn && calendarContainer) {
    toggleBtn.addEventListener('click', () => {
      const isVisible = calendarContainer.classList.contains('show');
      
      if (isVisible) {
        calendarContainer.classList.remove('show');
        toggleBtn.textContent = '📅 Open Calendar';
        toggleBtn.style.background = 'linear-gradient(135deg, #1890FF, #40A9FF)';
      } else {
        calendarContainer.classList.add('show');
        toggleBtn.textContent = '✖️ Close Calendar';
        toggleBtn.style.background = 'linear-gradient(135deg, #FF4D4F, #FF7875)';
      }
    });
  }
}

function setupFilterListeners() {
  const monthFilter = document.getElementById('monthFilter');
  const bookingFilter = document.getElementById('bookingFilter');
  const monasteryToggle = document.getElementById('monasteryToggle');
  const festivalSearch = document.getElementById('festivalSearch');
  
  if (monthFilter) {
    monthFilter.addEventListener('change', filterFestivals);
  }
  
  if (bookingFilter) {
    bookingFilter.addEventListener('change', filterFestivals);
  }
  
  if (monasteryToggle) {
    monasteryToggle.addEventListener('change', filterFestivals);
  }
  
  if (festivalSearch) {
    festivalSearch.addEventListener('input', filterFestivals);
  }
}

function renderFestivals(festivals) {
  const container = document.getElementById("festival-container");
  if (!container) {
    console.error("Festival container not found");
    return;
  }
  
  container.innerHTML = '';

  if (festivals.length === 0) {
    container.innerHTML = '<div class="error-message">No festivals found for the selected filters.</div>';
    return;
  }

  festivals.forEach((festival) => {
    const card = document.createElement("div");
    card.className = "festival-card";
    card.dataset.festivalId = festival.id;
    card.dataset.festivalName = festival.name;
    
    const tagType = festival.type || 'festival';
    const requiresBooking = getBookingInfo(festival.name);
    
    card.innerHTML = `
      <div class="card-header">
        <div class="card-image" style="background-image: url(${festival.image})">
          ${!festival.image ? '<div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #f5f5f5; color: #999;">No Image</div>' : ''}
        </div>
        <div class="card-title">
          <h3>${escapeHtml(festival.name)}</h3>
          <span class="tag ${tagType}">${tagType.charAt(0).toUpperCase() + tagType.slice(1)}</span>
        </div>
      </div>
      
      <div class="card-content">
        <div class="location">${getLocationForFestival(festival.name)}</div>
        
        <p class="description">${getDescriptionForFestival(festival.name)}</p>
        
        <div class="event-details">
          <div class="date-info">
            <div class="date">${getFormattedDate(festival.date)}</div>
            <div class="duration">${getTimeInfo(festival.name)}</div>
          </div>
          <div class="accessibility">
            <div class="open-to-all">Open to All</div>
            <div class="duration-days">${getDurationDays(festival.name)}</div>
          </div>
        </div>
        
        <div class="event-highlights">
          <div class="highlights-title">Event Highlights</div>
          <div class="highlight-tags">
            ${getHighlightsForFestival(festival.name).map(highlight => 
              `<span class="highlight-tag">${escapeHtml(highlight)}</span>`
            ).join('')}
          </div>
        </div>
        
        <div class="card-footer">
          ${requiresBooking ? 
            '<div class="booking-info">Booking Required</div>' : 
            '<div class="no-booking">Open Access</div>'
          }
          <div class="action-buttons">
            <button class="btn btn-photos">📸 Photos</button>
            <button class="btn btn-learn-more">Learn More</button>
            ${requiresBooking ? 
              '<button class="btn btn-book">Book Now</button>' : 
              ''
            }
          </div>
        </div>
      </div>
    `;
    
    card.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn') || e.target.closest('.btn')) return;
      const identifier = `name=${encodeURIComponent(festival.name)}`;
      window.location.href = `details.html?${identifier}`;
    });
    
    const photosBtn = card.querySelector('.btn-photos');
    const learnMoreBtn = card.querySelector('.btn-learn-more');
    const bookBtn = card.querySelector('.btn-book');
    
    if (photosBtn) {
      photosBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        console.log(`View photos for ${festival.name}`);
        const identifier = `name=${encodeURIComponent(festival.name)}`;
        window.open(`photos.html?${identifier}`, '_blank');
      });
    }
    
    if (learnMoreBtn) {
      learnMoreBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        console.log(`Learn more about ${festival.name}`);
        const identifier = `name=${encodeURIComponent(festival.name)}`;
        window.location.href = `details.html?${identifier}`;
      });
    }
    
    if (bookBtn) {
      bookBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        console.log(`Book ${festival.name}`);
        showBookingModal(festival.name);
      });
    }
    
    container.appendChild(card);
  });
}

function showBookingModal(festivalName) {
  const modal = document.getElementById('bookingModal');
  if (!modal) return;

  // Fetch details from details.json
  const detail = window.festivalsData.details.find(d => d.name === festivalName);
  if (!detail) {
    console.error(`No details found for ${festivalName}`);
    return;
  }

  document.getElementById('modalFestivalName').textContent = `Book ${festivalName}`;
  document.getElementById('modalFestivalDetails').textContent = getDescriptionForFestival(festivalName);
  document.getElementById('modalPrice').textContent = `${detail.price || 500} ${detail.currency || 'INR'}`;
  document.getElementById('modalSeats').textContent = detail.remainingSeats || '50';

  modal.style.display = 'block';

  const closeBtn = document.getElementById('closeModal');
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  const form = document.getElementById('bookingForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    const tickets = document.getElementById('numTickets').value;
    console.log(`Booking for ${festivalName}: ${name}, ${email}, ${tickets} tickets`);
    alert('Booking Confirmed!');
    modal.style.display = 'none';
  });
}

function highlightFestivalCard(festivalName) {
  if (currentHighlightedCard) {
    currentHighlightedCard.classList.remove('highlighted');
  }
  
  const cards = document.querySelectorAll('.festival-card');
  const targetCard = Array.from(cards).find(card => 
    card.dataset.festivalName === festivalName
  );
  
  if (targetCard) {
    targetCard.classList.add('highlighted');
    currentHighlightedCard = targetCard;
    
    targetCard.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center',
      inline: 'nearest'
    });
    
    setTimeout(() => {
      if (currentHighlightedCard === targetCard) {
        targetCard.classList.remove('highlighted');
        currentHighlightedCard = null;
      }
    }, 3000);
  }
}

function updateEventCount(count) {
  const eventCountElement = document.getElementById('eventCount');
  if (eventCountElement) {
    eventCountElement.textContent = `${count} events`;
  }
}

function updateCalendarTitle() {
  const calendarTitle = document.getElementById('calendarTitle');
  if (calendarTitle) {
    const monthFilter = document.getElementById('monthFilter')?.value;
    const bookingFilter = document.getElementById('bookingFilter')?.value;
    
    if (monthFilter !== 'all' && bookingFilter !== 'all') {
      calendarTitle.textContent = `${monthFilter} - ${bookingFilter === 'booking' ? 'Booking Required' : 'Open Access'} Festivals`;
    } else if (monthFilter !== 'all') {
      calendarTitle.textContent = `${monthFilter} Festivals`;
    } else if (bookingFilter !== 'all') {
      calendarTitle.textContent = bookingFilter === 'booking' ? 'Booking Required Festivals' : 'Open Access Festivals';
    } else {
      calendarTitle.textContent = 'Cultural Calendar';
    }
  }
}

function filterFestivals() {
  const monthFilterElement = document.getElementById("monthFilter");
  const bookingFilterElement = document.getElementById("bookingFilter");
  const monasteryToggle = document.getElementById('monasteryToggle');
  const festivalSearch = document.getElementById('festivalSearch');
  
  if (!monthFilterElement || !bookingFilterElement) return;
  
  let filteredFestivals = festivalsData;
  let noResultsMessage = 'No festivals found for the selected filters.';
  
  // Month filter
  const monthFilter = monthFilterElement.value;
  if (monthFilter !== "all") {
    filteredFestivals = filteredFestivals.filter(festival => festival.month === monthFilter);
  }
  
  // Booking filter
  const bookingFilter = bookingFilterElement.value;
  if (bookingFilter !== "all") {
    if (bookingFilter === "booking") {
      filteredFestivals = filteredFestivals.filter(festival => getBookingInfo(festival.name));
    } else if (bookingFilter === "open") {
      filteredFestivals = filteredFestivals.filter(festival => !getBookingInfo(festival.name));
    }
  }
  
  // Monastery toggle filter
  const monasteryFilter = monasteryToggle ? monasteryToggle.checked : false;
  if (monasteryFilter) {
    filteredFestivals = filteredFestivals.filter(festival => festival.monasteryInvolvement === "Yes");
  }
  
  // Search filter
  const searchValue = festivalSearch ? festivalSearch.value.toLowerCase().trim() : '';
  if (searchValue) {
    filteredFestivals = filteredFestivals.filter(festival => festival.name.toLowerCase().includes(searchValue));
    if (filteredFestivals.length === 0) {
      noResultsMessage = `No festivals like "${searchValue}"`;
    }
  }
  
  renderFestivals(filteredFestivals);
  updateEventCount(filteredFestivals.length);
  updateCalendarTitle();
  
  // Update no results message
  if (filteredFestivals.length === 0) {
    const container = document.getElementById("festival-container");
    container.innerHTML = `<div class="error-message">${noResultsMessage}</div>`;
  }
}

function getLocationForFestival(name) {
  const locations = window.festivalsData?.locations;
  return locations?.[name] || 'Various Locations';
}

function getDescriptionForFestival(name) {
  const descriptions = window.festivalsData?.descriptions;
  return descriptions?.[name] || 'A vibrant cultural celebration of Sikkim\'s rich heritage.';
}

function getTimeInfo(name) {
  const timeInfo = window.festivalsData?.timeInfo;
  return timeInfo?.[name] || 'All Day Event';
}

function getDurationDays(name) {
  const durations = window.festivalsData?.durationDays;
  return durations?.[name] || '1 day';
}

function getHighlightsForFestival(name) {
  const highlights = window.festivalsData?.highlights;
  return highlights?.[name] || ['Cultural Dance', 'Traditional Music', 'Community Events', 'Spiritual Blessings'];
}

function getBookingInfo(name) {
  const bookingFestivals = window.festivalsData?.bookingRequired || [];
  return bookingFestivals.includes(name);
}

function getFormattedDate(dateString) {
  const dateMatch = dateString.match(/(\d{1,2})(?:st|nd|rd|th)?\s+(January|February|March|April|May|June|July|August|September|October|November|December)/i);
  
  if (dateMatch) {
    const [, day, month] = dateMatch;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthAbbr = months[new Date(`${month} 1, 2025`).getMonth()];
    return `${day} ${monthAbbr}`;
  }
  
  return dateString.split(' ').slice(0, 3).join(' ');
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

class SikkimCalendar {
  constructor(festivalsData) {
    this.festivals = festivalsData;
    this.currentMonthIndex = 0;
    this.months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    this.year = 2025;
    this.enlargedDay = null;
    this.festivalDateMap = this.buildFestivalDateMap();
    this.init();
  }

  buildFestivalDateMap() {
    const dateMap = {};
    
    this.festivals.forEach(festival => {
      const dates = this.extractAllPossibleDates(festival.date, festival.month);
      dates.forEach(date => {
        if (!dateMap[date]) {
          dateMap[date] = [];
        }
        dateMap[date].push({
          name: festival.name,
          type: festival.type || 'festival'
        });
      });
    });
    
    return dateMap;
  }

  extractAllPossibleDates(dateString, monthName) {
    const dates = [];
    const monthNum = this.getMonthNumber(monthName);
    
    const exactMatch = dateString.match(/(\d{1,2})(?:st|nd|rd|th)?\s+(January|February|March|April|May|June|July|August|September|October|November|December)/i);
    if (exactMatch) {
      const [, day, month] = exactMatch;
      if (month.toLowerCase() === monthName.toLowerCase()) {
        dates.push(`${monthName} ${parseInt(day)}`);
      }
      return dates;
    }
    
    const rangeMatch = dateString.match(/(\d{1,2})(?:st|nd|rd|th)?-\s*(\d{1,2})(?:st|nd|rd|th)?\s+(January|February|March|April|May|June|July|August|September|October|November|December)/i);
    if (rangeMatch) {
      const [, startDay, endDay, month] = rangeMatch;
      if (month.toLowerCase() === monthName.toLowerCase()) {
        const start = parseInt(startDay);
        const end = parseInt(endDay);
        for (let day = start; day <= end; day++) {
          dates.push(`${monthName} ${day}`);
        }
      }
      return dates;
    }
    
    const approxMatch = dateString.match(/≈\s*(January|February|March|April|May|June|July|August|September|October|November|December)/i);
    if (approxMatch && approxMatch[1].toLowerCase() === monthName.toLowerCase()) {
      dates.push(`${monthName} 1`);
    }
    
    const fixedDates = {
      'Maghe Sankranti': 14,
      'Sonam Lochar / Tamang New Year (Sonam Lhosar)': 1,
      'Losar / Tibetan New Year': 1,
      'Bumchu Festival': 15,
      'Holi': 14,
      'Sakewa (Sakela)': 15,
      'Ram Navami / Chaite Dasain': 6,
      'Saga Dawa': 15,
      'International Flower & Garden Festival': 8,
      'Khangchendzonga Festival / Tourist Festival': 20,
      'Drupka Teshi (Drukpa Tshe-zi)': 4,
      'Tendong Lho Rum Faat': 8,
      'Pang Lhabsol': 15,
      'Indra Jatra (Indrajatra)': 7,
      'Dasain / Durga Puja': 1,
      'Deepawali / Tihar (Diwali)': 20,
      'Lhabab Duchen': 15,
      'Tamu Lochar / Gurung New Year': 25,
      'Kagyed / Kagyat Dance': 29,
      'Enchey Chaam': 19,
      'Rumtek Chaams': 28,
      'Losoong / Namsoong': 1,
      'Mangan Music Festival': 15
    };
    
    const festivalName = this.festivals.find(f => f.date.includes(f.name))?.name;
    if (fixedDates[festivalName] && monthName === this.festivals.find(f => f.name === festivalName)?.month) {
      dates.push(`${monthName} ${fixedDates[festivalName]}`);
    }
    
    return dates;
  }

  init() {
    this.createCalendarCards();
    this.renderMonth(this.currentMonthIndex);
    this.setupEventListeners();
  }

  createCalendarCards() {
    const container = document.getElementById('calendarMain');
    if (!container) return;

    this.months.forEach((monthName, index) => {
      const card = document.createElement('div');
      card.className = 'calendar-card';
      card.dataset.monthIndex = index;
      card.id = `month-${index}`;
      card.innerHTML = this.generateCalendarHTML(monthName, index);
      container.appendChild(card);
    });
  }

  generateCalendarHTML(monthName, monthIndex) {
    const month = this.getMonthNumber(monthName);
    const year = this.year;
    const daysInMonth = this.getDaysInMonth(month, year);
    const firstDay = this.getFirstDayOfMonth(month, year);
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const currentDay = today.getDate();
    
    const monthFestivals = this.getFestivalsForMonth(monthName);
    const festivalCount = monthFestivals.length;

    let calendarHTML = `
      <div class="calendar-header-info">
        <div><h3 style="margin: 0; color: #0f52ba; font-size: 0.9rem;">${monthName} ${year}</h3></div>
        <div class="festival-count">${festivalCount} Festivals</div>
      </div>
      
      <div class="calendar-grid">
        <div class="day-header">Sun</div>
        <div class="day-header">Mon</div>
        <div class="day-header">Tue</div>
        <div class="day-header">Wed</div>
        <div class="day-header">Thu</div>
        <div class="day-header">Fri</div>
        <div class="day-header">Sat</div>
    `;

    for (let i = 0; i < firstDay; i++) {
      calendarHTML += '<div class="day-cell other-month"></div>';
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = (monthIndex === currentMonth && year === currentYear && day === currentDay);
      const dateKey = `${monthName} ${day}`;
      const dayFestivals = this.festivalDateMap[dateKey] || [];
      const hasFestival = dayFestivals.length > 0;
      const festivalData = dayFestivals;

      let festivalInfo = '';
      let dotClass = '';
      
      if (hasFestival) {
        const mainFestival = dayFestivals[0];
        const additionalCount = dayFestivals.length - 1;
        festivalInfo = `
          <div class="festival-info">
            <div class="festival-name">${mainFestival.name}</div>
            <div class="festival-type ${mainFestival.type}">${mainFestival.type}${additionalCount > 0 ? ` +${additionalCount}` : ''}</div>
          </div>
        `;
        dotClass = additionalCount > 0 ? 'multiple' : '';
      }

      calendarHTML += `
        <div class="day-cell ${isToday ? 'today' : ''} ${hasFestival ? 'has-festival' : ''}" 
             data-date="${day}" data-month="${monthName}" 
             data-festivals='${JSON.stringify(festivalData)}'>
          <div class="day-number">${day}</div>
          ${hasFestival ? `<div class="festival-dot ${dotClass}">🎉</div>` : ''}
          ${festivalInfo}
        </div>
      `;
    }

    const totalCells = 42;
    const cellsFilled = firstDay + daysInMonth;
    for (let i = cellsFilled; i < totalCells; i++) {
      calendarHTML += '<div class="day-cell other-month"></div>';
    }

    calendarHTML += '</div>';
    return calendarHTML;
  }

  getMonthNumber(monthName) {
    return this.months.indexOf(monthName);
  }

  getDaysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
  }

  getFirstDayOfMonth(month, year) {
    const date = new Date(year, month, 1);
    return date.getDay();
  }

  getFestivalsForMonth(monthName) {
    return this.festivals.filter(festival => 
      festival.month.toLowerCase() === monthName.toLowerCase()
    );
  }

  isFestivalOnDate(festivalDate, monthName, day) {
    const dateKey = `${monthName} ${day}`;
    return this.festivalDateMap[dateKey] && this.festivalDateMap[dateKey].length > 0;
  }

  getFestivalsOnDate(monthName, day) {
    const dateKey = `${monthName} ${day}`;
    return this.festivalDateMap[dateKey] || [];
  }

  renderMonth(index) {
    const cards = document.querySelectorAll('.calendar-card');
    const titleElement = document.getElementById('monthTitle');
    
    if (cards.length === 0 || !titleElement) return;

    const monthName = this.months[index];
    titleElement.textContent = `${monthName} ${this.year}`;

    cards.forEach((card, i) => {
      card.classList.remove('active');
      if (i === index) {
        card.classList.add('active');
      }
    });

    this.updateNavButtons();
    this.closeEnlargedDay();
  }

  updateNavButtons() {
    const prevBtn = document.getElementById('prevMonth');
    const nextBtn = document.getElementById('nextMonth');
    
    if (prevBtn) prevBtn.disabled = this.currentMonthIndex === 0;
    if (nextBtn) nextBtn.disabled = this.currentMonthIndex === this.months.length - 1;
  }

  setupEventListeners() {
    const prevBtn = document.getElementById('prevMonth');
    const nextBtn = document.getElementById('nextMonth');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (this.currentMonthIndex > 0) {
          this.currentMonthIndex--;
          this.renderMonth(this.currentMonthIndex);
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (this.currentMonthIndex < this.months.length - 1) {
          this.currentMonthIndex++;
          this.renderMonth(this.currentMonthIndex);
        }
      });
    }

    document.addEventListener('click', (e) => {
      this.handleDayClick(e);
    });

    document.addEventListener('mousedown', this.handleDayStart.bind(this));
    document.addEventListener('touchstart', this.handleDayStart.bind(this), { passive: false });
    
    document.addEventListener('mousemove', this.handleDayDrag.bind(this));
    document.addEventListener('touchmove', this.handleDayDrag.bind(this), { passive: false });
    
    document.addEventListener('mouseup', this.handleDayEnd.bind(this));
    document.addEventListener('touchend', this.handleDayEnd.bind(this));
  }

  handleDayStart(e) {
    this.startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    this.startY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
    this.startTime = Date.now();
    this.isDragging = false;
  }

  handleDayDrag(e) {
    if (!this.startX || !this.startY) return;
    
    const currentX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    const currentY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
    const distance = Math.sqrt((currentX - this.startX) ** 2 + (currentY - this.startY) ** 2);
    
    if (distance > 10) {
      this.isDragging = true;
      const target = e.target.closest('.day-cell');
      if (target && target.classList.contains('has-festival')) {
        this.enlargeDay(target);
      }
    }
  }

  handleDayEnd(e) {
    this.startX = null;
    this.startY = null;
    this.isDragging = false;
  }

  handleDayClick(e) {
    const target = e.target.closest('.day-cell');
    if (!target || !target.dataset.date || !target.classList.contains('has-festival')) {
      this.closeEnlargedDay();
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    
    try {
      const festivalsData = JSON.parse(target.dataset.festivals);
      
      if (festivalsData && festivalsData.length > 0) {
        const festivalName = festivalsData[0].name;
        highlightFestivalCard(festivalName);
        
        if (festivalsData.length > 1) {
          showMultipleFestivalsToast(festivalsData, target.dataset.date, target.dataset.month);
        }
      }
    } catch (error) {
      console.error('Error parsing festival data:', error);
    }
  }

  enlargeDay(dayElement) {
    if (this.enlargedDay === dayElement) return;
    
    if (this.enlargedDay) {
      this.enlargedDay.classList.remove('enlarged');
    }

    this.enlargedDay = dayElement;
    dayElement.classList.add('enlarged');
    
    if (dayElement.classList.contains('has-festival')) {
      try {
        const festivalsData = JSON.parse(dayElement.dataset.festivals);
        const day = dayElement.dataset.date;
        const month = dayElement.dataset.month;
        
        const tooltip = document.createElement('div');
        tooltip.className = 'day-tooltip';
        tooltip.innerHTML = `
          <div class="tooltip-content">
            <h4>${festivalsData[0].name}</h4>
            <p><strong>Type:</strong> ${festivalsData[0].type}</p>
            <p><strong>Date:</strong> ${day} ${month}</p>
            ${festivalsData.length > 1 ? `<p><strong>More Events:</strong> +${festivalsData.length - 1}</p>` : ''}
            <button class="view-details-btn">View Festival</button>
          </div>
        `;
        
        document.body.appendChild(tooltip);
        
        const rect = dayElement.getBoundingClientRect();
        tooltip.style.left = `${rect.left + window.scrollX}px`;
        tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;
        
        tooltip.querySelector('.view-details-btn').addEventListener('click', () => {
          highlightFestivalCard(festivalsData[0].name);
          this.closeEnlargedDay();
          if (tooltip.parentNode) {
            tooltip.parentNode.removeChild(tooltip);
          }
        });

        document.addEventListener('click', function closeTooltip(e) {
          if (!tooltip.contains(e.target) && e.target !== dayElement) {
            this.closeEnlargedDay();
            if (tooltip.parentNode) {
              tooltip.parentNode.removeChild(tooltip);
            }
            document.removeEventListener('click', closeTooltip);
          }
        }.bind(this), { once: true });
        
      } catch (error) {
        console.error('Error creating tooltip:', error);
      }
    }
  }

  closeEnlargedDay() {
    if (this.enlargedDay) {
      this.enlargedDay.classList.remove('enlarged');
      const tooltip = document.querySelector('.day-tooltip');
      if (tooltip && tooltip.parentNode) {
        tooltip.parentNode.removeChild(tooltip);
      }
      this.enlargedDay = null;
    }
  }
}

function showMultipleFestivalsToast(festivalsData, day, month) {
  const existingToast = document.querySelector('.festival-toast');
  if (existingToast) {
    existingToast.remove();
  }
  
  const toast = document.createElement('div');
  toast.className = 'festival-toast';
  toast.innerHTML = `
    <div class="toast-content">
      <h4>Multiple Festivals on ${day} ${month}!</h4>
      <p>${festivalsData.map(f => f.name).join(', ')}</p>
      <button class="toast-close-btn">Close</button>
    </div>
  `;
  
  document.body.appendChild(toast);
  
  toast.querySelector('.toast-close-btn').addEventListener('click', () => {
    toast.remove();
  });
  
  setTimeout(() => {
    if (toast.parentElement) {
      toast.remove();
    }
  }, 7000);
}

function initializeCalendar(festivalsData) {
  if (sikkimCalendar) return;
  sikkimCalendar = new SikkimCalendar(festivalsData);
}

document.addEventListener('DOMContentLoaded', loadFestivals);