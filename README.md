# TaskFlow API

A personal task management REST API built with **Node.js, Express, MongoDB, and JWT authentication**.  
This project was developed for **CSE 341 – Backend Development** at BYU-Idaho.

---

## 🚀 Features

- **Authentication (JWT)**
  - Register and login users
  - Protected routes with Bearer tokens
- **Four collections with full CRUD**
  - Users
  - Tasks
  - Projects
  - Notes
- **Validation**
  - Required fields for POST and PUT requests
  - Returns `400 Bad Request` for invalid data
- **Swagger Documentation**
  - API documented and browsable at `/api-docs`
- **Testing**
  - Unit tests with **Jest**, **Supertest**, and **MongoDB Memory Server**
  - Covers GET and GET All routes for all collections
- **Deployment**
  - Hosted on **Render**
  - Swagger and endpoints accessible online

---

## 📂 Project Structure

├── config/ # Database configuration
├── controllers/ # Request handlers (auth, tasks, projects, notes)
├── middleware/ # Auth and error handling
├── models/ # Mongoose schemas (User, Task, Project, Note)
├── routes/ # API routes
├── swagger/ # Swagger API documentation
├── tests/ # Unit tests
├── server.js # Application entry point
└── package.json

yaml
Copiar código

---

## ⚙️ Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/your-username/taskflow-api.git
cd taskflow-api
2. Install dependencies
bash
Copiar código
npm install
3. Environment variables
Create a .env file in the root directory with the following:

ini
Copiar código
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=30d
NODE_ENV=development
PORT=3000
4. Start the server
For development:

bash
Copiar código
npm run dev
For production:

bash
Copiar código
npm start
The API will run at:

arduino
Copiar código
http://localhost:3000
Swagger docs:

bash
Copiar código
http://localhost:3000/api-docs
🔑 Authentication
Register a new user:

http
Copiar código
POST /auth/register
Login to receive a JWT:

http
Copiar código
POST /auth/login
Use the token for protected routes:

makefile
Copiar código
Authorization: Bearer <your-token>
📌 API Endpoints
Authentication
POST /auth/register → Register a user

POST /auth/login → Login and receive JWT

Tasks
GET /tasks → Get all tasks (protected)

GET /tasks/:id → Get a single task (protected)

POST /tasks → Create a new task (protected)

PUT /tasks/:id → Update a task (protected)

DELETE /tasks/:id → Delete a task (protected)

Projects
GET /projects → Get all projects (protected)

GET /projects/:id → Get a single project (protected)

POST /projects → Create a new project (protected)

PUT /projects/:id → Update a project (protected)

DELETE /projects/:id → Delete a project (protected)

Notes
GET /notes → Get all notes (protected)

GET /notes/:id → Get a single note (protected)

POST /notes → Create a new note (protected)

PUT /notes/:id → Update a note (protected)

DELETE /notes/:id → Delete a note (protected)

🧪 Testing
We use Jest, Supertest, and MongoDB Memory Server.

Run all tests:

bash
Copiar código
npm test
Example output:

bash
Copiar código
PASS  tests/projects.test.js
PASS  tests/notes.test.js

Test Suites: 2 passed, 2 total
Tests:       8 passed, 8 total
🌐 Deployment
The API is deployed on Render:

Base URL: https://cse341-taskflow-api.onrender.com

Swagger Docs: https://cse341-taskflow-api.onrender.com/api-docs

Health Check: https://cse341-taskflow-api.onrender.com/health

👤 Author
Nuno – CSE 341 Student
BYU-Idaho – Backend Development