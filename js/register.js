// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeRegistrationForm();
    initializePasswordToggles();
    initializeFormValidation();
});

// Registration Form Handling
function initializeRegistrationForm() {
    const form = document.getElementById('registerForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            handleRegistration();
        }
    });
}

// Password Toggle Functionality
function initializePasswordToggles() {
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const type = input.type === 'password' ? 'text' : 'password';
            input.type = type;
            
            // Update icon
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    });
}

// Form Validation
function initializeFormValidation() {
    const inputs = document.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

function validateForm() {
    const form = document.getElementById('registerForm');
    const inputs = form.querySelectorAll('input, textarea');
    let isValid = true;
    
    // Clear previous errors
    clearAllErrors();
    
    // Validate each field
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    // Validate password match
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    
    if (password.value !== confirmPassword.value) {
        showFieldError(confirmPassword, 'Passwords do not match');
        isValid = false;
    }
    
    // Validate terms checkbox
    const termsCheckbox = document.getElementById('terms');
    if (!termsCheckbox.checked) {
        showFieldError(termsCheckbox, 'You must agree to the terms and conditions');
        isValid = false;
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, `${getFieldLabel(field)} is required`);
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Phone validation
    if (fieldName === 'phone' && value) {
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(value.replace(/\D/g, ''))) {
            showFieldError(field, 'Please enter a valid 10-digit phone number');
            return false;
        }
    }
    
    // PIN code validation
    if (fieldName === 'pincode' && value) {
        const pincodeRegex = /^[0-9]{6}$/;
        if (!pincodeRegex.test(value)) {
            showFieldError(field, 'Please enter a valid 6-digit PIN code');
            return false;
        }
    }
    
    // Password validation
    if (fieldName === 'password' && value) {
        if (value.length < 8) {
            showFieldError(field, 'Password must be at least 8 characters long');
            return false;
        }
        
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
        if (!passwordRegex.test(value)) {
            showFieldError(field, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
            return false;
        }
    }
    
    // Date of birth validation
    if (fieldName === 'dateOfBirth' && value) {
        const birthDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        
        if (age < 18) {
            showFieldError(field, 'You must be at least 18 years old');
            return false;
        }
    }
    
    return true;
}

function getFieldLabel(field) {
    const label = field.previousElementSibling;
    return label ? label.textContent : field.name;
}

function showFieldError(field, message) {
    // Remove existing error
    clearFieldError(field);
    
    // Add error class
    field.classList.add('error');
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #dc2626;
        font-size: 0.8rem;
        margin-top: 0.25rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
    `;
    
    // Add error icon
    const icon = document.createElement('i');
    icon.className = 'fas fa-exclamation-circle';
    errorDiv.insertBefore(icon, errorDiv.firstChild);
    
    // Insert after the field
    field.parentNode.insertBefore(errorDiv, field.nextSibling);
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function clearAllErrors() {
    const errorDivs = document.querySelectorAll('.field-error');
    errorDivs.forEach(div => div.remove());
    
    const errorFields = document.querySelectorAll('.error');
    errorFields.forEach(field => field.classList.remove('error'));
}

// Registration Handling
function handleRegistration() {
    const form = document.getElementById('registerForm');
    const submitBtn = form.querySelector('.auth-btn');
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Simulate successful registration
        showSuccessMessage('Account created successfully! Redirecting to login...');
        
        // Store user data (in real app, this would be sent to server)
        const formData = new FormData(form);
        const userData = Object.fromEntries(formData);
        
        // Store in localStorage for demo purposes
        localStorage.setItem('registeredUser', JSON.stringify(userData));
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 2000);
        
    }, 1500);
}

function showSuccessMessage(message) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.success-message, .error-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create success message
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    // Insert at the top of the form
    const form = document.getElementById('registerForm');
    form.insertBefore(successDiv, form.firstChild);
}

function showErrorMessage(message) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.success-message, .error-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
    `;
    
    // Insert at the top of the form
    const form = document.getElementById('registerForm');
    form.insertBefore(errorDiv, form.firstChild);
}

// Utility Functions
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 10) {
        value = value.slice(0, 10);
    }
    input.value = value;
}

function formatPincode(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 6) {
        value = value.slice(0, 6);
    }
    input.value = value;
}

// Add input formatting
document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('phone');
    const pincodeInput = document.getElementById('pincode');
    
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            formatPhoneNumber(this);
        });
    }
    
    if (pincodeInput) {
        pincodeInput.addEventListener('input', function() {
            formatPincode(this);
        });
    }
});

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to submit form
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        const form = document.getElementById('registerForm');
        if (form) {
            form.dispatchEvent(new Event('submit'));
        }
    }
});

console.log('Registration page initialized successfully!'); 