// DTS Truck Management System - Main Application JavaScript

class DTSApp {
    constructor() {
        this.currentSection = 'dashboard';
        this.charts = {};
        this.data = {
            trips: [],
            trucks: [],
            drivers: [],
            expenses: [],
            services: [],
            emis: [],
            documents: []
        };
        
        // Sample data for initial setup
        this.sampleData = {
            trips: [
                {"id": 1, "truckId": "TN01AB1234", "driverName": "Raj Kumar", "startLocation": "Chennai", "destination": "Bangalore", "startDate": "2024-08-20", "endDate": "2024-08-22", "distance": 350, "freightAmount": 25000, "expenses": 8000, "profit": 17000, "status": "Completed"},
                {"id": 2, "truckId": "TN02CD5678", "driverName": "Suresh Babu", "startLocation": "Mumbai", "destination": "Pune", "startDate": "2024-08-25", "endDate": "2024-08-26", "distance": 150, "freightAmount": 12000, "expenses": 4000, "profit": 8000, "status": "In Progress"}
            ],
            trucks: [
                {"id": "TN01AB1234", "model": "Tata LPT 2518", "purchaseDate": "2023-05-15", "insuranceExpiry": "2025-12-30", "emiAmount": 45000, "nextServiceDate": "2025-09-15", "status": "Active"},
                {"id": "TN02CD5678", "model": "Ashok Leyland 2820", "purchaseDate": "2022-08-20", "insuranceExpiry": "2025-10-15", "emiAmount": 38000, "nextServiceDate": "2025-09-05", "status": "Active"}
            ],
            drivers: [
                {"id": 1, "name": "Raj Kumar", "licenseNo": "TN1234567890", "phoneNo": "+91-9876543210", "address": "123 Main Street, Chennai", "joiningDate": "2023-01-15", "assignedTruck": "TN01AB1234", "status": "Active"},
                {"id": 2, "name": "Suresh Babu", "licenseNo": "TN0987654321", "phoneNo": "+91-8765432109", "address": "456 Park Road, Mumbai", "joiningDate": "2022-06-20", "assignedTruck": "TN02CD5678", "status": "Active"}
            ],
            expenses: [
                {"id": 1, "date": "2024-08-20", "category": "Fuel", "amount": 5000, "description": "Diesel for Chennai-Bangalore trip", "truckId": "TN01AB1234"},
                {"id": 2, "date": "2024-08-22", "category": "Tolls", "amount": 1200, "description": "Highway tolls", "truckId": "TN01AB1234"},
                {"id": 3, "date": "2024-08-15", "category": "Maintenance", "amount": 8000, "description": "Engine service", "truckId": "TN02CD5678"}
            ]
        };

        this.expenseCategories = ["Fuel", "Maintenance", "Tolls", "Salaries", "Insurance", "Others"];
        this.serviceTypes = ["Oil Change", "Tire Replacement", "Engine Repair", "Body Work", "Inspection", "Others"];
        this.documentCategories = ["Insurance", "Registration", "License", "Invoice", "Receipt", "Others"];

        // Initialize immediately
        this.init();
    }

    init() {
        this.loadData();
        this.setupIntroVideo();
    }

    setupIntroVideo() {
        const introScreen = document.getElementById('intro-screen');
        const mainApp = document.getElementById('main-app');
        const introVideo = document.getElementById('intro-video');
        const skipBtn = document.getElementById('skip-intro');

        const showMainApp = () => {
            console.log('Showing main app...');
            introScreen.style.opacity = '0';
            setTimeout(() => {
                introScreen.classList.add('hidden');
                mainApp.classList.remove('hidden');
                
                // Setup the application after showing it
                setTimeout(() => {
                    this.setupEventListeners();
                    this.updateDashboard();
                    this.initializeCharts();
                    console.log('Application initialized successfully');
                }, 100);
            }, 500);
        };

        // Handle video end
        if (introVideo) {
            introVideo.addEventListener('ended', showMainApp);
            
            // Handle video error (when intro.mp4 doesn't exist)
            introVideo.addEventListener('error', () => {
                console.log('Video failed to load, showing fallback');
                setTimeout(showMainApp, 3000);
            });
        }

        // Handle skip button
        if (skipBtn) {
            skipBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Skip button clicked');
                showMainApp();
            });
        }

        // Auto-show main app if video doesn't load after 5 seconds
        setTimeout(() => {
            if (!introScreen.classList.contains('hidden')) {
                console.log('Auto-showing main app after timeout');
                showMainApp();
            }
        }, 5000);
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Navigation - Fix the event listeners
        const navLinks = document.querySelectorAll('[data-section]');
        console.log('Found navigation links:', navLinks.length);
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                console.log('Navigating to section:', section);
                this.switchSection(section);
            });
        });

        // Modal close
        const modalClose = document.querySelector('.modal-close');
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                this.closeModal();
            });
        }

        const modal = document.getElementById('modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target.id === 'modal') {
                    this.closeModal();
                }
            });
        }

        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebar-toggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                document.getElementById('sidebar').classList.toggle('active');
            });
        }

        // Add buttons - Fix the event listeners
        this.setupButtonListeners();

        // Export/Import buttons
        const exportBtn = document.getElementById('export-data-btn');
        const importBtn = document.getElementById('import-data-btn');
        const clearBtn = document.getElementById('clear-data-btn');

        if (exportBtn) exportBtn.addEventListener('click', () => this.exportData());
        if (importBtn) importBtn.addEventListener('click', () => this.importData());
        if (clearBtn) clearBtn.addEventListener('click', () => this.clearAllData());

        // Search and filters - Fix the event listeners
        this.setupSearchListeners();
        
        console.log('Event listeners setup completed');
    }

    setupButtonListeners() {
        const buttons = [
            { id: 'add-trip-btn', handler: () => this.openTripModal() },
            { id: 'add-truck-btn', handler: () => this.openTruckModal() },
            { id: 'add-driver-btn', handler: () => this.openDriverModal() },
            { id: 'add-expense-btn', handler: () => this.openExpenseModal() },
            { id: 'add-service-btn', handler: () => this.openServiceModal() },
            { id: 'add-emi-btn', handler: () => this.openEMIModal() },
            { id: 'add-document-btn', handler: () => this.openDocumentModal() }
        ];

        buttons.forEach(({ id, handler }) => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('click', handler);
                console.log('Button listener added for:', id);
            }
        });
    }

    setupSearchListeners() {
        const searchInputs = [
            { id: 'trip-search', handler: () => this.filterTrips() },
            { id: 'trip-filter-truck', handler: () => this.filterTrips() },
            { id: 'trip-filter-status', handler: () => this.filterTrips() },
            { id: 'expense-search', handler: () => this.filterExpenses() },
            { id: 'expense-filter-category', handler: () => this.filterExpenses() },
            { id: 'expense-filter-from', handler: () => this.filterExpenses() },
            { id: 'expense-filter-to', handler: () => this.filterExpenses() },
            { id: 'document-search', handler: () => this.filterDocuments() },
            { id: 'document-filter-category', handler: () => this.filterDocuments() }
        ];

        searchInputs.forEach(({ id, handler }) => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', handler);
                element.addEventListener('change', handler);
            }
        });
    }

    switchSection(section) {
        console.log('Switching to section:', section);
        
        // Update navigation
        document.querySelectorAll('[data-section]').forEach(link => {
            link.classList.remove('active');
        });
        const activeLink = document.querySelector(`[data-section="${section}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // Update sections
        document.querySelectorAll('.section').forEach(sec => {
            sec.classList.remove('active');
        });
        const activeSection = document.getElementById(`${section}-section`);
        if (activeSection) {
            activeSection.classList.add('active');
        }

        // Update page title
        const titles = {
            dashboard: 'Dashboard',
            trips: 'Trip Management',
            trucks: 'Truck Management',
            drivers: 'Driver Management',
            expenses: 'Expenses Tracking',
            services: 'Servicing & Maintenance',
            emis: 'EMI Tracking',
            documents: 'Documents Management',
            export: 'Data Export/Import'
        };
        const pageTitle = document.getElementById('page-title');
        if (pageTitle) {
            pageTitle.textContent = titles[section] || 'Dashboard';
        }

        this.currentSection = section;

        // Load section data
        switch(section) {
            case 'dashboard':
                this.updateDashboard();
                break;
            case 'trips':
                this.loadTrips();
                break;
            case 'trucks':
                this.loadTrucks();
                break;
            case 'drivers':
                this.loadDrivers();
                break;
            case 'expenses':
                this.loadExpenses();
                break;
            case 'services':
                this.loadServices();
                break;
            case 'emis':
                this.loadEMIs();
                break;
            case 'documents':
                this.loadDocuments();
                break;
        }
    }

    loadData() {
        const saved = localStorage.getItem('dts_data');
        if (saved) {
            try {
                this.data = JSON.parse(saved);
                console.log('Data loaded from localStorage');
            } catch (e) {
                console.error('Error loading data:', e);
                this.data = { ...this.sampleData, services: [], emis: [], documents: [] };
            }
        } else {
            // Load sample data on first run
            this.data = { ...this.sampleData, services: [], emis: [], documents: [] };
            this.saveData();
            console.log('Sample data loaded');
        }
    }

    saveData() {
        try {
            localStorage.setItem('dts_data', JSON.stringify(this.data));
            console.log('Data saved to localStorage');
        } catch (e) {
            console.error('Error saving data:', e);
        }
    }

    updateDashboard() {
        console.log('Updating dashboard...');
        
        // Update stats
        const totalTripsEl = document.getElementById('total-trips');
        const activetrucksEl = document.getElementById('active-trucks');
        const totalDriversEl = document.getElementById('total-drivers');
        const monthlyExpensesEl = document.getElementById('monthly-expenses');
        const upcomingEmisEl = document.getElementById('upcoming-emis');
        const pendingServicesEl = document.getElementById('pending-services');

        if (totalTripsEl) totalTripsEl.textContent = this.data.trips.length;
        if (activetrucksEl) activetrucksEl.textContent = this.data.trucks.filter(t => t.status === 'Active').length;
        if (totalDriversEl) totalDriversEl.textContent = this.data.drivers.length;
        
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthlyExpenses = this.data.expenses
            .filter(e => {
                const expenseDate = new Date(e.date);
                return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
            })
            .reduce((sum, e) => sum + e.amount, 0);
        if (monthlyExpensesEl) monthlyExpensesEl.textContent = `₹${monthlyExpenses.toLocaleString()}`;

        // Calculate upcoming EMIs (next 30 days)
        const today = new Date();
        const next30Days = new Date(today);
        next30Days.setDate(today.getDate() + 30);
        const upcomingEMIs = this.data.emis.filter(emi => {
            const emiDate = new Date(emi.emiDate);
            return emiDate >= today && emiDate <= next30Days;
        });
        if (upcomingEmisEl) upcomingEmisEl.textContent = upcomingEMIs.length;

        // Calculate pending services (next 30 days)
        const pendingServices = this.data.services.filter(service => {
            if (!service.nextServiceDate) return false;
            const serviceDate = new Date(service.nextServiceDate);
            return serviceDate >= today && serviceDate <= next30Days;
        });
        if (pendingServicesEl) pendingServicesEl.textContent = pendingServices.length;

        console.log('Dashboard stats updated');
    }

    initializeCharts() {
        console.log('Initializing charts...');
        if (this.currentSection !== 'dashboard') return;
        
        // Destroy existing charts first
        Object.keys(this.charts).forEach(key => {
            if (this.charts[key]) {
                this.charts[key].destroy();
            }
        });
        
        try {
            this.createExpensesChart();
            this.createTripsChart();
            this.createExpenseBreakdownChart();
            console.log('Charts initialized successfully');
        } catch (error) {
            console.error('Error initializing charts:', error);
        }
    }

    createExpensesChart() {
        const ctx = document.getElementById('expenses-chart');
        if (!ctx) return;

        // Get last 6 months of expenses
        const labels = [];
        const data = [];
        const today = new Date();
        
        for (let i = 5; i >= 0; i--) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthName = date.toLocaleString('default', { month: 'short' });
            labels.push(monthName);
            
            const monthExpenses = this.data.expenses
                .filter(e => {
                    const expenseDate = new Date(e.date);
                    return expenseDate.getMonth() === date.getMonth() && 
                           expenseDate.getFullYear() === date.getFullYear();
                })
                .reduce((sum, e) => sum + e.amount, 0);
            data.push(monthExpenses);
        }

        this.charts.expenses = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Expenses (₹)',
                    data: data,
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '₹' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }

    createTripsChart() {
        const ctx = document.getElementById('trips-chart');
        if (!ctx) return;

        // Count trips per truck
        const truckTrips = {};
        this.data.trucks.forEach(truck => {
            truckTrips[truck.id] = this.data.trips.filter(trip => trip.truckId === truck.id).length;
        });

        const labels = Object.keys(truckTrips);
        const data = Object.values(truckTrips);

        this.charts.trips = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Trips Count',
                    data: data,
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F'],
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }

    createExpenseBreakdownChart() {
        const ctx = document.getElementById('expense-breakdown-chart');
        if (!ctx) return;

        // Calculate expenses by category
        const categoryExpenses = {};
        this.expenseCategories.forEach(category => {
            categoryExpenses[category] = this.data.expenses
                .filter(e => e.category === category)
                .reduce((sum, e) => sum + e.amount, 0);
        });

        const labels = Object.keys(categoryExpenses);
        const data = Object.values(categoryExpenses);

        this.charts.expenseBreakdown = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ₹' + context.parsed.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }

    // Trips Management
    loadTrips() {
        console.log('Loading trips...');
        const tbody = document.querySelector('#trips-table tbody');
        const filterTruck = document.getElementById('trip-filter-truck');
        
        // Update truck filter options
        if (filterTruck) {
            filterTruck.innerHTML = '<option value="">All Trucks</option>';
            this.data.trucks.forEach(truck => {
                filterTruck.innerHTML += `<option value="${truck.id}">${truck.id}</option>`;
            });
        }

        this.renderTrips();
    }

    renderTrips(filteredTrips = null) {
        const tbody = document.querySelector('#trips-table tbody');
        if (!tbody) return;
        
        const trips = filteredTrips || this.data.trips;
        
        tbody.innerHTML = '';
        trips.forEach(trip => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${trip.id}</td>
                <td>${trip.truckId}</td>
                <td>${trip.driverName}</td>
                <td>${trip.startLocation} → ${trip.destination}</td>
                <td>${trip.startDate} to ${trip.endDate}</td>
                <td>${trip.distance} km</td>
                <td>₹${trip.freightAmount.toLocaleString()}</td>
                <td>₹${trip.expenses.toLocaleString()}</td>
                <td>₹${trip.profit.toLocaleString()}</td>
                <td><span class="status-badge status-${trip.status.toLowerCase().replace(' ', '-')}">${trip.status}</span></td>
                <td>
                    <button class="action-btn edit" onclick="window.app.editTrip(${trip.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="window.app.deleteTrip(${trip.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
        
        console.log('Trips rendered:', trips.length);
    }

    filterTrips() {
        const search = document.getElementById('trip-search');
        const filterTruck = document.getElementById('trip-filter-truck');
        const filterStatus = document.getElementById('trip-filter-status');

        const searchValue = search ? search.value.toLowerCase() : '';
        const filterTruckValue = filterTruck ? filterTruck.value : '';
        const filterStatusValue = filterStatus ? filterStatus.value : '';

        let filtered = this.data.trips.filter(trip => {
            const matchesSearch = !searchValue || 
                trip.startLocation.toLowerCase().includes(searchValue) ||
                trip.destination.toLowerCase().includes(searchValue) ||
                trip.driverName.toLowerCase().includes(searchValue);
            
            const matchesTruck = !filterTruckValue || trip.truckId === filterTruckValue;
            const matchesStatus = !filterStatusValue || trip.status === filterStatusValue;

            return matchesSearch && matchesTruck && matchesStatus;
        });

        this.renderTrips(filtered);
        console.log('Trips filtered:', filtered.length);
    }

    openTripModal(trip = null) {
        console.log('Opening trip modal...', trip ? 'Edit' : 'Add');
        const isEdit = trip !== null;
        const title = isEdit ? 'Edit Trip' : 'Add New Trip';
        
        // Generate truck and driver options
        const truckOptions = this.data.trucks.map(truck => 
            `<option value="${truck.id}" ${trip && trip.truckId === truck.id ? 'selected' : ''}>${truck.id}</option>`
        ).join('');
        
        const driverOptions = this.data.drivers.map(driver => 
            `<option value="${driver.name}" ${trip && trip.driverName === driver.name ? 'selected' : ''}>${driver.name}</option>`
        ).join('');

        const content = `
            <form id="trip-form">
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label">Truck</label>
                        <select name="truckId" class="form-control" required>
                            <option value="">Select Truck</option>
                            ${truckOptions}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Driver</label>
                        <select name="driverName" class="form-control" required>
                            <option value="">Select Driver</option>
                            ${driverOptions}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Start Location</label>
                        <input type="text" name="startLocation" class="form-control" value="${trip ? trip.startLocation : ''}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Destination</label>
                        <input type="text" name="destination" class="form-control" value="${trip ? trip.destination : ''}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Start Date</label>
                        <input type="date" name="startDate" class="form-control" value="${trip ? trip.startDate : ''}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">End Date</label>
                        <input type="date" name="endDate" class="form-control" value="${trip ? trip.endDate : ''}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Distance (km)</label>
                        <input type="number" name="distance" class="form-control" value="${trip ? trip.distance : ''}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Freight Amount (₹)</label>
                        <input type="number" name="freightAmount" class="form-control" value="${trip ? trip.freightAmount : ''}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Expenses (₹)</label>
                        <input type="number" name="expenses" class="form-control" value="${trip ? trip.expenses : ''}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Status</label>
                        <select name="status" class="form-control" required>
                            <option value="Planned" ${trip && trip.status === 'Planned' ? 'selected' : ''}>Planned</option>
                            <option value="In Progress" ${trip && trip.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                            <option value="Completed" ${trip && trip.status === 'Completed' ? 'selected' : ''}>Completed</option>
                            <option value="Cancelled" ${trip && trip.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                        </select>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn--outline" onclick="window.app.closeModal()">Cancel</button>
                    <button type="submit" class="btn btn--primary">${isEdit ? 'Update' : 'Add'} Trip</button>
                </div>
            </form>
        `;

        this.openModal(title, content);

        const form = document.getElementById('trip-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveTrip(new FormData(e.target), trip);
            });
        }
    }

    saveTrip(formData, existingTrip = null) {
        console.log('Saving trip...');
        const tripData = {
            id: existingTrip ? existingTrip.id : Date.now(),
            truckId: formData.get('truckId'),
            driverName: formData.get('driverName'),
            startLocation: formData.get('startLocation'),
            destination: formData.get('destination'),
            startDate: formData.get('startDate'),
            endDate: formData.get('endDate'),
            distance: parseInt(formData.get('distance')),
            freightAmount: parseInt(formData.get('freightAmount')),
            expenses: parseInt(formData.get('expenses')),
            status: formData.get('status')
        };

        tripData.profit = tripData.freightAmount - tripData.expenses;

        if (existingTrip) {
            const index = this.data.trips.findIndex(t => t.id === existingTrip.id);
            this.data.trips[index] = tripData;
        } else {
            this.data.trips.push(tripData);
        }

        this.saveData();
        this.renderTrips();
        this.updateDashboard();
        this.closeModal();
        this.showNotification('Trip saved successfully!', 'success');
    }

    editTrip(id) {
        const trip = this.data.trips.find(t => t.id === id);
        if (trip) {
            this.openTripModal(trip);
        }
    }

    deleteTrip(id) {
        if (confirm('Are you sure you want to delete this trip?')) {
            this.data.trips = this.data.trips.filter(t => t.id !== id);
            this.saveData();
            this.renderTrips();
            this.updateDashboard();
            this.showNotification('Trip deleted successfully!', 'success');
        }
    }

    // Simplified implementations for other sections...
    loadTrucks() {
        console.log('Loading trucks...');
        const tbody = document.querySelector('#trucks-table tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        this.data.trucks.forEach(truck => {
            const row = document.createElement('tr');
            const insuranceStatus = new Date(truck.insuranceExpiry) < new Date() ? 'expired' : 'active';
            const serviceStatus = new Date(truck.nextServiceDate) < new Date() ? 'due' : 'scheduled';
            
            row.innerHTML = `
                <td>${truck.id}</td>
                <td>${truck.model}</td>
                <td>${truck.purchaseDate}</td>
                <td>
                    ${truck.insuranceExpiry}
                    ${insuranceStatus === 'expired' ? '<span class="status-badge status-error">Expired</span>' : ''}
                </td>
                <td>₹${truck.emiAmount.toLocaleString()}</td>
                <td>
                    ${truck.nextServiceDate}
                    ${serviceStatus === 'due' ? '<span class="status-badge status-warning">Due</span>' : ''}
                </td>
                <td><span class="status-badge status-${truck.status.toLowerCase()}">${truck.status}</span></td>
                <td>
                    <button class="action-btn edit" onclick="window.app.editTruck('${truck.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="window.app.deleteTruck('${truck.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    openTruckModal() {
        this.showNotification('Truck modal functionality will be implemented', 'info');
    }

    editTruck(id) {
        this.showNotification(`Edit truck ${id} functionality will be implemented`, 'info');
    }

    deleteTruck(id) {
        this.showNotification(`Delete truck ${id} functionality will be implemented`, 'info');
    }

    // Similar simplified implementations for other sections
    loadDrivers() {
        console.log('Loading drivers...');
        const tbody = document.querySelector('#drivers-table tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        this.data.drivers.forEach(driver => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${driver.name}</td>
                <td>${driver.licenseNo}</td>
                <td>${driver.phoneNo}</td>
                <td>${driver.address}</td>
                <td>${driver.joiningDate}</td>
                <td>${driver.assignedTruck || 'Not Assigned'}</td>
                <td><span class="status-badge status-${driver.status.toLowerCase()}">${driver.status}</span></td>
                <td>
                    <button class="action-btn edit" onclick="window.app.editDriver(${driver.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="window.app.deleteDriver(${driver.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    openDriverModal() {
        this.showNotification('Driver modal functionality will be implemented', 'info');
    }

    editDriver(id) {
        this.showNotification(`Edit driver ${id} functionality will be implemented`, 'info');
    }

    deleteDriver(id) {
        this.showNotification(`Delete driver ${id} functionality will be implemented`, 'info');
    }

    loadExpenses() {
        console.log('Loading expenses...');
        const filterCategory = document.getElementById('expense-filter-category');
        
        // Update category filter options
        if (filterCategory) {
            filterCategory.innerHTML = '<option value="">All Categories</option>';
            this.expenseCategories.forEach(category => {
                filterCategory.innerHTML += `<option value="${category}">${category}</option>`;
            });
        }

        this.renderExpenses();
    }

    renderExpenses(filteredExpenses = null) {
        const tbody = document.querySelector('#expenses-table tbody');
        if (!tbody) return;
        
        const expenses = filteredExpenses || this.data.expenses;
        
        tbody.innerHTML = '';
        expenses.forEach(expense => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${expense.date}</td>
                <td>${expense.category}</td>
                <td>₹${expense.amount.toLocaleString()}</td>
                <td>${expense.description}</td>
                <td>${expense.truckId || 'General'}</td>
                <td>
                    <button class="action-btn edit" onclick="window.app.editExpense(${expense.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="window.app.deleteExpense(${expense.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    filterExpenses() {
        const search = document.getElementById('expense-search');
        const filterCategory = document.getElementById('expense-filter-category');
        const filterFrom = document.getElementById('expense-filter-from');
        const filterTo = document.getElementById('expense-filter-to');

        const searchValue = search ? search.value.toLowerCase() : '';
        const filterCategoryValue = filterCategory ? filterCategory.value : '';
        const filterFromValue = filterFrom ? filterFrom.value : '';
        const filterToValue = filterTo ? filterTo.value : '';

        let filtered = this.data.expenses.filter(expense => {
            const matchesSearch = !searchValue || 
                expense.description.toLowerCase().includes(searchValue) ||
                expense.category.toLowerCase().includes(searchValue);
            
            const matchesCategory = !filterCategoryValue || expense.category === filterCategoryValue;
            
            const matchesDateRange = (!filterFromValue || expense.date >= filterFromValue) &&
                                   (!filterToValue || expense.date <= filterToValue);

            return matchesSearch && matchesCategory && matchesDateRange;
        });

        this.renderExpenses(filtered);
    }

    openExpenseModal() {
        this.showNotification('Expense modal functionality will be implemented', 'info');
    }

    editExpense(id) {
        this.showNotification(`Edit expense ${id} functionality will be implemented`, 'info');
    }

    deleteExpense(id) {
        this.showNotification(`Delete expense ${id} functionality will be implemented`, 'info');
    }

    // Placeholder methods for other sections
    loadServices() {
        console.log('Loading services...');
        const tbody = document.querySelector('#services-table tbody');
        if (tbody) tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No service records yet</td></tr>';
    }

    openServiceModal() {
        this.showNotification('Service modal functionality will be implemented', 'info');
    }

    editService(id) {
        this.showNotification(`Edit service ${id} functionality will be implemented`, 'info');
    }

    deleteService(id) {
        this.showNotification(`Delete service ${id} functionality will be implemented`, 'info');
    }

    loadEMIs() {
        console.log('Loading EMIs...');
        const tbody = document.querySelector('#emis-table tbody');
        if (tbody) tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">No EMI records yet</td></tr>';
    }

    openEMIModal() {
        this.showNotification('EMI modal functionality will be implemented', 'info');
    }

    editEMI(id) {
        this.showNotification(`Edit EMI ${id} functionality will be implemented`, 'info');
    }

    deleteEMI(id) {
        this.showNotification(`Delete EMI ${id} functionality will be implemented`, 'info');
    }

    loadDocuments() {
        console.log('Loading documents...');
        const grid = document.getElementById('documents-grid');
        if (grid) {
            grid.innerHTML = '<p style="text-align: center; color: var(--color-text-secondary);">No documents uploaded yet.</p>';
        }
    }

    openDocumentModal() {
        this.showNotification('Document modal functionality will be implemented', 'info');
    }

    viewDocument(id) {
        this.showNotification(`View document ${id} functionality will be implemented`, 'info');
    }

    editDocumentDescription(id) {
        this.showNotification(`Edit document ${id} functionality will be implemented`, 'info');
    }

    deleteDocument(id) {
        this.showNotification(`Delete document ${id} functionality will be implemented`, 'info');
    }

    filterDocuments() {
        console.log('Filter documents called');
    }

    // Export/Import placeholder methods
    exportData() {
        this.showNotification('Export functionality will be implemented', 'info');
    }

    importData() {
        this.showNotification('Import functionality will be implemented', 'info');
    }

    clearAllData() {
        if (confirm('This will clear all sample data. Continue?')) {
            this.data = {
                trips: [],
                trucks: [],
                drivers: [],
                expenses: [],
                services: [],
                emis: [],
                documents: []
            };
            this.saveData();
            this.updateDashboard();
            this.switchSection(this.currentSection);
            this.showNotification('All data cleared!', 'warning');
        }
    }

    // Modal Management
    openModal(title, content) {
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        const modal = document.getElementById('modal');
        
        if (modalTitle) modalTitle.textContent = title;
        if (modalBody) modalBody.innerHTML = content;
        if (modal) {
            modal.classList.remove('hidden');
            setTimeout(() => modal.classList.add('active'), 10);
        }
    }

    closeModal() {
        const modal = document.getElementById('modal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.classList.add('hidden'), 300);
        }
    }

    // Notifications
    showNotification(message, type = 'info') {
        console.log('Notification:', message, type);
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        const container = document.getElementById('notifications');
        if (container) {
            container.appendChild(notification);
            
            setTimeout(() => notification.classList.add('show'), 100);
            
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (container.contains(notification)) {
                        container.removeChild(notification);
                    }
                }, 300);
            }, 3000);
        }
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app...');
    window.app = new DTSApp();
    console.log('App initialized and made globally available');
});
