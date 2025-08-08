// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all dashboard functionality
    initializeSidebar();
    initializeEMICalculator();
    initializeProgressCircles();
    initializeDashboardInteractions();
    initializeNotifications();
});

// Sidebar Functionality
function initializeSidebar() {
    const toggleBtn = document.querySelector('.toggle-btn');
    const sidebar = document.querySelector('.sidebar');
    const navItems = document.querySelectorAll('.nav-item');
    
    // Toggle sidebar on mobile
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            sidebar.classList.toggle('open');
        });
    }
    
    // Navigation item clicks
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

            if (pageName === 'Dashboard') {
                window.location.href = '../html/customer-dashboard.html';
            }

            if (pageName === 'Profile') {
                window.location.href = '../html/customer-profile.html';
            }

            if (pageName === 'Settings') {
                window.location.href = '../html/customer-settings.html';
            }

            if (pageName === 'Apply Loan') {
                window.location.href = '../html/customer-apply-loan.html';
            }

            // Handle logout
            if (this.classList.contains('logout')) {
                showNotification('Logging out...', 'info');
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 1000);
            }
        });
    });
}

// EMI Calculator Functionality
function initializeEMICalculator() {
    const loanAmountInput = document.querySelector('.loan-amount');
    const interestRateInput = document.querySelector('.interest-rate');
    const loanTenureSelect = document.querySelector('.loan-tenure');
    const emiAmount = document.querySelector('.emi-amount');
    const emiSummaryValues = document.querySelectorAll('.summary-item .value');
    
    function calculateEMI() {
        // Extract numeric values
        const principal = parseFloat(loanAmountInput.value.replace(/,/g, '')) || 0;
        const rate = parseFloat(interestRateInput.value.replace('%', '')) || 0;
        const time = parseInt(loanTenureSelect.value) || 0;
        
        if (principal > 0 && rate > 0 && time > 0) {
            const monthlyRate = rate / 12 / 100;
            const numberOfPayments = time * 12;
            
            const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments) / 
                      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
            
            const totalAmount = emi * numberOfPayments;
            const totalInterest = totalAmount - principal;
            
            // Update EMI display
            emiAmount.textContent = `EMI ₹${Math.round(emi).toLocaleString()}/month`;
            
            // Update summary values
            if (emiSummaryValues.length >= 2) {
                emiSummaryValues[0].textContent = `₹${Math.round(emi).toLocaleString()}`;
                emiSummaryValues[1].textContent = `₹${Math.round(totalAmount).toLocaleString()}`;
            }
            
            // Update pie chart
            updatePieChart(principal, totalInterest);
        }
    }
    
    function updatePieChart(principal, interest) {
        const pieChart = document.querySelector('.pie-chart');
        const total = principal + interest;
        const principalPercentage = (principal / total) * 100;
        const interestPercentage = (interest / total) * 100;
        
        pieChart.style.background = `conic-gradient(#f97316 0deg ${principalPercentage * 3.6}deg, #ef4444 ${principalPercentage * 3.6}deg 360deg)`;
    }
    
    // Add event listeners for real-time calculation
    [loanAmountInput, interestRateInput, loanTenureSelect].forEach(input => {
        input.addEventListener('input', calculateEMI);
        input.addEventListener('change', calculateEMI);
    });
    
    // Initial calculation
    calculateEMI();
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
    // Apply Now button
    const applyBtn = document.querySelector('.apply-btn');
    if (applyBtn) {
        applyBtn.addEventListener('click', function() {
            showNotification('Redirecting to loan application form...', 'info');
        });
    }
    
    // Generate Report button
    const generateReport = document.querySelector('.generate-report');
    if (generateReport) {
        generateReport.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Generating credit report...', 'info');
            
            setTimeout(() => {
                showNotification('Credit report generated successfully!', 'success');
            }, 2000);
        });
    }
    
    // View Report link
    const viewReportLink = document.querySelector('.view-report-link');
    if (viewReportLink) {
        viewReportLink.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Loading complete report...', 'info');
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
    
    // Top icons functionality
    const topIcons = document.querySelectorAll('.top-icons i, .top-icons .notification-icon, .top-icons .user-avatar');
    topIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const iconClass = this.className;
            let action = '';
            
            if (iconClass.includes('fa-question-circle')) {
                action = 'Help Center';
            } else if (iconClass.includes('fa-bell') || iconClass.includes('notification-icon')) {
                action = 'Notifications';
            } else if (iconClass.includes('fa-user') || iconClass.includes('user-avatar')) {
                action = 'User Profile';
            }
            
            showNotification(`Opening ${action}`, 'info');
        });
    });
}

// Notification System
function initializeNotifications() {
    // Create notification container
    const notificationContainer = document.createElement('div');
    notificationContainer.className = 'notification-container';
    notificationContainer.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        gap: 10px;
    `;
    document.body.appendChild(notificationContainer);
}

function showNotification(message, type = 'info') {
    const notificationContainer = document.querySelector('.notification-container');
    
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
        background: ${type === 'error' ? '#fee2e2' : type === 'success' ? '#d1fae5' : '#eff6ff'};
        color: ${type === 'error' ? '#dc2626' : type === 'success' ? '#059669' : '#3b82f6'};
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        max-width: 300px;
        animation: slideIn 0.3s ease-out;
        border-left: 4px solid ${type === 'error' ? '#dc2626' : type === 'success' ? '#059669' : '#3b82f6'};
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
    
    // Add to container
    notificationContainer.appendChild(notification);
    
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
document.querySelectorAll('.nav-item, .apply-btn, .generate-report, .view-report-link, .top-icons i, .top-icons .notification-icon, .top-icons .user-avatar').forEach(element => {
    element.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.transition = 'transform 0.2s ease';
    });
    
    element.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

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

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('.search-bar input');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // Escape to close sidebar on mobile
    if (e.key === 'Escape') {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
        }
    }
});

console.log('Customer Dashboard initialized successfully!'); 