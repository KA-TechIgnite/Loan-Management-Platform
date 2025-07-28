// Loan Application JavaScript

// Global state for loan application
let loanApplicationState = {
    selectedCategory: null,
    loanDetails: {},
    documents: {},
    personalInfo: {},
    addressInfo: {},
    employmentDetails: {},
    financialInfo: {},
    familyDetails: {},
    declaration: {},
    currentPage: 'loan-category',
    currentStep: 1,
    currentSubStep: 'personal-info'
};

// Initialize loan application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeLoanApplication();
});

function initializeLoanApplication() {
    // Initialize loan category selection
    initializeLoanCategories();
    
    // Initialize form handlers
    initializeFormHandlers();
    
    // Initialize file upload handlers
    initializeFileUploads();
    
    // Initialize tab handlers
    initializeTabs();
    
    // Initialize personal info navigation
    initializePersonalInfoNavigation();
    
    // Set default date for applied date
    const appliedDateInput = document.getElementById('appliedDate');
    if (appliedDateInput) {
        appliedDateInput.value = new Date().toISOString().split('T')[0];
    }
}

// Loan Category Selection
function initializeLoanCategories() {
    const categories = document.querySelectorAll('.loan-category');
    
    categories.forEach(category => {
        category.addEventListener('click', function() {
            // Remove previous selection
            categories.forEach(cat => cat.classList.remove('selected'));
            
            // Add selection to clicked category
            this.classList.add('selected');
            
            // Store selected category
            loanApplicationState.selectedCategory = this.dataset.category;
            
            // Update summary display
            const categoryDisplay = document.getElementById('selectedCategoryDisplay');
            if (categoryDisplay) {
                const categoryName = this.querySelector('span').textContent;
                categoryDisplay.textContent = categoryName;
            }
            
            // Enable next button
            const nextBtn = document.querySelector('.next-btn');
            if (nextBtn) {
                nextBtn.disabled = false;
            }
        });
    });
}

// Form Handlers
function initializeFormHandlers() {
    // Loan details form
    const loanDetailsForm = document.querySelector('.loan-details-form');
    if (loanDetailsForm) {
        const inputs = loanDetailsForm.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('change', updateLoanDetailsSummary);
            input.addEventListener('input', updateLoanDetailsSummary);
        });
    }
    
    // Personal info form
    const personalInfoForm = document.querySelector('.personal-info-form');
    if (personalInfoForm) {
        const inputs = personalInfoForm.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('change', updatePersonalInfoSummary);
            input.addEventListener('input', updatePersonalInfoSummary);
        });
    }
    
    // Address info form
    const addressInfoForm = document.querySelector('.address-info-form');
    if (addressInfoForm) {
        const inputs = addressInfoForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('change', updateAddressInfoSummary);
            input.addEventListener('input', updateAddressInfoSummary);
        });
    }
    
    // Employment form
    const employmentForm = document.querySelector('.employment-form');
    if (employmentForm) {
        const inputs = employmentForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('change', updateEmploymentSummary);
            input.addEventListener('input', updateEmploymentSummary);
        });
    }
    
    // Financial form
    const financialForm = document.querySelector('.financial-form');
    if (financialForm) {
        const inputs = financialForm.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('change', updateFinancialSummary);
            input.addEventListener('input', updateFinancialSummary);
        });
        
        // Handle existing loans toggle
        const existingLoansRadios = financialForm.querySelectorAll('input[name="existingLoans"]');
        existingLoansRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                const existingLoanDetails = document.querySelector('.existing-loan-details');
                if (existingLoanDetails) {
                    if (this.value === 'yes') {
                        existingLoanDetails.style.display = 'flex';
                    } else {
                        existingLoanDetails.style.display = 'none';
                    }
                }
            });
        });
    }
    
    // Family form
    const familyForm = document.querySelector('.family-form');
    if (familyForm) {
        const inputs = familyForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('change', updateFamilySummary);
            input.addEventListener('input', updateFamilySummary);
        });
    }
}

// File Upload Handlers
function initializeFileUploads() {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            const fileStatus = this.parentElement.querySelector('.file-status');
            if (this.files.length > 0) {
                fileStatus.textContent = this.files[0].name;
                fileStatus.style.color = '#28a745';
                
                // Store file info
                loanApplicationState.documents[this.id] = {
                    name: this.files[0].name,
                    size: this.files[0].size,
                    type: this.files[0].type
                };
            } else {
                fileStatus.textContent = 'No file selected';
                fileStatus.style.color = '#666';
                delete loanApplicationState.documents[this.id];
            }
        });
    });
}

// Tab Handlers
function initializeTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all tabs
            tabBtns.forEach(tab => tab.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Store selected tab
            loanApplicationState.loanDetails.type = this.dataset.tab;
        });
    });
}

// Personal Info Navigation
function initializePersonalInfoNavigation() {
    // This would handle sub-navigation within personal details
    // For now, we'll show address info by default in the design
    setTimeout(() => {
        showAddressInfo();
    }, 100);
}

// Navigation Functions
function showLoanApplication() {
    window.location.href = 'loan-application.html';
}

function showDashboard() {
    window.location.href = 'index.html';
}

function goToLoanDetails() {
    if (!loanApplicationState.selectedCategory) {
        showMessage('Please select a loan category first', 'error');
        return;
    }
    
    showPage('loan-details-page');
    loanApplicationState.currentPage = 'loan-details';
    loanApplicationState.currentStep = 1;
}

function goToLoanCategory() {
    showPage('loan-category-page');
    loanApplicationState.currentPage = 'loan-category';
}

function goToUploadDocuments() {
    if (!validateLoanDetails()) {
        return;
    }
    
    showPage('upload-documents-page');
    loanApplicationState.currentPage = 'upload-documents';
    loanApplicationState.currentStep = 2;
}

function goToLoanDetailsFromCategory() {
    if (!loanApplicationState.selectedCategory) {
        showMessage('Please select a loan category first', 'error');
        return;
    }
    
    showPage('loan-details-page');
    loanApplicationState.currentPage = 'loan-details';
    loanApplicationState.currentStep = 1;
}

function goToLoanDetails() {
    showPage('loan-details-page');
    loanApplicationState.currentPage = 'loan-details';
    loanApplicationState.currentStep = 1;
}

function goToPersonalDetails() {
    showPage('personal-details-page');
    loanApplicationState.currentPage = 'personal-details';
    loanApplicationState.currentStep = 3;
    showPersonalInfo();
}

function goToEmploymentDetails() {
    if (!validatePersonalDetails()) {
        return;
    }
    
    showPage('employment-details-page');
    loanApplicationState.currentPage = 'employment-details';
    loanApplicationState.currentStep = 4;
}

function goToFinancialInfo() {
    if (!validateEmploymentDetails()) {
        return;
    }
    
    showPage('financial-info-page');
    loanApplicationState.currentPage = 'financial-info';
    loanApplicationState.currentStep = 5;
}

function goToFamilyDetails() {
    if (!validateFinancialInfo()) {
        return;
    }
    
    showPage('family-details-page');
    loanApplicationState.currentPage = 'family-details';
    loanApplicationState.currentStep = 6;
}

function goToDeclaration() {
    if (!validateFamilyDetails()) {
        return;
    }
    
    showPage('declaration-page');
    loanApplicationState.currentPage = 'declaration';
    loanApplicationState.currentStep = 7;
    
    // Set current date for signature
    const signatureDateInput = document.getElementById('signatureDate');
    if (signatureDateInput) {
        signatureDateInput.value = new Date().toISOString().split('T')[0];
    }
}

function submitLoanApplication() {
    if (!validateDeclaration()) {
        return;
    }
    
    // Show loading state
    const submitBtn = document.querySelector('.btn-submit');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> SUBMITTING...';
    }
    
    // Simulate API call
    setTimeout(() => {
        showMessage('Loan application submitted successfully! You will receive a confirmation email shortly.', 'success');
        
        // Reset button
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'SUBMIT APPLICATION <i class="fas fa-check"></i>';
        }
        
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
    }, 2000);
}

// Page Display Functions
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.loan-page');
    pages.forEach(page => page.classList.remove('active'));
    
    // Show selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
}

function showPersonalInfo() {
    const sections = document.querySelectorAll('.personal-info-section');
    sections.forEach(section => section.classList.remove('active'));
    
    const personalInfoSection = document.getElementById('personal-info');
    if (personalInfoSection) {
        personalInfoSection.classList.add('active');
    }
    
    loanApplicationState.currentSubStep = 'personal-info';
}

function showAddressInfo() {
    const sections = document.querySelectorAll('.personal-info-section');
    sections.forEach(section => section.classList.remove('active'));
    
    const addressInfoSection = document.getElementById('address-info');
    if (addressInfoSection) {
        addressInfoSection.classList.add('active');
    }
    
    loanApplicationState.currentSubStep = 'address-info';
}

// File Selection Function
function selectFile(inputId) {
    const fileInput = document.getElementById(inputId);
    if (fileInput) {
        fileInput.click();
    }
}

// Validation Functions
function validateLoanDetails() {
    const appliedAmount = document.getElementById('appliedAmount')?.value;
    const tenure = document.getElementById('tenure')?.value;
    const appliedDate = document.getElementById('appliedDate')?.value;
    
    if (!appliedAmount || !tenure || !appliedDate) {
        showMessage('Please fill in all required loan details', 'error');
        return false;
    }
    
    if (parseFloat(appliedAmount) <= 0) {
        showMessage('Please enter a valid loan amount', 'error');
        return false;
    }
    
    return true;
}

function validatePersonalDetails() {
    const requiredFields = [
        'fullName', 'dob', 'countryBirth', 'taxId', 'education',
        'residentialStatus', 'residingYears', 'fatherName', 'motherName',
        'nationality', 'maritalStatus', 'presentAddress', 'permanentAddress',
        'emailId', 'mobile1'
    ];
    
    for (let fieldId of requiredFields) {
        const field = document.getElementById(fieldId);
        if (field && !field.value.trim()) {
            showMessage(`Please fill in ${field.previousElementSibling.textContent}`, 'error');
            field.focus();
            return false;
        }
    }
    
    // Validate email format
    const email = document.getElementById('emailId')?.value;
    if (email && !isValidEmail(email)) {
        showMessage('Please enter a valid email address', 'error');
        return false;
    }
    
    // Validate mobile number
    const mobile = document.getElementById('mobile1')?.value;
    if (mobile && !isValidMobile(mobile)) {
        showMessage('Please enter a valid mobile number', 'error');
        return false;
    }
    
    return true;
}

function validateEmploymentDetails() {
    const requiredFields = [
        'employmentType', 'companyName', 'designation', 'workExperience',
        'currentJobExperience', 'monthlyIncome', 'companyAddress', 'companyPhone'
    ];
    
    for (let fieldId of requiredFields) {
        const field = document.getElementById(fieldId);
        if (field && !field.value.trim()) {
            showMessage(`Please fill in ${field.previousElementSibling.textContent}`, 'error');
            field.focus();
            return false;
        }
    }
    
    // Validate monthly income
    const monthlyIncome = document.getElementById('monthlyIncome')?.value;
    if (monthlyIncome && parseFloat(monthlyIncome) <= 0) {
        showMessage('Please enter a valid monthly income', 'error');
        return false;
    }
    
    return true;
}

function validateFinancialInfo() {
    const requiredFields = [
        'bankName', 'accountNumber', 'ifscCode', 'accountType',
        'accountBalance', 'monthlyExpenses'
    ];
    
    for (let fieldId of requiredFields) {
        const field = document.getElementById(fieldId);
        if (field && !field.value.trim()) {
            showMessage(`Please fill in ${field.previousElementSibling.textContent}`, 'error');
            field.focus();
            return false;
        }
    }
    
    // Validate account balance
    const accountBalance = document.getElementById('accountBalance')?.value;
    if (accountBalance && parseFloat(accountBalance) < 0) {
        showMessage('Please enter a valid account balance', 'error');
        return false;
    }
    
    // Validate existing loan details if selected
    const existingLoans = document.querySelector('input[name="existingLoans"]:checked')?.value;
    if (existingLoans === 'yes') {
        const existingLoanAmount = document.getElementById('existingLoanAmount')?.value;
        const existingLoanEmi = document.getElementById('existingLoanEmi')?.value;
        
        if (!existingLoanAmount || !existingLoanEmi) {
            showMessage('Please provide existing loan details', 'error');
            return false;
        }
    }
    
    return true;
}

function validateFamilyDetails() {
    const requiredFields = [
        'emergencyName', 'emergencyRelation', 'emergencyPhone', 'emergencyAddress'
    ];
    
    for (let fieldId of requiredFields) {
        const field = document.getElementById(fieldId);
        if (field && !field.value.trim()) {
            showMessage(`Please fill in ${field.previousElementSibling.textContent}`, 'error');
            field.focus();
            return false;
        }
    }
    
    // Validate emergency phone
    const emergencyPhone = document.getElementById('emergencyPhone')?.value;
    if (emergencyPhone && !isValidMobile(emergencyPhone)) {
        showMessage('Please enter a valid emergency contact phone number', 'error');
        return false;
    }
    
    return true;
}

function validateDeclaration() {
    const requiredCheckboxes = ['termsAccept', 'dataConsent', 'creditCheck'];
    
    for (let checkboxId of requiredCheckboxes) {
        const checkbox = document.getElementById(checkboxId);
        if (checkbox && !checkbox.checked) {
            showMessage('Please accept all required terms and conditions', 'error');
            checkbox.focus();
            return false;
        }
    }
    
    const digitalSignature = document.getElementById('digitalSignature')?.value;
    const signatureDate = document.getElementById('signatureDate')?.value;
    
    if (!digitalSignature || !signatureDate) {
        showMessage('Please provide digital signature and date', 'error');
        return false;
    }
    
    return true;
}

// Update Summary Functions
function updateLoanDetailsSummary() {
    const appliedAmount = document.getElementById('appliedAmount')?.value;
    const tenure = document.getElementById('tenure')?.value;
    
    // Update summary display
    const summaryAmount = document.getElementById('summaryAmount');
    const summaryTenure = document.getElementById('summaryTenure');
    
    if (summaryAmount && appliedAmount) {
        summaryAmount.textContent = `₹ ${parseFloat(appliedAmount).toLocaleString('en-IN')}`;
    }
    
    if (summaryTenure && tenure) {
        summaryTenure.textContent = `${tenure} months`;
    }
    
    // Store in state
    loanApplicationState.loanDetails = {
        ...loanApplicationState.loanDetails,
        appliedAmount: appliedAmount,
        tenure: tenure,
        appliedDate: document.getElementById('appliedDate')?.value
    };
}

function updatePersonalInfoSummary() {
    const fullName = document.getElementById('fullName')?.value;
    const dob = document.getElementById('dob')?.value;
    const taxId = document.getElementById('taxId')?.value;
    
    // Store in state
    loanApplicationState.personalInfo = {
        ...loanApplicationState.personalInfo,
        fullName: fullName,
        dob: dob,
        taxId: taxId
    };
}

function updateAddressInfoSummary() {
    const presentAddress = document.getElementById('presentAddress')?.value;
    const permanentAddress = document.getElementById('permanentAddress')?.value;
    const emailId = document.getElementById('emailId')?.value;
    const mobile1 = document.getElementById('mobile1')?.value;
    
    // Store in state
    loanApplicationState.addressInfo = {
        ...loanApplicationState.addressInfo,
        presentAddress: presentAddress,
        permanentAddress: permanentAddress,
        emailId: emailId,
        mobile1: mobile1
    };
}

function updateEmploymentSummary() {
    const employmentType = document.getElementById('employmentType')?.value;
    const companyName = document.getElementById('companyName')?.value;
    const monthlyIncome = document.getElementById('monthlyIncome')?.value;
    
    // Store in state
    loanApplicationState.employmentDetails = {
        ...loanApplicationState.employmentDetails,
        employmentType: employmentType,
        companyName: companyName,
        monthlyIncome: monthlyIncome
    };
}

function updateFinancialSummary() {
    const bankName = document.getElementById('bankName')?.value;
    const accountType = document.getElementById('accountType')?.value;
    const accountBalance = document.getElementById('accountBalance')?.value;
    
    // Store in state
    loanApplicationState.financialInfo = {
        ...loanApplicationState.financialInfo,
        bankName: bankName,
        accountType: accountType,
        accountBalance: accountBalance
    };
}

function updateFamilySummary() {
    const emergencyName = document.getElementById('emergencyName')?.value;
    const emergencyRelation = document.getElementById('emergencyRelation')?.value;
    const emergencyPhone = document.getElementById('emergencyPhone')?.value;
    
    // Store in state
    loanApplicationState.familyDetails = {
        ...loanApplicationState.familyDetails,
        emergencyName: emergencyName,
        emergencyRelation: emergencyRelation,
        emergencyPhone: emergencyPhone
    };
}

// Utility Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidMobile(mobile) {
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(mobile.replace(/\D/g, ''));
}

function showMessage(message, type = 'info') {
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="background: none; border: none; color: inherit; margin-left: 10px; cursor: pointer; font-size: 16px;">&times;</button>
    `;
    
    // Add to body
    document.body.appendChild(messageDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentElement) {
            messageDiv.remove();
        }
    }, 5000);
}

// Add CSS animation for message
if (!document.querySelector('#message-styles')) {
    const style = document.createElement('style');
    style.id = 'message-styles';
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
}

// Export functions for global access
window.loanApplication = {
    showLoanApplication,
    showDashboard,
    goToLoanDetails,
    goToLoanCategory,
    goToUploadDocuments,
    goToPersonalDetails,
    goToEmploymentDetails,
    selectFile,
    showPersonalInfo,
    showAddressInfo
};

// Logout function
function logout() {
    // Clear authentication data
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('authToken');
    
    // Navigate to login page
    window.location.href = 'index.html';
}

// Make functions globally available
window.showLoanApplication = showLoanApplication;
window.showDashboard = showDashboard;
window.goToLoanDetails = goToLoanDetails;
window.goToLoanDetailsFromCategory = goToLoanDetailsFromCategory;
window.goToLoanCategory = goToLoanCategory;
window.goToUploadDocuments = goToUploadDocuments;
window.goToPersonalDetails = goToPersonalDetails;
window.goToEmploymentDetails = goToEmploymentDetails;
window.goToFinancialInfo = goToFinancialInfo;
window.goToFamilyDetails = goToFamilyDetails;
window.goToDeclaration = goToDeclaration;
window.submitLoanApplication = submitLoanApplication;
window.selectFile = selectFile;
window.showPersonalInfo = showPersonalInfo;
window.showAddressInfo = showAddressInfo;
window.logout = logout;