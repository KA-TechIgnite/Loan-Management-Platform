/**
 * API Service Module
 * Handles all API communications with .NET backend
 */

// API Configuration
const API_CONFIG = {
    baseUrl: 'https://localhost:5001/api',
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000
};

// API Service for handling all backend communications
const ApiService = {
    /**
     * Make HTTP request with error handling and retry logic
     * @param {string} endpoint - API endpoint
     * @param {Object} options - Request options
     * @returns {Promise<Object>} - Response data
     */
    async request(endpoint, options = {}) {
        const url = `${API_CONFIG.baseUrl}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            timeout: API_CONFIG.timeout,
            ...options
        };

        // Add authentication token if available
        const token = this.getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        let lastError;
        
        // Retry logic
        for (let attempt = 1; attempt <= API_CONFIG.retryAttempts; attempt++) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), config.timeout);
                
                const response = await fetch(url, {
                    ...config,
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const data = await response.json();
                return data;
                
            } catch (error) {
                lastError = error;
                console.warn(`API request attempt ${attempt} failed:`, error.message);
                
                // Don't retry on authentication errors or client errors (4xx)
                if (error.message.includes('401') || error.message.includes('403') || 
                    error.message.includes('400') || error.message.includes('404')) {
                    break;
                }
                
                // Wait before retrying (except on last attempt)
                if (attempt < API_CONFIG.retryAttempts) {
                    await this.delay(API_CONFIG.retryDelay * attempt);
                }
            }
        }
        
        throw lastError;
    },

    /**
     * Authentication endpoints
     */
    auth: {
        /**
         * Login user
         * @param {Object} credentials - Login credentials
         * @returns {Promise<Object>} - Login response
         */
        async login(credentials) {
            return await ApiService.request('/auth/login', {
                method: 'POST',
                body: JSON.stringify(credentials)
            });
        },

        /**
         * Logout user
         * @returns {Promise<Object>} - Logout response
         */
        async logout() {
            return await ApiService.request('/auth/logout', {
                method: 'POST'
            });
        },

        /**
         * Refresh authentication token
         * @param {string} refreshToken - Refresh token
         * @returns {Promise<Object>} - Refresh response
         */
        async refreshToken(refreshToken) {
            return await ApiService.request('/auth/refresh', {
                method: 'POST',
                body: JSON.stringify({ refreshToken })
            });
        },

        /**
         * Validate current session
         * @returns {Promise<Object>} - Validation response
         */
        async validateSession() {
            return await ApiService.request('/auth/validate', {
                method: 'GET'
            });
        }
    },

    /**
     * User management endpoints
     */
    user: {
        /**
         * Get user profile
         * @returns {Promise<Object>} - User profile data
         */
        async getProfile() {
            return await ApiService.request('/user/profile', {
                method: 'GET'
            });
        },

        /**
         * Update user profile
         * @param {Object} profileData - Profile data to update
         * @returns {Promise<Object>} - Update response
         */
        async updateProfile(profileData) {
            return await ApiService.request('/user/profile', {
                method: 'PUT',
                body: JSON.stringify(profileData)
            });
        },

        /**
         * Get user dashboard data
         * @returns {Promise<Object>} - Dashboard data
         */
        async getDashboardData() {
            return await ApiService.request('/user/dashboard', {
                method: 'GET'
            });
        }
    },

    /**
     * Loan management endpoints
     */
    loans: {
        /**
         * Calculate EMI
         * @param {Object} loanData - Loan calculation parameters
         * @returns {Promise<Object>} - EMI calculation result
         */
        async calculateEMI(loanData) {
            return await ApiService.request('/loans/calculate-emi', {
                method: 'POST',
                body: JSON.stringify(loanData)
            });
        },

        /**
         * Check loan eligibility
         * @param {Object} eligibilityData - Eligibility check parameters
         * @returns {Promise<Object>} - Eligibility result
         */
        async checkEligibility(eligibilityData) {
            return await ApiService.request('/loans/eligibility', {
                method: 'POST',
                body: JSON.stringify(eligibilityData)
            });
        },

        /**
         * Get loan types
         * @returns {Promise<Array>} - Available loan types
         */
        async getLoanTypes() {
            return await ApiService.request('/loans/types', {
                method: 'GET'
            });
        },

        /**
         * Get interest rates
         * @returns {Promise<Object>} - Current interest rates
         */
        async getInterestRates() {
            return await ApiService.request('/loans/interest-rates', {
                method: 'GET'
            });
        }
    },

    /**
     * Application management endpoints
     */
    applications: {
        /**
         * Submit loan application
         * @param {Object} applicationData - Application data
         * @returns {Promise<Object>} - Application submission result
         */
        async submit(applicationData) {
            return await ApiService.request('/applications', {
                method: 'POST',
                body: JSON.stringify(applicationData)
            });
        },

        /**
         * Get user applications
         * @param {Object} filters - Optional filters
         * @returns {Promise<Array>} - User applications
         */
        async getAll(filters = {}) {
            const queryParams = new URLSearchParams(filters).toString();
            const endpoint = queryParams ? `/applications?${queryParams}` : '/applications';
            
            return await ApiService.request(endpoint, {
                method: 'GET'
            });
        },

        /**
         * Get application by ID
         * @param {string} applicationId - Application ID
         * @returns {Promise<Object>} - Application details
         */
        async getById(applicationId) {
            return await ApiService.request(`/applications/${applicationId}`, {
                method: 'GET'
            });
        },

        /**
         * Update application status (Manager only)
         * @param {string} applicationId - Application ID
         * @param {string} status - New status
         * @param {string} comments - Optional comments
         * @returns {Promise<Object>} - Update result
         */
        async updateStatus(applicationId, status, comments = '') {
            return await ApiService.request(`/applications/${applicationId}/status`, {
                method: 'PATCH',
                body: JSON.stringify({ status, comments })
            });
        },

        /**
         * Cancel application
         * @param {string} applicationId - Application ID
         * @returns {Promise<Object>} - Cancellation result
         */
        async cancel(applicationId) {
            return await ApiService.request(`/applications/${applicationId}/cancel`, {
                method: 'POST'
            });
        }
    },

    /**
     * Document management endpoints
     */
    documents: {
        /**
         * Upload document
         * @param {File} file - File to upload
         * @param {string} documentType - Type of document
         * @param {string} applicationId - Associated application ID
         * @returns {Promise<Object>} - Upload result
         */
        async upload(file, documentType, applicationId) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('documentType', documentType);
            formData.append('applicationId', applicationId);

            return await ApiService.request('/documents/upload', {
                method: 'POST',
                body: formData,
                headers: {} // Remove Content-Type to let browser set it for FormData
            });
        },

        /**
         * Get documents for application
         * @param {string} applicationId - Application ID
         * @returns {Promise<Array>} - Document list
         */
        async getByApplication(applicationId) {
            return await ApiService.request(`/documents/application/${applicationId}`, {
                method: 'GET'
            });
        },

        /**
         * Download document
         * @param {string} documentId - Document ID
         * @returns {Promise<Blob>} - Document blob
         */
        async download(documentId) {
            const response = await fetch(`${API_CONFIG.baseUrl}/documents/${documentId}/download`, {
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`
                }
            });
            
            if (!response.ok) {
                throw new Error(`Download failed: ${response.statusText}`);
            }
            
            return await response.blob();
        }
    },

    /**
     * Reports and analytics endpoints
     */
    reports: {
        /**
         * Get credit report
         * @returns {Promise<Object>} - Credit report data
         */
        async getCreditReport() {
            return await ApiService.request('/reports/credit', {
                method: 'GET'
            });
        },

        /**
         * Get application analytics (Manager only)
         * @param {Object} filters - Date range and other filters
         * @returns {Promise<Object>} - Analytics data
         */
        async getApplicationAnalytics(filters = {}) {
            const queryParams = new URLSearchParams(filters).toString();
            const endpoint = queryParams ? `/reports/analytics?${queryParams}` : '/reports/analytics';
            
            return await ApiService.request(endpoint, {
                method: 'GET'
            });
        }
    },

    /**
     * Utility methods
     */

    /**
     * Get authentication token from storage
     * @returns {string|null} - Auth token
     */
    getAuthToken() {
        return localStorage.getItem('authToken');
    },

    /**
     * Set authentication token
     * @param {string} token - Auth token
     */
    setAuthToken(token) {
        localStorage.setItem('authToken', token);
    },

    /**
     * Clear authentication token
     */
    clearAuthToken() {
        localStorage.removeItem('authToken');
    },

    /**
     * Delay execution
     * @param {number} ms - Milliseconds to delay
     * @returns {Promise} - Promise that resolves after delay
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * Handle API errors globally
     * @param {Error} error - Error object
     * @param {string} context - Context where error occurred
     */
    handleError(error, context = 'API Request') {
        console.error(`${context} Error:`, error);
        
        // Handle specific error types
        if (error.message.includes('401')) {
            // Unauthorized - redirect to login
            this.clearAuthToken();
            if (window.appUtils) {
                window.appUtils.navigateToLogin();
            }
        } else if (error.message.includes('403')) {
            // Forbidden - show permission error
            if (window.appUtils) {
                window.appUtils.showMessage('You do not have permission to perform this action.', 'error');
            }
        } else if (error.message.includes('500')) {
            // Server error
            if (window.appUtils) {
                window.appUtils.showMessage('Server error occurred. Please try again later.', 'error');
            }
        } else if (error.name === 'AbortError') {
            // Request timeout
            if (window.appUtils) {
                window.appUtils.showMessage('Request timed out. Please check your connection.', 'error');
            }
        } else {
            // Generic error
            if (window.appUtils) {
                window.appUtils.showMessage('An unexpected error occurred. Please try again.', 'error');
            }
        }
    },

    /**
     * Check if online
     * @returns {boolean} - Online status
     */
    isOnline() {
        return navigator.onLine;
    },

    /**
     * Setup offline/online event listeners
     */
    setupNetworkListeners() {
        window.addEventListener('online', () => {
            console.log('Connection restored');
            if (window.appUtils) {
                window.appUtils.showMessage('Connection restored', 'success');
            }
        });

        window.addEventListener('offline', () => {
            console.log('Connection lost');
            if (window.appUtils) {
                window.appUtils.showMessage('Connection lost. Some features may not work.', 'warning');
            }
        });
    }
};

// Initialize network listeners
ApiService.setupNetworkListeners();

// Export for use in other modules
window.ApiService = ApiService;

// Example usage and integration points for .NET backend:
/*

// 1. Authentication Integration
const loginResult = await ApiService.auth.login({
    email: 'user@example.com',
    password: 'password123',
    role: 'customer'
});

// 2. Loan Calculation Integration
const emiResult = await ApiService.loans.calculateEMI({
    loanType: 'Personal Loan',
    amount: 300000,
    tenure: 24, // months
    interestRate: 7.21
});

// 3. Application Submission Integration
const applicationResult = await ApiService.applications.submit({
    loanType: 'Personal Loan',
    amount: 300000,
    tenure: 24,
    purpose: 'Home renovation',
    documents: ['income_proof', 'identity_proof']
});

// 4. Document Upload Integration
const uploadResult = await ApiService.documents.upload(
    fileInput.files[0],
    'income_proof',
    'APP123456'
);

*/