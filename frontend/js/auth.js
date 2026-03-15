// Authentication functionality
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Check if user is logged in on page load
        this.checkAuthStatus();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Navigation toggle
        const navToggle = getElement('.nav-toggle');
        const navMenu = getElement('.nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navMenu && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navMenu.classList.remove('active');
            }
        });
    }

    async checkAuthStatus() {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                api.setToken(token);
                const response = await api.getCurrentUser();
                if (response.success) {
                    this.currentUser = response.data.user;
                    this.updateAuthUI();
                } else {
                    this.logout();
                }
            } else {
                this.updateAuthUI();
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            this.logout();
        }
    }

    updateAuthUI() {
        const authLinks = getElement('#auth-links');
        if (!authLinks) return;

        if (this.currentUser) {
            authLinks.innerHTML = `
                <span class="welcome-text">Welcome, ${this.currentUser.username}!</span>
                <a href="/create-post" class="btn btn-primary btn-sm">
                    <i class="fas fa-plus"></i> New Post
                </a>
                <button class="btn btn-secondary btn-sm" onclick="authManager.logout()">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </button>
            `;
        } else {
            authLinks.innerHTML = `
                <a href="/login" class="btn btn-secondary btn-sm">
                    <i class="fas fa-sign-in-alt"></i> Login
                </a>
                <a href="/register" class="btn btn-primary btn-sm">
                    <i class="fas fa-user-plus"></i> Register
                </a>
            `;
        }
    }

    async login(email, password) {
        try {
            showLoading();
            const response = await api.login({ email, password });
            
            if (response.success) {
                const { user, token } = response.data;
                api.setToken(token);
                this.currentUser = user;
                this.updateAuthUI();
                showToast('Login successful!', 'success');
                navigateTo('/');
                return true;
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            handleError(error, 'Login failed');
            return false;
        } finally {
            hideLoading();
        }
    }

    async register(userData) {
        try {
            showLoading();
            const response = await api.register(userData);
            
            if (response.success) {
                const { user, token } = response.data;
                api.setToken(token);
                this.currentUser = user;
                this.updateAuthUI();
                showToast('Registration successful!', 'success');
                navigateTo('/');
                return true;
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            handleError(error, 'Registration failed');
            return false;
        } finally {
            hideLoading();
        }
    }

    logout() {
        api.setToken(null);
        this.currentUser = null;
        this.updateAuthUI();
        showToast('Logged out successfully', 'success');
        navigateTo('/');
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    // Render login form
    renderLoginForm() {
        return `
            <div class="container">
                <div class="card" style="max-width: 400px; margin: 0 auto;">
                    <h2 class="text-center mb-4">Login</h2>
                    <form id="login-form">
                        <div class="form-group">
                            <label class="form-label" for="email">Email</label>
                            <input type="email" id="email" class="form-input" required>
                            <div class="form-error" id="email-error"></div>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="password">Password</label>
                            <input type="password" id="password" class="form-input" required>
                            <div class="form-error" id="password-error"></div>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-sign-in-alt"></i> Login
                            </button>
                            <a href="/register" class="btn btn-secondary">
                                <i class="fas fa-user-plus"></i> Register
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    // Render registration form
    renderRegisterForm() {
        return `
            <div class="container">
                <div class="card" style="max-width: 400px; margin: 0 auto;">
                    <h2 class="text-center mb-4">Register</h2>
                    <form id="register-form">
                        <div class="form-group">
                            <label class="form-label" for="username">Username</label>
                            <input type="text" id="username" class="form-input" required>
                            <div class="form-error" id="username-error"></div>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="email">Email</label>
                            <input type="email" id="email" class="form-input" required>
                            <div class="form-error" id="email-error"></div>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="password">Password</label>
                            <input type="password" id="password" class="form-input" required>
                            <div class="form-error" id="password-error"></div>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="confirm-password">Confirm Password</label>
                            <input type="password" id="confirm-password" class="form-input" required>
                            <div class="form-error" id="confirm-password-error"></div>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-user-plus"></i> Register
                            </button>
                            <a href="/login" class="btn btn-secondary">
                                <i class="fas fa-sign-in-alt"></i> Login
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    // Setup form handlers
    setupLoginForm() {
        const form = getElement('#login-form');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Clear previous errors
            getElements('.form-error').forEach(el => el.textContent = '');
            
            const email = getElement('#email').value.trim();
            const password = getElement('#password').value;

            // Basic validation
            let isValid = true;
            
            if (!email) {
                getElement('#email-error').textContent = 'Email is required';
                isValid = false;
            }
            
            if (!password) {
                getElement('#password-error').textContent = 'Password is required';
                isValid = false;
            }

            if (isValid) {
                await this.login(email, password);
            }
        });
    }

    setupRegisterForm() {
        const form = getElement('#register-form');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Clear previous errors
            getElements('.form-error').forEach(el => el.textContent = '');
            
            const username = getElement('#username').value.trim();
            const email = getElement('#email').value.trim();
            const password = getElement('#password').value;
            const confirmPassword = getElement('#confirm-password').value;

            // Basic validation
            let isValid = true;
            
            if (!username) {
                getElement('#username-error').textContent = 'Username is required';
                isValid = false;
            } else if (username.length < 3) {
                getElement('#username-error').textContent = 'Username must be at least 3 characters';
                isValid = false;
            }
            
            if (!email) {
                getElement('#email-error').textContent = 'Email is required';
                isValid = false;
            }
            
            if (!password) {
                getElement('#password-error').textContent = 'Password is required';
                isValid = false;
            } else if (password.length < 6) {
                getElement('#password-error').textContent = 'Password must be at least 6 characters';
                isValid = false;
            }
            
            if (!confirmPassword) {
                getElement('#confirm-password-error').textContent = 'Please confirm your password';
                isValid = false;
            } else if (password !== confirmPassword) {
                getElement('#confirm-password-error').textContent = 'Passwords do not match';
                isValid = false;
            }

            if (isValid) {
                await this.register({ username, email, password });
            }
        });
    }
}

// Create global auth manager instance
const authManager = new AuthManager();
