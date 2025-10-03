async function loadDetails() {
  const params = new URLSearchParams(window.location.search);
  // Fixed: Look for 'name' parameter instead of 'id'
  const festivalName = decodeURIComponent(params.get('name'));

  if (!festivalName) {
    console.error("No festival name found in URL parameters");
    showError("No festival selected. Please go back to the calendar.");
    return;
  }

  console.log("Looking for festival:", festivalName);

  try {
    const response = await fetch("details.json");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const festivals = await response.json();
    
    console.log("Fetched festivals:", festivals);
    const fest = festivals.find(f => f.name === festivalName);

    if (fest) {
      populateFestivalDetails(fest);
    } else {
      console.log("Festival not found:", festivalName);
      showError(`Festival "${festivalName}" not found in details.`);
    }
  } catch (error) {
    console.error("Error loading details:", error);
    showError("Failed to load festival details. Please check your connection.");
  }
}

function populateFestivalDetails(fest) {
  // Festival Name
  const festivalNameElement = document.getElementById('festival-name');
  festivalNameElement.innerHTML = `
    <div class="main_head">
      <div>
        <h1>${escapeHtml(fest.name)}</h1>
        <p class="festival-subtitle">${fest.mainTheme || 'A celebration of Sikkim\'s rich cultural heritage'}</p>
      </div>
    </div>
  `;

  // About & History Section
  const aboutHistoryElement = document.querySelector(".about-history");
  aboutHistoryElement.innerHTML = `
    <h2>About & History</h2>
    <div class="detail-section">
      <h3>Main Theme</h3>
      <p>${fest.mainTheme || 'No theme available'}</p>
    </div>
    <div class="detail-section">
      <h3>Reasons to Celebrate</h3>
      <p>${fest.reasonsToCelebrate || 'No description available'}</p>
    </div>
    <div class="detail-section">
      <h3>Historical Significance</h3>
      <p>${fest.historicalSignificance || 'Not available'}</p>
    </div>
  `;

  // Features Section
  const featuresElement = document.querySelector(".features");
  featuresElement.innerHTML = `
    <h2>Features</h2>
    <div class="detail-section">
      <h3>Special Aspects</h3>
      <p>${fest.specialAspects || 'No special aspects listed'}</p>
    </div>
    <div class="detail-section">
      <h3>Cultural Practices</h3>
      <p>${fest.culturalPractices || 'Not available'}</p>
    </div>
  `;

  // Specials Section
  const specialsElement = document.querySelector(".specials");
  specialsElement.innerHTML = `
    <h2>Special Features</h2>
    <div class="detail-section">
      <h3>Where Famous</h3>
      <p>${fest.whereFamous || 'Celebrated across Sikkim'}</p>
    </div>
    <div class="detail-section">
      <h3>Scientific Context</h3>
      <p>${fest.scientificContext || 'Not available'}</p>
    </div>
    <div class="detail-section">
      <h3>Regional Variations</h3>
      <p>${fest.regionalVariations || 'Celebrated uniformly across the region'}</p>
    </div>
    <div class="detail-section">
      <h3>Monastery Involvement</h3>
      <p>${fest.monasteryInvolvement || 'Not applicable'}</p>
    </div>
  `;
}

function showError(message) {
  const festivalNameElement = document.getElementById('festival-name');
  const aboutHistoryElement = document.querySelector(".about-history");
  const featuresElement = document.querySelector(".features");
  const specialsElement = document.querySelector(".specials");

  festivalNameElement.innerHTML = `
    <div class="main_head">
      <div>
        <h1>Error Loading Festival</h1>
      </div>
    </div>
  `;

  aboutHistoryElement.innerHTML = `
    <h2>Error</h2>
    <p class="error-message">${message}</p>
    <a href="calendar.html" class="back-link">← Back to Calendar</a>
  `;

  featuresElement.innerHTML = '';
  specialsElement.innerHTML = '';
}

// Utility function to escape HTML
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', loadDetails);