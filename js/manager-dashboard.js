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

// Add click handlers for navigation items
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');

        if (href === 'logout') {
            e.preventDefault();
            if (confirm('Are you sure you want to logout?')) {
                alert('Logout functionality would be implemented here');
            }
            return;
        }

        // Remove active class from all items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // Add active class to clicked item (except logout)
        if (!link.closest('.nav-item').classList.contains('logout')) {
            link.closest('.nav-item').classList.add('active');
        }
    });
});

// Dropdown toggle functionality
const dropdownToggles = document.querySelectorAll('.nav-item.dropdown > .nav-link');

dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const parent = toggle.parentElement;
        parent.classList.toggle('open');
    });
});























