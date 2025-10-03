# TaskFlow API

A robust and secure RESTful API for personal task management built with Node.js, Express, and MongoDB. This API provides full CRUD operations for tasks with JWT authentication and comprehensive documentation.

## 🚀 Features

- **User Authentication**: JWT-based registration and login system
- **Task Management**: Full CRUD operations for tasks
- **Security**: Password hashing with bcrypt and protected routes
- **Documentation**: Interactive Swagger/OpenAPI documentation
- **Error Handling**: Comprehensive error handling with appropriate HTTP status codes
- **Validation**: Input validation and data sanitization

## 📋 API Endpoints

### Authentication
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/auth/register` | Register a new user | Public |
| POST | `/auth/login` | Login user | Public |

### Tasks
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET | `/tasks` | Get all tasks for authenticated user | Private |
| POST | `/tasks` | Create a new task | Private |
| GET | `/tasks/:id` | Get a single task by ID | Private |
| PUT | `/tasks/:id` | Update a task | Private |
| DELETE | `/tasks/:id` | Delete a task | Private |

## 🛠️ Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB instance
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/taskflow-api.git
   cd taskflow-api
Install dependencies


npm install
Environment Configuration



# Development mode
npm run dev

# Production mode
npm start
📚 API Documentation
Once the server is running, access the interactive API documentation at:

text
http://localhost:3000/api-docs
The documentation provides:

Complete endpoint descriptions

Request/response schemas

Interactive testing capability

Authentication examples

🗄️ Database Schema
User Model
javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
Task Model
javascript
{
  title: String,
  description: String,
  dueDate: Date,
  status: String (enum: ['pending', 'in-progress', 'completed']),
  category: String,
  userId: ObjectId (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
🔐 Authentication
The API uses JWT (JSON Web Tokens) for authentication. To access protected routes:

Register a new user or login to receive a JWT token


🚢 Deployment
Deploy to Render
Push your code to GitHub

Create a new Web Service on Render

Connect your GitHub repository

Add environment variables in Render dashboard:

MONGODB_URI

JWT_SECRET

NODE_ENV=production

Deploy

Environment Variables for Production

NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_production_jwt_secret
🧪 Testing the API
Using Swagger UI
Navigate to /api-docs on your deployed application

Use the "Authorize" button to set your JWT token

Test endpoints directly from the documentation

Using curl or Postman

# Register a new user
curl -X POST https://cse341-taskflow-api.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST https://your-app.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Create a task (with JWT token)
curl -X POST https://cse341-taskflow-api.onrender.com/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title":"Complete project","description":"Finish the API documentation","status":"pending"}'
📦 Dependencies
Production
express: Web framework

mongoose: MongoDB ODM

bcryptjs: Password hashing

jsonwebtoken: JWT authentication

swagger-ui-express: API documentation

dotenv: Environment variables

cors: Cross-origin resource sharing

Development
nodemon: Development server with auto-restart

# Video
https://youtu.be/82-ze4tENMA

🤝 Contributing
Fork the repository

Create a feature branch (git checkout -b feature/amazing-feature)

Commit your changes (git commit -m 'Add some amazing feature')

Push to the branch (git push origin feature/amazing-feature)

Open a Pull Request

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

👥 Author
Nuno Ferreira - Initial work

🙏 Acknowledgments
Brigham Young University-Idaho for the project guidelines

MongoDB Atlas for database hosting

Render for deployment platform