/**
 * Dashboard Module
 * Handles dashboard functionality, data loading, and user interactions
 */

// Dashboard service
const DashboardService = {
    // Base URL for dashboard API (placeholder for .NET backend)
    apiBaseUrl: 'https://localhost:5001/api/dashboard',
    
    /**
     * Initialize dashboard when user logs in
     */
    async init() {
        try {
            // Load user data
            await this.loadUserData();
            
            // Load application data
            await this.loadApplicationData();
            
            // Initialize EMI calculator
            this.initEMICalculator();
            
            // Initialize charts
            if (window.ChartService) {
                window.ChartService.initAllCharts();
            }
            
            // Set up periodic data refresh
            this.startDataRefresh();
            
        } catch (error) {
            console.error('Dashboard initialization error:', error);
            this.showError('Failed to load dashboard data');
        }
    },
    
    /**
     * Load user profile data
     */
    async loadUserData() {
        try {
            // TODO: Replace with actual API call to .NET backend
            // const token = AuthService.getToken();
            // const response = await fetch(`${this.apiBaseUrl}/user`, {
            //     headers: {
            //         'Authorization': `Bearer ${token}`
            //     }
            // });
            // const userData = await response.json();
            
            // Placeholder implementation
            const userName = localStorage.getItem('userName') || 'John Mathew';
            const userRole = localStorage.getItem('userRole') || 'customer';
            
            // Update UI with user data
            const userNameElement = document.getElementById('userName');
            if (userNameElement) {
                userNameElement.textContent = userName;
            }
            
            // Store user data for later use
            this.userData = {
                name: userName,
                role: userRole,
                hasAppliedForLoan: false,
                eligibilityScore: 750,
                creditStatus: 'Excellent'
            };
            
        } catch (error) {
            console.error('Error loading user data:', error);
            throw error;
        }
    },
    
    /**
     * Load application status data
     */
    async loadApplicationData() {
        try {
            // TODO: Replace with actual API call to .NET backend
            // const token = AuthService.getToken();
            // const response = await fetch(`${this.apiBaseUrl}/applications`, {
            //     headers: {
            //         'Authorization': `Bearer ${token}`
            //     }
            // });
            // const applications = await response.json();
            
            // Placeholder data
            const applications = [
                {
                    id: '#12345',
                    type: 'Personal Loan',
                    amount: 72207,
                    interest: '12%',
                    startDate: '01-16-2022',
                    endDate: '01-16-2022',
                    tenure: '6 Years',
                    status: 'Pending'
                },
                {
                    id: '#12346',
                    type: 'Car Loan',
                    amount: 72207,
                    interest: '12%',
                    startDate: '01-16-2022',
                    endDate: '01-16-2022',
                    tenure: '6 Years',
                    status: 'Accepted'
                },
                {
                    id: '#12347',
                    type: 'Personal Loan',
                    amount: 72207,
                    interest: '12%',
                    startDate: '01-16-2022',
                    endDate: '01-16-2022',
                    tenure: '6 Years',
                    status: 'Pending'
                },
                {
                    id: '#12348',
                    type: 'Car Loan',
                    amount: 72207,
                    interest: '12%',
                    startDate: '01-16-2022',
                    endDate: '01-16-2022',
                    tenure: '6 Years',
                    status: 'Rejected'
                },
                {
                    id: '#12349',
                    type: 'Personal Loan',
                    amount: 72207,
                    interest: '12%',
                    startDate: '01-16-2022',
                    endDate: '01-16-2022',
                    tenure: '6 Years',
                    status: 'Pending'
                },
                {
                    id: '#12350',
                    type: 'Car Loan',
                    amount: 72207,
                    interest: '12%',
                    startDate: '01-16-2022',
                    endDate: '01-16-2022',
                    tenure: '6 Years',
                    status: 'Accepted'
                }
            ];
            
            // Update application status table
            this.updateApplicationTable(applications);
            
            // Update application profile charts
            this.updateApplicationProfile();
            
        } catch (error) {
            console.error('Error loading application data:', error);
            throw error;
        }
    },
    
    /**
     * Update application status table
     * @param {Array} applications - Array of application objects
     */
    updateApplicationTable(applications) {
        const tableBody = document.getElementById('applicationTableBody');
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        applications.forEach(app => {
            const row = document.createElement('div');
            row.className = 'table-row';
            
            row.innerHTML = `
                <div>${app.type}</div>
                <div>${app.id}</div>
                <div>₹ ${app.amount.toLocaleString()}</div>
                <div>${app.interest}</div>
                <div>${app.startDate}</div>
                <div>${app.endDate}</div>
                <div>${app.tenure}</div>
                <div><span class="status-badge status-${app.status.toLowerCase()}">${app.status}</span></div>
            `;
            
            tableBody.appendChild(row);
        });
    },
    
    /**
     * Update application profile section
     */
    updateApplicationProfile() {
        // This will be handled by the chart service
        // Update profile statistics
        const profileData = {
            carLoan: {
                percentage: 20,
                amount: 21549,
                remaining: '4 Years are remaining in pay 100% loan'
            },
            personalLoan: {
                percentage: 60,
                amount: 9540,
                remaining: '4 Years are remaining in pay 100% loan'
            }
        };
        
        // Store for chart rendering
        this.profileData = profileData;
    },
    
    /**
     * Initialize EMI Calculator
     */
    initEMICalculator() {
        const loanTypeSelect = document.getElementById('loanType');
        const loanAmountInput = document.getElementById('loanAmount');
        const loanTenureSelect = document.getElementById('loanTenure');
        const applyBtn = document.querySelector('.apply-btn');
        
        // Add event listeners for real-time calculation
        [loanTypeSelect, loanAmountInput, loanTenureSelect].forEach(element => {
            if (element) {
                element.addEventListener('change', () => this.calculateEMI());
                element.addEventListener('input', () => this.calculateEMI());
            }
        });
        
        // Apply button functionality
        if (applyBtn) {
            applyBtn.addEventListener('click', () => this.handleLoanApplication());
        }
        
        // Initial calculation
        this.calculateEMI();
    },
    
    /**
     * Calculate EMI based on current inputs
     */
    async calculateEMI() {
        try {
            const loanType = document.getElementById('loanType')?.value || 'Personal Loan';
            const loanAmount = parseFloat(document.getElementById('loanAmount')?.value) || 300000;
            const loanTenure = document.getElementById('loanTenure')?.value || '2years';
            
            // TODO: Replace with actual API call to .NET backend
            // const response = await fetch(`${this.apiBaseUrl}/calculate-emi`, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Authorization': `Bearer ${AuthService.getToken()}`
            //     },
            //     body: JSON.stringify({ loanType, loanAmount, loanTenure })
            // });
            // const calculation = await response.json();
            
            // Placeholder calculation logic
            const tenureYears = parseInt(loanTenure.replace('years', ''));
            const interestRate = this.getInterestRate(loanType);
            const monthlyRate = interestRate / 100 / 12;
            const totalMonths = tenureYears * 12;
            
            // EMI calculation formula
            const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                       (Math.pow(1 + monthlyRate, totalMonths) - 1);
            
            const totalAmount = emi * totalMonths;
            const totalInterest = totalAmount - loanAmount;
            
            // Update UI
            this.updateEMIDisplay({
                emi: Math.round(emi),
                principal: loanAmount,
                interest: Math.round(totalInterest),
                interestRate: interestRate
            });
            
            // Update chart
            if (window.ChartService) {
                window.ChartService.updateEMIChart(loanAmount, Math.round(totalInterest));
            }
            
        } catch (error) {
            console.error('EMI calculation error:', error);
        }
    },
    
    /**
     * Get interest rate based on loan type
     * @param {string} loanType - Type of loan
     * @returns {number} - Interest rate percentage
     */
    getInterestRate(loanType) {
        const rates = {
            'Personal Loan': 7.21,
            'Car Loan': 6.5,
            'Home Loan': 5.8
        };
        return rates[loanType] || 7.21;
    },
    
    /**
     * Update EMI display in UI
     * @param {Object} calculation - Calculation results
     */
    updateEMIDisplay(calculation) {
        const emiAmountElement = document.getElementById('emiAmount');
        const principalAmountElement = document.getElementById('principalAmount');
        const interestAmountElement = document.getElementById('interestAmount');
        const interestRateElement = document.getElementById('interestRate');
        
        if (emiAmountElement) {
            emiAmountElement.textContent = calculation.emi.toLocaleString();
        }
        
        if (principalAmountElement) {
            principalAmountElement.textContent = `₹ ${calculation.principal.toLocaleString()}`;
        }
        
        if (interestAmountElement) {
            interestAmountElement.textContent = `₹ ${calculation.interest.toLocaleString()}`;
        }
        
        if (interestRateElement) {
            interestRateElement.textContent = `${calculation.interestRate}%`;
        }
    },
    
    /**
     * Handle loan application submission
     */
    async handleLoanApplication() {
        try {
            const loanType = document.getElementById('loanType')?.value;
            const loanAmount = document.getElementById('loanAmount')?.value;
            const loanTenure = document.getElementById('loanTenure')?.value;
            
            if (!loanType || !loanAmount || !loanTenure) {
                this.showError('Please fill in all loan details');
                return;
            }
            
            // Show loading state
            const applyBtn = document.querySelector('.apply-btn');
            const originalText = applyBtn.textContent;
            applyBtn.textContent = 'APPLYING...';
            applyBtn.disabled = true;
            
            // TODO: Replace with actual API call to .NET backend
            // const response = await fetch(`${this.apiBaseUrl}/apply`, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Authorization': `Bearer ${AuthService.getToken()}`
            //     },
            //     body: JSON.stringify({
            //         loanType,
            //         amount: parseFloat(loanAmount),
            //         tenure: loanTenure
            //     })
            // });
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show success message
            this.showSuccess('Loan application submitted successfully! You will receive a confirmation email shortly.');
            
            // Refresh application data
            await this.loadApplicationData();
            
        } catch (error) {
            console.error('Loan application error:', error);
            this.showError('Failed to submit loan application. Please try again.');
        } finally {
            // Reset button state
            const applyBtn = document.querySelector('.apply-btn');
            applyBtn.textContent = 'APPLY NOW';
            applyBtn.disabled = false;
        }
    },
    
    /**
     * Start periodic data refresh
     */
    startDataRefresh() {
        // Refresh data every 5 minutes
        setInterval(async () => {
            try {
                await this.loadApplicationData();
            } catch (error) {
                console.error('Data refresh error:', error);
            }
        }, 5 * 60 * 1000);
    },
    
    /**
     * Show success message
     * @param {string} message - Success message
     */
    showSuccess(message) {
        if (window.appUtils) {
            window.appUtils.showMessage(message, 'success');
        }
    },
    
    /**
     * Show error message
     * @param {string} message - Error message
     */
    showError(message) {
        if (window.appUtils) {
            window.appUtils.showMessage(message, 'error');
        }
    }
};

// Initialize dashboard when called from main app
function initDashboard() {
    DashboardService.init();
}

// Export for use in other modules
window.DashboardService = DashboardService;
window.initDashboard = initDashboard;