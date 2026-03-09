📋 Notice Board App - README
🎯 Project Overview
A modern digital notice board application built with Next.js, MongoDB, and Tailwind CSS. Replace traditional physical notice boards with this efficient, paperless solution for educational institutions and organizations.

👥 Team Members
Asad Qayyum (2022-GCUF-095264)

Muzammil Ramzan (2022-GCUF-095304)

Muhammad Adeeb Shahzad (2022-GCUF-095279)

🚀 Features
For All Users
🔐 User Registration & Login

👀 View all notices

🔍 Filter notices by category

📱 Responsive design

For Publishers & Admins
📝 Create new notices

✏️ Edit notices

🏷️ Categorize notices (Academic, Events, Urgent, General)

⏰ Set expiry dates

For Admins Only
👥 Manage users (Create, Edit, Delete)

🔄 Change user roles (User/Publisher/Admin)

⚖️ Suspend/Activate accounts

📊 View statistics

🛠️ Technology Stack
Frontend
Next.js 15 - React framework

Tailwind CSS - Styling

React Hot Toast - Notifications

Backend
Next.js API Routes - Backend APIs

MongoDB - Database

Mongoose - ODM

JWT - Authentication

Bcrypt - Password hashing

📁 Project Structure
text
notice-board-app/
├── src/
│   ├── app/
│   │   ├── api/                    # Backend APIs
│   │   │   ├── auth/                # Authentication APIs
│   │   │   ├── admin/                # Admin APIs
│   │   │   └── notices/              # Notice APIs
│   │   ├── admin/                    # Admin panel
│   │   │   ├── page.jsx              # Admin dashboard
│   │   │   ├── layout.jsx            # Admin layout
│   │   │   └── notices/              # Admin notices
│   │   ├── dashboard/                 # User dashboard
│   │   │   ├── page.jsx
│   │   │   ├── layout.jsx
│   │   │   ├── users/                 # User management
│   │   │   └── create-notice/         # Create notice
│   │   ├── login/                     # Login page
│   │   ├── register/                   # Register page
│   │   └── page.jsx                    # Home page
│   ├── components/                     # Reusable components
│   │   ├── Navbar.jsx
│   │   ├── NoticeCard.jsx
│   │   └── LoadingSpinner.jsx
│   ├── context/
│   │   └── AuthContext.jsx             # Auth context
│   └── lib/
│       ├── mongodb.js                   # DB connection
│       ├── models/                       # DB models
│       │   ├── User.js
│       │   ├── Notice.js
│       │   └── Category.js
│       └── utils.js                      # Utility functions
├── public/                               # Static files
├── .env.local                            # Environment variables
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── middleware.js                          # Route protection
⚙️ Installation
Prerequisites
Node.js (v18 or higher)

MongoDB (local or Atlas)

Git

Steps
Clone the repository

bash
git clone https://github.com/yourusername/notice-board-app.git
cd notice-board-app
Install dependencies

bash
npm install
Environment Variables
Create .env.local file:

env
MONGODB_URI=mongodb://localhost:27017/noticeboard
JWT_SECRET=your-super-secret-jwt-key-change-this
NODE_ENV=development
Run the development server

bash
npm run dev
Open in browser

text
http://localhost:3000
🗄️ Database Models
User Model
javascript
{
  name: String,
  email: String,
  password: String (hashed),
  role: ['user', 'publisher', 'admin'],
  accountStatus: ['active', 'suspended'],
  createdAt: Date
}
Notice Model
javascript
{
  title: String,
  description: String,
  category: ['Academic', 'Events', 'Urgent', 'General'],
  priority: ['low', 'medium', 'high', 'urgent'],
  createdBy: ObjectId (ref: User),
  createdDate: Date,
  expiryDate: Date,
  status: ['active', 'archived'],
  views: Number
}
👥 User Roles
Role	Permissions
User	View notices only
Publisher	View + Create notices
Admin	Full access (Manage users, all notices)
🔐 API Endpoints
Authentication
POST /api/auth/register - Register new user

POST /api/auth/login - Login user

POST /api/auth/logout - Logout user

GET /api/auth/user - Get current user

Admin
GET /api/admin/users - Get all users

POST /api/admin/users - Create new user

PUT /api/admin/users/[id] - Update user

DELETE /api/admin/users/[id] - Delete user

Notices
GET /api/notices - Get all notices

POST /api/notices - Create notice

GET /api/notices/[id] - Get single notice

PUT /api/notices/[id] - Update notice

DELETE /api/notices/[id] - Delete notice

🚦 How to Use
1. First Time Setup
bash
# Make yourself an admin (run in MongoDB)
mongosh
use noticeboard
db.users.updateOne(
  { email: "your-email@gmail.com" },
  { $set: { role: "admin" } }
)
2. Login as Admin
Email: your-email@gmail.com

Password: (your password)

3. Create Users
Go to Dashboard → Manage Users

Click "Create New User"

Set roles (User/Publisher/Admin)

4. Create Notices
Go to Dashboard → Create Notice

Fill title, description, category

Set expiry date

Publish

🎨 Features in Detail
User Management
View all users in table format

Change user roles via dropdown

Suspend/Activate accounts

Delete users (except yourself)

Notice Management
Rich text descriptions

Category filtering

Priority levels

Auto-archive on expiry

View counter

Dashboard
Statistics cards

Filter notices by status

Responsive grid layout

Quick actions

🧪 Testing
Run the development server and test:

bash
npm run dev
Test URLs:

Home: http://localhost:3000

Login: http://localhost:3000/login

Register: http://localhost:3000/register

Dashboard: http://localhost:3000/dashboard

Admin: http://localhost:3000/admin

🐛 Common Issues & Solutions
1. MongoDB Connection Error
bash
# Start MongoDB
mongod
# Or use MongoDB Atlas URI in .env.local
2. Login Issues
javascript
// Check your role in console
fetch('/api/auth/user', { credentials: 'include' })
  .then(res => res.json())
  .then(data => console.log(data))
3. Tailwind CSS Not Working
bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
📦 Dependencies
json
{
  "dependencies": {
    "next": "15.1.6",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "mongoose": "^8.8.3",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "cookie": "^0.7.1",
    "react-hot-toast": "^2.4.1",
    "axios": "^1.7.9",
    "date-fns": "^4.1.0"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.17",
    "postcss": "^8.4.49",
    "autoprefixer": "^10.4.20"
  }
}
🚀 Deployment
Deploy to Vercel
bash
npm run build
vercel --prod
Environment Variables on Vercel
Add MONGODB_URI (use MongoDB Atlas)

Add JWT_SECRET

Set NODE_ENV=production

📸 Screenshots
Page	Description
Home	Public notice board
Dashboard	User dashboard
Admin Panel	User management
Create Notice	Notice creation form
🤝 Contributing
Fork the repository

Create feature branch (git checkout -b feature/AmazingFeature)

Commit changes (git commit -m 'Add AmazingFeature')

Push to branch (git push origin feature/AmazingFeature)

Open a Pull Request

📄 License
This project is submitted in partial fulfillment of the requirements for the Degree of Bachelor of Science in Computer Science at Government College University, Faisalabad.

📞 Contact
Asad Qayyum - GitHub

Muzammil Ramzan

Muhammad Adeeb Shahzad

Project Link: https://github.com/yourusername/notice-board-app

🙏 Acknowledgments
Department of Computer Science, GCUF

Project Supervisor

All team members for their dedication

Made with ❤️ by Team GCUF
© 2026 All Rights Reserved
