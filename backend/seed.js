const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Post = require('./models/Post');
const Comment = require('./models/Comment');

// Sample data for testing
const sampleUsers = [
    {
        username: 'john_doe',
        email: 'john@example.com',
        password: 'password123'
    },
    {
        username: 'jane_smith',
        email: 'jane@example.com',
        password: 'password123'
    },
    {
        username: 'mike_wilson',
        email: 'mike@example.com',
        password: 'password123'
    }
];

const samplePosts = [
    {
        title: 'Getting Started with Node.js',
        content: 'Node.js is a powerful JavaScript runtime built on Chrome\'s V8 JavaScript engine. It allows developers to run JavaScript on the server-side, opening up new possibilities for web development.\n\nIn this post, we\'ll explore the basics of Node.js and why it has become so popular among developers.\n\n## What is Node.js?\n\nNode.js is an open-source, cross-platform JavaScript runtime environment that executes JavaScript code outside a web browser. It was created by Ryan Dahl in 2009 and has since become one of the most popular technologies for building scalable network applications.\n\n## Key Features\n\n1. **Asynchronous and Event-Driven**: Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient.\n2. **Fast Execution**: Built on Chrome\'s V8 JavaScript engine, Node.js provides excellent performance.\n3. **NPM Ecosystem**: With over 1 million packages, the Node Package Manager (NPM) is the largest software registry in the world.\n4. **Cross-Platform**: Node.js runs on various platforms including Windows, macOS, and Linux.\n\n## Getting Started\n\nTo get started with Node.js, you\'ll need to:\n\n1. Download and install Node.js from the official website\n2. Verify your installation using node --version\n3. Create your first Node.js application\n4. Explore the vast ecosystem of NPM packages\n\nNode.js has revolutionized the way we think about JavaScript and web development. Whether you\'re building a simple API or a complex microservices architecture, Node.js provides the tools and performance you need.'
    },
    {
        title: 'Building RESTful APIs with Express',
        content: 'Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. It\'s one of the most popular frameworks for building RESTful APIs.\n\n## What is Express?\n\nExpress is a web application framework for Node.js that provides a thin layer of fundamental web application features, without obscuring Node.js features. It\'s designed to make building web applications and APIs much easier.\n\n## Core Concepts\n\n### Routing\nRouting refers to how an application\'s endpoints (URIs) respond to client requests. Express provides a simple routing system:\n\n```javascript\napp.get(\'/users\', (req, res) => {\n  // Handle GET request to /users\n});\n\napp.post(\'/users\', (req, res) => {\n  // Handle POST request to /users\n});\n```\n\n### Middleware\nMiddleware functions are functions that have access to the request object (req), the response object (res), and the next function in the application\'s request-response cycle:\n\n```javascript\napp.use((req, res, next) => {\n  console.log(\'Time:\', Date.now());\n  next();\n});\n```\n\n### Error Handling\nExpress provides built-in error handling mechanisms:\n\n```javascript\napp.use((err, req, res, next) => {\n  console.error(err.stack);\n  res.status(500).send(\'Something broke!\');\n});\n```\n\n## Building a RESTful API\n\nHere\'s how you can structure a basic RESTful API with Express:\n\n1. Define your routes for different HTTP methods\n2. Implement middleware for authentication and validation\n3. Handle errors gracefully\n4. Use proper HTTP status codes\n5. Implement pagination for large datasets\n\nExpress makes it easy to build scalable and maintainable APIs that follow REST principles.'
    },
    {
        title: 'MongoDB Basics for Web Developers',
        content: 'MongoDB is a popular NoSQL database that provides high performance, high availability, and automatic scaling. It\'s an excellent choice for web applications that need to handle large amounts of data.\n\n## What is MongoDB?\n\nMongoDB is a document-oriented database that stores data in flexible, JSON-like documents. Unlike traditional relational databases, MongoDB doesn\'t require a predefined schema, making it perfect for applications with evolving data requirements.\n\n## Key Features\n\n1. **Document-Oriented**: Stores data in flexible, JSON-like documents\n2. **Schema-less**: No predefined schema required\n3. **Scalable**: Horizontal scaling with sharding\n4. **High Performance**: Optimized for read and write operations\n5. **Rich Query Language**: Powerful querying and aggregation capabilities\n\n## Basic Operations\n\n### Inserting Documents\n```javascript\ndb.users.insertOne({\n  name: "John Doe",\n  email: "john@example.com",\n  age: 30\n});\n```\n\n### Querying Documents\n```javascript\ndb.users.find({ age: { $gte: 18 } });\n```\n\n### Updating Documents\n```javascript\ndb.users.updateOne(\n  { name: "John Doe" },\n  { $set: { age: 31 } }\n);\n```\n\n### Deleting Documents\n```javascript\ndb.users.deleteOne({ name: "John Doe" });\n```\n\n## Using MongoDB with Node.js\n\nThe Mongoose library makes it easy to work with MongoDB in Node.js applications:\n\n```javascript\nconst mongoose = require(\'mongoose\');\n\nconst userSchema = new mongoose.Schema({\n  name: String,\n  email: String,\n  age: Number\n});\n\nconst User = mongoose.model(\'User\', userSchema);\n```\n\nMongoDB\'s flexibility and scalability make it an excellent choice for modern web applications that need to handle diverse and evolving data requirements.'
    },
    {
        title: 'Frontend Development Best Practices',
        content: 'Frontend development has evolved significantly over the years. Modern web applications require careful planning and implementation to ensure optimal performance, accessibility, and user experience.\n\n## Performance Optimization\n\n### Lazy Loading\nImplement lazy loading for images and components to improve initial page load times:\n\n```javascript\nconst imageObserver = new IntersectionObserver((entries) => {\n  entries.forEach(entry => {\n    if (entry.isIntersecting) {\n      const img = entry.target;\n      img.src = img.dataset.src;\n      imageObserver.unobserve(img);\n    }\n  });\n});\n```\n\n### Code Splitting\nSplit your JavaScript code into smaller chunks that can be loaded on demand:\n\n```javascript\n// Dynamic import\nconst module = await import(\'./module.js\');\n```\n\n### Minification and Compression\nAlways minify your CSS and JavaScript files in production. Enable gzip compression on your server.\n\n## Accessibility Best Practices\n\n### Semantic HTML\nUse semantic HTML elements to provide meaning to your content:\n\n```html\n<nav>\n  <ul>\n    <li><a href="/">Home</a></li>\n    <li><a href="/about">About</a></li>\n  </ul>\n</nav>\n```\n\n### ARIA Attributes\nUse ARIA attributes to enhance accessibility for screen readers:\n\n```html\n<button aria-label="Close dialog" aria-expanded="false">\n  <span aria-hidden="true">&times;</span>\n</button>\n```\n\n## Responsive Design\n\n### Mobile-First Approach\nStart with mobile layouts and progressively enhance for larger screens:\n\n```css\n/* Mobile first */\n.container {\n  width: 100%;\n  padding: 1rem;\n}\n\n/* Tablet and up */\n@media (min-width: 768px) {\n  .container {\n    max-width: 750px;\n    margin: 0 auto;\n  }\n}\n```\n\n### Flexible Grid Systems\nUse CSS Grid and Flexbox for flexible layouts:\n\n```css\n.grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n  gap: 1rem;\n}\n```\n\n## Security Considerations\n\n### Content Security Policy\nImplement a strong Content Security Policy to prevent XSS attacks:\n\n```html\n<meta http-equiv="Content-Security-Policy" \n      content="default-src \'self\'; script-src \'self\' \'unsafe-inline\';">\n```\n\n### Input Validation\nAlways validate and sanitize user input on both client and server side.\n\nFollowing these best practices will help you build web applications that are fast, accessible, and secure.'
    }
];

const sampleComments = [
    {
        content: "Great introduction to Node.js! This really helped me understand the basics.",
        postIndex: 0,
        authorIndex: 1
    },
    {
        content: "I've been using Express for a while now, and this post covers all the important concepts perfectly.",
        postIndex: 1,
        authorIndex: 0
    },
    {
        content: "MongoDB is indeed a great choice for modern applications. The flexibility of document databases is amazing!",
        postIndex: 2,
        authorIndex: 2
    },
    {
        content: "Thanks for sharing these frontend best practices. The performance optimization tips are especially useful.",
        postIndex: 3,
        authorIndex: 1
    },
    {
        content: "Could you write more about middleware in Express? I'd love to learn more about custom middleware.",
        postIndex: 1,
        authorIndex: 2
    },
    {
        content: "This is exactly what I needed to get started with web development. Clear, concise, and practical!",
        postIndex: 0,
        authorIndex: 2
    },
    {
        content: "The accessibility section is really important. More developers should focus on building inclusive applications.",
        postIndex: 3,
        authorIndex: 0
    },
    {
        content: "MongoDB's aggregation framework is incredibly powerful. You should consider writing about that next!",
        postIndex: 2,
        authorIndex: 1
    }
];

// Seed function
async function seedDatabase() {
    try {
        // Clear existing data
        await User.deleteMany({});
        await Post.deleteMany({});
        await Comment.deleteMany({});
        
        console.log('Cleared existing data');
        
        // Create users
        const createdUsers = [];
        for (const userData of sampleUsers) {
            const user = new User(userData);
            await user.save();
            createdUsers.push(user);
        }
        console.log(`Created ${createdUsers.length} users`);
        
        // Create posts
        const createdPosts = [];
        for (let i = 0; i < samplePosts.length; i++) {
            const postData = {
                ...samplePosts[i],
                author: createdUsers[i % createdUsers.length]._id
            };
            const post = new Post(postData);
            await post.save();
            createdPosts.push(post);
        }
        console.log(`Created ${createdPosts.length} posts`);
        
        // Create comments
        for (const commentData of sampleComments) {
            const comment = new Comment({
                content: commentData.content,
                post: createdPosts[commentData.postIndex]._id,
                author: createdUsers[commentData.authorIndex]._id
            });
            await comment.save();
        }
        console.log(`Created ${sampleComments.length} comments`);
        
        console.log('Database seeded successfully!');
        
        // Display created data summary
        console.log('\n=== Created Users ===');
        createdUsers.forEach(user => {
            console.log(`- ${user.username} (${user.email})`);
        });
        
        console.log('\n=== Created Posts ===');
        createdPosts.forEach(post => {
            console.log(`- "${post.title}" by ${post.author}`);
        });
        
        console.log('\n=== Sample Login Credentials ===');
        console.log('Email: john@example.com | Password: password123');
        console.log('Email: jane@example.com | Password: password123');
        console.log('Email: mike@example.com | Password: password123');
        
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        mongoose.disconnect();
    }
}

// Connect to database and seed
const connectAndSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blog-platform', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB for seeding');
    await seedDatabase();
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Only run seeding if this file is run directly
if (require.main === module) {
  connectAndSeed();
}

module.exports = { seedDatabase, connectAndSeed };
