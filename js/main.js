// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeRoleSelection();
    initializeEMICalculator();
    initializeFormHandling();
    initializeProgressCircles();
    initializeDashboardInteractions();
});

// Role Selection Functionality
function initializeRoleSelection() {
    const roleButtons = document.querySelectorAll('.role-btn');
    
    roleButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            roleButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update form based on role
            updateFormForRole(this.dataset.role);
        });
    });
}

function updateFormForRole(role) {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    if (role === 'customer') {
        emailInput.value = 'customer@example.com';
        passwordInput.placeholder = 'Enter customer password';
    } else if (role === 'manager') {
        emailInput.value = 'Albertmoorie@xyz.com';
        passwordInput.placeholder = 'Enter manager password';
    }
}

// EMI Calculator Functionality
function initializeEMICalculator() {
    const calculatorForm = document.querySelector('.calculator-form');
    const loanAmountInput = calculatorForm.querySelector('input[placeholder="Loan Amount"]');
    const interestRateInput = calculatorForm.querySelector('input[placeholder="Interest Rate"]');
    const tenureInput = calculatorForm.querySelector('input[placeholder="Tenure"]');
    const emiAmount = document.querySelector('.emi-amount .amount');
    const totalPayable = document.querySelector('.total-payable span');
    
    function calculateEMI() {
        const principal = parseFloat(loanAmountInput.value) || 0;
        const rate = parseFloat(interestRateInput.value) || 0;
        const time = parseFloat(tenureInput.value) || 0;
        
        if (principal > 0 && rate > 0 && time > 0) {
            const monthlyRate = rate / 12 / 100;
            const numberOfPayments = time * 12;
            
            const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments) / 
                      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
            
            const totalAmount = emi * numberOfPayments;
            
            emiAmount.textContent = `₹${Math.round(emi).toLocaleString()}`;
            totalPayable.textContent = `Total Payable: ₹${Math.round(totalAmount).toLocaleString()}`;
        }
    }
    
    // Add event listeners for real-time calculation
    [loanAmountInput, interestRateInput, tenureInput].forEach(input => {
        input.addEventListener('input', calculateEMI);
    });
    
    // Initial calculation
    calculateEMI();
}

// Form Handling
function initializeFormHandling() {
    const loginForm = document.querySelector('.login-form');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const activeRole = document.querySelector('.role-btn.active').dataset.role;
        
        // Basic validation
        if (!email || !password) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate login process
        showNotification('Signing in...', 'info');
        
        setTimeout(() => {
            showNotification(`Welcome ${activeRole}! Login successful.`, 'success');
            
            // Redirect based on role
            setTimeout(() => {
                if (activeRole === 'customer') {
                    window.location.href = 'html/customer-dashboard.html';
                } else if (activeRole === 'manager') {
                    window.location.href = 'html/manager-dashboard.html';
                } else {
                    // For manager, stay on current page or redirect to manager dashboard
                    window.location.href = '#dashboard';
                }
            }, 1500);
        }, 1000);
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Progress Circles Animation
function initializeProgressCircles() {
    const progressCircles = document.querySelectorAll('.progress-circle');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateProgressCircle(entry.target);
            }
        });
    });
    
    progressCircles.forEach(circle => {
        observer.observe(circle);
    });
}

function animateProgressCircle(circle) {
    const progress = parseInt(circle.dataset.progress);
    const progressText = circle.querySelector('.progress-text');
    
    let currentProgress = 0;
    const interval = setInterval(() => {
        currentProgress += 1;
        progressText.textContent = `${currentProgress}%`;
        
        if (currentProgress >= progress) {
            clearInterval(interval);
        }
    }, 20);
}

// Dashboard Interactions
function initializeDashboardInteractions() {
    // Navigation items
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Show notification for navigation
            const pageName = this.querySelector('span').textContent;
            showNotification(`Navigating to ${pageName}`, 'info');
        });
    });
    
    // Apply Now button
    const applyBtn = document.querySelector('.apply-btn');
    if (applyBtn) {
        applyBtn.addEventListener('click', function() {
            showNotification('Redirecting to loan application form...', 'info');
        });
    }
    
    // Generate Report button
    const reportBtn = document.querySelector('.report-btn');
    if (reportBtn) {
        reportBtn.addEventListener('click', function() {
            showNotification('Generating credit report...', 'info');
            
            setTimeout(() => {
                showNotification('Credit report generated successfully!', 'success');
            }, 2000);
        });
    }
    
    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                showNotification(`Searching for: ${this.value}`, 'info');
            }
        });
    }
    
    // Header icons
    const headerIcons = document.querySelectorAll('.header-icons i');
    headerIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const iconClass = this.className;
            let action = '';
            
            if (iconClass.includes('fa-user')) {
                action = 'User Profile';
            } else if (iconClass.includes('fa-bell')) {
                action = 'Notifications';
            } else if (iconClass.includes('fa-cog')) {
                action = 'Settings';
            }
            
            showNotification(`Opening ${action}`, 'info');
        });
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#fee2e2' : type === 'success' ? '#d1fae5' : '#eff6ff'};
        color: ${type === 'error' ? '#dc2626' : type === 'success' ? '#059669' : '#3b82f6'};
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        max-width: 300px;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Add to page
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(amount);
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

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading states to buttons
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function() {
        if (!this.classList.contains('loading')) {
            this.classList.add('loading');
            this.style.pointerEvents = 'none';
            
            setTimeout(() => {
                this.classList.remove('loading');
                this.style.pointerEvents = 'auto';
            }, 2000);
        }
    });
});

// Add hover effects for interactive elements
document.querySelectorAll('.nav-item, .role-btn, .apply-btn, .report-btn, .signin-btn').forEach(element => {
    element.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.transition = 'transform 0.2s ease';
    });
    
    element.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

console.log('Loan Accelerator website initialized successfully!'); 