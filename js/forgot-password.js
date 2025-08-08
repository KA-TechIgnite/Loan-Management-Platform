// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeForgotPasswordForm();
    initializeFormValidation();
});

// Forgot Password Form Handling
function initializeForgotPasswordForm() {
    const form = document.getElementById('forgotPasswordForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            handlePasswordReset();
        }
    });
}

// Form Validation
function initializeFormValidation() {
    const emailInput = document.getElementById('email');
    
    emailInput.addEventListener('blur', function() {
        validateEmail(this);
    });
    
    emailInput.addEventListener('input', function() {
        clearFieldError(this);
    });
}

function validateForm() {
    const emailInput = document.getElementById('email');
    let isValid = true;
    
    // Clear previous errors
    clearAllErrors();
    
    // Validate email
    if (!validateEmail(emailInput)) {
        isValid = false;
    }
    
    return isValid;
}

function validateEmail(field) {
    const value = field.value.trim();
    
    // Required field validation
    if (!value) {
        showFieldError(field, 'Email address is required');
        return false;
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
        showFieldError(field, 'Please enter a valid email address');
        return false;
    }
    
    return true;
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

// Password Reset Handling
function handlePasswordReset() {
    const form = document.getElementById('forgotPasswordForm');
    const submitBtn = form.querySelector('.auth-btn');
    const emailInput = document.getElementById('email');
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Simulate successful password reset request
        showSuccessMessage(`Password reset link sent to ${emailInput.value}! Please check your email.`);
        
        // Store reset request (in real app, this would be sent to server)
        const resetData = {
            email: emailInput.value,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('passwordResetRequest', JSON.stringify(resetData));
        
        // Update button text
        submitBtn.textContent = 'LINK SENT';
        submitBtn.style.background = '#10b981';
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 3000);
        
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
    const form = document.getElementById('forgotPasswordForm');
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
    const form = document.getElementById('forgotPasswordForm');
    form.insertBefore(errorDiv, form.firstChild);
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to submit form
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        const form = document.getElementById('forgotPasswordForm');
        if (form) {
            form.dispatchEvent(new Event('submit'));
        }
    }
    
    // Escape to go back
    if (e.key === 'Escape') {
        window.history.back();
    }
});

console.log('Forgot password page initialized successfully!'); 