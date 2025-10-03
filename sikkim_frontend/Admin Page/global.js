// Application Data
const appData = {
  "monasteries": [
    {
      "id": 1,
      "name": "Rumtek Monastery",
      "location": {"lat": 27.3389, "lng": 88.5583},
      "description": "Seat of the Gyalwa Karmapa, head of the Kagyu school of Tibetan Buddhism",
      "established": "1740",
      "architecture": "Tibetan Buddhist",
      "significance": "Most significant monastery of the Kagyu school",
      "images": ["rumtek1.jpg", "rumtek2.jpg"],
      "status": "active",
      "visitors_last_month": 1250
    },
    {
      "id": 2, 
      "name": "Enchey Monastery",
      "location": {"lat": 27.3314, "lng": 88.6138},
      "description": "Important Nyingma monastery above Gangtok",
      "established": "1840",
      "architecture": "Traditional Sikkimese",
      "significance": "Known for its annual Cham dance",
      "images": ["enchey1.jpg", "enchey2.jpg"],
      "status": "active",
      "visitors_last_month": 890
    },
    {
      "id": 3,
      "name": "Pemayangtse Monastery", 
      "location": {"lat": 27.2120, "lng": 88.2465},
      "description": "One of the oldest and premier monasteries of Sikkim",
      "established": "1705",
      "architecture": "Traditional Tibetan",
      "significance": "Head monastery of Nyingma sect in Sikkim",
      "images": ["pemayangtse1.jpg"],
      "status": "active",
      "visitors_last_month": 675
    }
  ],
  "virtual_tours": [
    {"id": 1, "monastery_id": 1, "title": "Main Assembly Hall", "images": 15, "languages": ["English", "Hindi", "Nepali"], "status": "published"},
    {"id": 2, "monastery_id": 1, "title": "Golden Stupa", "images": 8, "languages": ["English", "Hindi"], "status": "draft"},
    {"id": 3, "monastery_id": 2, "title": "Prayer Wheel Gallery", "images": 12, "languages": ["English", "Nepali"], "status": "published"}
  ],
  "archives": [
    {"id": 1, "title": "Ancient Manuscript Collection", "type": "manuscript", "monastery_id": 1, "date_uploaded": "2024-08-15", "language": "Tibetan", "status": "digitized"},
    {"id": 2, "title": "Mural Photography", "type": "artwork", "monastery_id": 2, "date_uploaded": "2024-08-20", "language": "Visual", "status": "processing"},
    {"id": 3, "title": "Historical Documents", "type": "document", "monastery_id": 3, "date_uploaded": "2024-08-10", "language": "English", "status": "digitized"}
  ],
  "events": [
    {"id": 1, "name": "Losar Festival", "monastery_id": 1, "date": "2025-02-15", "type": "festival", "status": "upcoming", "bookings": 45},
    {"id": 2, "name": "Cham Dance", "monastery_id": 2, "date": "2024-12-18", "type": "cultural", "status": "confirmed", "bookings": 78},
    {"id": 3, "name": "Meditation Retreat", "monastery_id": 3, "date": "2024-11-05", "type": "spiritual", "status": "confirmed", "bookings": 25}
  ],
  "analytics": {
    "total_monasteries": 28,
    "total_virtual_tours": 45,
    "total_archives": 156,
    "total_events": 23,
    "monthly_visitors": 8430,
    "popular_monasteries": ["Rumtek", "Enchey", "Pemayangtse"],
    "top_languages": ["English", "Hindi", "Nepali", "Tibetan"]
  },
  "users": [
    {"id": 1, "name": "Tenzin Norbu", "role": "Super Admin", "monastery": "All", "last_login": "2024-09-26", "status": "active"},
    {"id": 2, "name": "Karma Lhamo", "role": "Monastery Admin", "monastery": "Rumtek", "last_login": "2024-09-25", "status": "active"},
    {"id": 3, "name": "Pemba Sherpa", "role": "Content Manager", "monastery": "Enchey", "last_login": "2024-09-24", "status": "active"}
  ]
};

// DOM Elements
const navLinks = document.querySelectorAll('.nav-link');
const contentSections = document.querySelectorAll('.content-section');
const pageTitle = document.getElementById('page-title');

// Modal Elements
const monasteryModal = document.getElementById('monastery-modal');
const monasteryForm = document.getElementById('monastery-form');
const monasteryModalClose = document.getElementById('monastery-modal-close');
const monasteryCancelBtn = document.getElementById('monastery-cancel');
const monasterySaveBtn = document.getElementById('monastery-save');

// Notification Element
const notification = document.getElementById('notification');
const notificationMessage = document.getElementById('notification-message');

// Current editing monastery
let currentEditingMonastery = null;

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    loadDashboardData();
    loadMonasteriesTable();
    loadVirtualTours();
    loadArchives();
    loadEvents();
    loadUsersTable();
    initializeModals();
    initializeTabs();
    initializeButtons();
});

// Navigation System
function initializeNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionName = this.dataset.section;
            
            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding section
            contentSections.forEach(section => {
                section.classList.remove('active');
            });
            
            const targetSection = document.getElementById(sectionName);
            if (targetSection) {
                targetSection.classList.add('active');
                updatePageTitle(sectionName);
            }
        });
    });
}

function updatePageTitle(sectionName) {
    const titles = {
        'dashboard': 'Dashboard Overview',
        'monasteries': 'Monastery Management',
        'virtual-tours': 'Virtual Tours Management',
        'archives': 'Digital Archives',
        'map': 'Interactive Map Management',
        'calendar': 'Cultural Calendar',
        'audio': 'Audio Guides Management',
        'users': 'User Management',
        'content': 'Content Management System',
        'analytics': 'Analytics & Reports'
    };
    
    pageTitle.textContent = titles[sectionName] || 'Dashboard';
}

// Dashboard Data Loading
function loadDashboardData() {
    document.getElementById('total-monasteries').textContent = appData.analytics.total_monasteries;
    document.getElementById('total-tours').textContent = appData.analytics.total_virtual_tours;
    document.getElementById('total-archives').textContent = appData.analytics.total_archives;
    document.getElementById('total-events').textContent = appData.analytics.total_events;
}

// Monasteries Table
function loadMonasteriesTable() {
    const tableBody = document.querySelector('#monasteries-table tbody');
    
    function renderTable(monasteries = appData.monasteries) {
        tableBody.innerHTML = '';
        
        monasteries.forEach(monastery => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${monastery.name}</strong></td>
                <td>${monastery.location.lat.toFixed(4)}, ${monastery.location.lng.toFixed(4)}</td>
                <td>${monastery.established}</td>
                <td><span class="status-badge status-${monastery.status}">${monastery.status}</span></td>
                <td>${monastery.visitors_last_month.toLocaleString()}</td>
                <td>
                    <button class="action-btn action-edit" onclick="editMonastery(${monastery.id})">Edit</button>
                    <button class="action-btn action-delete" onclick="deleteMonastery(${monastery.id})">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
    
    // Initial render
    renderTable();
    
    // Search functionality
    const searchInput = document.getElementById('monastery-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const filteredMonasteries = appData.monasteries.filter(monastery =>
                monastery.name.toLowerCase().includes(searchTerm) ||
                monastery.description.toLowerCase().includes(searchTerm)
            );
            renderTable(filteredMonasteries);
        });
    }
    
    // Status filter
    const statusFilter = document.getElementById('status-filter');
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            const status = this.value;
            const filteredMonasteries = status ? 
                appData.monasteries.filter(monastery => monastery.status === status) :
                appData.monasteries;
            renderTable(filteredMonasteries);
        });
    }
}

// Virtual Tours Loading
function loadVirtualTours() {
    const toursGrid = document.getElementById('tours-grid');
    
    toursGrid.innerHTML = '';
    
    appData.virtual_tours.forEach(tour => {
        const monastery = appData.monasteries.find(m => m.id === tour.monastery_id);
        const card = document.createElement('div');
        card.className = 'tour-card';
        card.innerHTML = `
            <div class="card-header">
                <div class="card-title">${tour.title}</div>
                <div class="card-meta">${monastery ? monastery.name : 'Unknown Monastery'}</div>
            </div>
            <div class="card-body">
                <div class="card-stats">
                    <div class="stat-item">
                        <span class="stat-number">${tour.images}</span>
                        <span class="stat-label">Images</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${tour.languages.length}</span>
                        <span class="stat-label">Languages</span>
                    </div>
                </div>
                <div class="tour-languages">
                    <strong>Languages:</strong> ${tour.languages.join(', ')}
                </div>
                <div class="tour-status">
                    <span class="status-badge status-${tour.status}">${tour.status}</span>
                </div>
            </div>
        `;
        toursGrid.appendChild(card);
    });
}

// Archives Loading
function loadArchives() {
    const archivesGrid = document.getElementById('archives-grid');
    
    archivesGrid.innerHTML = '';
    
    appData.archives.forEach(archive => {
        const monastery = appData.monasteries.find(m => m.id === archive.monastery_id);
        const card = document.createElement('div');
        card.className = 'archive-card';
        card.innerHTML = `
            <div class="card-header">
                <div class="card-title">${archive.title}</div>
                <div class="card-meta">${monastery ? monastery.name : 'Unknown Monastery'}</div>
            </div>
            <div class="card-body">
                <div class="archive-details">
                    <p><strong>Type:</strong> ${archive.type}</p>
                    <p><strong>Language:</strong> ${archive.language}</p>
                    <p><strong>Uploaded:</strong> ${new Date(archive.date_uploaded).toLocaleDateString()}</p>
                    <span class="status-badge status-${archive.status}">${archive.status}</span>
                </div>
            </div>
        `;
        archivesGrid.appendChild(card);
    });
}

// Events Loading
function loadEvents() {
    const eventsList = document.getElementById('events-list');
    
    eventsList.innerHTML = '';
    
    appData.events.forEach(event => {
        const monastery = appData.monasteries.find(m => m.id === event.monastery_id);
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card';
        eventCard.innerHTML = `
            <div class="event-info">
                <h4>${event.name}</h4>
                <div class="event-details">
                    <span class="event-date">${new Date(event.date).toLocaleDateString()}</span> • 
                    ${monastery ? monastery.name : 'Unknown Monastery'} • 
                    <span class="status-badge status-${event.status}">${event.status}</span>
                </div>
            </div>
            <div class="event-stats">
                <span class="booking-count">${event.bookings}</span>
                <span class="booking-label">Bookings</span>
            </div>
        `;
        eventsList.appendChild(eventCard);
    });
}

// Users Table
function loadUsersTable() {
    const tableBody = document.querySelector('#users-table tbody');
    
    tableBody.innerHTML = '';
    
    appData.users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${user.name}</strong></td>
            <td>${user.role}</td>
            <td>${user.monastery}</td>
            <td>${new Date(user.last_login).toLocaleDateString()}</td>
            <td><span class="status-badge status-${user.status}">${user.status}</span></td>
            <td>
                <button class="action-btn action-edit">Edit</button>
                <button class="action-btn action-delete">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Modal System
function initializeModals() {
    // Monastery modal close handlers
    [monasteryModalClose, monasteryCancelBtn].forEach(btn => {
        btn.addEventListener('click', closeMonasteryModal);
    });
    
    // Click outside to close
    monasteryModal.addEventListener('click', function(e) {
        if (e.target === monasteryModal) {
            closeMonasteryModal();
        }
    });
    
    // Form submission
    monasteryForm.addEventListener('submit', handleMonasteryFormSubmit);
}

function openMonasteryModal(monastery = null) {
    currentEditingMonastery = monastery;
    
    if (monastery) {
        // Edit mode
        document.getElementById('monastery-modal-title').textContent = 'Edit Monastery';
        document.getElementById('monastery-name').value = monastery.name;
        document.getElementById('monastery-lat').value = monastery.location.lat;
        document.getElementById('monastery-lng').value = monastery.location.lng;
        document.getElementById('monastery-description').value = monastery.description;
        document.getElementById('monastery-established').value = monastery.established;
        document.getElementById('monastery-architecture').value = monastery.architecture;
        document.getElementById('monastery-significance').value = monastery.significance;
        document.getElementById('monastery-status').value = monastery.status;
    } else {
        // Add mode
        document.getElementById('monastery-modal-title').textContent = 'Add New Monastery';
        monasteryForm.reset();
    }
    
    monasteryModal.classList.remove('hidden');
}

function closeMonasteryModal() {
    monasteryModal.classList.add('hidden');
    currentEditingMonastery = null;
    monasteryForm.reset();
}

function handleMonasteryFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('monastery-name').value,
        location: {
            lat: parseFloat(document.getElementById('monastery-lat').value),
            lng: parseFloat(document.getElementById('monastery-lng').value)
        },
        description: document.getElementById('monastery-description').value,
        established: document.getElementById('monastery-established').value,
        architecture: document.getElementById('monastery-architecture').value,
        significance: document.getElementById('monastery-significance').value,
        status: document.getElementById('monastery-status').value
    };
    
    if (currentEditingMonastery) {
        // Update existing monastery
        const index = appData.monasteries.findIndex(m => m.id === currentEditingMonastery.id);
        if (index !== -1) {
            appData.monasteries[index] = { ...appData.monasteries[index], ...formData };
            showNotification('Monastery updated successfully!');
        }
    } else {
        // Add new monastery
        const newMonastery = {
            id: Date.now(),
            ...formData,
            images: [],
            visitors_last_month: 0
        };
        appData.monasteries.push(newMonastery);
        showNotification('Monastery added successfully!');
    }
    
    loadMonasteriesTable();
    closeMonasteryModal();
}

// CRUD Operations
function editMonastery(id) {
    const monastery = appData.monasteries.find(m => m.id === id);
    if (monastery) {
        openMonasteryModal(monastery);
    }
}

function deleteMonastery(id) {
    if (confirm('Are you sure you want to delete this monastery?')) {
        const index = appData.monasteries.findIndex(m => m.id === id);
        if (index !== -1) {
            appData.monasteries.splice(index, 1);
            loadMonasteriesTable();
            showNotification('Monastery deleted successfully!');
        }
    }
}

// Button Handlers
function initializeButtons() {
    // Add monastery button
    const addMonasteryBtn = document.getElementById('add-monastery-btn');
    if (addMonasteryBtn) {
        addMonasteryBtn.addEventListener('click', () => openMonasteryModal());
    }
    
    // Other action buttons
    const buttons = [
        { id: 'add-tour-btn', message: 'Virtual tour creation interface would open here' },
        { id: 'upload-archive-btn', message: 'Document upload interface would open here' },
        { id: 'add-event-btn', message: 'Event creation form would open here' },
        { id: 'upload-audio-btn', message: 'Audio upload interface would open here' },
        { id: 'add-user-btn', message: 'User creation form would open here' },
        { id: 'export-btn', message: 'Report export functionality would be triggered here' }
    ];
    
    buttons.forEach(({ id, message }) => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', () => showNotification(message));
        }
    });
}

// Tab System
function initializeTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            
            // Update active tab button
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update active tab pane
            tabPanes.forEach(pane => {
                pane.classList.remove('active');
            });
            
            const targetPane = document.getElementById(`${tabName}-tab`);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });
}

// Notification System
function showNotification(message, type = 'success') {
    notificationMessage.textContent = message;
    
    // Update notification style based on type
    const notificationContent = notification.querySelector('.notification-content');
    notificationContent.className = `notification-content ${type}`;
    
    notification.classList.remove('hidden');
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        hideNotification();
    }, 3000);
}

function hideNotification() {
    notification.classList.add('hidden');
}

// Notification close button
document.querySelector('.notification-close').addEventListener('click', hideNotification);

// Utility Functions
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatNumber(num) {
    return num.toLocaleString();
}

// Global functions for inline event handlers
window.editMonastery = editMonastery;
window.deleteMonastery = deleteMonastery;

// Search and Filter Enhancement
function initializeSearchAndFilter() {
    // Enhanced search for all sections
    const searchInputs = document.querySelectorAll('.search-input');
    const filterSelects = document.querySelectorAll('[id$="-filter"]');
    
    searchInputs.forEach(input => {
        input.addEventListener('input', debounce(handleSearch, 300));
    });
    
    filterSelects.forEach(select => {
        select.addEventListener('change', handleFilter);
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const sectionId = event.target.closest('.content-section').id;
    
    // Implement section-specific search logic
    switch (sectionId) {
        case 'monasteries':
            // Already implemented in loadMonasteriesTable
            break;
        case 'virtual-tours':
            searchVirtualTours(searchTerm);
            break;
        case 'archives':
            searchArchives(searchTerm);
            break;
        default:
            console.log(`Search not implemented for ${sectionId}`);
    }
}

function handleFilter(event) {
    const filterValue = event.target.value;
    const sectionId = event.target.closest('.content-section').id;
    
    // Implement section-specific filter logic
    console.log(`Filter ${filterValue} applied to ${sectionId}`);
}

function searchVirtualTours(searchTerm) {
    const tours = document.querySelectorAll('.tour-card');
    tours.forEach(tour => {
        const title = tour.querySelector('.card-title').textContent.toLowerCase();
        const meta = tour.querySelector('.card-meta').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || meta.includes(searchTerm)) {
            tour.style.display = 'block';
        } else {
            tour.style.display = 'none';
        }
    });
}

function searchArchives(searchTerm) {
    const archives = document.querySelectorAll('.archive-card');
    archives.forEach(archive => {
        const title = archive.querySelector('.card-title').textContent.toLowerCase();
        const meta = archive.querySelector('.card-meta').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || meta.includes(searchTerm)) {
            archive.style.display = 'block';
        } else {
            archive.style.display = 'none';
        }
    });
}

// Responsive Mobile Menu (if needed)
function initializeMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    // Add mobile menu toggle if screen is small
    if (window.innerWidth <= 768) {
        const menuToggle = document.createElement('button');
        menuToggle.innerHTML = '☰';
        menuToggle.className = 'mobile-menu-toggle';
        menuToggle.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 1001;
            background: #0f52ba;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            font-size: 18px;
            cursor: pointer;
        `;
        
        document.body.appendChild(menuToggle);
        
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
        
        // Close sidebar when clicking on main content
        mainContent.addEventListener('click', () => {
            sidebar.classList.remove('active');
        });
    }
}

// Initialize mobile menu on load and resize
window.addEventListener('load', initializeMobileMenu);
window.addEventListener('resize', initializeMobileMenu);

// Form Validation Enhancement
function validateMonasteryForm() {
    const requiredFields = [
        'monastery-name',
        'monastery-lat',
        'monastery-lng',
        'monastery-description'
    ];
    
    let isValid = true;
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field.value.trim()) {
            field.style.borderColor = '#ff6b6b';
            isValid = false;
        } else {
            field.style.borderColor = '#d6e6f2';
        }
    });
    
    // Validate coordinates
    const lat = parseFloat(document.getElementById('monastery-lat').value);
    const lng = parseFloat(document.getElementById('monastery-lng').value);
    
    if (isNaN(lat) || lat < -90 || lat > 90) {
        document.getElementById('monastery-lat').style.borderColor = '#ff6b6b';
        isValid = false;
    }
    
    if (isNaN(lng) || lng < -180 || lng > 180) {
        document.getElementById('monastery-lng').style.borderColor = '#ff6b6b';
        isValid = false;
    }
    
    return isValid;
}

// Enhanced form submission with validation
monasterySaveBtn.addEventListener('click', function(e) {
    e.preventDefault();
    
    if (validateMonasteryForm()) {
        handleMonasteryFormSubmit(e);
    } else {
        showNotification('Please fill in all required fields correctly.', 'error');
    }
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeSearchAndFilter();
});

console.log('Monastery360 Admin Dashboard initialized successfully!');