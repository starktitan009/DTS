// DTS Truck Transport Business Application
class DTSApp {
    constructor() {
        this.currentPage = 'dashboard';
        this.data = {
            trucks: [],
            trips: [],
            drivers: [],
            documents: [],
            emi: [],
            itr: [],
            alerts: [],
            alarms: [],
            notes: [],
            owners: []
        };
        
        this.charts = {};
        
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        console.log('Initializing DTS App...');
        this.loadData();
        this.setupLogin();
        this.bindEvents();
        this.updateStats();
        this.updateBadges();
    }

    setupLogin() {
        // Set up login form with multiple event listeners for reliability
        const loginForm = document.getElementById('loginForm');
        const usernameField = document.getElementById('username');
        const passwordField = document.getElementById('password');
        
        if (!loginForm || !usernameField || !passwordField) {
            console.error('Login form elements not found');
            return;
        }

        // Clear any existing values
        usernameField.value = '';
        passwordField.value = '';

        // Multiple event bindings for maximum compatibility
        loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        
        // Direct button click handler
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.addEventListener('click', (e) => {
                if (e.target.form === loginForm) {
                    e.preventDefault();
                    this.handleLogin(e);
                }
            });
        }

        // Enter key handlers
        usernameField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.handleLogin(e);
            }
        });

        passwordField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.handleLogin(e);
            }
        });

        console.log('Login form setup complete');
    }

    handleLogin(e) {
        e.preventDefault();
        
        console.log('Login attempt started...');
        
        // Get form elements
        const usernameField = document.getElementById('username');
        const passwordField = document.getElementById('password');
        const errorElement = document.getElementById('loginError');
        
        if (!usernameField || !passwordField) {
            console.error('Login fields not found');
            this.showLoginError('System error: Please refresh the page');
            return;
        }

        // Get values
        const username = usernameField.value;
        const password = passwordField.value;
        
        console.log('Checking credentials:', {
            username: username,
            password: password ? '***' : '(empty)',
            usernameLength: username.length,
            passwordLength: password.length
        });

        // Clear previous errors
        if (errorElement) {
            errorElement.classList.add('hidden');
            errorElement.textContent = '';
        }

        // Validate credentials
        const correctUsername = 'Damayanti2023';
        const correctPassword = '02092007';
        
        if (username === correctUsername && password === correctPassword) {
            console.log('Login successful!');
            this.performLogin();
        } else {
            console.log('Login failed - invalid credentials');
            this.showLoginError('Invalid username or password. Please try again.');
            
            // Also show toast message
            setTimeout(() => {
                this.showToast('Login failed. Please check your credentials.', 'error');
            }, 100);
        }
    }

    performLogin() {
        const loginScreen = document.getElementById('loginScreen');
        const mainApp = document.getElementById('mainApp');
        
        if (!loginScreen || !mainApp) {
            console.error('Login or main app screens not found');
            return;
        }

        // Hide login screen and show main app
        loginScreen.style.display = 'none';
        mainApp.style.display = 'flex';
        
        // Navigate to dashboard
        this.showPage('dashboard');
        
        // Initialize charts
        setTimeout(() => {
            this.updateCharts();
        }, 500);
        
        // Show success message
        setTimeout(() => {
            this.showToast('Welcome to DTS! Login successful.', 'success');
        }, 200);
        
        console.log('Login completed successfully');
    }

    showLoginError(message) {
        const errorElement = document.getElementById('loginError');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
        }
    }

    logout() {
        const loginScreen = document.getElementById('loginScreen');
        const mainApp = document.getElementById('mainApp');
        const usernameField = document.getElementById('username');
        const passwordField = document.getElementById('password');
        const errorElement = document.getElementById('loginError');
        
        if (loginScreen) loginScreen.style.display = 'flex';
        if (mainApp) mainApp.style.display = 'none';
        if (usernameField) usernameField.value = '';
        if (passwordField) passwordField.value = '';
        if (errorElement) {
            errorElement.classList.add('hidden');
            errorElement.textContent = '';
        }
        
        this.showToast('Logged out successfully!', 'success');
    }

    // Data Management
    loadData() {
        try {
            const savedData = localStorage.getItem('dts-data');
            if (savedData) {
                this.data = { ...this.data, ...JSON.parse(savedData) };
                console.log('Data loaded from localStorage');
            }
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    saveData() {
        try {
            localStorage.setItem('dts-data', JSON.stringify(this.data));
            this.showToast('Data saved successfully!', 'success');
            this.updateStats();
            this.updateBadges();
            this.updateCharts();
        } catch (error) {
            console.error('Error saving data:', error);
            this.showToast('Error saving data!', 'error');
        }
    }

    // Event Binding
    bindEvents() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => this.navigate(e));
        });

        // Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }

        // Save Changes
        const saveBtn = document.getElementById('saveChangesBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveData());
        }

        // Modal
        const modalClose = document.getElementById('modalClose');
        const modal = document.getElementById('modal');
        if (modalClose) {
            modalClose.addEventListener('click', () => this.closeModal());
        }
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target.id === 'modal') this.closeModal();
            });
        }

        // Add buttons
        this.bindActionButtons();
    }

    bindActionButtons() {
        const buttons = [
            { id: 'addAlertBtn', action: () => this.openAlertForm() },
            { id: 'addTruckBtn', action: () => this.openTruckForm() },
            { id: 'addTripBtn', action: () => this.showToast('Trip form coming soon!', 'success') },
            { id: 'addDriverBtn', action: () => this.showToast('Driver form coming soon!', 'success') },
            { id: 'addDocumentBtn', action: () => this.showToast('Document form coming soon!', 'success') },
            { id: 'addEmiBtn', action: () => this.showToast('EMI form coming soon!', 'success') },
            { id: 'addItrBtn', action: () => this.showToast('ITR form coming soon!', 'success') },
            { id: 'addAlarmBtn', action: () => this.showToast('Alarm form coming soon!', 'success') },
            { id: 'addNoteBtn', action: () => this.showToast('Note form coming soon!', 'success') },
            { id: 'addOwnerBtn', action: () => this.showToast('Owner form coming soon!', 'success') },
            { id: 'exportTripsBtn', action: () => this.showToast('Export feature coming soon!', 'success') },
            { id: 'exportEmiBtn', action: () => this.showToast('Export feature coming soon!', 'success') }
        ];

        buttons.forEach(({ id, action }) => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('click', action);
            }
        });

        // Search and filter
        const truckSearch = document.getElementById('truckSearch');
        const truckFilter = document.getElementById('truckFilter');
        const notesSearch = document.getElementById('notesSearch');
        
        if (truckSearch) truckSearch.addEventListener('input', () => this.filterTrucks());
        if (truckFilter) truckFilter.addEventListener('change', () => this.filterTrucks());
        if (notesSearch) notesSearch.addEventListener('input', () => this.searchNotes());
    }

    // Navigation
    navigate(e) {
        e.preventDefault();
        const page = e.currentTarget.dataset.page;
        if (page) {
            this.showPage(page);
        }
    }

    showPage(page) {
        // Update nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        const activeLink = document.querySelector(`[data-page="${page}"]`);
        if (activeLink) activeLink.classList.add('active');

        // Update pages
        document.querySelectorAll('.page').forEach(p => {
            p.classList.remove('active');
        });
        const activePage = document.getElementById(`${page}Page`);
        if (activePage) activePage.classList.add('active');

        // Update page title
        const titles = {
            dashboard: 'Dashboard',
            alerts: 'Alerts & Reminders',
            trucks: 'Trucks',
            trips: 'Trips',
            drivers: 'Drivers',
            documents: 'Documents',
            emi: 'Truck EMI',
            itr: 'ITR (Income Tax Returns)',
            alarm: 'Alarm',
            notes: 'Notes',
            about: 'About Us'
        };
        
        const titleElement = document.getElementById('pageTitle');
        if (titleElement) {
            titleElement.textContent = titles[page] || 'Dashboard';
        }
        
        this.currentPage = page;
        this.renderCurrentPage();
    }

    renderCurrentPage() {
        switch(this.currentPage) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'alerts':
                this.renderAlerts();
                break;
            case 'trucks':
                this.renderTrucks();
                break;
            case 'trips':
                this.renderTrips();
                break;
            case 'drivers':
                this.renderDrivers();
                break;
            case 'documents':
                this.renderDocuments();
                break;
            case 'emi':
                this.renderEmi();
                break;
            case 'itr':
                this.renderItr();
                break;
            case 'alarm':
                this.renderAlarms();
                break;
            case 'notes':
                this.renderNotes();
                break;
            case 'about':
                this.renderOwners();
                break;
        }
    }

    // Dashboard
    renderDashboard() {
        this.updateStats();
        this.updateCharts();
        this.renderDashboardAlerts();
    }

    updateStats() {
        const totalProfit = this.data.trips.reduce((sum, trip) => {
            const income = (trip.tonnes || 0) * (trip.ratePerTonne || 0);
            const expenses = (trip.fuel || 0) + (trip.def || 0) + (trip.food || 0) + 
                           (trip.line || 0) + (trip.toll || 0) + (trip.driverSalary || 0);
            return sum + (income - expenses);
        }, 0);

        const activeTrucks = this.data.trucks.filter(truck => truck.status === 'ongoing').length;
        const completedTrips = this.data.trips.filter(trip => trip.status === 'completed').length;

        const totalProfitEl = document.getElementById('totalProfit');
        const totalTripsEl = document.getElementById('totalTrips');
        const activeTrucksEl = document.getElementById('activeTrucks');
        const completedTripsEl = document.getElementById('completedTrips');

        if (totalProfitEl) totalProfitEl.textContent = `₹${totalProfit.toLocaleString()}`;
        if (totalTripsEl) totalTripsEl.textContent = this.data.trips.length;
        if (activeTrucksEl) activeTrucksEl.textContent = activeTrucks;
        if (completedTripsEl) completedTripsEl.textContent = completedTrips;
    }

    updateCharts() {
        setTimeout(() => {
            this.renderExpenseProfitChart();
            this.renderTripsByTruckChart();
            this.renderMonthlyEarningsChart();
        }, 100);
    }

    renderExpenseProfitChart() {
        const ctx = document.getElementById('expenseProfitChart');
        if (!ctx) return;

        if (this.charts.expenseProfit) {
            this.charts.expenseProfit.destroy();
        }

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const expenses = [50000, 60000, 45000, 70000, 55000, 65000];
        const profits = [80000, 90000, 70000, 110000, 85000, 95000];

        this.charts.expenseProfit = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: months,
                datasets: [{
                    label: 'Expenses',
                    data: expenses,
                    backgroundColor: '#B4413C'
                }, {
                    label: 'Profit',
                    data: profits,
                    backgroundColor: '#1FB8CD'
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

    renderTripsByTruckChart() {
        const ctx = document.getElementById('tripsByTruckChart');
        if (!ctx) return;

        if (this.charts.tripsByTruck) {
            this.charts.tripsByTruck.destroy();
        }

        let truckData = this.data.trucks.slice(0, 5).map(truck => ({
            label: truck.number || 'Unknown',
            trips: this.data.trips.filter(trip => trip.truckNo === truck.number).length
        }));

        if (truckData.length === 0) {
            truckData = [
                { label: 'Sample Truck 1', trips: 5 },
                { label: 'Sample Truck 2', trips: 3 },
                { label: 'Sample Truck 3', trips: 7 }
            ];
        }

        this.charts.tripsByTruck = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: truckData.map(t => t.label),
                datasets: [{
                    data: truckData.map(t => t.trips),
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    renderMonthlyEarningsChart() {
        const ctx = document.getElementById('monthlyEarningsChart');
        if (!ctx) return;

        if (this.charts.monthlyEarnings) {
            this.charts.monthlyEarnings.destroy();
        }

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const earnings = [80000, 90000, 70000, 110000, 85000, 95000];

        this.charts.monthlyEarnings = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: 'Monthly Earnings',
                    data: earnings,
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

    renderDashboardAlerts() {
        const container = document.getElementById('dashboardAlerts');
        if (!container) return;

        const upcomingAlerts = this.data.alerts
            .filter(alert => new Date(alert.datetime) > new Date())
            .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
            .slice(0, 5);

        const dueAlarms = this.data.alarms
            .filter(alarm => {
                const alarmTime = new Date(alarm.datetime);
                const now = new Date();
                return alarmTime <= now && !alarm.completed;
            });

        let html = '<h3>Upcoming Alerts & Due Alarms</h3>';
        
        if (upcomingAlerts.length > 0 || dueAlarms.length > 0) {
            html += '<div class="alert-list">';
            
            dueAlarms.forEach(alarm => {
                html += `
                    <div class="dashboard-alert due">
                        <strong>🔔 ALARM DUE:</strong> ${alarm.task}
                        <small>${new Date(alarm.datetime).toLocaleString()}</small>
                    </div>
                `;
            });
            
            upcomingAlerts.forEach(alert => {
                html += `
                    <div class="dashboard-alert">
                        <strong>${alert.title}</strong>
                        <small>${new Date(alert.datetime).toLocaleString()}</small>
                    </div>
                `;
            });
            
            html += '</div>';
        } else {
            html += '<p>No upcoming alerts or due alarms.</p>';
        }

        container.innerHTML = html;
    }

    // Alerts Management
    renderAlerts() {
        const container = document.getElementById('alertsList');
        if (!container) return;

        const alerts = this.data.alerts.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

        if (alerts.length === 0) {
            container.innerHTML = '<div class="no-data">No alerts found. Click "Add Alert" to create one.</div>';
            return;
        }

        container.innerHTML = alerts.map(alert => {
            const isOverdue = new Date(alert.datetime) < new Date();
            return `
                <div class="item-card ${isOverdue ? 'overdue' : ''}">
                    <div class="item-header">
                        <h3 class="item-title">${alert.title}</h3>
                        ${isOverdue ? '<span class="item-status">Overdue</span>' : '<span class="item-status status-idle">Upcoming</span>'}
                    </div>
                    <div class="item-details">
                        <div class="item-detail">
                            <span class="item-detail-label">Date & Time:</span>
                            <span class="item-detail-value">${new Date(alert.datetime).toLocaleString()}</span>
                        </div>
                        ${alert.description ? `
                            <div class="item-detail">
                                <span class="item-detail-label">Description:</span>
                                <span class="item-detail-value">${alert.description}</span>
                            </div>
                        ` : ''}
                    </div>
                    <div class="item-actions">
                        <button class="btn btn--secondary btn--sm" onclick="app.editAlert('${alert.id}')">Edit</button>
                        <button class="btn btn--outline btn--sm" onclick="app.deleteAlert('${alert.id}')">Delete</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    openAlertForm(alertId = null) {
        const alert = alertId ? this.data.alerts.find(a => a.id === alertId) : null;
        const isEdit = !!alert;

        this.openModal(isEdit ? 'Edit Alert' : 'Add Alert', `
            <form id="alertForm" class="form-grid">
                <div class="form-group">
                    <label class="form-label">Title</label>
                    <input type="text" name="title" class="form-control" value="${alert?.title || ''}" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Date & Time</label>
                    <input type="datetime-local" name="datetime" class="form-control" value="${alert?.datetime || ''}" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Description</label>
                    <textarea name="description" class="form-control" rows="3">${alert?.description || ''}</textarea>
                </div>
                <div class="form-group">
                    <button type="submit" class="btn btn--primary">${isEdit ? 'Update' : 'Add'} Alert</button>
                </div>
            </form>
        `);

        const form = document.getElementById('alertForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const alertData = {
                    id: alert?.id || this.generateId(),
                    title: formData.get('title'),
                    datetime: formData.get('datetime'),
                    description: formData.get('description')
                };

                if (isEdit) {
                    const index = this.data.alerts.findIndex(a => a.id === alert.id);
                    if (index !== -1) {
                        this.data.alerts[index] = alertData;
                    }
                } else {
                    this.data.alerts.push(alertData);
                }

                this.closeModal();
                this.renderAlerts();
                this.updateBadges();
                this.showToast('Alert saved successfully!', 'success');
            });
        }
    }

    editAlert(id) {
        this.openAlertForm(id);
    }

    deleteAlert(id) {
        if (confirm('Are you sure you want to delete this alert?')) {
            this.data.alerts = this.data.alerts.filter(a => a.id !== id);
            this.renderAlerts();
            this.updateBadges();
            this.showToast('Alert deleted successfully!', 'success');
        }
    }

    // Trucks Management
    renderTrucks() {
        this.filterTrucks();
    }

    filterTrucks() {
        const container = document.getElementById('trucksList');
        if (!container) return;

        const searchInput = document.getElementById('truckSearch');
        const filterSelect = document.getElementById('truckFilter');
        
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const statusFilter = filterSelect ? filterSelect.value : '';

        let trucks = this.data.trucks;

        if (searchTerm) {
            trucks = trucks.filter(truck => 
                (truck.number && truck.number.toLowerCase().includes(searchTerm)) ||
                (truck.type && truck.type.toLowerCase().includes(searchTerm))
            );
        }

        if (statusFilter) {
            trucks = trucks.filter(truck => truck.status === statusFilter);
        }

        if (trucks.length === 0) {
            container.innerHTML = '<div class="no-data">No trucks found. Click "Add Truck" to create one.</div>';
            return;
        }

        container.innerHTML = trucks.map(truck => `
            <div class="item-card">
                <div class="item-header">
                    <h3 class="item-title">${truck.number}</h3>
                    <span class="item-status ${truck.status === 'ongoing' ? 'status-ongoing' : 'status-idle'}">
                        ${truck.status === 'ongoing' ? 'On-going' : 'Idle'}
                    </span>
                </div>
                ${truck.photo ? `<img src="${truck.photo}" alt="Truck" class="item-photo">` : ''}
                <div class="item-details">
                    <div class="item-detail">
                        <span class="item-detail-label">Type:</span>
                        <span class="item-detail-value">${truck.type || 'N/A'}</span>
                    </div>
                    <div class="item-detail">
                        <span class="item-detail-label">Capacity:</span>
                        <span class="item-detail-value">${truck.capacity || 'N/A'}</span>
                    </div>
                </div>
                <div class="item-actions">
                    <button class="btn btn--secondary btn--sm" onclick="app.editTruck('${truck.id}')">Edit</button>
                    <button class="btn btn--outline btn--sm" onclick="app.deleteTruck('${truck.id}')">Delete</button>
                    <button class="btn btn--primary btn--sm" onclick="app.toggleTruckStatus('${truck.id}')">
                        ${truck.status === 'ongoing' ? 'Mark Idle' : 'Mark On-going'}
                    </button>
                </div>
            </div>
        `).join('');
    }

    openTruckForm(truckId = null) {
        const truck = truckId ? this.data.trucks.find(t => t.id === truckId) : null;
        const isEdit = !!truck;

        this.openModal(isEdit ? 'Edit Truck' : 'Add Truck', `
            <form id="truckForm" class="form-grid">
                <div class="form-group">
                    <label class="form-label">Truck Number</label>
                    <input type="text" name="number" class="form-control" value="${truck?.number || ''}" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Type</label>
                    <input type="text" name="type" class="form-control" value="${truck?.type || ''}" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Capacity</label>
                    <input type="text" name="capacity" class="form-control" value="${truck?.capacity || ''}" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Status</label>
                    <select name="status" class="form-control" required>
                        <option value="idle" ${truck?.status === 'idle' ? 'selected' : ''}>Idle</option>
                        <option value="ongoing" ${truck?.status === 'ongoing' ? 'selected' : ''}>On-going</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Photo</label>
                    <input type="file" name="photo" class="form-control" accept="image/*">
                </div>
                <div class="form-group">
                    <button type="submit" class="btn btn--primary">${isEdit ? 'Update' : 'Add'} Truck</button>
                </div>
            </form>
        `);

        const form = document.getElementById('truckForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const file = formData.get('photo');
                
                const truckData = {
                    id: truck?.id || this.generateId(),
                    number: formData.get('number'),
                    type: formData.get('type'),
                    capacity: formData.get('capacity'),
                    status: formData.get('status'),
                    photo: truck?.photo || null
                };

                if (file && file.size > 0) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        truckData.photo = e.target.result;
                        this.saveTruck(truckData, isEdit);
                    };
                    reader.readAsDataURL(file);
                } else {
                    this.saveTruck(truckData, isEdit);
                }
            });
        }
    }

    saveTruck(truckData, isEdit) {
        if (isEdit) {
            const index = this.data.trucks.findIndex(t => t.id === truckData.id);
            if (index !== -1) {
                this.data.trucks[index] = truckData;
            }
        } else {
            this.data.trucks.push(truckData);
        }

        this.closeModal();
        this.renderTrucks();
        this.updateStats();
        this.showToast('Truck saved successfully!', 'success');
    }

    editTruck(id) {
        this.openTruckForm(id);
    }

    deleteTruck(id) {
        if (confirm('Are you sure you want to delete this truck?')) {
            this.data.trucks = this.data.trucks.filter(t => t.id !== id);
            this.renderTrucks();
            this.updateStats();
            this.showToast('Truck deleted successfully!', 'success');
        }
    }

    toggleTruckStatus(id) {
        const truck = this.data.trucks.find(t => t.id === id);
        if (truck) {
            truck.status = truck.status === 'ongoing' ? 'idle' : 'ongoing';
            this.renderTrucks();
            this.updateStats();
            this.showToast(`Truck status updated to ${truck.status}!`, 'success');
        }
    }

    // Simplified render methods for other sections
    renderTrips() {
        const container = document.getElementById('tripsList');
        if (container) {
            container.innerHTML = '<div class="no-data">No trips found. Click "Add Trip" to create one.</div>';
        }
    }

    renderDrivers() {
        const container = document.getElementById('driversList');
        if (container) {
            container.innerHTML = '<div class="no-data">No drivers found. Click "Add Driver" to create one.</div>';
        }
    }

    renderDocuments() {
        const container = document.getElementById('documentsList');
        if (container) {
            container.innerHTML = '<div class="no-data">No documents found. Click "Upload Document" to add one.</div>';
        }
    }

    renderEmi() {
        const container = document.getElementById('emiList');
        if (container) {
            container.innerHTML = '<div class="no-data">No EMI records found. Click "Add EMI Payment" to create one.</div>';
        }
    }

    renderItr() {
        const container = document.getElementById('itrList');
        if (container) {
            container.innerHTML = '<div class="no-data">No ITR records found. Click "Add ITR Data" to create one.</div>';
        }
    }

    renderAlarms() {
        const container = document.getElementById('alarmsList');
        if (container) {
            container.innerHTML = '<div class="no-data">No alarms found. Click "Add Alarm" to create one.</div>';
        }
    }

    renderNotes() {
        const container = document.getElementById('notesList');
        if (container) {
            container.innerHTML = '<div class="no-data">No notes found. Click "Add Note" to create one.</div>';
        }
    }

    renderOwners() {
        const container = document.getElementById('ownersList');
        if (container) {
            container.innerHTML = '<div class="no-data">No owner profiles found. Click "Add Owner Profile" to create one.</div>';
        }
    }

    searchNotes() {
        this.renderNotes();
    }

    // Utility Functions
    generateId() {
        return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    openModal(title, content) {
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        const modal = document.getElementById('modal');
        
        if (modalTitle) modalTitle.textContent = title;
        if (modalBody) modalBody.innerHTML = content;
        if (modal) modal.classList.remove('hidden');
    }

    closeModal() {
        const modal = document.getElementById('modal');
        if (modal) modal.classList.add('hidden');
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        
        if (toast && toastMessage) {
            toastMessage.textContent = message;
            toast.className = `toast ${type}`;
            toast.classList.add('show');

            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
    }

    updateBadges() {
        const alertsBadge = document.getElementById('alertsBadge');
        const docsBadge = document.getElementById('docsBadge');
        const alarmBadge = document.getElementById('alarmBadge');
        
        if (alertsBadge) alertsBadge.textContent = this.data.alerts.length;
        if (docsBadge) docsBadge.textContent = '0';
        if (alarmBadge) alarmBadge.textContent = this.data.alarms.length;
    }
}

// Initialize the application
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new DTSApp();
});

// Fallback initialization
if (document.readyState !== 'loading') {
    app = new DTSApp();
}
