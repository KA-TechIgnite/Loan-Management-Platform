/**
 * Authentication Module
 * Handles user authentication, role management, and session handling
 */

// Authentication service
const AuthService = {
    // Base URL for authentication API (placeholder for .NET backend)
    apiBaseUrl: 'https://localhost:5001/api/auth',
    
    /**
     * Authenticate user with email, password, and role
     * @param {string} email - User email
     * @param {string} password - User password
     * @param {string} role - User role (customer/manager)
     * @returns {Promise<Object>} - Authentication result
     */
    async login(email, password, role) {
        try {
            // TODO: Replace with actual API call to .NET backend
            // const response = await fetch(`${this.apiBaseUrl}/login`, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify({ email, password, role })
            // });
            // 
            // if (!response.ok) {
            //     throw new Error(`HTTP error! status: ${response.status}`);
            // }
            // 
            // const data = await response.json();
            // return data;
            
            // Placeholder implementation for demo
            await this.simulateNetworkDelay(800);
            
            // Simulate different responses based on email for demo
            if (email === 'admin@test.com' && password === 'admin123') {
                return {
                    success: true,
                    token: this.generateToken(),
                    user: {
                        id: 1,
                        name: 'Admin User',
                        email: email,
                        role: role,
                        permissions: role === 'manager' ? ['read', 'write', 'admin'] : ['read']
                    },
                    expiresIn: 3600 // 1 hour
                };
            } else if (email.includes('@') && password.length >= 6) {
                return {
                    success: true,
                    token: this.generateToken(),
                    user: {
                        id: Math.floor(Math.random() * 1000),
                        name: this.extractNameFromEmail(email),
                        email: email,
                        role: role,
                        permissions: role === 'manager' ? ['read', 'write'] : ['read']
                    },
                    expiresIn: 3600
                };
            } else {
                return {
                    success: false,
                    error: 'Invalid credentials'
                };
            }
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                error: 'Network error occurred'
            };
        }
    },
    
    /**
     * Logout user and clear session
     * @returns {Promise<Object>} - Logout result
     */
    async logout() {
        try {
            // TODO: Replace with actual API call to .NET backend
            // const token = this.getToken();
            // const response = await fetch(`${this.apiBaseUrl}/logout`, {
            //     method: 'POST',
            //     headers: {
            //         'Authorization': `Bearer ${token}`,
            //         'Content-Type': 'application/json'
            //     }
            // });
            
            // Clear local storage
            this.clearSession();
            
            return {
                success: true
            };
        } catch (error) {
            console.error('Logout error:', error);
            // Clear session even if API call fails
            this.clearSession();
            return {
                success: false,
                error: 'Logout error occurred'
            };
        }
    },
    
    /**
     * Refresh authentication token
     * @returns {Promise<Object>} - Refresh result
     */
    async refreshToken() {
        try {
            // TODO: Replace with actual API call to .NET backend
            // const refreshToken = localStorage.getItem('refreshToken');
            // const response = await fetch(`${this.apiBaseUrl}/refresh`, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify({ refreshToken })
            // });
            
            // Placeholder implementation
            const currentToken = this.getToken();
            if (currentToken) {
                const newToken = this.generateToken();
                localStorage.setItem('authToken', newToken);
                return {
                    success: true,
                    token: newToken
                };
            }
            
            return {
                success: false,
                error: 'No valid token to refresh'
            };
        } catch (error) {
            console.error('Token refresh error:', error);
            return {
                success: false,
                error: 'Token refresh failed'
            };
        }
    },
    
    /**
     * Validate current session
     * @returns {Promise<Object>} - Validation result
     */
    async validateSession() {
        try {
            const token = this.getToken();
            if (!token) {
                return {
                    valid: false,
                    error: 'No token found'
                };
            }
            
            // TODO: Replace with actual API call to .NET backend
            // const response = await fetch(`${this.apiBaseUrl}/validate`, {
            //     method: 'GET',
            //     headers: {
            //         'Authorization': `Bearer ${token}`
            //     }
            // });
            
            // Placeholder validation
            const tokenData = this.parseToken(token);
            const isExpired = Date.now() > tokenData.exp * 1000;
            
            if (isExpired) {
                return {
                    valid: false,
                    error: 'Token expired'
                };
            }
            
            return {
                valid: true,
                user: {
                    id: tokenData.userId,
                    name: localStorage.getItem('userName'),
                    email: tokenData.email,
                    role: localStorage.getItem('userRole')
                }
            };
        } catch (error) {
            console.error('Session validation error:', error);
            return {
                valid: false,
                error: 'Validation failed'
            };
        }
    },
    
    /**
     * Get current authentication token
     * @returns {string|null} - Authentication token
     */
    getToken() {
        return localStorage.getItem('authToken');
    },
    
    /**
     * Get current user data
     * @returns {Object|null} - User data
     */
    getCurrentUser() {
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        if (!isAuthenticated) {
            return null;
        }
        
        return {
            name: localStorage.getItem('userName'),
            role: localStorage.getItem('userRole'),
            email: localStorage.getItem('userEmail')
        };
    },
    
    /**
     * Check if user is authenticated
     * @returns {boolean} - Authentication status
     */
    isAuthenticated() {
        return localStorage.getItem('isAuthenticated') === 'true' && this.getToken();
    },
    
    /**
     * Check if user has specific role
     * @param {string} role - Role to check
     * @returns {boolean} - Role check result
     */
    hasRole(role) {
        const userRole = localStorage.getItem('userRole');
        return userRole === role;
    },
    
    /**
     * Check if user has specific permission
     * @param {string} permission - Permission to check
     * @returns {boolean} - Permission check result
     */
    hasPermission(permission) {
        const userRole = localStorage.getItem('userRole');
        
        // Define role-based permissions
        const rolePermissions = {
            'customer': ['read'],
            'manager': ['read', 'write', 'admin']
        };
        
        const permissions = rolePermissions[userRole] || [];
        return permissions.includes(permission);
    },
    
    /**
     * Clear user session
     */
    clearSession() {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('refreshToken');
    },
    
    /**
     * Generate a demo JWT token
     * @returns {string} - Generated token
     */
    generateToken() {
        const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
        const payload = btoa(JSON.stringify({
            userId: Math.floor(Math.random() * 1000),
            email: localStorage.getItem('userEmail') || 'demo@example.com',
            role: localStorage.getItem('userRole') || 'customer',
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 3600 // 1 hour
        }));
        const signature = btoa('demo-signature-' + Math.random().toString(36));
        
        return `${header}.${payload}.${signature}`;
    },
    
    /**
     * Parse JWT token (demo implementation)
     * @param {string} token - JWT token
     * @returns {Object} - Parsed token data
     */
    parseToken(token) {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) {
                throw new Error('Invalid token format');
            }
            
            const payload = JSON.parse(atob(parts[1]));
            return payload;
        } catch (error) {
            console.error('Token parsing error:', error);
            return null;
        }
    },
    
    /**
     * Extract name from email address
     * @param {string} email - Email address
     * @returns {string} - Extracted name
     */
    extractNameFromEmail(email) {
        const username = email.split('@')[0];
        return username.charAt(0).toUpperCase() + username.slice(1).replace(/[._]/g, ' ');
    },
    
    /**
     * Simulate network delay for demo purposes
     * @param {number} ms - Milliseconds to delay
     * @returns {Promise} - Promise that resolves after delay
     */
    simulateNetworkDelay(ms = 1000) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

// Password validation utilities
const PasswordValidator = {
    /**
     * Validate password strength
     * @param {string} password - Password to validate
     * @returns {Object} - Validation result
     */
    validate(password) {
        const result = {
            isValid: true,
            errors: [],
            strength: 'weak'
        };
        
        if (password.length < 8) {
            result.isValid = false;
            result.errors.push('Password must be at least 8 characters long');
        }
        
        if (!/[A-Z]/.test(password)) {
            result.errors.push('Password should contain at least one uppercase letter');
        }
        
        if (!/[a-z]/.test(password)) {
            result.errors.push('Password should contain at least one lowercase letter');
        }
        
        if (!/\d/.test(password)) {
            result.errors.push('Password should contain at least one number');
        }
        
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            result.errors.push('Password should contain at least one special character');
        }
        
        // Calculate strength
        let score = 0;
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
        
        if (score >= 5) result.strength = 'strong';
        else if (score >= 3) result.strength = 'medium';
        
        return result;
    }
};

// Export for use in other modules
window.AuthService = AuthService;
window.PasswordValidator = PasswordValidator;

// Auto-refresh token before expiration
setInterval(async () => {
    if (AuthService.isAuthenticated()) {
        const validation = await AuthService.validateSession();
        if (!validation.valid && validation.error === 'Token expired') {
            const refreshResult = await AuthService.refreshToken();
            if (!refreshResult.success) {
                // Force logout if refresh fails
                AuthService.clearSession();
                if (window.appUtils) {
                    window.appUtils.navigateToLogin();
                }
            }
        }
    }
}, 5 * 60 * 1000); // Check every 5 minutes