const fs = require('fs');
const envContent = `PORT=3000
MONGODB_URI=mongodb://localhost:27017/blog-platform
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
`;

fs.writeFileSync('.env', envContent);
console.log('Created .env file with PORT=3000');
