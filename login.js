// DOM Elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const togglePassword = document.getElementById('togglePassword');
const rememberMe = document.getElementById('rememberMe');
const loginBtn = document.querySelector('.login-btn');
const btnText = document.querySelector('.btn-text');
const loadingSpinner = document.querySelector('.loading-spinner');

// Error message elements
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');

// Modal elements
const messageModal = document.getElementById('messageModal');
const modalTitle = document.getElementById('modalTitle');
const modalMessage = document.getElementById('modalMessage');
const modalClose = document.getElementById('modalClose');
const successIcon = document.getElementById('successIcon');
const errorIcon = document.getElementById('errorIcon');

// Social login buttons
const googleBtn = document.querySelector('.google-btn');
const facebookBtn = document.querySelector('.facebook-btn');

// Validation patterns
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordMinLength = 6;

// Demo credentials for testing
const demoCredentials = {
    email: 'demo@smartdict.com',
    password: 'demo123'
};

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    loadRememberedCredentials();
});

function initializeEventListeners() {
    // Form submission
    loginForm.addEventListener('submit', handleLogin);
    
    // Password visibility toggle
    togglePassword.addEventListener('click', togglePasswordVisibility);
    
    // Real-time validation
    emailInput.addEventListener('blur', validateEmail);
    passwordInput.addEventListener('blur', validatePassword);
    emailInput.addEventListener('input', clearEmailError);
    passwordInput.addEventListener('input', clearPasswordError);
    
    // Modal close
    modalClose.addEventListener('click', closeModal);
    messageModal.addEventListener('click', function(e) {
        if (e.target === messageModal) {
            closeModal();
        }
    });
    
    // Social login buttons
    googleBtn.addEventListener('click', handleGoogleLogin);
    facebookBtn.addEventListener('click', handleFacebookLogin);
    
    // Forgot password link
    const forgotPasswordLink = document.querySelector('.forgot-password');
    forgotPasswordLink.addEventListener('click', handleForgotPassword);
}

// Form submission handler
async function handleLogin(e) {
    e.preventDefault();
    
    // Clear previous errors
    clearAllErrors();
    
    // Validate form
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    
    if (!isEmailValid || !isPasswordValid) {
        return;
    }
    
    // Show loading state
    setLoadingState(true);
    
    try {
        // Simulate API call
        const result = await simulateLogin({
            email: emailInput.value.trim(),
            password: passwordInput.value,
            rememberMe: rememberMe.checked
        });
        
        if (result.success) {
            handleLoginSuccess(result);
        } else {
            handleLoginError(result.message);
        }
    } catch (error) {
        handleLoginError('An unexpected error occurred. Please try again.');
    } finally {
        setLoadingState(false);
    }
}

// Simulate login API call
function simulateLogin(credentials) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Check demo credentials
            if (credentials.email === demoCredentials.email && 
                credentials.password === demoCredentials.password) {
                resolve({
                    success: true,
                    user: {
                        email: credentials.email,
                        name: 'Demo User'
                    }
                });
            } else {
                // Check for specific error cases
                if (credentials.email !== demoCredentials.email) {
                    resolve({
                        success: false,
                        message: 'Email not found. Please check your email address.'
                    });
                } else {
                    resolve({
                        success: false,
                        message: 'Incorrect password. Please try again.'
                    });
                }
            }
        }, 1500); // Simulate network delay
    });
}

// Handle successful login
function handleLoginSuccess(result) {
    // Save user data if remember me is checked
    if (rememberMe.checked) {
        saveRememberedCredentials(emailInput.value);
    } else {
        clearRememberedCredentials();
    }
    
    showModal('Success', 'Welcome back! You have successfully logged in.', 'success');
    
    // Redirect after modal is closed
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

// Handle login error
function handleLoginError(message) {
    showModal('Login Failed', message, 'error');
}

// Email validation
function validateEmail() {
    const email = emailInput.value.trim();
    
    if (!email) {
        showError(emailError, 'Email is required');
        return false;
    }
    
    if (!emailPattern.test(email)) {
        showError(emailError, 'Please enter a valid email address');
        return false;
    }
    
    clearError(emailError);
    return true;
}

// Password validation
function validatePassword() {
    const password = passwordInput.value;
    
    if (!password) {
        showError(passwordError, 'Password is required');
        return false;
    }
    
    if (password.length < passwordMinLength) {
        showError(passwordError, `Password must be at least ${passwordMinLength} characters long`);
        return false;
    }
    
    clearError(passwordError);
    return true;
}

// Error handling functions
function showError(errorElement, message) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function clearError(errorElement) {
    errorElement.textContent = '';
    errorElement.style.display = 'none';
}

function clearEmailError() {
    clearError(emailError);
}

function clearPasswordError() {
    clearError(passwordError);
}

function clearAllErrors() {
    clearError(emailError);
    clearError(passwordError);
}

// Password visibility toggle
function togglePasswordVisibility() {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    togglePassword.classList.toggle('fa-eye');
    togglePassword.classList.toggle('fa-eye-slash');
}

// Loading state management
function setLoadingState(isLoading) {
    if (isLoading) {
        loginBtn.disabled = true;
        btnText.style.display = 'none';
        loadingSpinner.style.display = 'inline-block';
    } else {
        loginBtn.disabled = false;
        btnText.style.display = 'inline';
        loadingSpinner.style.display = 'none';
    }
}

// Modal functions
function showModal(title, message, type) {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    
    // Show appropriate icon
    if (type === 'success') {
        successIcon.style.display = 'block';
        errorIcon.style.display = 'none';
    } else {
        successIcon.style.display = 'none';
        errorIcon.style.display = 'block';
    }
    
    messageModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    messageModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Remember me functionality
function saveRememberedCredentials(email) {
    const userData = {
        email: email,
        timestamp: Date.now()
    };
    // Using in-memory storage for demo (would use localStorage in real app)
    window.rememberedUser = userData;
}

function loadRememberedCredentials() {
    // In a real app, you would check localStorage here
    if (window.rememberedUser) {
        const userData = window.rememberedUser;
        // Check if data is not too old (30 days)
        const thirtyDays = 30 * 24 * 60 * 60 * 1000;
        if (Date.now() - userData.timestamp < thirtyDays) {
            emailInput.value = userData.email;
            rememberMe.checked = true;
        }
    }
}

function clearRememberedCredentials() {
    window.rememberedUser = null;
}

// Social login handlers
function handleGoogleLogin() {
    showModal('Info', 'Google login integration would be implemented here with Google OAuth.', 'info');
}

function handleFacebookLogin() {
    showModal('Info', 'Facebook login integration would be implemented here with Facebook SDK.', 'info');
}

// Forgot password handler
function handleForgotPassword(e) {
    e.preventDefault();
    const email = emailInput.value.trim();
    
    if (!email) {
        showModal('Info', 'Please enter your email address first, then click "Forgot Password?"', 'info');
        emailInput.focus();
        return;
    }
    
    if (!emailPattern.test(email)) {
        showModal('Error', 'Please enter a valid email address.', 'error');
        emailInput.focus();
        return;
    }
    
    showModal('Success', `Password reset instructions have been sent to ${email}`, 'success');
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // ESC to close modal
    if (e.key === 'Escape' && messageModal.style.display === 'flex') {
        closeModal();
    }
    
    // Enter to submit form when modal is not open
    if (e.key === 'Enter' && messageModal.style.display !== 'flex') {
        const activeElement = document.activeElement;
        if (activeElement === emailInput || activeElement === passwordInput) {
            handleLogin(e);
        }
    }
});

// Form auto-complete enhancement
emailInput.addEventListener('input', function() {
    // Remove any whitespace
    this.value = this.value.trim();
});

// Demo helper - Add demo credentials info
function addDemoInfo() {
    const demoInfo = document.createElement('div');
    demoInfo.className = 'demo-info';
    demoInfo.innerHTML = `
        <p><strong>Demo Credentials:</strong></p>
        <p>Email: ${demoCredentials.email}</p>
        <p>Password: ${demoCredentials.password}</p>
    `;
    demoInfo.style.cssText = `
        background: #f0f9ff;
        border: 1px solid #0ea5e9;
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 20px;
        font-size: 14px;
        color: #0c4a6e;
    `;
    
    const loginCard = document.querySelector('.login-card');
    loginCard.insertBefore(demoInfo, loginCard.firstChild);
}

// Add demo info for development/testing
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(addDemoInfo, 100);
    });
}