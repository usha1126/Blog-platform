# Blog Platform

A full-stack blog platform built with Node.js, Express, MongoDB, and vanilla JavaScript frontend.

## Features

### Backend
- RESTful APIs for user authentication, posts, and comments
- JWT-based authentication system
- User registration and login
- CRUD operations for posts (create, read, update, delete)
- Comments system linked to posts and users
- MongoDB with Mongoose ODM
- Input validation and error handling
- Environment variables for configuration

### Frontend
- Responsive design for mobile and desktop
- Dynamic CSS effects with hover animations and transitions
- Single Page Application (SPA) with client-side routing
- Modern UI with card-based layout
- Interactive forms with validation
- Real-time updates without page refresh
- Loading states and error handling
- Toast notifications for user feedback

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

### Frontend
- **Vanilla JavaScript** - No frameworks required
- **CSS3** - Modern styling with animations
- **Font Awesome** - Icons
- **Google Fonts** - Typography

## Project Structure

```
blog-platform/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Post.js
│   │   └── Comment.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── posts.js
│   │   └── comments.js
│   ├── middleware/
│   │   └── auth.js
│   └── server.js
├── frontend/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── api.js
│   │   ├── auth.js
│   │   ├── posts.js
│   │   ├── comments.js
│   │   └── app.js
│   └── index.html
├── package.json
├── .env.example
└── README.md
```

## Installation and Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)

### 1. Clone and Install Dependencies

```bash
cd blog-platform
npm install
```

### 2. Environment Setup

Copy the environment example file:
```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blog-platform
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

### 3. Start MongoDB

If using local MongoDB:
```bash
mongod
```

### 4. Start the Application

For development:
```bash
npm run dev
```

For production:
```bash
npm start
```

The application will be available at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Posts
- `GET /api/posts` - Get all posts (with pagination)
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post (protected)
- `PUT /api/posts/:id` - Update post (protected, author only)
- `DELETE /api/posts/:id` - Delete post (protected, author only)

### Comments
- `GET /api/comments/post/:postId` - Get comments for a post
- `POST /api/comments` - Create new comment (protected)
- `DELETE /api/comments/:id` - Delete comment (protected, author only)

## Usage

### As a Guest
- View all blog posts
- Read individual posts
- View comments on posts

### As a Registered User
- All guest features
- Create new blog posts
- Edit and delete your own posts
- Add comments to posts
- Delete your own comments

### Registration and Login
1. Click "Register" to create an account
2. Fill in username, email, and password
3. Login with your credentials
4. Start creating content!

## Features in Detail

### Authentication System
- Secure password hashing with bcrypt
- JWT tokens for session management
- Protected routes with middleware
- Automatic token refresh handling

### Post Management
- Rich text content support
- Author attribution
- Creation and modification timestamps
- Pagination for post lists
- Search and filtering capabilities

### Comment System
- Nested discussions
- Real-time updates
- Author verification
- Timestamp formatting

### User Interface
- Responsive design for all devices
- Smooth animations and transitions
- Loading states and error handling
- Keyboard shortcuts
- Accessibility features

## Development

### Adding New Features
1. Backend: Add routes in `/backend/routes/`
2. Models: Define schemas in `/backend/models/`
3. Frontend: Add JavaScript modules in `/frontend/js/`
4. Styling: Update CSS in `/frontend/css/style.css`

### Code Style
- ES6+ JavaScript features
- Async/await for asynchronous operations
- Modular architecture
- Error handling throughout
- Input validation on both client and server

## Security Considerations
- Password hashing with bcrypt
- JWT token authentication
- Input sanitization
- XSS protection
- CORS configuration
- Environment variable usage

## Performance Optimizations
- Lazy loading for images
- Debounced scroll events
- Efficient DOM manipulation
- Optimized database queries
- Client-side caching

## Deployment

### Environment Variables
Set these in your production environment:
- `NODE_ENV=production`
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Strong secret key
- `PORT` - Application port (default: 5000)

### Process Management
Use PM2 for production:
```bash
npm install -g pm2
pm2 start backend/server.js --name blog-platform
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For issues and questions, please open an issue on the repository.

---

**Built with ❤️ using Node.js, Express, MongoDB, and vanilla JavaScript**
