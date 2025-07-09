# 🧠 JobPilot AI – AI-Powered Job Tracker

![JobPilot Banner](https://via.placeholder.com/1200x400?text=JobPilot+AI+Banner)

A full-stack application to supercharge your job search with AI-powered tools.

---

## ✨ Features

### 🧠 AI-Powered Job Search Tools
- **Smart Resume Analyzer** – Get tailored suggestions to improve your resume  
- **Personalized Cover Letter Generator** – Create custom cover letters in seconds  
- **Job Description Parser** – Extract key requirements from job postings

### 📊 Application Management
- **Dashboard Overview** – Visualize your job search progress  
- **Status Tracking** – Track applications (Applied, Interview, Offer, Rejected)  
- **Deadline Reminders** – Never miss an application deadline

### 🔒 Secure & Reliable
- **JWT Authentication** – Secure user accounts  
- **Data Encryption** – Protect your sensitive information  
- **Cloud Backups** – Never lose your application history

---

## 🛠 Tech Stack

### 🔹 Frontend
- React (CRA)
- Tailwind CSS
- React Router v6
- Axios
- React Hook Form
- React Icons

### 🔸 Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for Authentication
- Bcrypt for Password Hashing
- Nodemailer for Email Notifications

### 🤖 AI Services
- OpenAI API (GPT-4) for content generation
- PDF Parsing for Resume Analysis

---

## 🚀 Getting Started

### 🔧 Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB
- OpenAI API key

### 📦 Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/your-username/jobpilot-ai.git
cd jobpilot-ai
2. Setup the Backend
bash
Copy
Edit
cd server
npm install
cp .env.example .env
# ✅ Update .env with your credentials
3. Setup the Frontend
bash
Copy
Edit
cd ../client
npm install
cp .env.example .env
# ✅ Update .env with your API URL
4. Run the Application
Start the backend:

bash
Copy
Edit
cd server
npm start
Start the frontend:

bash
Copy
Edit
cd client
npm start
📂 Project Structure
bash
Copy
Edit
jobpilot-ai/
├── client/           # React frontend
│   ├── public/       # Static files
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── utils/
│   │   └── App.js
│   └── .env
│
├── server/           # Node.js backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── .env
│
└── README.md
🌐 API Endpoints
Endpoint	Method	Description
/api/auth/register	POST	Register a new user
/api/auth/login	POST	User login
/api/jobs	GET	Get all jobs (protected)
/api/jobs	POST	Create new job
/api/jobs/:id	PUT	Update job
/api/jobs/:id	DELETE	Delete job
/api/ai/resume	POST	Get resume improvement tips
/api/ai/cover-letter	POST	Generate a cover letter

📝 Environment Variables
🔹 Frontend (client/.env)
env
Copy
Edit
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_ANALYTICS_ID=UA-XXXXX-Y
🔸 Backend (server/.env)
env
Copy
Edit
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/dbname
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
OPENAI_API_KEY=your_openai_api_key
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your@email.com
EMAIL_PASS=your_email_password
📜 License
This project is licensed under the MIT License

👨‍💻 Author
Vishal Dwivedy

GitHub: @VishalXDev

Twitter: @VishalXDev

LinkedIn: Vishal Dwivedy

🙏 Acknowledgments
OpenAI for GPT-4 API

The React & Node.js communities

Tailwind CSS

All open-source contributors

⭐ If you find this project helpful, give it a star and share it!
