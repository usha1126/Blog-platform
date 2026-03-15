// Posts functionality
class PostsManager {
    constructor() {
        this.posts = [];
        this.currentPost = null;
        this.currentPage = 1;
        this.postsPerPage = 10;
    }

    // Load all posts
    async loadPosts(page = 1) {
        try {
            console.log('Loading posts from:', api.baseURL);
            showLoading();
            const response = await api.getPosts(page, this.postsPerPage);
            console.log('API response:', response);
            
            if (response.success) {
                this.posts = response.data.posts;
                this.currentPage = page;
                return response.data;
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            console.error('Posts load error:', error);
            handleError(error, 'Failed to load posts');
            return null;
        } finally {
            hideLoading();
        }
    }

    // Load single post
    async loadPost(id) {
        try {
            showLoading();
            const response = await api.getPost(id);
            
            if (response.success) {
                this.currentPost = response.data.post;
                return response.data;
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            handleError(error, 'Failed to load post');
            return null;
        } finally {
            hideLoading();
        }
    }

    // Create new post
    async createPost(postData) {
        try {
            showLoading();
            const response = await api.createPost(postData);
            
            if (response.success) {
                showToast('Post created successfully!', 'success');
                navigateTo(`/post/${response.data.post._id}`);
                return true;
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            handleError(error, 'Failed to create post');
            return false;
        } finally {
            hideLoading();
        }
    }

    // Update post
    async updatePost(id, postData) {
        try {
            showLoading();
            const response = await api.updatePost(id, postData);
            
            if (response.success) {
                showToast('Post updated successfully!', 'success');
                this.currentPost = response.data.post;
                return true;
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            handleError(error, 'Failed to update post');
            return false;
        } finally {
            hideLoading();
        }
    }

    // Delete post
    async deletePost(id) {
        if (!confirm('Are you sure you want to delete this post?')) {
            return false;
        }

        try {
            showLoading();
            const response = await api.deletePost(id);
            
            if (response.success) {
                showToast('Post deleted successfully!', 'success');
                navigateTo('/');
                return true;
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            handleError(error, 'Failed to delete post');
            return false;
        } finally {
            hideLoading();
        }
    }

    // Render posts list
    renderPostsList(postsData) {
        const { posts, pagination } = postsData;
        
        if (!posts || posts.length === 0) {
            return `
                <div class="container">
                    <div class="card text-center">
                        <h2>No posts found</h2>
                        <p class="text-muted">Be the first to create a post!</p>
                        ${authManager.isAuthenticated() ? 
                            `<a href="/create-post" class="btn btn-primary mt-3">
                                <i class="fas fa-plus"></i> Create Post
                            </a>` : 
                            `<a href="/register" class="btn btn-primary mt-3">
                                <i class="fas fa-user-plus"></i> Register to Post
                            </a>`
                        }
                    </div>
                </div>
            `;
        }

        const postsHTML = posts.map(post => this.renderPostCard(post)).join('');
        const paginationHTML = this.renderPagination(pagination);

        return `
            <div class="container">
                <div class="mb-4">
                    <h1>Latest Posts</h1>
                    ${authManager.isAuthenticated() ? 
                        `<a href="/create-post" class="btn btn-primary">
                            <i class="fas fa-plus"></i> Create New Post
                        </a>` : ''
                    }
                </div>
                <div class="posts-list">
                    ${postsHTML}
                </div>
                ${paginationHTML}
            </div>
        `;
    }

    // Render single post card
    renderPostCard(post) {
        const isAuthor = authManager.isAuthenticated() && 
                        authManager.getCurrentUser()._id === post.author._id;

        return `
            <div class="post-card card fade-in" onclick="appRouter.handlePostClick('${post._id}')">
                <h3 class="post-title">${this.escapeHtml(post.title)}</h3>
                <div class="post-meta">
                    <span><i class="fas fa-user"></i> ${this.escapeHtml(post.author.username)}</span>
                    <span><i class="fas fa-calendar"></i> ${formatDate(post.createdAt)}</span>
                </div>
                <p class="post-excerpt">${this.escapeHtml(truncateText(post.content, 200))}</p>
                <div class="post-actions">
                    <button class="btn btn-primary btn-sm">
                        <i class="fas fa-book-open"></i> Read More
                    </button>
                    ${isAuthor ? `
                        <a href="/edit-post/${post._id}" class="btn btn-secondary btn-sm" onclick="event.stopPropagation()">
                            <i class="fas fa-edit"></i> Edit
                        </a>
                        <button class="btn btn-danger btn-sm" onclick="event.stopPropagation(); postsManager.deletePost('${post._id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }

    // Render full post page
    renderPostPage(postData) {
        const { post, isAuthor } = postData;
        
        return `
            <div class="container">
                <div class="card">
                    <div class="mb-4">
                        <a href="/" class="btn btn-secondary">
                            <i class="fas fa-arrow-left"></i> Back to Posts
                        </a>
                        ${isAuthor ? `
                            <div class="float-right">
                                <a href="/edit-post/${post._id}" class="btn btn-secondary btn-sm">
                                    <i class="fas fa-edit"></i> Edit
                                </a>
                                <button class="btn btn-danger btn-sm" onclick="postsManager.deletePost('${post._id}')">
                                    <i class="fas fa-trash"></i> Delete
                                </button>
                            </div>
                        ` : ''}
                    </div>
                    
                    <h1 class="post-title mb-3">${this.escapeHtml(post.title)}</h1>
                    
                    <div class="post-meta mb-4">
                        <span><i class="fas fa-user"></i> ${this.escapeHtml(post.author.username)}</span>
                        <span><i class="fas fa-calendar"></i> ${formatDate(post.createdAt)}</span>
                        ${post.updatedAt !== post.createdAt ? 
                            `<span><i class="fas fa-edit"></i> Updated ${formatDate(post.updatedAt)}</span>` : ''
                        }
                    </div>
                    
                    <div class="post-content">
                        <p>${this.escapeHtml(post.content).replace(/\n/g, '<br>')}</p>
                    </div>
                </div>
                
                <!-- Comments Section -->
                <div id="comments-section"></div>
            </div>
        `;
    }

    // Render create/edit post form
    renderPostForm(post = null) {
        const isEdit = !!post;
        const title = isEdit ? 'Edit Post' : 'Create New Post';
        
        return `
            <div class="container">
                <div class="card">
                    <div class="mb-4">
                        <a href="/" class="btn btn-secondary">
                            <i class="fas fa-arrow-left"></i> Back
                        </a>
                    </div>
                    
                    <h2 class="text-center mb-4">${title}</h2>
                    
                    <form id="post-form">
                        <div class="form-group">
                            <label class="form-label" for="title">Title</label>
                            <input type="text" id="title" class="form-input" value="${isEdit ? this.escapeHtml(post.title) : ''}" required>
                            <div class="form-error" id="title-error"></div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" for="content">Content</label>
                            <textarea id="content" class="form-textarea" rows="10" required>${isEdit ? this.escapeHtml(post.content) : ''}</textarea>
                            <div class="form-error" id="content-error"></div>
                        </div>
                        
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save"></i> ${isEdit ? 'Update' : 'Create'} Post
                            </button>
                            <a href="/" class="btn btn-secondary">
                                <i class="fas fa-times"></i> Cancel
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    // Render pagination
    renderPagination(pagination) {
        if (!pagination || pagination.pages <= 1) return '';

        const { page, pages } = pagination;
        let paginationHTML = '<div class="pagination text-center mt-4">';

        // Previous button
        if (page > 1) {
            paginationHTML += `<button class="btn btn-secondary btn-sm mx-1" onclick="postsManager.loadPage(${page - 1})">
                <i class="fas fa-chevron-left"></i> Previous
            </button>`;
        }

        // Page numbers
        for (let i = 1; i <= pages; i++) {
            const isActive = i === page;
            paginationHTML += `<button class="btn ${isActive ? 'btn-primary' : 'btn-secondary'} btn-sm mx-1" onclick="postsManager.loadPage(${i})">${i}</button>`;
        }

        // Next button
        if (page < pages) {
            paginationHTML += `<button class="btn btn-secondary btn-sm mx-1" onclick="postsManager.loadPage(${page + 1})">
                Next <i class="fas fa-chevron-right"></i>
            </button>`;
        }

        paginationHTML += '</div>';
        return paginationHTML;
    }

    // Load specific page
    async loadPage(page) {
        const postsData = await this.loadPosts(page);
        if (postsData) {
            appRouter.renderPostsList(postsData);
        }
    }

    // Setup post form handlers
    setupPostForm(isEdit = false, postId = null) {
        const form = getElement('#post-form');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Clear previous errors
            getElements('.form-error').forEach(el => el.textContent = '');
            
            const title = getElement('#title').value.trim();
            const content = getElement('#content').value.trim();

            // Basic validation
            let isValid = true;
            
            if (!title) {
                getElement('#title-error').textContent = 'Title is required';
                isValid = false;
            }
            
            if (!content) {
                getElement('#content-error').textContent = 'Content is required';
                isValid = false;
            } else if (content.length < 10) {
                getElement('#content-error').textContent = 'Content must be at least 10 characters';
                isValid = false;
            }

            if (isValid) {
                if (isEdit) {
                    await this.updatePost(postId, { title, content });
                } else {
                    await this.createPost({ title, content });
                }
            }
        });
    }

    // Handle post click
    handlePostClick(postId) {
        navigateTo(`/post/${postId}`);
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Create global posts manager instance
const postsManager = new PostsManager();
