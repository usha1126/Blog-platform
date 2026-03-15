// Comments functionality
class CommentsManager {
    constructor() {
        this.comments = [];
        this.currentPostId = null;
        this.currentPage = 1;
        this.commentsPerPage = 20;
    }

    // Load comments for a post
    async loadComments(postId, page = 1) {
        try {
            this.currentPostId = postId;
            const response = await api.getComments(postId, page, this.commentsPerPage);
            
            if (response.success) {
                this.comments = response.data.comments;
                this.currentPage = page;
                return response.data;
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            handleError(error, 'Failed to load comments');
            return null;
        }
    }

    // Create new comment
    async createComment(content, postId) {
        try {
            const response = await api.createComment({
                content,
                post: postId
            });
            
            if (response.success) {
                showToast('Comment added successfully!', 'success');
                // Reload comments to show the new one
                await this.loadComments(postId);
                this.renderComments();
                return true;
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            handleError(error, 'Failed to add comment');
            return false;
        }
    }

    // Delete comment
    async deleteComment(commentId) {
        if (!confirm('Are you sure you want to delete this comment?')) {
            return false;
        }

        try {
            const response = await api.deleteComment(commentId);
            
            if (response.success) {
                showToast('Comment deleted successfully!', 'success');
                // Reload comments
                await this.loadComments(this.currentPostId);
                this.renderComments();
                return true;
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            handleError(error, 'Failed to delete comment');
            return false;
        }
    }

    // Render comments section
    renderComments(commentsData = null) {
        const data = commentsData || { comments: this.comments, pagination: null };
        const { comments, pagination } = data;

        const commentsHTML = `
            <div class="comments-section">
                <h3>Comments (${comments.length})</h3>
                
                <!-- Add Comment Form -->
                ${authManager.isAuthenticated() ? this.renderCommentForm() : `
                    <div class="card mb-4 text-center">
                        <p><a href="/login">Login</a> to add a comment</p>
                    </div>
                `}
                
                <!-- Comments List -->
                <div class="comments-list">
                    ${comments.length > 0 ? 
                        comments.map(comment => this.renderComment(comment)).join('') : 
                        '<p class="text-muted">No comments yet. Be the first to comment!</p>'
                    }
                </div>
                
                <!-- Pagination -->
                ${this.renderPagination(pagination)}
            </div>
        `;

        const commentsSection = getElement('#comments-section');
        if (commentsSection) {
            commentsSection.innerHTML = commentsHTML;
            this.setupCommentForm();
        }
    }

    // Render individual comment
    renderComment(comment) {
        const isAuthor = authManager.isAuthenticated() && 
                        authManager.getCurrentUser()._id === comment.author._id;

        return `
            <div class="comment fade-in">
                <div class="comment-header">
                    <div>
                        <span class="comment-author">${this.escapeHtml(comment.author.username)}</span>
                        <span class="comment-date">${formatDateTime(comment.createdAt)}</span>
                    </div>
                    ${isAuthor ? `
                        <button class="btn btn-danger btn-sm" onclick="commentsManager.deleteComment('${comment._id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    ` : ''}
                </div>
                <div class="comment-content">
                    <p>${this.escapeHtml(comment.content).replace(/\n/g, '<br>')}</p>
                </div>
            </div>
        `;
    }

    // Render comment form
    renderCommentForm() {
        return `
            <div class="card mb-4">
                <h4>Add a Comment</h4>
                <form id="comment-form">
                    <div class="form-group">
                        <textarea id="comment-content" class="form-textarea" rows="3" placeholder="Share your thoughts..." required></textarea>
                        <div class="form-error" id="comment-content-error"></div>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-comment"></i> Add Comment
                        </button>
                    </div>
                </form>
            </div>
        `;
    }

    // Render pagination for comments
    renderPagination(pagination) {
        if (!pagination || pagination.pages <= 1) return '';

        const { page, pages } = pagination;
        let paginationHTML = '<div class="pagination text-center mt-4">';

        // Previous button
        if (page > 1) {
            paginationHTML += `<button class="btn btn-secondary btn-sm mx-1" onclick="commentsManager.loadPage(${page - 1})">
                <i class="fas fa-chevron-left"></i> Previous
            </button>`;
        }

        // Page numbers
        for (let i = 1; i <= pages; i++) {
            const isActive = i === page;
            paginationHTML += `<button class="btn ${isActive ? 'btn-primary' : 'btn-secondary'} btn-sm mx-1" onclick="commentsManager.loadPage(${i})">${i}</button>`;
        }

        // Next button
        if (page < pages) {
            paginationHTML += `<button class="btn btn-secondary btn-sm mx-1" onclick="commentsManager.loadPage(${page + 1})">
                Next <i class="fas fa-chevron-right"></i>
            </button>`;
        }

        paginationHTML += '</div>';
        return paginationHTML;
    }

    // Load specific page of comments
    async loadPage(page) {
        if (!this.currentPostId) return;
        
        const commentsData = await this.loadComments(this.currentPostId, page);
        if (commentsData) {
            this.renderComments(commentsData);
        }
    }

    // Setup comment form handlers
    setupCommentForm() {
        const form = getElement('#comment-form');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Clear previous errors
            getElements('.form-error').forEach(el => el.textContent = '');
            
            const content = getElement('#comment-content').value.trim();

            // Basic validation
            let isValid = true;
            
            if (!content) {
                getElement('#comment-content-error').textContent = 'Comment content is required';
                isValid = false;
            } else if (content.length < 3) {
                getElement('#comment-content-error').textContent = 'Comment must be at least 3 characters';
                isValid = false;
            } else if (content.length > 500) {
                getElement('#comment-content-error').textContent = 'Comment cannot exceed 500 characters';
                isValid = false;
            }

            if (isValid) {
                const success = await this.createComment(content, this.currentPostId);
                if (success) {
                    // Clear form
                    getElement('#comment-content').value = '';
                }
            }
        });

        // Character counter for comment textarea
        const textarea = getElement('#comment-content');
        if (textarea) {
            textarea.addEventListener('input', (e) => {
                const length = e.target.value.length;
                const maxLength = 500;
                
                // Update character counter if it exists
                let counter = getElement('#char-counter');
                if (!counter) {
                    counter = createElement('small', 'text-muted', '');
                    counter.id = 'char-counter';
                    textarea.parentNode.appendChild(counter);
                }
                
                counter.textContent = `${length}/${maxLength} characters`;
                
                // Change color based on length
                if (length > maxLength) {
                    counter.className = 'text-danger';
                } else if (length > maxLength * 0.9) {
                    counter.className = 'text-warning';
                } else {
                    counter.className = 'text-muted';
                }
            });
        }
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Clear current post
    clearCurrentPost() {
        this.currentPostId = null;
        this.comments = [];
        this.currentPage = 1;
    }
}

// Create global comments manager instance
const commentsManager = new CommentsManager();
