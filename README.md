# 🎓 Hackcrypt - Smart Student Attendance Management System

> A modern, intelligent attendance tracking system powered by biometric recognition and real-time verification. Built for educational institutions to streamline attendance management with cutting-edge technology.

[![React](https://img.shields.io/badge/React-19.2.3-blue?logo=react)](https://reactjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-Database-brightgreen?logo=supabase)](https://supabase.io)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🌟 Features

### For Students
- ✅ **Easy Login & Registration** - Secure authentication with student credentials
- 👤 **Attendance Dashboard** - Real-time view of your attendance statistics
- 📊 **Subject-wise Tracking** - Monitor attendance by individual subjects
- 🔐 **Multiple Verification Methods**
  - Fingerprint verification
  - Facial recognition
  - QR code scanning
  - ID verification
- 📱 **Mobile-Friendly Interface** - Access from any device

### For Teachers
- 📋 **Class Management** - Handle multiple classes (FYIT, SYIT, TYIT)
- ⚡ **Quick Attendance Marking** - Radar-based attendance grid for 60+ students
- 🎯 **Bulk Operations** - Mark all students present with one action
- 🔍 **Biometric Verification** - Face recognition verification system
- 📊 **Real-time Reports** - Instant attendance data export

### Advanced Features
- 🧠 **AI-Powered Face Recognition** - Uses face-api.js for accurate facial detection
- 📸 **Face Registration** - Store face data securely in database
- 🎬 **Radar Animation** - Visual feedback during attendance marking
- 🔄 **Live Data Sync** - Supabase integration for real-time updates
- 🛡️ **Secure Architecture** - Role-based access control (Student/Teacher)

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v14+ ([Download](https://nodejs.org))
- **npm** v6+ (comes with Node.js)
- **Git** for version control

### Installation

```bash
# Clone the repository
git clone https://github.com/abhiyadav10/Hackcrypt.git
cd Hackcrypt/Hackcrypt-main

# Install dependencies
npm install

# Start the development server
npm start
```

Your app will open at `http://localhost:3000` 🎉

---

## 📖 How to Use

### First Time Users

1. **Open the App** → Visit `http://localhost:3000`
2. **Choose Your Role** → Click "Student" or "Teacher" button
3. **Create Account** → Register with your email and password
4. **Log In** → Use your credentials to access the dashboard

### Student Workflow
```
Dashboard → Verify Identity → Mark Attendance → View Stats
    ↓
  - Use Radar (fingerprint/face/ID)
  - Scan QR code
  - Register face for future logins
```

### Teacher Workflow
```
Dashboard → Select Class → Mark Attendance → Submit & Confirm
    ↓
  - Use grid interface for 60 students
  - Toggle Present/Absent for each student
  - Use Radar animation for quick marking
  - View submission confirmation
```

---

## 🛠️ Available Commands

```bash
# Start development server (with hot reload)
npm start

# Build for production (creates optimized build)
npm run build

# Run tests
npm test

# Analyze the build (view bundle size)
npm run analyze
```

---

## 📁 Project Structure

```
Hackcrypt-main/
├── src/
│   ├── components/
│   │   ├── Dashboard.js          # Landing page with role selection
│   │   ├── StudentAuth.js        # Student login/registration
│   │   ├── TeacherAuth.js        # Teacher login/registration
│   │   ├── Home.js               # Student dashboard
│   │   ├── TeacherDashboard.js   # Teacher dashboard
│   │   ├── Radar.js              # Student verification page
│   │   ├── Teacherradar.js       # Class selection for teachers
│   │   ├── Attendance.js         # Attendance marking grid
│   │   ├── ScanQr.jsx            # QR code scanner
│   │   ├── RegisterFace.jsx      # Face registration
│   │   └── FaceAttendance.jsx    # Face-based attendance
│   ├── App.js                     # Main application component
│   ├── index.js                   # React entry point
│   ├── supabaseClient.js         # Supabase configuration
│   └── [CSS files]               # Styling for each component
├── public/                        # Static assets
├── package.json                   # Dependencies and scripts
└── README.md                      # This file
```

---

## 🔐 Authentication & Security

### Supabase Integration
The app uses **Supabase** (open-source Firebase alternative) for:
- User authentication
- Profile management
- Attendance records storage
- Face data encryption

### User Roles
- **Student** - Limited access to personal attendance
- **Teacher** - Full access to class attendance management

### Data Privacy
✅ Passwords encrypted with bcrypt
✅ Face data stored securely
✅ Role-based access control
✅ Session management

---

## 🧠 AI & Machine Learning

### Face Recognition Engine
Powered by **face-api.js**, a JavaScript implementation of face detection:
- Real-time face detection
- Face descriptor extraction
- Facial matching (Euclidean distance calculation)
- Threshold-based verification (>0.6 match score)

### How It Works
1. User registers face → Face descriptor extracted & stored
2. During attendance → Live face captured & compared
3. If match found → Attendance marked automatically
4. Confidence score displayed

---

## 📊 Database Schema

### Core Tables
```
users (via Supabase Auth)
├── id
├── email
├── role (student/teacher)
└── metadata

profiles
├── id (user_id)
├── name
├── face_data (JSON descriptor)
└── created_at

attendance
├── id
├── user_id
├── class_name
├── marked_at
└── verification_type

subjects
├── id
├── name
├── attendance_percentage
└── user_id
```

---

## 🎨 Technologies Used

| Technology | Purpose | Version |
|-----------|---------|---------|
| React | Frontend framework | 19.2.3 |
| Supabase | Backend & Database | 2.90.1 |
| face-api.js | Face recognition | 0.22.2 |
| jsQR | QR code scanning | 1.4.0 |
| react-webcam | Camera access | 7.2.0 |
| react-icons | UI icons | 5.5.0 |
| lucide-react | Icon library | 0.562.0 |

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Drag & drop 'build' folder to Netlify
```

### Environment Variables
Create a `.env` file:
```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_key
```

---

## 🐛 Troubleshooting

### "Face not detected"
- Ensure proper lighting
- Position face clearly in camera
- Try registering again

### "Module not found: 'fs'"
- This is a known face-api.js issue in browser
- Safe to ignore - doesn't affect functionality

### Port 3000 already in use
```bash
# Use different port
PORT=3001 npm start
```

### Dependencies not installing
```bash
# Clear npm cache
npm cache clean --force
npm install
```

---

## 📝 Contributing

We welcome contributions! Here's how:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see the LICENSE file for details.

---

## 👥 Team

Built with ❤️ by the **Gravity Coders** team

**Contributors:**
- Abhishek Yadav (Developer)

---

## 📞 Support & Contact

- 📧 **Email**: abhiyadav10@github.com
- 💬 **GitHub Issues**: [Report bugs here](https://github.com/abhiyadav10/Hackcrypt/issues)
- 🌐 **Live Demo**: [Coming Soon](#)

---

## 🙏 Acknowledgments

- Face API for face recognition capabilities
- Supabase for database and authentication
- React community for amazing tools and libraries
- All contributors who have helped improve this project

---

## 🎯 Future Roadmap

- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Blockchain for attendance certificates
- [ ] Multi-language support
- [ ] Offline attendance marking
- [ ] SMS/Email notifications
- [ ] Integration with school ERP

---

**Made with 💻 and ☕ in 2026**

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
