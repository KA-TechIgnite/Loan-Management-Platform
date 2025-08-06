
        // Profile Form Management
        const editBtn = document.getElementById('editBtn');
        const saveBtn = document.getElementById('saveBtn');
        const cancelBtn = document.getElementById('cancelBtn');
        const profileForm = document.getElementById('profileForm');
        const profileSuccess = document.getElementById('profileSuccess');
        const notificationSuccess = document.getElementById('notificationSuccess');
        
        let originalValues = {};

        editBtn.addEventListener('click', () => {
            // Store original values
            const inputs = profileForm.querySelectorAll('.form-input');
            inputs.forEach(input => {
                originalValues[input.id] = input.value;
                input.disabled = false;
            });
            
            // Toggle buttons
            editBtn.style.display = 'none';
            saveBtn.style.display = 'inline-block';
            cancelBtn.style.display = 'inline-block';
        });

        saveBtn.addEventListener('click', () => {
            // Disable inputs
            const inputs = profileForm.querySelectorAll('.form-input');
            inputs.forEach(input => {
                input.disabled = true;
            });
            
            // Toggle buttons
            editBtn.style.display = 'inline-block';
            saveBtn.style.display = 'none';
            cancelBtn.style.display = 'none';
            
            // Show success message
            profileSuccess.style.display = 'block';
            setTimeout(() => {
                profileSuccess.style.display = 'none';
            }, 3000);
        });

        cancelBtn.addEventListener('click', () => {
            // Restore original values
            const inputs = profileForm.querySelectorAll('.form-input');
            inputs.forEach(input => {
                input.value = originalValues[input.id];
                input.disabled = true;
            });
            
            // Toggle buttons
            editBtn.style.display = 'inline-block';
            saveBtn.style.display = 'none';
            cancelBtn.style.display = 'none';
        });

        // Notification toggle change handler
        document.querySelectorAll('.toggle-input').forEach(toggle => {
            toggle.addEventListener('change', () => {
                notificationSuccess.style.display = 'block';
                setTimeout(() => {
                    notificationSuccess.style.display = 'none';
                }, 2000);
            });
        });

        // Account settings save
        document.getElementById('saveAccountSettings').addEventListener('click', () => {
            const button = document.getElementById('saveAccountSettings');
            const originalText = button.textContent;
            
            button.textContent = 'Saving...';
            button.disabled = true;
            
            setTimeout(() => {
                button.textContent = 'Saved!';
                button.style.backgroundColor = '#28a745';
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.backgroundColor = '#4a90e2';
                    button.disabled = false;
                }, 1500);
            }, 1000);
        });

        // Sidebar navigation highlighting
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // Password change functionality
        document.querySelector('.settings-card .btn-primary').addEventListener('click', function() {
            if (this.textContent === 'Change Password') {
                alert('Password change functionality would redirect to a secure password change form.');
            }
        });

        // Delete account confirmation
        document.querySelector('button[style*="background-color: #dc3545"]').addEventListener('click', function() {
            const confirmDelete = confirm('Are you sure you want to delete your account? This action cannot be undone.');
            if (confirmDelete) {
                alert('Account deletion process would be initiated here.');
            }
        });
    