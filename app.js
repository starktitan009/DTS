// Global Variables
let currentUser = null;
let appData = {
    trucks: [],
    drivers: [],
    trips: [],
    documents: [],
    emiRecords: [],
    alerts: [],
    itrRecords: [],
    alarms: [],
    notes: []
};

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    loadDataFromStorage();
    setupEventListeners();
    
    // Show video screen first
    document.getElementById('videoScreen').classList.remove('hidden');
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('mainApp').classList.add('hidden');
    
    startVideoSequence();
}

// Video and Login Flow
function startVideoSequence() {
    const videoScreen = document.getElementById('videoScreen');
    const loginScreen = document.getElementById('loginScreen');
    const skipBtn = document.getElementById('skipVideo');
    const loadingFallback = document.querySelector('.loading-fallback');

    // Show loading fallback after 5 seconds if video doesn't load properly
    const fallbackTimer = setTimeout(() => {
        document.querySelector('.video-container').classList.add('hidden');
        loadingFallback.classList.remove('hidden');
        
        // Auto-skip after 3 more seconds
        setTimeout(() => {
            showLoginScreen();
        }, 3000);
    }, 5000);

    // Skip button handler
    skipBtn.addEventListener('click', (e) => {
        e.preventDefault();
        clearTimeout(fallbackTimer);
        showLoginScreen();
    });

    // Auto-advance after video duration (assume 15 seconds)
    setTimeout(() => {
        if (!loginScreen.classList.contains('hidden')) return; // Already advanced
        clearTimeout(fallbackTimer);
        showLoginScreen();
    }, 15000);

    function showLoginScreen() {
        videoScreen.classList.add('hidden');
        loginScreen.classList.remove('hidden');
        
        // Focus on username field
        setTimeout(() => {
            document.getElementById('username').focus();
        }, 100);
    }
}

// Event Listeners Setup
function setupEventListeners() {
    // Login form - use proper event handling
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.dataset.section;
            navigateToSection(section);
        });
    });

    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }
    
    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Save changes
    const saveBtn = document.getElementById('saveChanges');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveDataToStorage);
    }
    
    // Forms
    setupFormListeners();
    
    // Search functionality
    const notesSearch = document.getElementById('notesSearch');
    if (notesSearch) {
        notesSearch.addEventListener('input', searchNotes);
    }
}

function setupFormListeners() {
    // Alert form
    const alertForm = document.getElementById('alertForm');
    if (alertForm) {
        alertForm.addEventListener('submit', handleAlertForm);
    }
    
    // Truck form
    const truckForm = document.getElementById('truckForm');
    if (truckForm) {
        truckForm.addEventListener('submit', handleTruckForm);
    }
    
    // Trip form
    const tripForm = document.getElementById('tripForm');
    if (tripForm) {
        tripForm.addEventListener('submit', handleTripForm);
    }
    
    // Driver form
    const driverForm = document.getElementById('driverForm');
    if (driverForm) {
        driverForm.addEventListener('submit', handleDriverForm);
    }
    
    // Document form
    const documentForm = document.getElementById('documentForm');
    if (documentForm) {
        documentForm.addEventListener('submit', handleDocumentForm);
    }
    
    // EMI form
    const emiForm = document.getElementById('emiForm');
    if (emiForm) {
        emiForm.addEventListener('submit', handleEMIForm);
    }
    
    // ITR form
    const itrForm = document.getElementById('itrForm');
    if (itrForm) {
        itrForm.addEventListener('submit', handleITRForm);
    }
    
    // Alarm form
    const alarmForm = document.getElementById('alarmForm');
    if (alarmForm) {
        alarmForm.addEventListener('submit', handleAlarmForm);
    }
    
    // Note form
    const noteForm = document.getElementById('noteForm');
    if (noteForm) {
        noteForm.addEventListener('submit', handleNoteForm);
    }
}

// Authentication
function handleLogin(e) {
    e.preventDefault();
    
    const usernameField = document.getElementById('username');
    const passwordField = document.getElementById('password');
    const errorDiv = document.getElementById('loginError');
    
    if (!usernameField || !passwordField) return;
    
    const username = usernameField.value.trim();
    const password = passwordField.value.trim();
    
    // Hide any previous error
    errorDiv.classList.add('hidden');
    
    // Validate credentials
    if (username === 'Damayanti2023' && password === '02092007') {
        currentUser = { username: username };
        
        // Hide login screen and show main app
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('mainApp').classList.remove('hidden');
        
        // Initialize the application
        initializeDashboard();
        populateDropdowns();
        navigateToSection('dashboard');
        
    } else {
        // Show error message
        errorDiv.classList.remove('hidden');
        
        // Clear password field
        passwordField.value = '';
        passwordField.focus();
        
        // Hide error after 3 seconds
        setTimeout(() => {
            errorDiv.classList.add('hidden');
        }, 3000);
    }
}

function logout() {
    currentUser = null;
    document.getElementById('mainApp').classList.add('hidden');
    document.getElementById('loginScreen').classList.remove('hidden');
    
    // Clear form fields
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    
    // Focus username field
    setTimeout(() => {
        document.getElementById('username').focus();
    }, 100);
}

// Navigation
function navigateToSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionName + 'Section');
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }
    
    // Add active class to clicked nav item
    const activeNav = document.querySelector(`[data-section="${sectionName}"]`);
    if (activeNav) {
        activeNav.classList.add('active');
    }
    
    // Update page title
    const titles = {
        dashboard: 'Dashboard',
        alerts: 'Alerts & Reminders',
        trucks: 'Trucks',
        trips: 'Trips',
        drivers: 'Drivers',
        documents: 'Documents',
        emi: 'Truck EMI',
        itr: 'Income Tax Returns',
        alarm: 'Alarms & Tasks',
        notes: 'Notes',
        about: 'About Us'
    };
    
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) {
        pageTitle.textContent = titles[sectionName] || 'Dashboard';
    }
    
    // Load section specific data
    loadSectionData(sectionName);
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('collapsed');
    }
}

// Data Management
function loadDataFromStorage() {
    try {
        const savedData = localStorage.getItem('dtsAppData');
        if (savedData) {
            appData = JSON.parse(savedData);
        } else {
            initializeSampleData();
        }
    } catch (error) {
        console.error('Error loading data:', error);
        initializeSampleData();
    }
}

function saveDataToStorage() {
    try {
        localStorage.setItem('dtsAppData', JSON.stringify(appData));
        
        // Show save confirmation
        const saveBtn = document.getElementById('saveChanges');
        if (saveBtn) {
            const originalText = saveBtn.textContent;
            saveBtn.textContent = '✅ Saved!';
            saveBtn.style.background = '#22c55e';
            
            setTimeout(() => {
                saveBtn.textContent = originalText;
                saveBtn.style.background = '';
            }, 2000);
        }
    } catch (error) {
        console.error('Error saving data:', error);
        alert('Failed to save data. Please try again.');
    }
}

function initializeSampleData() {
    appData = {
        trucks: [
            {
                id: 1,
                number: "TN-01-AB-1234",
                type: "Container Truck",
                capacity: "25 tons",
                status: "Active"
            },
            {
                id: 2,
                number: "TN-02-CD-5678",
                type: "Trailer Truck",
                capacity: "40 tons",
                status: "Idle"
            }
        ],
        drivers: [
            {
                id: 1,
                name: "Ravi Kumar",
                phone: "9876543210",
                license: "TN123456789",
                totalSalary: 45000,
                remarks: "Experienced driver"
            },
            {
                id: 2,
                name: "Suresh Babu",
                phone: "9876543211",
                license: "TN987654321",
                totalSalary: 38000,
                remarks: "New driver"
            }
        ],
        trips: [
            {
                id: 1,
                truckId: 1,
                driverId: 1,
                item: "Electronics",
                weight: "15 tons",
                from: "Chennai",
                to: "Bangalore",
                startDate: "2024-08-01",
                endDate: "2024-08-03",
                expenses: {
                    fuel: 8000,
                    def: 500,
                    food: 1200,
                    line: 300,
                    toll: 800
                },
                revenue: 25000,
                profit: 14200,
                remarks: "Successful delivery"
            }
        ],
        documents: [
            {
                id: 1,
                name: "Insurance Certificate",
                type: "Insurance",
                truckId: 1,
                uploadDate: "2024-07-15",
                expiryDate: "2025-07-15",
                status: "Valid",
                remarks: "Annual insurance"
            }
        ],
        emiRecords: [
            {
                id: 1,
                truckId: 1,
                monthlyAmount: 25000,
                totalAmount: 1200000,
                paidAmount: 300000,
                remainingAmount: 900000,
                lastPaymentDate: "2024-08-01"
            }
        ],
        alerts: [
            {
                id: 1,
                title: "Insurance Renewal",
                description: "Renew truck insurance for TN-01-AB-1234",
                date: "2025-07-01",
                priority: "High",
                status: "Pending"
            }
        ],
        itrRecords: [
            {
                id: 1,
                year: "2023-24",
                income: 1500000,
                expenses: 1200000,
                tax: 45000,
                profit: 255000,
                remarks: "Filed successfully"
            }
        ],
        alarms: [
            {
                id: 1,
                title: "Monthly EMI Payment",
                description: "Pay EMI for Truck TN-01-AB-1234",
                date: "2024-09-01",
                time: "10:00",
                priority: "High",
                status: "Pending"
            }
        ],
        notes: [
            {
                id: 1,
                title: "Business Expansion Plans",
                content: "Consider adding 2 more trucks by end of year. Research fuel-efficient models.",
                category: "Business",
                createdDate: "2024-08-26",
                updatedDate: "2024-08-26"
            }
        ]
    };
}

// Dashboard Functions
function initializeDashboard() {
    updateDashboardStats();
    renderCharts();
    updateAlertsBadge();
}

function updateDashboardStats() {
    const totalProfit = appData.trips.reduce((sum, trip) => sum + (trip.profit || 0), 0);
    const totalTrips = appData.trips.length;
    const activeTrucks = appData.trucks.filter(truck => truck.status === 'Active').length;
    const completedTrips = appData.trips.filter(trip => trip.endDate && new Date(trip.endDate) <= new Date()).length;
    
    const totalProfitEl = document.getElementById('totalProfit');
    const totalTripsEl = document.getElementById('totalTrips');
    const activeTrucksEl = document.getElementById('activetrucks');
    const completedTripsEl = document.getElementById('completedTrips');
    
    if (totalProfitEl) totalProfitEl.textContent = `₹${totalProfit.toLocaleString()}`;
    if (totalTripsEl) totalTripsEl.textContent = totalTrips;
    if (activeTrucksEl) activeTrucksEl.textContent = activeTrucks;
    if (completedTripsEl) completedTripsEl.textContent = completedTrips;
}

function renderCharts() {
    setTimeout(() => {
        renderProfitChart();
        renderTripsChart();
    }, 100); // Small delay to ensure DOM is ready
}

function renderProfitChart() {
    const canvas = document.getElementById('profitChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Clear any existing chart
    if (window.profitChartInstance) {
        window.profitChartInstance.destroy();
    }
    
    // Calculate monthly data
    const monthlyData = {};
    appData.trips.forEach(trip => {
        if (trip.startDate) {
            const month = new Date(trip.startDate).toLocaleString('default', { month: 'short', year: '2-digit' });
            if (!monthlyData[month]) {
                monthlyData[month] = { revenue: 0, expenses: 0 };
            }
            monthlyData[month].revenue += trip.revenue || 0;
            const totalExpenses = Object.values(trip.expenses || {}).reduce((sum, exp) => sum + exp, 0);
            monthlyData[month].expenses += totalExpenses;
        }
    });
    
    const labels = Object.keys(monthlyData);
    const revenues = labels.map(label => monthlyData[label].revenue);
    const expenses = labels.map(label => monthlyData[label].expenses);
    
    // If no data, show sample data
    if (labels.length === 0) {
        labels.push('Aug 24');
        revenues.push(25000);
        expenses.push(10800);
    }
    
    window.profitChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Revenue',
                    data: revenues,
                    backgroundColor: '#1FB8CD'
                },
                {
                    label: 'Expenses',
                    data: expenses,
                    backgroundColor: '#FFC185'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Revenue vs Expenses'
                }
            }
        }
    });
}

function renderTripsChart() {
    const canvas = document.getElementById('tripsChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Clear any existing chart
    if (window.tripsChartInstance) {
        window.tripsChartInstance.destroy();
    }
    
    // Calculate trips by truck
    const truckTrips = {};
    appData.trips.forEach(trip => {
        const truck = appData.trucks.find(t => t.id === trip.truckId);
        const truckName = truck ? truck.number : 'Unknown';
        truckTrips[truckName] = (truckTrips[truckName] || 0) + 1;
    });
    
    const labels = Object.keys(truckTrips);
    const data = Object.values(truckTrips);
    const colors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F'];
    
    // If no data, show sample data
    if (labels.length === 0) {
        labels.push('TN-01-AB-1234');
        data.push(1);
    }
    
    window.tripsChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors.slice(0, labels.length)
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Trips by Truck'
                }
            }
        }
    });
}

function updateAlertsBadge() {
    const alertsCount = appData.alerts.filter(alert => alert.status === 'Pending').length;
    const badge = document.getElementById('alertsBadge');
    if (badge) {
        badge.textContent = alertsCount;
    }
}

// Section Data Loading
function loadSectionData(section) {
    switch(section) {
        case 'dashboard':
            initializeDashboard();
            break;
        case 'alerts':
            renderAlerts();
            break;
        case 'trucks':
            renderTrucks();
            break;
        case 'trips':
            renderTrips();
            break;
        case 'drivers':
            renderDrivers();
            break;
        case 'documents':
            renderDocuments();
            break;
        case 'emi':
            renderEMIRecords();
            break;
        case 'itr':
            renderITRRecords();
            break;
        case 'alarm':
            renderAlarms();
            break;
        case 'notes':
            renderNotes();
            break;
    }
}

// Alerts Section
function renderAlerts() {
    const container = document.getElementById('alertsList');
    if (!container) return;
    
    container.innerHTML = '';
    
    appData.alerts.forEach(alert => {
        const alertDate = new Date(alert.date);
        const today = new Date();
        const isOverdue = alertDate < today && alert.status === 'Pending';
        
        const alertDiv = document.createElement('div');
        alertDiv.className = `list-item ${isOverdue ? 'overdue' : ''}`;
        alertDiv.innerHTML = `
            <div class="list-item-header">
                <h3 class="list-item-title">${alert.title}</h3>
                <div class="list-item-actions">
                    <button class="btn btn--sm btn-icon" onclick="editAlert(${alert.id})">✏️</button>
                    <button class="btn btn--sm btn-icon" onclick="deleteAlert(${alert.id})">🗑️</button>
                </div>
            </div>
            <div class="list-item-content">
                <div class="content-field">
                    <span class="field-label">Description</span>
                    <span class="field-value">${alert.description}</span>
                </div>
                <div class="content-field">
                    <span class="field-label">Date</span>
                    <span class="field-value">${new Date(alert.date).toLocaleDateString()}</span>
                </div>
                <div class="content-field">
                    <span class="field-label">Priority</span>
                    <span class="field-value status-badge status-${alert.priority.toLowerCase()}">${alert.priority}</span>
                </div>
                <div class="content-field">
                    <span class="field-label">Status</span>
                    <span class="field-value">${alert.status}</span>
                </div>
            </div>
        `;
        container.appendChild(alertDiv);
    });
}

function handleAlertForm(e) {
    e.preventDefault();
    
    const alert = {
        id: Date.now(),
        title: document.getElementById('alertTitle').value,
        description: document.getElementById('alertDescription').value,
        date: document.getElementById('alertDate').value,
        priority: document.getElementById('alertPriority').value,
        status: 'Pending'
    };
    
    appData.alerts.push(alert);
    closeModal('alertModal');
    renderAlerts();
    updateAlertsBadge();
    e.target.reset();
}

function deleteAlert(id) {
    if (confirm('Are you sure you want to delete this alert?')) {
        appData.alerts = appData.alerts.filter(alert => alert.id !== id);
        renderAlerts();
        updateAlertsBadge();
    }
}

// Trucks Section
function renderTrucks() {
    const container = document.getElementById('trucksList');
    if (!container) return;
    
    container.innerHTML = '';
    
    appData.trucks.forEach(truck => {
        const truckDiv = document.createElement('div');
        truckDiv.className = 'truck-card';
        truckDiv.innerHTML = `
            <div class="truck-header">
                <div class="truck-avatar">🚛</div>
                <div>
                    <h3>${truck.number}</h3>
                    <span class="status-badge status-${truck.status.toLowerCase()}">${truck.status}</span>
                </div>
            </div>
            <div class="content-field">
                <span class="field-label">Type</span>
                <span class="field-value">${truck.type}</span>
            </div>
            <div class="content-field">
                <span class="field-label">Capacity</span>
                <span class="field-value">${truck.capacity}</span>
            </div>
            <div class="list-item-actions mt-16">
                <button class="btn btn--sm" onclick="editTruck(${truck.id})">Edit</button>
                <button class="btn btn--sm btn--outline" onclick="deleteTruck(${truck.id})">Delete</button>
            </div>
        `;
        container.appendChild(truckDiv);
    });
}

function handleTruckForm(e) {
    e.preventDefault();
    
    const truck = {
        id: Date.now(),
        number: document.getElementById('truckNumber').value,
        type: document.getElementById('truckType').value,
        capacity: document.getElementById('truckCapacity').value,
        status: document.getElementById('truckStatus').value
    };
    
    appData.trucks.push(truck);
    closeModal('truckModal');
    renderTrucks();
    populateDropdowns();
    e.target.reset();
}

function deleteTruck(id) {
    if (confirm('Are you sure you want to delete this truck?')) {
        appData.trucks = appData.trucks.filter(truck => truck.id !== id);
        renderTrucks();
        populateDropdowns();
    }
}

// Trips Section
function renderTrips() {
    const container = document.getElementById('tripsList');
    if (!container) return;
    
    container.innerHTML = '';
    
    appData.trips.forEach(trip => {
        const truck = appData.trucks.find(t => t.id === trip.truckId);
        const driver = appData.drivers.find(d => d.id === trip.driverId);
        const totalExpenses = Object.values(trip.expenses || {}).reduce((sum, exp) => sum + exp, 0);
        
        const tripDiv = document.createElement('div');
        tripDiv.className = 'list-item';
        tripDiv.innerHTML = `
            <div class="list-item-header">
                <h3 class="list-item-title">${trip.from} → ${trip.to}</h3>
                <div class="list-item-actions">
                    <button class="btn btn--sm btn-icon" onclick="editTrip(${trip.id})">✏️</button>
                    <button class="btn btn--sm btn-icon" onclick="deleteTrip(${trip.id})">🗑️</button>
                </div>
            </div>
            <div class="list-item-content">
                <div class="content-field">
                    <span class="field-label">Truck</span>
                    <span class="field-value">${truck ? truck.number : 'Unknown'}</span>
                </div>
                <div class="content-field">
                    <span class="field-label">Driver</span>
                    <span class="field-value">${driver ? driver.name : 'Unknown'}</span>
                </div>
                <div class="content-field">
                    <span class="field-label">Item</span>
                    <span class="field-value">${trip.item}</span>
                </div>
                <div class="content-field">
                    <span class="field-label">Weight</span>
                    <span class="field-value">${trip.weight}</span>
                </div>
                <div class="content-field">
                    <span class="field-label">Start Date</span>
                    <span class="field-value">${new Date(trip.startDate).toLocaleDateString()}</span>
                </div>
                <div class="content-field">
                    <span class="field-label">End Date</span>
                    <span class="field-value">${new Date(trip.endDate).toLocaleDateString()}</span>
                </div>
                <div class="content-field">
                    <span class="field-label">Revenue</span>
                    <span class="field-value text-success">₹${(trip.revenue || 0).toLocaleString()}</span>
                </div>
                <div class="content-field">
                    <span class="field-label">Expenses</span>
                    <span class="field-value text-error">₹${totalExpenses.toLocaleString()}</span>
                </div>
                <div class="content-field">
                    <span class="field-label">Profit</span>
                    <span class="field-value text-success">₹${((trip.revenue || 0) - totalExpenses).toLocaleString()}</span>
                </div>
            </div>
        `;
        container.appendChild(tripDiv);
    });
}

function handleTripForm(e) {
    e.preventDefault();
    
    const revenue = parseFloat(document.getElementById('tripRevenue').value) || 0;
    const expenses = {
        fuel: parseFloat(document.getElementById('tripFuel').value) || 0,
        def: parseFloat(document.getElementById('tripDef').value) || 0,
        food: parseFloat(document.getElementById('tripFood').value) || 0,
        line: parseFloat(document.getElementById('tripLine').value) || 0,
        toll: parseFloat(document.getElementById('tripToll').value) || 0
    };
    
    const totalExpenses = Object.values(expenses).reduce((sum, exp) => sum + exp, 0);
    
    const trip = {
        id: Date.now(),
        truckId: parseInt(document.getElementById('tripTruck').value),
        driverId: parseInt(document.getElementById('tripDriver').value),
        item: document.getElementById('tripItem').value,
        weight: document.getElementById('tripWeight').value,
        from: document.getElementById('tripFrom').value,
        to: document.getElementById('tripTo').value,
        startDate: document.getElementById('tripStartDate').value,
        endDate: document.getElementById('tripEndDate').value,
        expenses: expenses,
        revenue: revenue,
        profit: revenue - totalExpenses,
        remarks: document.getElementById('tripRemarks').value
    };
    
    appData.trips.push(trip);
    closeModal('tripModal');
    renderTrips();
    updateDashboardStats();
    renderCharts(); // Update charts with new trip data
    e.target.reset();
}

function deleteTrip(id) {
    if (confirm('Are you sure you want to delete this trip?')) {
        appData.trips = appData.trips.filter(trip => trip.id !== id);
        renderTrips();
        updateDashboardStats();
        renderCharts(); // Update charts after deletion
    }
}

// Drivers Section
function renderDrivers() {
    const container = document.getElementById('driversList');
    if (!container) return;
    
    container.innerHTML = '';
    
    appData.drivers.forEach(driver => {
        const driverTrips = appData.trips.filter(trip => trip.driverId === driver.id);
        
        const driverDiv = document.createElement('div');
        driverDiv.className = 'driver-card';
        driverDiv.innerHTML = `
            <div class="driver-header">
                <div class="driver-avatar">👤</div>
                <div>
                    <h3>${driver.name}</h3>
                    <p class="field-value">${driver.phone}</p>
                </div>
            </div>
            <div class="content-field">
                <span class="field-label">License</span>
                <span class="field-value">${driver.license}</span>
            </div>
            <div class="content-field">
                <span class="field-label">Total Trips</span>
                <span class="field-value">${driverTrips.length}</span>
            </div>
            <div class="content-field">
                <span class="field-label">Total Salary</span>
                <span class="field-value text-success">₹${(driver.totalSalary || 0).toLocaleString()}</span>
            </div>
            <div class="list-item-actions mt-16">
                <button class="btn btn--sm" onclick="editDriver(${driver.id})">Edit</button>
                <button class="btn btn--sm btn--outline" onclick="deleteDriver(${driver.id})">Delete</button>
            </div>
        `;
        container.appendChild(driverDiv);
    });
}

function handleDriverForm(e) {
    e.preventDefault();
    
    const driver = {
        id: Date.now(),
        name: document.getElementById('driverName').value,
        phone: document.getElementById('driverPhone').value,
        license: document.getElementById('driverLicense').value,
        totalSalary: 0,
        remarks: document.getElementById('driverRemarks').value
    };
    
    appData.drivers.push(driver);
    closeModal('driverModal');
    renderDrivers();
    populateDropdowns();
    e.target.reset();
}

function deleteDriver(id) {
    if (confirm('Are you sure you want to delete this driver?')) {
        appData.drivers = appData.drivers.filter(driver => driver.id !== id);
        renderDrivers();
        populateDropdowns();
    }
}

// Documents Section
function renderDocuments() {
    const container = document.getElementById('documentsList');
    if (!container) return;
    
    container.innerHTML = '';
    
    appData.documents.forEach(doc => {
        const truck = appData.trucks.find(t => t.id === doc.truckId);
        const expiryDate = new Date(doc.expiryDate);
        const today = new Date();
        const daysToExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
        const isExpiringSoon = daysToExpiry <= 30 && daysToExpiry > 0;
        const isExpired = daysToExpiry <= 0;
        
        const docDiv = document.createElement('div');
        docDiv.className = `list-item ${isExpired ? 'overdue' : isExpiringSoon ? 'expiring-soon' : ''}`;
        docDiv.innerHTML = `
            <div class="list-item-header">
                <h3 class="list-item-title">${doc.name}</h3>
                <div class="list-item-actions">
                    <button class="btn btn--sm btn-icon" onclick="editDocument(${doc.id})">✏️</button>
                    <button class="btn btn--sm btn-icon" onclick="deleteDocument(${doc.id})">🗑️</button>
                </div>
            </div>
            <div class="list-item-content">
                <div class="content-field">
                    <span class="field-label">Type</span>
                    <span class="field-value">${doc.type}</span>
                </div>
                <div class="content-field">
                    <span class="field-label">Truck</span>
                    <span class="field-value">${truck ? truck.number : 'Unknown'}</span>
                </div>
                <div class="content-field">
                    <span class="field-label">Upload Date</span>
                    <span class="field-value">${new Date(doc.uploadDate).toLocaleDateString()}</span>
                </div>
                <div class="content-field">
                    <span class="field-label">Expiry Date</span>
                    <span class="field-value ${isExpired ? 'text-error' : isExpiringSoon ? 'text-warning' : ''}">
                        ${doc.expiryDate ? new Date(doc.expiryDate).toLocaleDateString() : 'N/A'}
                        ${isExpired ? ' (Expired)' : isExpiringSoon ? ` (${daysToExpiry} days)` : ''}
                    </span>
                </div>
                <div class="content-field">
                    <span class="field-label">Remarks</span>
                    <span class="field-value">${doc.remarks || 'N/A'}</span>
                </div>
            </div>
        `;
        container.appendChild(docDiv);
    });
}

function handleDocumentForm(e) {
    e.preventDefault();
    
    const document = {
        id: Date.now(),
        name: document.getElementById('documentName').value,
        type: document.getElementById('documentType').value,
        truckId: parseInt(document.getElementById('documentTruck').value),
        uploadDate: new Date().toISOString().split('T')[0],
        expiryDate: document.getElementById('documentExpiry').value,
        remarks: document.getElementById('documentRemarks').value,
        status: 'Valid'
    };
    
    appData.documents.push(document);
    closeModal('documentModal');
    renderDocuments();
    e.target.reset();
}

function deleteDocument(id) {
    if (confirm('Are you sure you want to delete this document?')) {
        appData.documents = appData.documents.filter(doc => doc.id !== id);
        renderDocuments();
    }
}

// EMI Section
function renderEMIRecords() {
    const container = document.getElementById('emiList');
    if (!container) return;
    
    container.innerHTML = '';
    
    appData.emiRecords.forEach(emi => {
        const truck = appData.trucks.find(t => t.id === emi.truckId);
        const progress = ((emi.paidAmount / emi.totalAmount) * 100).toFixed(1);
        
        const emiDiv = document.createElement('div');
        emiDiv.className = 'list-item';
        emiDiv.innerHTML = `
            <div class="list-item-header">
                <h3 class="list-item-title">EMI - ${truck ? truck.number : 'Unknown'}</h3>
                <div class="list-item-actions">
                    <button class="btn btn--sm btn-icon" onclick="editEMI(${emi.id})">✏️</button>
                    <button class="btn btn--sm btn-icon" onclick="deleteEMI(${emi.id})">🗑️</button>
                </div>
            </div>
            <div class="list-item-content">
                <div class="content-field">
                    <span class="field-label">Monthly Amount</span>
                    <span class="field-value">₹${emi.monthlyAmount.toLocaleString()}</span>
                </div>
                <div class="content-field">
                    <span class="field-label">Total Amount</span>
                    <span class="field-value">₹${emi.totalAmount.toLocaleString()}</span>
                </div>
                <div class="content-field">
                    <span class="field-label">Paid Amount</span>
                    <span class="field-value text-success">₹${emi.paidAmount.toLocaleString()}</span>
                </div>
                <div class="content-field">
                    <span class="field-label">Remaining</span>
                    <span class="field-value text-error">₹${emi.remainingAmount.toLocaleString()}</span>
                </div>
                <div class="content-field">
                    <span class="field-label">Progress</span>
                    <div class="field-value">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress}%"></div>
                        </div>
                        <span>${progress}% Complete</span>
                    </div>
                </div>
                <div class="content-field">
                    <span class="field-label">Last Payment</span>
                    <span class="field-value">${new Date(emi.lastPaymentDate).toLocaleDateString()}</span>
                </div>
            </div>
        `;
        container.appendChild(emiDiv);
    });
}

function handleEMIForm(e) {
    e.preventDefault();
    
    const monthlyAmount = parseFloat(document.getElementById('emiAmount').value);
    const totalAmount = parseFloat(document.getElementById('emiTotal').value);
    
    const emi = {
        id: Date.now(),
        truckId: parseInt(document.getElementById('emiTruck').value),
        monthlyAmount: monthlyAmount,
        totalAmount: totalAmount,
        paidAmount: monthlyAmount,
        remainingAmount: totalAmount - monthlyAmount,
        lastPaymentDate: document.getElementById('emiDate').value
    };
    
    appData.emiRecords.push(emi);
    closeModal('emiModal');
    renderEMIRecords();
    e.target.reset();
}

function deleteEMI(id) {
    if (confirm('Are you sure you want to delete this EMI record?')) {
        appData.emiRecords = appData.emiRecords.filter(emi => emi.id !== id);
        renderEMIRecords();
    }
}

// ITR Section
function renderITRRecords() {
    const container = document.getElementById('itrList');
    if (!container) return;
    
    container.innerHTML = '';
    
    appData.itrRecords.forEach(itr => {
        const itrDiv = document.createElement('div');
        itrDiv.className = 'list-item';
        itrDiv.innerHTML = `
            <div class="list-item-header">
                <h3 class="list-item-title">ITR ${itr.year}</h3>
                <div class="list-item-actions">
                    <button class="btn btn--sm btn-icon" onclick="editITR(${itr.id})">✏️</button>
                    <button class="btn btn--sm btn-icon" onclick="deleteITR(${itr.id})">🗑️</button>
                </div>
            </div>
            <div class="list-item-content">
                <div class="content-field">
                    <span class="field-label">Total Income</span>
                    <span class="field-value text-success">₹${itr.income.toLocaleString()}</span>
                </div>
                <div class="content-field">
                    <span class="field-label">Total Expenses</span>
                    <span class="field-value text-error">₹${itr.expenses.toLocaleString()}</span>
                </div>
                <div class="content-field">
                    <span class="field-label">Tax Paid</span>
                    <span class="field-value">₹${itr.tax.toLocaleString()}</span>
                </div>
                <div class="content-field">
                    <span class="field-label">Net Profit</span>
                    <span class="field-value text-success">₹${(itr.income - itr.expenses - itr.tax).toLocaleString()}</span>
                </div>
                <div class="content-field">
                    <span class="field-label">Remarks</span>
                    <span class="field-value">${itr.remarks || 'N/A'}</span>
                </div>
            </div>
        `;
        container.appendChild(itrDiv);
    });
}

function handleITRForm(e) {
    e.preventDefault();
    
    const itr = {
        id: Date.now(),
        year: document.getElementById('itrYear').value,
        income: parseFloat(document.getElementById('itrIncome').value),
        expenses: parseFloat(document.getElementById('itrExpenses').value),
        tax: parseFloat(document.getElementById('itrTax').value),
        remarks: document.getElementById('itrRemarks').value
    };
    
    appData.itrRecords.push(itr);
    closeModal('itrModal');
    renderITRRecords();
    e.target.reset();
}

function deleteITR(id) {
    if (confirm('Are you sure you want to delete this ITR record?')) {
        appData.itrRecords = appData.itrRecords.filter(itr => itr.id !== id);
        renderITRRecords();
    }
}

// Alarms Section
function renderAlarms() {
    const container = document.getElementById('alarmList');
    if (!container) return;
    
    container.innerHTML = '';
    
    appData.alarms.forEach(alarm => {
        const alarmDateTime = new Date(`${alarm.date}T${alarm.time}`);
        const now = new Date();
        const isUpcoming = alarmDateTime > now && alarmDateTime - now <= 24 * 60 * 60 * 1000;
        
        const alarmDiv = document.createElement('div');
        alarmDiv.className = `list-item ${isUpcoming ? 'expiring-soon' : ''}`;
        alarmDiv.innerHTML = `
            <div class="list-item-header">
                <h3 class="list-item-title">${alarm.title}</h3>
                <div class="list-item-actions">
                    <button class="btn btn--sm btn-icon" onclick="editAlarm(${alarm.id})">✏️</button>
                    <button class="btn btn--sm btn-icon" onclick="deleteAlarm(${alarm.id})">🗑️</button>
                </div>
            </div>
            <div class="list-item-content">
                <div class="content-field">
                    <span class="field-label">Description</span>
                    <span class="field-value">${alarm.description}</span>
                </div>
                <div class="content-field">
                    <span class="field-label">Date & Time</span>
                    <span class="field-value">${new Date(alarm.date).toLocaleDateString()} ${alarm.time}</span>
                </div>
                <div class="content-field">
                    <span class="field-label">Priority</span>
                    <span class="field-value status-badge status-${alarm.priority.toLowerCase()}">${alarm.priority}</span>
                </div>
                <div class="content-field">
                    <span class="field-label">Status</span>
                    <span class="field-value">${alarm.status}</span>
                </div>
            </div>
        `;
        container.appendChild(alarmDiv);
    });
}

function handleAlarmForm(e) {
    e.preventDefault();
    
    const alarm = {
        id: Date.now(),
        title: document.getElementById('alarmTitle').value,
        description: document.getElementById('alarmDescription').value,
        date: document.getElementById('alarmDate').value,
        time: document.getElementById('alarmTime').value,
        priority: document.getElementById('alarmPriority').value,
        status: 'Pending'
    };
    
    appData.alarms.push(alarm);
    closeModal('alarmModal');
    renderAlarms();
    e.target.reset();
}

function deleteAlarm(id) {
    if (confirm('Are you sure you want to delete this alarm?')) {
        appData.alarms = appData.alarms.filter(alarm => alarm.id !== id);
        renderAlarms();
    }
}

// Notes Section
function renderNotes() {
    const container = document.getElementById('notesList');
    if (!container) return;
    
    container.innerHTML = '';
    
    appData.notes.forEach(note => {
        const noteDiv = document.createElement('div');
        noteDiv.className = 'note-card';
        noteDiv.innerHTML = `
            <div class="note-card-header">
                <h3 class="note-title">${note.title}</h3>
                <span class="note-category">${note.category}</span>
            </div>
            <div class="note-content">${note.content}</div>
            <div class="note-date">Created: ${new Date(note.createdDate).toLocaleDateString()}</div>
            <div class="list-item-actions mt-16">
                <button class="btn btn--sm" onclick="editNote(${note.id})">Edit</button>
                <button class="btn btn--sm btn--outline" onclick="deleteNote(${note.id})">Delete</button>
            </div>
        `;
        container.appendChild(noteDiv);
    });
}

function handleNoteForm(e) {
    e.preventDefault();
    
    const now = new Date().toISOString().split('T')[0];
    
    const note = {
        id: Date.now(),
        title: document.getElementById('noteTitle').value,
        content: document.getElementById('noteContent').value,
        category: document.getElementById('noteCategory').value,
        createdDate: now,
        updatedDate: now
    };
    
    appData.notes.push(note);
    closeModal('noteModal');
    renderNotes();
    e.target.reset();
}

function deleteNote(id) {
    if (confirm('Are you sure you want to delete this note?')) {
        appData.notes = appData.notes.filter(note => note.id !== id);
        renderNotes();
    }
}

function searchNotes() {
    const searchTerm = document.getElementById('notesSearch').value.toLowerCase();
    const noteCards = document.querySelectorAll('.note-card');
    
    noteCards.forEach(card => {
        const title = card.querySelector('.note-title').textContent.toLowerCase();
        const content = card.querySelector('.note-content').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || content.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
        populateDropdowns();
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
    }
}

function populateDropdowns() {
    // Populate truck dropdowns
    const tripTruckSelect = document.getElementById('tripTruck');
    const documentTruckSelect = document.getElementById('documentTruck');
    const emiTruckSelect = document.getElementById('emiTruck');
    
    [tripTruckSelect, documentTruckSelect, emiTruckSelect].forEach(select => {
        if (select) {
            select.innerHTML = '<option value="">Select Truck</option>';
            appData.trucks.forEach(truck => {
                select.innerHTML += `<option value="${truck.id}">${truck.number}</option>`;
            });
        }
    });
    
    // Populate driver dropdown
    const tripDriverSelect = document.getElementById('tripDriver');
    if (tripDriverSelect) {
        tripDriverSelect.innerHTML = '<option value="">Select Driver</option>';
        appData.drivers.forEach(driver => {
            tripDriverSelect.innerHTML += `<option value="${driver.id}">${driver.name}</option>`;
        });
    }
}

// Excel Export Functions
function exportToExcel(type) {
    if (!window.XLSX) {
        alert('Excel export functionality is not available. Please check your internet connection.');
        return;
    }
    
    let data = [];
    let filename = '';
    
    switch(type) {
        case 'trips':
            data = appData.trips.map(trip => {
                const truck = appData.trucks.find(t => t.id === trip.truckId);
                const driver = appData.drivers.find(d => d.id === trip.driverId);
                const totalExpenses = Object.values(trip.expenses || {}).reduce((sum, exp) => sum + exp, 0);
                
                return {
                    'Trip ID': trip.id,
                    'Truck': truck ? truck.number : 'Unknown',
                    'Driver': driver ? driver.name : 'Unknown',
                    'Item': trip.item,
                    'Weight': trip.weight,
                    'From': trip.from,
                    'To': trip.to,
                    'Start Date': trip.startDate,
                    'End Date': trip.endDate,
                    'Revenue': trip.revenue,
                    'Total Expenses': totalExpenses,
                    'Profit': trip.revenue - totalExpenses,
                    'Remarks': trip.remarks
                };
            });
            filename = 'trips_export.xlsx';
            break;
            
        case 'drivers':
            data = appData.drivers.map(driver => {
                const driverTrips = appData.trips.filter(trip => trip.driverId === driver.id);
                return {
                    'Driver ID': driver.id,
                    'Name': driver.name,
                    'Phone': driver.phone,
                    'License': driver.license,
                    'Total Trips': driverTrips.length,
                    'Total Salary': driver.totalSalary,
                    'Remarks': driver.remarks
                };
            });
            filename = 'drivers_export.xlsx';
            break;
            
        case 'emi':
            data = appData.emiRecords.map(emi => {
                const truck = appData.trucks.find(t => t.id === emi.truckId);
                return {
                    'EMI ID': emi.id,
                    'Truck': truck ? truck.number : 'Unknown',
                    'Monthly Amount': emi.monthlyAmount,
                    'Total Amount': emi.totalAmount,
                    'Paid Amount': emi.paidAmount,
                    'Remaining Amount': emi.remainingAmount,
                    'Last Payment Date': emi.lastPaymentDate
                };
            });
            filename = 'emi_export.xlsx';
            break;
    }
    
    if (data.length === 0) {
        alert('No data to export');
        return;
    }
    
    try {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, filename);
    } catch (error) {
        console.error('Export error:', error);
        alert('Failed to export data. Please try again.');
    }
}

// Edit Functions (Stubs for future implementation)
function editAlert(id) { console.log('Edit alert:', id); }
function editTruck(id) { console.log('Edit truck:', id); }
function editTrip(id) { console.log('Edit trip:', id); }
function editDriver(id) { console.log('Edit driver:', id); }
function editDocument(id) { console.log('Edit document:', id); }
function editEMI(id) { console.log('Edit EMI:', id); }
function editITR(id) { console.log('Edit ITR:', id); }
function editAlarm(id) { console.log('Edit alarm:', id); }
function editNote(id) { console.log('Edit note:', id); }