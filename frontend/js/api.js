// API Configuration and Base Functions
class API {
    constructor() {
        this.baseURL = 'http://localhost:3000/api';
        this.token = localStorage.getItem('token');
    }

    // Set authentication token
    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }

    // Get authorization headers
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return headers;
    }

    // Make API request
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: this.getHeaders(),
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // GET request
    async get(endpoint) {
        return this.request(endpoint, {
            method: 'GET'
        });
    }

    // POST request
    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // PUT request
    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    // DELETE request
    async delete(endpoint) {
        return this.request(endpoint, {
            method: 'DELETE'
        });
    }

    // Authentication methods
    async register(userData) {
        return this.post('/auth/register', userData);
    }

    async login(credentials) {
        return this.post('/auth/login', credentials);
    }

    async getCurrentUser() {
        return this.get('/auth/me');
    }

    // Post methods
    async getPosts(page = 1, limit = 10) {
        return this.get(`/posts?page=${page}&limit=${limit}`);
    }

    async getPost(id) {
        return this.get(`/posts/${id}`);
    }

    async createPost(postData) {
        return this.post('/posts', postData);
    }

    async updatePost(id, postData) {
        return this.put(`/posts/${id}`, postData);
    }

    async deletePost(id) {
        return this.delete(`/posts/${id}`);
    }

    // Comment methods
    async getComments(postId, page = 1, limit = 20) {
        return this.get(`/comments/post/${postId}?page=${page}&limit=${limit}`);
    }

    async createComment(commentData) {
        return this.post('/comments', commentData);
    }

    async deleteComment(id) {
        return this.delete(`/comments/${id}`);
    }
}

// Create global API instance
const api = new API();

// Utility functions
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

// Error handling
const handleError = (error, customMessage = 'An error occurred') => {
    console.error(error);
    showToast(error.message || customMessage, 'error');
};

// Show loading spinner
const showLoading = () => {
    document.getElementById('loading-spinner').classList.remove('hidden');
};

// Hide loading spinner
const hideLoading = () => {
    document.getElementById('loading-spinner').classList.add('hidden');
};

// Show toast notification
const showToast = (message, type = 'success') => {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    
    toast.className = `toast ${type}`;
    toastMessage.textContent = message;
    toast.classList.remove('hidden');

    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
};

// DOM utilities
const getElement = (selector) => {
    return document.querySelector(selector);
};

const getElements = (selector) => {
    return document.querySelectorAll(selector);
};

const createElement = (tag, className = '', content = '') => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content) element.textContent = content;
    return element;
};

// Route management
const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
};

const getCurrentPath = () => {
    return window.location.pathname;
};
const API_URL = "https://blog-platform-9npy.onrender.com/api";

fetch(`${API_URL}/api/posts`)
  .then(res => res.json())
  .then(data => {
    console.log(data);

    const container = document.getElementById("posts");

    if (!container) {
      alert("No posts container found!");
      return;
    }

    container.innerHTML = "";

    data.forEach(post => {
      const div = document.createElement("div");
      div.innerHTML = `
        <h3>${post.title}</h3>
        <p>${post.content}</p>
      `;
      container.appendChild(div);
    });
  })
  .catch(err => {
    alert("Error: " + err.message);
  });