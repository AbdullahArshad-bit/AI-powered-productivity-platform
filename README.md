# 🚀 AI Task Assistant

A modern, AI-powered productivity platform that helps you manage tasks, projects, notes, and boost your productivity with intelligent automation.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-ISC-green)
![React](https://img.shields.io/badge/React-19.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-22.21.0-green)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Screenshots](#-screenshots)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Environment Variables](#-environment-variables)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🎯 Core Features

- **AI-Powered Assistant**: Get intelligent task breakdowns and productivity insights powered by advanced AI (OpenAI GPT-3.5 or Hugging Face)
- **Smart Kanban Board**: Organize tasks with drag-and-drop interface. Visualize your workflow effortlessly
- **Calendar Integration**: View all your tasks on a beautiful calendar. Never miss a deadline again
- **Project Management**: Organize tasks into projects. Track progress and collaborate effectively
- **Knowledge Base**: Store and organize your notes. AI helps you find information quickly
- **Tag System**: Categorize and organize tasks, notes, and projects with custom tags
- **Analytics & Insights**: Track your productivity with detailed analytics and progress reports

### 🔐 Authentication & Security

- **Secure Authentication**: JWT-based authentication with password hashing
- **Email Verification**: Email verification with OTP codes for account security
- **Password Validation**: Strong password requirements (8+ characters, uppercase, lowercase, special character)
- **Protected Routes**: Private routes for authenticated users only

### 🎨 User Interface

- **Modern Design**: Beautiful, responsive UI with glassmorphism effects
- **Dark Mode Support**: Toggle between light and dark themes
- **Smooth Animations**: Professional animations and transitions
- **Mobile Responsive**: Works seamlessly on all devices
- **Professional Homepage**: Landing page with features, about, contact, and privacy policy

## 🛠️ Tech Stack

### Frontend

- **React 19.2.0**: Modern React with hooks
- **React Router DOM 7.10.1**: Client-side routing
- **Tailwind CSS 4.1.18**: Utility-first CSS framework
- **Vite 7.2.4**: Fast build tool and dev server
- **Axios 1.13.2**: HTTP client for API requests
- **Lucide React 0.561.0**: Beautiful icon library
- **@dnd-kit**: Drag and drop functionality for Kanban board
- **React Markdown 10.1.0**: Markdown rendering for AI responses

### Backend

- **Node.js 22.21.0**: JavaScript runtime
- **Express.js 5.2.1**: Web framework
- **MongoDB**: Database (via Mongoose)
- **Mongoose 9.0.1**: MongoDB object modeling
- **JWT (jsonwebtoken 9.0.3)**: Authentication tokens
- **bcryptjs 3.0.3**: Password hashing
- **Nodemailer 7.0.11**: Email sending
- **OpenAI 6.10.0**: AI integration
- **dotenv 17.2.3**: Environment variables

## 📸 Screenshots

### Home Page
- Professional landing page with hero section
- Features showcase
- About section
- Call-to-action sections

### Dashboard
- Overview of tasks, projects, and notes
- Quick statistics
- Quick actions

### Kanban Board
- Drag-and-drop task management
- Multiple columns (To Do, In Progress, Done)
- Task filtering and search

### Calendar View
- Monthly calendar with tasks
- Task creation from calendar
- Deadline tracking

### AI Assistant
- Chat interface with AI
- Task breakdown suggestions
- Markdown support

## 🚀 Installation

### Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB)
- Gmail account (for email verification)
- OpenAI API key (optional, can use Hugging Face as free alternative)

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd "Project 1"
```

### Step 2: Install Dependencies

#### Backend

```bash
cd server
npm install
```

#### Frontend

```bash
cd client
npm install
```

### Step 3: Configure Environment Variables

#### Backend (.env)

Create a `.env` file in the `server` directory:

```env
# Server Configuration
PORT=5000

# MongoDB Configuration
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_random

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password-16-digits

# AI Configuration (Choose one or both)
# OpenAI API Key
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx

# Hugging Face API Key (Free Alternative)
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxx
```

#### Frontend

The frontend uses the backend API. Make sure the backend is running on the port specified in your backend `.env` file.

### Step 4: Run the Application

#### Start Backend Server

```bash
cd server
npm start
```

The server will run on `http://localhost:5000`

#### Start Frontend Development Server

```bash
cd client
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

## ⚙️ Configuration

### MongoDB Atlas Setup

1. Create a MongoDB Atlas account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user with username and password
4. Whitelist your IP address (or use `0.0.0.0/0` for all IPs)
5. Get your connection string and replace `<username>` and `<password>` in `MONGO_URI`

### Email Configuration (Gmail)

1. Enable 2-Step Verification on your Gmail account
2. Generate an App Password:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Copy the 16-digit password
3. Add to `.env`:
   - `EMAIL_USER`: Your Gmail address
   - `EMAIL_PASSWORD`: The 16-digit app password

### AI API Configuration

#### Option 1: OpenAI (Paid)

1. Get API key from [platform.openai.com](https://platform.openai.com)
2. Add `OPENAI_API_KEY` to `.env`

#### Option 2: Hugging Face (Free)

1. Get API key from [huggingface.co](https://huggingface.co)
2. Add `HUGGINGFACE_API_KEY` to `.env`
3. The app will use Hugging Face as primary, fallback to OpenAI if available

## 📖 Usage

### Getting Started

1. **Register**: Create a new account at `/register`
2. **Verify Email**: Check your email for verification code
3. **Login**: Sign in with your credentials
4. **Dashboard**: Access your dashboard to see overview

### Creating Tasks

1. Go to **Tasks** page
2. Click **Create Task**
3. Fill in task details
4. Use **AI Help** to get task breakdown suggestions
5. Drag tasks between columns (To Do → In Progress → Done)

### Managing Projects

1. Go to **Projects** page
2. Click **Create Project**
3. Add tasks to projects from project detail page
4. Track project progress

### Using AI Assistant

1. Go to **AI Assistant** page
2. Ask questions about your tasks, notes, or productivity
3. Get intelligent suggestions and breakdowns
4. Use **AI Help** button in task creation for automatic breakdown

### Calendar View

1. Go to **Calendar** page
2. View tasks by date
3. Click on a date to create a new task
4. See all upcoming deadlines

### Notes Management

1. Go to **Notes** page
2. Create, edit, and delete notes
3. Add tags to organize notes
4. Search through your notes

### Tags

1. Go to **Tags** page
2. Create custom tags with colors
3. Use tags to categorize tasks, notes, and projects
4. Track tag usage statistics

## 📁 Project Structure

```
Project 1/
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── layout/    # Layout components
│   │   │   ├── tasks/     # Task-related components
│   │   │   ├── projects/  # Project components
│   │   │   ├── notes/     # Note components
│   │   │   ├── tags/      # Tag components
│   │   │   └── ui/        # UI components (Button, Input)
│   │   ├── pages/         # Page components
│   │   │   ├── auth/      # Authentication pages
│   │   │   └── ...        # Other pages
│   │   ├── context/       # React Context (AuthContext)
│   │   ├── utils/         # Utility functions
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # Backend Node.js application
│   ├── config/            # Configuration files
│   │   └── db.js          # MongoDB connection
│   ├── controllers/       # Route controllers
│   │   ├── authController.js
│   │   ├── taskController.js
│   │   ├── projectController.js
│   │   ├── noteController.js
│   │   ├── tagController.js
│   │   └── aiController.js
│   ├── middleware/        # Express middleware
│   │   └── authMiddleware.js
│   ├── models/            # Mongoose models
│   │   ├── User.js
│   │   ├── Task.js
│   │   ├── Project.js
│   │   ├── Note.js
│   │   ├── Tag.js
│   │   └── EmailVerification.js
│   ├── routes/            # Express routes
│   │   ├── authRoutes.js
│   │   ├── taskRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── noteRoutes.js
│   │   ├── tagRoutes.js
│   │   └── aiRoutes.js
│   ├── services/          # Business logic
│   │   └── aiService.js   # AI integration
│   ├── utils/             # Utility functions
│   │   ├── emailService.js
│   │   ├── passwordValidator.js
│   │   └── generateToken.js
│   ├── server.js          # Express app entry point
│   ├── package.json
│   └── .env               # Environment variables
│
└── README.md              # This file
```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify-email` - Verify email with OTP
- `POST /api/auth/resend-verification` - Resend verification code
- `GET /api/auth/me` - Get current user (protected)

### Tasks

- `GET /api/tasks` - Get all tasks (protected)
- `POST /api/tasks` - Create new task (protected)
- `GET /api/tasks/:id` - Get task by ID (protected)
- `PUT /api/tasks/:id` - Update task (protected)
- `DELETE /api/tasks/:id` - Delete task (protected)

### Projects

- `GET /api/projects` - Get all projects (protected)
- `POST /api/projects` - Create new project (protected)
- `GET /api/projects/:id` - Get project by ID (protected)
- `PUT /api/projects/:id` - Update project (protected)
- `DELETE /api/projects/:id` - Delete project (protected)

### Notes

- `GET /api/notes` - Get all notes (protected)
- `POST /api/notes` - Create new note (protected)
- `GET /api/notes/:id` - Get note by ID (protected)
- `PUT /api/notes/:id` - Update note (protected)
- `DELETE /api/notes/:id` - Delete note (protected)

### Tags

- `GET /api/tags` - Get all tags (protected)
- `POST /api/tags` - Create new tag (protected)
- `GET /api/tags/:id` - Get tag by ID (protected)
- `PUT /api/tags/:id` - Update tag (protected)
- `DELETE /api/tags/:id` - Delete tag (protected)
- `GET /api/tags/stats` - Get tag statistics (protected)

### AI Assistant

- `POST /api/ai/chat` - Chat with AI assistant (protected)
- `POST /api/ai/breakdown` - Get task breakdown (protected)

## 🔐 Environment Variables

### Required

- `PORT`: Server port (default: 5000)
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens

### Optional

- `EMAIL_USER`: Gmail address for email verification
- `EMAIL_PASSWORD`: Gmail app password (16 digits)
- `OPENAI_API_KEY`: OpenAI API key for AI features
- `HUGGINGFACE_API_KEY`: Hugging Face API key (free alternative)

## 🎯 Key Features Explained

### AI-Powered Task Breakdown

When creating a task, click "AI Help" to get intelligent subtask suggestions. The AI analyzes your task description and provides a structured breakdown.

### Drag-and-Drop Kanban

Tasks can be dragged between columns (To Do, In Progress, Done) to update their status visually.

### Email Verification

After registration, users receive a 6-digit OTP code via email. This must be verified before accessing the dashboard.

### Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one special character

### Tag System

Create custom tags with colors to organize tasks, notes, and projects. Tags track usage statistics.

## 🐛 Troubleshooting

### MongoDB Connection Issues

- Verify your connection string is correct
- Check IP whitelist in MongoDB Atlas
- Ensure username and password are URL-encoded if they contain special characters

### Email Not Sending

- Verify Gmail App Password is correct (16 digits)
- Check that 2-Step Verification is enabled
- Ensure `EMAIL_USER` is your full Gmail address

### AI Not Working

- Check API keys in `.env`
- Verify API key is valid and has credits (OpenAI)
- Try Hugging Face as free alternative
- Check server logs for error messages

### CORS Errors

- Ensure backend CORS is configured correctly
- Check that frontend is calling correct backend URL

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**AI Task Assistant Team**

- Email: aipoweredassistant49@gmail.com
- Phone: +92(332)6665102
- Address: Plot 135, Township Block 5 Twp Sector C2 Lahore

## 🙏 Acknowledgments

- OpenAI for GPT API
- Hugging Face for free AI alternatives
- MongoDB Atlas for cloud database
- All open-source contributors

## 📞 Support

For support, email aipoweredassistant49@gmail.com or visit the Contact page in the application.

---

**Made with ❤️ using React, Node.js, and AI**
