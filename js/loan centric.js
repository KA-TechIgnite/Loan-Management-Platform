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

// Add click handlers for view details buttons
const viewDetailsButtons = document.querySelectorAll('.view-details-btn');

viewDetailsButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const loanCard = e.target.closest('.loan-card');
        const loanTitle = loanCard.querySelector('.loan-title').textContent;
        
        // Add some visual feedback
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
        
        // Here you would typically navigate to a detailed view
        // For now, we'll show an alert
        alert(`Viewing details for ${loanTitle}`);
    });
});

// Add hover effects for loan cards
const loanCards = document.querySelectorAll('.loan-card');

loanCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Navigation handling
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        if (href === '#' && link.closest('.nav-item').classList.contains('logout')) {
            e.preventDefault();
            if (confirm('Are you sure you want to logout?')) {
                alert('Logout functionality would be implemented here');
            }
            return;
        }
        
        if (href === '#' && link.closest('.nav-item').classList.contains('dropdown')) {
            return; // Let dropdown handler manage this
        }
    });
});