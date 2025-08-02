
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('mainContent');
const toggleBtn = document.getElementById('toggleBtn');

// Toggle Sidebar
toggleBtn.addEventListener('click', () => {
    if (window.innerWidth > 1024) {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
    } else {
        sidebar.classList.toggle('mobile-open');
    }
});

// Close sidebar on mobile when clicking outside
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 1024 && 
        !sidebar.contains(e.target) && 
        !toggleBtn.contains(e.target) &&
        sidebar.classList.contains('mobile-open')) {
        sidebar.classList.remove('mobile-open');
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) {
        sidebar.classList.remove('mobile-open');
    }
    if (window.innerWidth <= 1024) {
        sidebar.classList.remove('collapsed');
        mainContent.classList.remove('expanded');
    }
});

// Dropdown toggle functionality
const dropdownItems = document.querySelectorAll('.nav-item.dropdown');

dropdownItems.forEach(item => {
    const link = item.querySelector('.nav-link');
    link.addEventListener('click', (e) => {
        e.preventDefault();
        item.classList.toggle('open');
    });
});

// Charts initialization
document.addEventListener('DOMContentLoaded', function() {
    // Loan Type Distribution Chart (Donut)
    const loanTypeCtx = document.getElementById('loanTypeChart').getContext('2d');
    const loanTypeData = {
        labels: ['Credit Card Loans', 'Personal Loans', 'Housing Loan', 'Debt Consolidation Loan', 'Consumer Loan', 'Small Business Loan', 'Vehicle Loans', 'Medical Loans'],
        datasets: [{
            data: [48, 40, 30, 45, 25, 15, 10, 50],
            backgroundColor: [
                '#b19cd9',
                '#4f7cff',
                '#45b7d1',
                '#ff9ff3',
                '#ff6b6b',
                '#feca57',
                '#96ceb4',
                '#4ecdc4'
            ],
            borderWidth: 0,
            cutout: '60%'
        }]
    };

    new Chart(loanTypeCtx, {
        type: 'doughnut',
        data: loanTypeData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    // Create custom legend for loan types
    const loanTypeLegend = document.getElementById('loanTypeLegend');
    const loanTypeLabels = ['Credit Card Loans (48%)', 'Personal Loans (40%)', 'Housing Loan (30%)', 'Debt Consolidation Loan (45%)', 'Consumer Loan (25%)', 'Small Business Loan (15%)', 'Vehicle Loans (10%)', 'Medical Loans (50%)'];
    const loanTypeColors = ['#b19cd9', '#4f7cff', '#45b7d1', '#ff9ff3', '#ff6b6b', '#feca57', '#96ceb4', '#4ecdc4'];

    loanTypeLabels.forEach((label, index) => {
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        legendItem.innerHTML = `
            <div class="legend-color" style="background: ${loanTypeColors[index]};"></div>
            <span>${label}</span>
        `;
        loanTypeLegend.appendChild(legendItem);
    });

    // State Distribution Chart (Pie)
    const stateCtx = document.getElementById('stateChart').getContext('2d');
    const stateData = {
        labels: ['CA', 'NY', 'TX', 'FL', 'WA', 'IL', 'PA', 'OH', 'GA'],
        datasets: [{
            data: [3.80, 25.60, 19.67, 30, 15, 40, 36.70, 38.9, 20.60],
            backgroundColor: [
                '#4f7cff',
                '#7b68ee',
                '#ff6b6b',
                '#4ecdc4',
                '#45b7d1',
                '#96ceb4',
                '#feca57',
                '#ff9ff3',
                '#54a0ff'
            ],
            borderWidth: 2,
            borderColor: '#fff'
        }]
    };

    new Chart(stateCtx, {
        type: 'pie',
        data: stateData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    // Monthly Loan Distribution Chart
    const monthlyCtx = document.getElementById('monthlyChart').getContext('2d');
    const monthlyData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
            type: 'bar',
            label: 'Distribution',
            data: [36, 47, 56, 37, 42, 39, 53, 52, 40, 43, 40, 53],
            backgroundColor: 'rgba(79, 124, 255, 0.3)',
            borderColor: 'rgba(79, 124, 255, 0.8)',
            borderWidth: 1
        }, {
            type: 'line',
            label: 'Trend',
            data: [36, 47, 56, 37, 42, 39, 53, 52, 40, 43, 40, 53],
            borderColor: '#4f7cff',
            backgroundColor: 'transparent',
            borderWidth: 2,
            pointBackgroundColor: '#4f7cff',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4,
            fill: false
        }]
    };

    new Chart(monthlyCtx, {
        type: 'bar',
        data: monthlyData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 70,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    // Loan Engagement Chart
    const engagementCtx = document.getElementById('engagementChart').getContext('2d');
    const engagementData = {
        labels: ['8', '9', '10', '11', '12', '13', '14'],
        datasets: [{
            label: 'Loan Count',
            data: [2, 3, 2, 6, 12, 14, 11],
            backgroundColor: '#4f7cff',
            borderColor: '#4f7cff',
            borderWidth: 1
        }]
    };

    new Chart(engagementCtx, {
        type: 'bar',
        data: engagementData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 16,
                    title: {
                        display: true,
                        text: 'Loan Count'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Days'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
});
