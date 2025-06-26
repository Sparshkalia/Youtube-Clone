# 🎥 YouTube Clone (MERN Stack)

A full-featured YouTube-inspired video sharing platform built with the MERN stack. It supports user authentication, video uploads, likes, comments, playlists, subscriptions, and more—featuring a seamless frontend experience with robust backend architecture.

---

## 🚀 Features

- 🔐 JWT-based user authentication (Register, Login)
- 📤 Upload and stream videos (with Firebase Storage integration)
- ❤️ Like / Dislike functionality
- 💬 Comment on videos
- 📁 Manage playlists
- 👤 User profiles and channel pages
- 🔔 Subscribe / Unsubscribe to channels
- 📊 YouTube Studio-style dashboard (for creators)
- ⚙️ Admin tools and role-based content visibility
- 📱 Responsive UI (mobile + desktop)

---

## 🧱 Tech Stack

| Layer        | Technology                              |
|--------------|------------------------------------------|
| Frontend     | React.js, Redux Toolkit, Tailwind CSS / MUI |
| Backend      | Node.js, Express.js                     |
| Database     | MongoDB Atlas, Mongoose ODM             |
| Auth         | JSON Web Tokens (JWT)                   |
| File Storage | Cloudinary (for videos)                 |
| Dev Tools    | dotenv, nodemon                         |

---

## 📂 Project Structure

Youtube-Clone/
│
├── backend/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── utils/
│ ├── middleware/
│ └── index.js
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── redux/
│ │ ├── App.js
│ │ └── index.js
│
└── README.md

yaml
Copy
Edit

---

## 📦 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Sparshkalia/Youtube-Clone.git
cd Youtube-Clone
2. Set up environment variables
🔧 Backend (backend/.env)
ini
Copy
Edit
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
🌐 Frontend (frontend/.env)
ini
Copy
Edit
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_id
REACT_APP_FIREBASE_APP_ID=your_app_id
Note: Get Firebase config from Firebase Console
```
3. Install dependencies
```bash
Copy
Edit
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
4. Run the application
bash
Copy
Edit
# Start backend
cd backend
npm run dev

# Start frontend
cd ../frontend
npm run dev
App will be available at:
Frontend → http://localhost:3000
Backend API → http://localhost:5000
```
🔌 API Endpoints (Sample)
Method	Endpoint	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	Authenticate user
GET	/api/videos/	Get all videos
GET	/api/videos/:id	Get video by ID
POST	/api/videos/upload	Upload a new video
PUT	/api/videos/:id/like	Like a video
POST	/api/videos/:id/comment	Comment on a video
GET	/api/users/:id	Get user details

🧪 Testing
Currently supports manual testing. (Optional: Integrate with Jest or Postman collection for automated tests)

📦 Deployment
You can deploy the app to:

Frontend: Vercel, Netlify

Backend: Render, Heroku, or Railway

Database: MongoDB Atlas

Storage: Firebase Storage

📸 Screenshots (Optional)
Add some screenshots or screen recordings here to show off your UI/UX!

🤝 Contributing
Contributions, issues, and feature requests are welcome!

Fork the repository

Create your feature branch (git checkout -b feature/feature-name)

Commit your changes (git commit -m "feat: added feature")

Push to the branch (git push origin feature/feature-name)

Open a pull request

📄 License
Distributed under the MIT License. See LICENSE for more information.

🙋‍♂️ Author
Sparsh Kalia
📫 LinkedIn
📧 sparsh@example.com

