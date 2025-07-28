/**
 * Charts Module
 * Handles all chart visualizations using Chart.js
 */

// Chart service for managing all dashboard charts
const ChartService = {
    charts: {},
    
    /**
     * Initialize all charts in the dashboard
     */
    initAllCharts() {
        this.initEMIChart();
        this.initEligibilityScoreGauge();
        this.initProfileCharts();
    },
    
    /**
     * Initialize EMI Calculator Donut Chart
     */
    initEMIChart() {
        const canvas = document.getElementById('emiChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Destroy existing chart if it exists
        if (this.charts.emiChart) {
            this.charts.emiChart.destroy();
        }
        
        this.charts.emiChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Principal', 'Interest'],
                datasets: [{
                    data: [72207, 66207],
                    backgroundColor: [
                        '#4285f4',
                        '#ea4335'
                    ],
                    borderWidth: 0,
                    cutout: '70%'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed;
                                return `${label}: ₹${value.toLocaleString()}`;
                            }
                        }
                    }
                },
                elements: {
                    arc: {
                        borderWidth: 0
                    }
                }
            }
        });
    },
    
    /**
     * Update EMI Chart with new data
     * @param {number} principal - Principal amount
     * @param {number} interest - Interest amount
     */
    updateEMIChart(principal, interest) {
        if (this.charts.emiChart) {
            this.charts.emiChart.data.datasets[0].data = [principal, interest];
            this.charts.emiChart.update();
        }
    },
    
    /**
     * Initialize Eligibility Score Gauge Chart
     */
    initEligibilityScoreGauge() {
        const canvas = document.getElementById('scoreGauge');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Destroy existing chart if it exists
        if (this.charts.scoreGauge) {
            this.charts.scoreGauge.destroy();
        }
        
        const score = 750;
        const maxScore = 850;
        const percentage = (score / maxScore) * 100;
        
        this.charts.scoreGauge = new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [percentage, 100 - percentage],
                    backgroundColor: [
                        this.getScoreColor(score),
                        '#e8eaed'
                    ],
                    borderWidth: 0,
                    cutout: '80%',
                    circumference: 180,
                    rotation: 270
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: false
                    }
                }
            }
        });
    },
    
    /**
     * Update Eligibility Score Gauge
     * @param {number} score - Credit score
     */
    updateScoreGauge(score) {
        if (this.charts.scoreGauge) {
            const maxScore = 850;
            const percentage = (score / maxScore) * 100;
            
            this.charts.scoreGauge.data.datasets[0].data = [percentage, 100 - percentage];
            this.charts.scoreGauge.data.datasets[0].backgroundColor[0] = this.getScoreColor(score);
            this.charts.scoreGauge.update();
            
            // Update score display
            const scoreValueElement = document.getElementById('scoreValue');
            if (scoreValueElement) {
                scoreValueElement.textContent = score;
            }
        }
    },
    
    /**
     * Get color based on credit score
     * @param {number} score - Credit score
     * @returns {string} - Color hex code
     */
    getScoreColor(score) {
        if (score >= 750) return '#34a853'; // Excellent - Green
        if (score >= 700) return '#fbbc04'; // Good - Yellow
        if (score >= 650) return '#ff9800'; // Fair - Orange
        return '#ea4335'; // Poor - Red
    },
    
    /**
     * Initialize Application Profile Charts
     */
    initProfileCharts() {
        this.initProfileChart1();
        this.initProfileChart2();
    },
    
    /**
     * Initialize Car Loan Profile Chart
     */
    initProfileChart1() {
        const canvas = document.getElementById('profileChart1');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Destroy existing chart if it exists
        if (this.charts.profileChart1) {
            this.charts.profileChart1.destroy();
        }
        
        const percentage = 20;
        
        this.charts.profileChart1 = new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [percentage, 100 - percentage],
                    backgroundColor: [
                        '#ff9800',
                        '#e8eaed'
                    ],
                    borderWidth: 0,
                    cutout: '70%'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Car Loan: ${context.parsed}%`;
                            }
                        }
                    }
                }
            }
        });
    },
    
    /**
     * Initialize Personal Loan Profile Chart
     */
    initProfileChart2() {
        const canvas = document.getElementById('profileChart2');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Destroy existing chart if it exists
        if (this.charts.profileChart2) {
            this.charts.profileChart2.destroy();
        }
        
        const percentage = 60;
        
        this.charts.profileChart2 = new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [percentage, 100 - percentage],
                    backgroundColor: [
                        '#ff9800',
                        '#e8eaed'
                    ],
                    borderWidth: 0,
                    cutout: '70%'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Personal Loan: ${context.parsed}%`;
                            }
                        }
                    }
                }
            }
        });
    },
    
    /**
     * Update Profile Charts with new data
     * @param {Object} profileData - Profile data object
     */
    updateProfileCharts(profileData) {
        if (profileData.carLoan && this.charts.profileChart1) {
            const percentage = profileData.carLoan.percentage;
            this.charts.profileChart1.data.datasets[0].data = [percentage, 100 - percentage];
            this.charts.profileChart1.update();
        }
        
        if (profileData.personalLoan && this.charts.profileChart2) {
            const percentage = profileData.personalLoan.percentage;
            this.charts.profileChart2.data.datasets[0].data = [percentage, 100 - percentage];
            this.charts.profileChart2.update();
        }
    },
    
    /**
     * Create a simple line chart for trends
     * @param {string} canvasId - Canvas element ID
     * @param {Array} data - Chart data
     * @param {Array} labels - Chart labels
     * @param {string} color - Chart color
     */
    createLineChart(canvasId, data, labels, color = '#4285f4') {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Destroy existing chart if it exists
        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }
        
        this.charts[canvasId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    borderColor: color,
                    backgroundColor: color + '20',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: color,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        grid: {
                            color: '#e8eaed'
                        }
                    }
                }
            }
        });
    },
    
    /**
     * Create a bar chart
     * @param {string} canvasId - Canvas element ID
     * @param {Array} data - Chart data
     * @param {Array} labels - Chart labels
     * @param {string} color - Chart color
     */
    createBarChart(canvasId, data, labels, color = '#4285f4') {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Destroy existing chart if it exists
        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }
        
        this.charts[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: color,
                    borderColor: color,
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        grid: {
                            color: '#e8eaed'
                        },
                        beginAtZero: true
                    }
                }
            }
        });
    },
    
    /**
     * Destroy all charts
     */
    destroyAllCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        this.charts = {};
    },
    
    /**
     * Resize all charts (useful for responsive design)
     */
    resizeAllCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.resize === 'function') {
                chart.resize();
            }
        });
    },
    
    /**
     * Update chart theme (for dark/light mode)
     * @param {string} theme - Theme name ('light' or 'dark')
     */
    updateTheme(theme) {
        const textColor = theme === 'dark' ? '#ffffff' : '#333333';
        const gridColor = theme === 'dark' ? '#444444' : '#e8eaed';
        
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.options) {
                // Update text colors
                if (chart.options.scales) {
                    Object.values(chart.options.scales).forEach(scale => {
                        if (scale.ticks) {
                            scale.ticks.color = textColor;
                        }
                        if (scale.grid) {
                            scale.grid.color = gridColor;
                        }
                    });
                }
                
                chart.update();
            }
        });
    }
};

// Animation utilities for charts
const ChartAnimations = {
    /**
     * Animate number counting up
     * @param {HTMLElement} element - Element to animate
     * @param {number} start - Start value
     * @param {number} end - End value
     * @param {number} duration - Animation duration in ms
     */
    animateNumber(element, start, end, duration = 1000) {
        if (!element) return;
        
        const startTime = performance.now();
        const difference = end - start;
        
        function updateNumber(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            
            const current = Math.round(start + (difference * easeOut));
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            }
        }
        
        requestAnimationFrame(updateNumber);
    },
    
    /**
     * Animate chart appearance
     * @param {Chart} chart - Chart.js instance
     */
    animateChartAppearance(chart) {
        if (!chart) return;
        
        chart.options.animation = {
            duration: 1000,
            easing: 'easeOutQuart'
        };
        
        chart.update();
    }
};

// Handle window resize for chart responsiveness
window.addEventListener('resize', () => {
    ChartService.resizeAllCharts();
});

// Export for use in other modules
window.ChartService = ChartService;
window.ChartAnimations = ChartAnimations;

// Initialize charts when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Charts will be initialized when dashboard loads
    // This ensures Chart.js is loaded first
});