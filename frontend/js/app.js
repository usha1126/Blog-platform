// Main application router and controller
class AppRouter {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
        this.init();
    }

    init() {
        // Define routes
        this.routes = {
            '/': this.handleHome.bind(this),
            '/login': this.handleLogin.bind(this),
            '/register': this.handleRegister.bind(this),
            '/post/:id': this.handlePost.bind(this),
            '/create-post': this.handleCreatePost.bind(this),
            '/edit-post/:id': this.handleEditPost.bind(this)
        };

        // Setup browser history handling
        window.addEventListener('popstate', () => {
            this.handleRoute();
        });

        // Handle initial route
        this.handleRoute();
    }

    // Parse URL parameters
    parseUrl(url) {
        const path = url.split('?')[0];
        const params = {};
        
        // Extract route parameters
        for (const route in this.routes) {
            const routeParts = route.split('/');
            const pathParts = path.split('/');
            
            if (routeParts.length === pathParts.length) {
                let match = true;
                const extractedParams = {};
                
                for (let i = 0; i < routeParts.length; i++) {
                    if (routeParts[i].startsWith(':')) {
                        extractedParams[routeParts[i].substring(1)] = pathParts[i];
                    } else if (routeParts[i] !== pathParts[i]) {
                        match = false;
                        break;
                    }
                }
                
                if (match) {
                    return { route, params: extractedParams };
                }
            }
        }
        
        return { route: null, params: {} };
    }

    // Handle current route
    async handleRoute() {
        const path = window.location.pathname;
        const { route, params } = this.parseUrl(path);
        
        if (!route) {
            // Route not found, redirect to home
            navigateTo('/');
            return;
        }

        this.currentRoute = { route, params };
        
        try {
            await this.routes[route](params);
        } catch (error) {
            console.error('Route error:', error);
            this.renderError('An error occurred while loading the page.');
        }
    }

    // Home page - list all posts
    async handleHome() {
        const postsData = await postsManager.loadPosts();
        if (postsData) {
            const html = postsManager.renderPostsList(postsData);
            this.render(html);
        } else {
            this.renderError('Failed to load posts');
        }
    }

    // Login page
    handleLogin() {
        if (authManager.isAuthenticated()) {
            navigateTo('/');
            return;
        }

        const html = authManager.renderLoginForm();
        this.render(html);
        authManager.setupLoginForm();
    }

    // Register page
    handleRegister() {
        if (authManager.isAuthenticated()) {
            navigateTo('/');
            return;
        }

        const html = authManager.renderRegisterForm();
        this.render(html);
        authManager.setupRegisterForm();
    }

    // Single post page
    async handlePost(params) {
        const postData = await postsManager.loadPost(params.id);
        if (postData) {
            const html = postsManager.renderPostPage(postData);
            this.render(html);
            
            // Load comments after rendering the post
            const commentsData = await commentsManager.loadComments(params.id);
            if (commentsData) {
                commentsManager.renderComments(commentsData);
            }
        } else {
            this.renderError('Post not found');
        }
    }

    // Create new post page
    handleCreatePost() {
        if (!authManager.isAuthenticated()) {
            navigateTo('/login');
            return;
        }

        const html = postsManager.renderPostForm();
        this.render(html);
        postsManager.setupPostForm(false);
    }

    // Edit post page
    async handleEditPost(params) {
        if (!authManager.isAuthenticated()) {
            navigateTo('/login');
            return;
        }

        const postData = await postsManager.loadPost(params.id);
        if (postData) {
            if (!postData.isAuthor) {
                this.renderError('You are not authorized to edit this post');
                return;
            }

            const html = postsManager.renderPostForm(postData.post);
            this.render(html);
            postsManager.setupPostForm(true, params.id);
        } else {
            this.renderError('Post not found');
        }
    }

    // Handle post click from posts list
    async handlePostClick(postId) {
        navigateTo(`/post/${postId}`);
    }

    // Render HTML content
    render(html) {
        const app = getElement('#app');
        if (app) {
            app.innerHTML = html;
            // Add fade-in animation
            app.classList.add('fade-in');
            
            // Scroll to top
            window.scrollTo(0, 0);
            
            // Remove animation class after animation completes
            setTimeout(() => {
                app.classList.remove('fade-in');
            }, 500);
        }
    }

    // Render error page
    renderError(message) {
        const html = `
            <div class="container">
                <div class="card text-center">
                    <h1>Error</h1>
                    <p>${this.escapeHtml(message)}</p>
                    <a href="/" class="btn btn-primary mt-3">
                        <i class="fas fa-home"></i> Go Home
                    </a>
                </div>
            </div>
        `;
        this.render(html);
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Create global app router instance
    window.appRouter = new AppRouter();
    
    // Make managers globally available
    window.authManager = authManager;
    window.postsManager = postsManager;
    window.commentsManager = commentsManager;
    
    console.log('Blog Platform initialized successfully!');
});

// Handle navigation links
document.addEventListener('click', (e) => {
    // Check if clicked element is a navigation link
    const link = e.target.closest('a');
    if (link && link.href && link.getAttribute('href')?.startsWith('/')) {
        e.preventDefault();
        navigateTo(link.getAttribute('href'));
    }
});

// Handle form submissions with proper error handling
document.addEventListener('submit', async (e) => {
    const form = e.target;
    
    // Add loading state to submit button
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
        const originalText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        
        // Restore button after a timeout (in case form doesn't submit properly)
        setTimeout(() => {
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
        }, 5000);
    }
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K for quick navigation (placeholder for future search feature)
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        console.log('Quick search - feature coming soon!');
    }
    
    // Escape key to close mobile menu
    if (e.key === 'Escape') {
        const navMenu = getElement('.nav-menu');
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
        }
    }
});

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll-to-top button functionality
let scrollToTopButton = null;

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        if (!scrollToTopButton) {
            scrollToTopButton = createElement('button', 'scroll-to-top', '<i class="fas fa-arrow-up"></i>');
            scrollToTopButton.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: var(--primary-color);
                color: white;
                border: none;
                cursor: pointer;
                box-shadow: var(--shadow-lg);
                z-index: 1000;
                transition: var(--transition);
                opacity: 0;
                transform: translateY(20px);
            `;
            
            scrollToTopButton.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
            
            scrollToTopButton.addEventListener('mouseenter', () => {
                scrollToTopButton.style.transform = 'translateY(-5px)';
            });
            
            scrollToTopButton.addEventListener('mouseleave', () => {
                scrollToTopButton.style.transform = 'translateY(0)';
            });
            
            document.body.appendChild(scrollToTopButton);
            
            // Fade in animation
            setTimeout(() => {
                scrollToTopButton.style.opacity = '1';
                scrollToTopButton.style.transform = 'translateY(0)';
            }, 100);
        }
    } else if (scrollToTopButton && window.pageYOffset <= 300) {
        // Fade out and remove
        scrollToTopButton.style.opacity = '0';
        scrollToTopButton.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            if (scrollToTopButton && scrollToTopButton.parentNode) {
                scrollToTopButton.parentNode.removeChild(scrollToTopButton);
                scrollToTopButton = null;
            }
        }, 300);
    }
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add lazy loading for images (if any are added later)
const lazyLoadImages = () => {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
};

// Initialize lazy loading
lazyLoadImages();
