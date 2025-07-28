/**
 * Main Application JavaScript
 * Handles page navigation, initialization, and global functionality
 */

// Global application state
const appState = {
    currentPage: 'loginPage',
    isAuthenticated: false,
    userRole: null,
    userData: null,
    selectedRole: null
};

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the application
    initApp();
});

/**
 * Initialize the application
 */
function initApp() {
    // Check if user is already authenticated (e.g., from localStorage)
    checkAuthStatus();
    
    // Initialize event listeners
    initEventListeners();
    
    // Initialize role selector
    initRoleSelector();
    
    // Initialize login form
    initLoginForm();
}

/**
 * Check authentication status
 */
function checkAuthStatus() {
    // Check localStorage for authentication status
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userRole = localStorage.getItem('userRole');
    
    if (isAuthenticated && userRole) {
        appState.isAuthenticated = true;
        appState.userRole = userRole;
        
        // Only navigate to dashboard if we're on the main page
        if (document.getElementById('loginPage') && document.getElementById('dashboardPage')) {
            navigateToDashboard();
        }
    }
}

/**
 * Initialize global event listeners
 */
function initEventListeners() {
    // Logout button
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Navigation items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all items
            navItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            item.classList.add('active');
            
            // Handle navigation (placeholder for future implementation)
            const navText = item.querySelector('span').textContent.trim();
            console.log(`Navigating to: ${navText}`);
            
            // TODO: Implement actual navigation between dashboard sections
        });
    });
}

/**
 * Initialize role selector functionality
 */
function initRoleSelector() {
    const roleOptions = document.querySelectorAll('.role-option');
    const signInBtn = document.querySelector('.sign-in-btn');
    
    roleOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove selected class from all options
            roleOptions.forEach(opt => opt.classList.remove('selected'));
            // Add selected class to clicked option
            option.classList.add('selected');
            
            // Update app state
            appState.selectedRole = option.getAttribute('data-role');
            
            // Enable sign in button if role is selected
            if (signInBtn) {
                signInBtn.disabled = false;
            }
        });
    });
}

/**
 * Initialize login form functionality
 */
function initLoginForm() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form data
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Validate form data
            if (!email || !password || !appState.selectedRole) {
                showMessage('Please fill in all fields and select a role', 'error');
                return;
            }
            
            // Show loading state
            const signInBtn = document.querySelector('.sign-in-btn');
            signInBtn.disabled = true;
            signInBtn.classList.add('loading');
            signInBtn.textContent = 'Signing In...';
            
            try {
                // Simulate API call to authenticate user
                await simulateApiCall(800); // Simulate network delay
                
                // For demo purposes, always authenticate successfully
                // In a real application, this would be an actual API call to a .NET backend
                const authResult = {
                    success: true,
                    user: {
                        name: email.split('@')[0],
                        role: appState.selectedRole,
                        token: 'demo-token-' + Math.random().toString(36).substring(2)
                    }
                };
                
                if (authResult.success) {
                    // Store authentication data
                    localStorage.setItem('isAuthenticated', 'true');
                    localStorage.setItem('userRole', authResult.user.role);
                    localStorage.setItem('userName', authResult.user.name);
                    localStorage.setItem('authToken', authResult.user.token);
                    
                    // Update app state
                    appState.isAuthenticated = true;
                    appState.userRole = authResult.user.role;
                    appState.userData = authResult.user;
                    
                    // Navigate to dashboard
                    navigateToDashboard();
                } else {
                    showMessage('Authentication failed. Please check your credentials.', 'error');
                }
            } catch (error) {
                console.error('Login error:', error);
                showMessage('An error occurred during login. Please try again.', 'error');
            } finally {
                // Reset button state
                signInBtn.disabled = false;
                signInBtn.classList.remove('loading');
                signInBtn.textContent = 'SIGN IN';
            }
        });
    }
}

/**
 * Handle logout functionality
 */
function handleLogout() {
    // Clear authentication data
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('authToken');
    
    // Reset app state
    appState.isAuthenticated = false;
    appState.userRole = null;
    appState.userData = null;
    
    // Navigate to login page
    navigateToLogin();
}

/**
 * Navigate to dashboard page
 */
function navigateToDashboard() {
    const loginPage = document.getElementById('loginPage');
    const dashboardPage = document.getElementById('dashboardPage');
    
    // Only proceed if elements exist
    if (loginPage && dashboardPage) {
        // Hide login page
        loginPage.classList.remove('active');
        
        // Show dashboard page
        dashboardPage.classList.add('active');
        
        // Update app state
        appState.currentPage = 'dashboardPage';
        
        // Initialize dashboard
        initDashboard();
    } else {
        // If we're not on the main page, redirect to dashboard
        window.location.href = 'dashboard.html';
    }
}

/**
 * Navigate to login page
 */
function navigateToLogin() {
    const loginPage = document.getElementById('loginPage');
    const dashboardPage = document.getElementById('dashboardPage');
    
    // Only proceed if elements exist
    if (loginPage && dashboardPage) {
        // Hide dashboard page
        dashboardPage.classList.remove('active');
        
        // Show login page
        loginPage.classList.add('active');
        
        // Update app state
        appState.currentPage = 'loginPage';
        
        // Reset login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.reset();
        }
        
        // Reset role selector
        const roleOptions = document.querySelectorAll('.role-option');
        roleOptions.forEach(opt => opt.classList.remove('selected'));
        
        // Disable sign in button
        const signInBtn = document.querySelector('.sign-in-btn');
        if (signInBtn) {
            signInBtn.disabled = true;
        }
    } else {
        // If we're not on the main page, redirect to index
        window.location.href = 'index.html';
    }
}

/**
 * Show message to user
 * @param {string} message - Message to display
 * @param {string} type - Message type (success, error, info)
 */
function showMessage(message, type = 'info') {
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}-message`;
    messageElement.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add to DOM
    const container = document.querySelector('.login-form-section') || document.querySelector('.main-content');
    if (container) {
        container.appendChild(messageElement);
        
        // Remove after 5 seconds
        setTimeout(() => {
            messageElement.classList.add('fade-out');
            setTimeout(() => {
                messageElement.remove();
            }, 300);
        }, 5000);
    }
}

/**
 * Simulate API call with delay
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise} - Promise that resolves after delay
 */
function simulateApiCall(ms = 1000) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Navigate to loan application page
 */
function navigateToLoanApplication() {
    window.location.href = 'loan-application.html';
}

/**
 * Export functions and state for use in other modules
 */
window.appUtils = {
    appState,
    showMessage,
    navigateToDashboard,
    navigateToLogin,
    navigateToLoanApplication,
    simulateApiCall
};

// Make navigation function globally available
window.navigateToLoanApplication = navigateToLoanApplication;