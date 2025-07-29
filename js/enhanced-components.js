/**
 * Enhanced Components JavaScript
 * Handles all enhanced UI components and interactions
 */

// Global state management
const AppState = {
    currentSection: 'dashboard',
    isMobileMenuOpen: false,
    isUserDropdownOpen: false,
    emiCalculatorData: {
        loanType: 'personal',
        amount: 300000,
        tenure: 5,
        rate: 12.0
    },
    applications: [],
    faqs: [],
    settings: {
        profile: {},
        security: {},
        notifications: {},
        preferences: {}
    }
};

// Navigation Management
class NavigationManager {
    static init() {
        this.setupNavigation();
        this.setupMobileMenu();
        this.setupUserDropdown();
    }

    static setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const section = item.getAttribute('data-section');
                if (section && section !== 'apply-loan') {
                    e.preventDefault();
                    this.showSection(section);
                }
            });
        });
    }

    static showSection(sectionName) {
        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`)?.classList.add('active');

        // Hide all sections
        document.querySelectorAll('.section-content').forEach(section => {
            section.style.display = 'none';
        });
        document.querySelector('.main-content').style.display = sectionName === 'dashboard' ? 'block' : 'none';

        // Show target section
        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.style.display = 'block';
            targetSection.classList.add('fade-in');
        }

        AppState.currentSection = sectionName;
        this.loadSectionContent(sectionName);
        
        // Close mobile menu if open
        this.closeMobileMenu();
    }

    static loadSectionContent(sectionName) {
        switch (sectionName) {
            case 'emi-calculator':
                EMICalculator.init();
                break;
            case 'view-status':
                StatusManager.init();
                break;
            case 'faqs':
                FAQManager.init();
                break;
            case 'settings':
                SettingsManager.init();
                break;
        }
    }

    static setupMobileMenu() {
        const toggleBtn = document.querySelector('.mobile-menu-toggle');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');

        if (toggleBtn) {
            toggleBtn.addEventListener('click', this.toggleMobileMenu.bind(this));
        }

        if (overlay) {
            overlay.addEventListener('click', this.closeMobileMenu.bind(this));
        }
    }

    static toggleMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        
        AppState.isMobileMenuOpen = !AppState.isMobileMenuOpen;
        
        if (AppState.isMobileMenuOpen) {
            sidebar?.classList.add('mobile-open');
            overlay?.classList.add('show');
        } else {
            sidebar?.classList.remove('mobile-open');
            overlay?.classList.remove('show');
        }
    }

    static closeMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        
        AppState.isMobileMenuOpen = false;
        sidebar?.classList.remove('mobile-open');
        overlay?.classList.remove('show');
    }

    static setupUserDropdown() {
        const userProfile = document.querySelector('.user-profile');
        const dropdown = document.getElementById('userDropdown');

        if (userProfile) {
            userProfile.addEventListener('click', this.toggleUserDropdown.bind(this));
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.user-profile-dropdown')) {
                this.closeUserDropdown();
            }
        });
    }

    static toggleUserDropdown() {
        const dropdown = document.getElementById('userDropdown');
        const userProfile = document.querySelector('.user-profile');
        
        AppState.isUserDropdownOpen = !AppState.isUserDropdownOpen;
        
        if (AppState.isUserDropdownOpen) {
            dropdown?.classList.add('show');
            userProfile?.classList.add('active');
        } else {
            dropdown?.classList.remove('show');
            userProfile?.classList.remove('active');
        }
    }

    static closeUserDropdown() {
        const dropdown = document.getElementById('userDropdown');
        const userProfile = document.querySelector('.user-profile');
        
        AppState.isUserDropdownOpen = false;
        dropdown?.classList.remove('show');
        userProfile?.classList.remove('active');
    }
}

// EMI Calculator
class EMICalculator {
    static init() {
        this.setupEventListeners();
        this.updateCalculation();
        this.initChart();
    }

    static setupEventListeners() {
        const amountSlider = document.getElementById('calc-amount');
        const tenureSlider = document.getElementById('calc-tenure');
        const rateSlider = document.getElementById('calc-rate');
        const loanTypeSelect = document.getElementById('calc-loan-type');

        if (amountSlider) {
            amountSlider.addEventListener('input', (e) => {
                AppState.emiCalculatorData.amount = parseInt(e.target.value);
                this.updateDisplays();
                this.updateCalculation();
            });
        }

        if (tenureSlider) {
            tenureSlider.addEventListener('input', (e) => {
                AppState.emiCalculatorData.tenure = parseInt(e.target.value);
                this.updateDisplays();
                this.updateCalculation();
            });
        }

        if (rateSlider) {
            rateSlider.addEventListener('input', (e) => {
                AppState.emiCalculatorData.rate = parseFloat(e.target.value);
                this.updateDisplays();
                this.updateCalculation();
            });
        }

        if (loanTypeSelect) {
            loanTypeSelect.addEventListener('change', (e) => {
                AppState.emiCalculatorData.loanType = e.target.value;
                this.updateInterestRate();
                this.updateCalculation();
            });
        }
    }

    static updateDisplays() {
        const amountDisplay = document.getElementById('amount-display');
        const tenureDisplay = document.getElementById('tenure-display');
        const rateDisplay = document.getElementById('rate-display');

        if (amountDisplay) {
            amountDisplay.textContent = `₹${AppState.emiCalculatorData.amount.toLocaleString('en-IN')}`;
        }

        if (tenureDisplay) {
            tenureDisplay.textContent = `${AppState.emiCalculatorData.tenure} Years`;
        }

        if (rateDisplay) {
            rateDisplay.textContent = `${AppState.emiCalculatorData.rate.toFixed(1)}%`;
        }
    }

    static updateInterestRate() {
        const rates = {
            personal: 12.0,
            home: 8.5,
            car: 9.5,
            education: 10.5
        };

        AppState.emiCalculatorData.rate = rates[AppState.emiCalculatorData.loanType] || 12.0;
        
        const rateSlider = document.getElementById('calc-rate');
        if (rateSlider) {
            rateSlider.value = AppState.emiCalculatorData.rate;
        }
        
        this.updateDisplays();
    }

    static updateCalculation() {
        const { amount, tenure, rate } = AppState.emiCalculatorData;
        
        const monthlyRate = rate / (12 * 100);
        const totalMonths = tenure * 12;
        
        const emi = (amount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                   (Math.pow(1 + monthlyRate, totalMonths) - 1);
        
        const totalAmount = emi * totalMonths;
        const totalInterest = totalAmount - amount;

        // Update UI
        const monthlyEmiEl = document.getElementById('monthly-emi');
        const totalInterestEl = document.getElementById('total-interest');
        const totalAmountEl = document.getElementById('total-amount');

        if (monthlyEmiEl) {
            monthlyEmiEl.textContent = `₹${Math.round(emi).toLocaleString('en-IN')}`;
        }

        if (totalInterestEl) {
            totalInterestEl.textContent = `₹${Math.round(totalInterest).toLocaleString('en-IN')}`;
        }

        if (totalAmountEl) {
            totalAmountEl.textContent = `₹${Math.round(totalAmount).toLocaleString('en-IN')}`;
        }

        this.updateChart(amount, totalInterest);
    }

    static initChart() {
        const ctx = document.getElementById('emi-breakdown-chart');
        if (!ctx) return;

        this.chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Principal', 'Interest'],
                datasets: [{
                    data: [300000, 100000],
                    backgroundColor: ['#4285f4', '#34a853'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    static updateChart(principal, interest) {
        if (this.chart) {
            this.chart.data.datasets[0].data = [principal, interest];
            this.chart.update();
        }
    }
}

// Status Manager
class StatusManager {
    static init() {
        this.loadApplications();
        this.setupFilters();
    }

    static loadApplications() {
        // Mock data - replace with actual API call
        AppState.applications = [
            {
                id: 'LA001',
                type: 'Personal Loan',
                amount: 500000,
                status: 'approved',
                appliedDate: '2024-01-15',
                approvedDate: '2024-01-20'
            },
            {
                id: 'LA002',
                type: 'Home Loan',
                amount: 2500000,
                status: 'pending',
                appliedDate: '2024-01-10',
                approvedDate: null
            }
        ];

        this.renderApplications();
    }

    static setupFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filter = btn.getAttribute('data-filter');
                this.filterApplications(filter);
            });
        });
    }

    static filterApplications(filter) {
        let filteredApps = AppState.applications;
        
        if (filter !== 'all') {
            filteredApps = AppState.applications.filter(app => app.status === filter);
        }
        
        this.renderApplications(filteredApps);
    }

    static renderApplications(applications = AppState.applications) {
        const container = document.getElementById('applications-grid');
        if (!container) return;

        container.innerHTML = applications.map(app => `
            <div class="application-card slide-up">
                <div class="app-header">
                    <h4>${app.type}</h4>
                    <span class="status-badge status-${app.status}">${app.status.toUpperCase()}</span>
                </div>
                <div class="app-details">
                    <p><strong>Application ID:</strong> ${app.id}</p>
                    <p><strong>Amount:</strong> ₹${app.amount.toLocaleString('en-IN')}</p>
                    <p><strong>Applied Date:</strong> ${new Date(app.appliedDate).toLocaleDateString()}</p>
                    ${app.approvedDate ? `<p><strong>Approved Date:</strong> ${new Date(app.approvedDate).toLocaleDateString()}</p>` : ''}
                </div>
                <div class="app-actions">
                    <button class="btn btn-primary btn-sm">View Details</button>
                    ${app.status === 'approved' ? '<button class="btn btn-success btn-sm">Download Agreement</button>' : ''}
                </div>
            </div>
        `).join('');
    }
}

// FAQ Manager
class FAQManager {
    static init() {
        this.loadFAQs();
        this.setupSearch();
        this.setupCategories();
    }

    static loadFAQs() {
        // Mock FAQ data
        AppState.faqs = [
            {
                id: 1,
                question: 'What documents are required for a personal loan?',
                answer: 'You need identity proof, address proof, income proof, and bank statements for the last 6 months.',
                category: 'documentation'
            },
            {
                id: 2,
                question: 'What is the minimum eligibility criteria?',
                answer: 'Minimum age 21 years, maximum age 60 years, minimum monthly income ₹25,000.',
                category: 'eligibility'
            },
            {
                id: 3,
                question: 'How long does the loan processing take?',
                answer: 'Typically 3-7 business days after document verification.',
                category: 'processing'
            },
            {
                id: 4,
                question: 'Can I prepay my loan?',
                answer: 'Yes, you can prepay your loan after 6 months with minimal charges.',
                category: 'repayment'
            }
        ];

        this.renderFAQs();
    }

    static setupSearch() {
        const searchInput = document.getElementById('faq-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchFAQs(e.target.value);
            });
        }
    }

    static setupCategories() {
        const categoryBtns = document.querySelectorAll('.category-btn');
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                categoryBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const category = btn.getAttribute('data-category');
                this.filterFAQs(category);
            });
        });
    }

    static searchFAQs(query) {
        const filteredFAQs = AppState.faqs.filter(faq => 
            faq.question.toLowerCase().includes(query.toLowerCase()) ||
            faq.answer.toLowerCase().includes(query.toLowerCase())
        );
        this.renderFAQs(filteredFAQs);
    }

    static filterFAQs(category) {
        let filteredFAQs = AppState.faqs;
        
        if (category !== 'all') {
            filteredFAQs = AppState.faqs.filter(faq => faq.category === category);
        }
        
        this.renderFAQs(filteredFAQs);
    }

    static renderFAQs(faqs = AppState.faqs) {
        const container = document.getElementById('faq-list');
        if (!container) return;

        container.innerHTML = faqs.map(faq => `
            <div class="faq-item" data-faq-id="${faq.id}">
                <div class="faq-question" onclick="FAQManager.toggleFAQ(${faq.id})">
                    <span>${faq.question}</span>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="faq-answer">
                    <p>${faq.answer}</p>
                </div>
            </div>
        `).join('');
    }

    static toggleFAQ(faqId) {
        const faqItem = document.querySelector(`[data-faq-id="${faqId}"]`);
        if (faqItem) {
            faqItem.classList.toggle('active');
        }
    }
}

// Settings Manager
class SettingsManager {
    static init() {
        this.setupTabs();
        this.loadSettings();
    }

    static setupTabs() {
        const tabs = document.querySelectorAll('.settings-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                const tabName = tab.getAttribute('data-tab');
                this.showTab(tabName);
            });
        });
    }

    static showTab(tabName) {
        const panels = document.querySelectorAll('.settings-panel');
        panels.forEach(panel => panel.classList.remove('active'));
        
        const targetPanel = document.getElementById(`${tabName}-settings`);
        if (targetPanel) {
            targetPanel.classList.add('active');
            this.loadTabContent(tabName);
        }
    }

    static loadTabContent(tabName) {
        const panel = document.getElementById(`${tabName}-settings`);
        if (!panel) return;

        switch (tabName) {
            case 'profile':
                panel.innerHTML = this.getProfileSettingsHTML();
                break;
            case 'security':
                panel.innerHTML = this.getSecuritySettingsHTML();
                break;
            case 'notifications':
                panel.innerHTML = this.getNotificationSettingsHTML();
                break;
            case 'preferences':
                panel.innerHTML = this.getPreferencesSettingsHTML();
                break;
        }
    }

    static getProfileSettingsHTML() {
        return `
            <div class="settings-section">
                <h3>Profile Information</h3>
                <div class="form-grid">
                    <div class="input-group">
                        <label for="profile-name">Full Name</label>
                        <input type="text" id="profile-name" class="form-control" value="John Mathew">
                    </div>
                    <div class="input-group">
                        <label for="profile-email">Email</label>
                        <input type="email" id="profile-email" class="form-control" value="john.mathew@email.com">
                    </div>
                    <div class="input-group">
                        <label for="profile-phone">Phone</label>
                        <input type="tel" id="profile-phone" class="form-control" value="+91 9876543210">
                    </div>
                    <div class="input-group">
                        <label for="profile-address">Address</label>
                        <textarea id="profile-address" class="form-control" rows="3">123 Main Street, City, State - 123456</textarea>
                    </div>
                </div>
                <button class="btn btn-primary">Save Changes</button>
            </div>
        `;
    }

    static getSecuritySettingsHTML() {
        return `
            <div class="settings-section">
                <h3>Security Settings</h3>
                <div class="form-grid">
                    <div class="input-group">
                        <label for="current-password">Current Password</label>
                        <input type="password" id="current-password" class="form-control">
                    </div>
                    <div class="input-group">
                        <label for="new-password">New Password</label>
                        <input type="password" id="new-password" class="form-control">
                    </div>
                    <div class="input-group">
                        <label for="confirm-password">Confirm New Password</label>
                        <input type="password" id="confirm-password" class="form-control">
                    </div>
                </div>
                <button class="btn btn-primary">Update Password</button>
                
                <div class="security-options">
                    <h4>Two-Factor Authentication</h4>
                    <div class="toggle-option">
                        <label class="toggle-switch">
                            <input type="checkbox" id="2fa-toggle">
                            <span class="slider"></span>
                        </label>
                        <span>Enable Two-Factor Authentication</span>
                    </div>
                </div>
            </div>
        `;
    }

    static getNotificationSettingsHTML() {
        return `
            <div class="settings-section">
                <h3>Notification Preferences</h3>
                <div class="notification-options">
                    <div class="toggle-option">
                        <label class="toggle-switch">
                            <input type="checkbox" id="email-notifications" checked>
                            <span class="slider"></span>
                        </label>
                        <span>Email Notifications</span>
                    </div>
                    <div class="toggle-option">
                        <label class="toggle-switch">
                            <input type="checkbox" id="sms-notifications" checked>
                            <span class="slider"></span>
                        </label>
                        <span>SMS Notifications</span>
                    </div>
                    <div class="toggle-option">
                        <label class="toggle-switch">
                            <input type="checkbox" id="push-notifications">
                            <span class="slider"></span>
                        </label>
                        <span>Push Notifications</span>
                    </div>
                    <div class="toggle-option">
                        <label class="toggle-switch">
                            <input type="checkbox" id="marketing-emails">
                            <span class="slider"></span>
                        </label>
                        <span>Marketing Emails</span>
                    </div>
                </div>
                <button class="btn btn-primary">Save Preferences</button>
            </div>
        `;
    }

    static getPreferencesSettingsHTML() {
        return `
            <div class="settings-section">
                <h3>Application Preferences</h3>
                <div class="form-grid">
                    <div class="input-group">
                        <label for="language-select">Language</label>
                        <select id="language-select" class="form-control">
                            <option value="en">English</option>
                            <option value="hi">Hindi</option>
                            <option value="mr">Marathi</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label for="currency-select">Currency</label>
                        <select id="currency-select" class="form-control">
                            <option value="INR">Indian Rupee (₹)</option>
                            <option value="USD">US Dollar ($)</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label for="theme-select">Theme</label>
                        <select id="theme-select" class="form-control">
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                            <option value="auto">Auto</option>
                        </select>
                    </div>
                </div>
                <button class="btn btn-primary">Save Preferences</button>
            </div>
        `;
    }

    static loadSettings() {
        // Load settings from localStorage or API
        const savedSettings = localStorage.getItem('userSettings');
        if (savedSettings) {
            AppState.settings = JSON.parse(savedSettings);
        }
    }

    static saveSettings() {
        localStorage.setItem('userSettings', JSON.stringify(AppState.settings));
    }
}

// Global functions for HTML onclick handlers
function showSection(sectionName) {
    NavigationManager.showSection(sectionName);
}

function toggleMobileMenu() {
    NavigationManager.toggleMobileMenu();
}

function closeMobileMenu() {
    NavigationManager.closeMobileMenu();
}

function toggleUserDropdown() {
    NavigationManager.toggleUserDropdown();
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    NavigationManager.init();
    
    // Initialize default section content if needed
    if (AppState.currentSection === 'dashboard') {
        // Dashboard is already loaded, no need to do anything
    }
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        NavigationManager,
        EMICalculator,
        StatusManager,
        FAQManager,
        SettingsManager,
        AppState
    };
}