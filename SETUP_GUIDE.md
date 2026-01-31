# 🚀 Smart Event Management System - Complete Setup Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Database Setup](#database-setup)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Initial Data Setup (Manual)](#initial-data-setup-manual)
6. [Testing Each Panel](#testing-each-panel)

---

## Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (running locally or MongoDB Atlas)
- **npm** or **yarn**

---

## Database Setup

### Step 1: Start MongoDB
```bash
# If MongoDB is installed locally, start the service
# Windows: MongoDB should start automatically
# Or use: net start MongoDB

# For MongoDB Atlas, ensure your connection string is in .env
```

### Step 2: Create `.env` file in Backend folder
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/event-management
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/event-management

JWT_ACCESS_SECRET=your_access_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key_here
```

---

## Backend Setup

### Step 1: Navigate to Backend folder
```bash
cd Backend
```

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Start the server
```bash
npm start
# OR
node server.js
```

You should see:
```
🚀 Server running on port 5000
```

---

## Frontend Setup

### Step 1: Navigate to Frontend folder
```bash
cd Frontend/react_app
```

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Start the development server
```bash
npm run dev
```

You should see:
```
VITE ready in XXX ms
➜  Local:   http://localhost:5173/
```

---

## Initial Data Setup (Manual)

**⚠️ IMPORTANT:** You need to manually add initial data to MongoDB. Here's how:

### Option 1: Using MongoDB Compass (Recommended)

1. Open **MongoDB Compass**
2. Connect to your database
3. Select the database: `event-management`

### Option 2: Using MongoDB Shell

```bash
mongosh
use event-management
```

---

### Step 1: Create Department

**Collection:** `departments`

Insert this document:
```json
{
  "name": "Computer Science",
  "shortName": "CS",
  "description": "Computer Science Department",
  "location": "Building A, Floor 2",
  "hod": null,
  "createdAt": new Date(),
  "updatedAt": new Date()
}
```
$2b$10$eepF1ZHN7UPGkuTNGWAdmOs32lqz6fRd.x2ZLbSONFJ/tM21Bfhv6

**Note:** Copy the `_id` of this department - you'll need it for HOD user.

---

### Step 2: Create HOD User

**Collection:** `users`

First, generate a password hash. In your backend terminal, run:
```javascript
// In Node.js REPL or create a temp file
const bcrypt = require('bcrypt');
const hash = await bcrypt.hash('hod123', 10);
console.log(hash);
```

Or use this pre-hashed password (for password: `hod1`):
```
$2b$10$A9bYMxUAoHgm00gOP61V5eQJgJDsGlr0y.kv51yKKhEXKTvCMLawC
```

Insert HOD user (replace `DEPARTMENT_ID` with actual department `_id`):
```json
{
  "userId": "hod-001",
  "fullName": "Dr. John Smith",
  "email": "hod@college.edu",
  "password": "$2b$10$A9bYMxUAoHgm00gOP61V5eQJgJDsGlr0y.kv51yKKhEXKTvCMLawC",
  "role": "HOD",
  "departmentId": "DEPARTMENT_ID_HERE",
  "isActive": true,
  "isFirstLogin": false,
  "createdAt": new Date(),
  "updatedAt": new Date()
}
```

**Update Department** with HOD reference:
```json
{
  "hod": "HOD_USER_ID_HERE"
}
```

---

### Step 3: Create Coordinator User

**Collection:** `users`

Generate password hash for `coordinator1` or use:
```
$2b$10$LW6zViTdvFxIh8h2Q15OT.Tv3ElpsGP93A6fW.FCUJ3A8293SVdAS
```

Insert Coordinator:
```json
{
  "userId": "coord-001",
  "fullName": "Ms. Jane Doe",
  "email": "coordinator@college.edu",
  "password": "$2b$10$LW6zViTdvFxIh8h2Q15OT.Tv3ElpsGP93A6fW.FCUJ3A8293SVdAS",
  "role": "COORDINATOR",
  "departmentId": "697bb999b9ac7c857c6c8f3c",
  "isActive": true,
  "isFirstLogin": false,
  "createdAt":"2026-01-30T10:30:00.000+00:00",
  "updatedAt": "2026-01-30T10:30:00.000+00:00"
}
```
---

### Step 4: Create Teacher User

**Collection:** `users`

Generate password hash for `teacher123` or use:
```
$2b$10$tE8K8K8K8K8K8K8K8K8K8uK8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K
```

Insert Teacher:
```json
{
  "userId": "teacher-001",
  "fullName": "Prof. Robert Johnson",
  "email": "teacher@college.edu",
  "password": "$2b$10$VVkVsFX/BaEKcnVHycdSlumB/Mjwx6OCRZFTpI/0sSq5T9ec6Lc3e",
  "role": "TEACHER",
  "departmentId": "697ca5908eac62d11b5062f0",
  "isActive": true,
  "isFirstLogin": false,
  "createdAt": 2026-01-30T10:30:00.000+00:00,
  "updatedAt": 2026-01-30T10:30:00.000+00:00
}
```

---

### Step 5: Create Student User

**Collection:** `users`

Generate password hash for roll number (e.g., `STU001`) or use:
```
$2b$10$sT8K8K8K8K8K8K8K8K8K8uK8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K
```

Insert Student:
```json
{
  "userId": "stu-002",
  "fullName": "Sorav",
  "rollNumber": "23401115",
  "password": "$2b$10$hzdncpbyPfoZ4bmMduvytObzgrmfz.49kYt5Yk8plAaqIlONI.ZYG",
  "role": "STUDENT",
  "departmentId": "697bb999b9ac7c857c6c8f3c",
  "course": "B.Tech",
  "year": 3,
  "section": "A",
  "isActive": true,
  "isFirstLogin": true,
  "createdAt": new Date(),
  "updatedAt": new Date()
}
```

**Note:** Student's default password is their roll number. They must change it on first login.

---

## Quick Password Hash Generator Script

Create a file `Backend/generateHash.js`:
```javascript
import bcrypt from "bcrypt";

const password = process.argv[2] || "password123";
const hash = await bcrypt.hash(password, 10);
console.log(`Password: ${password}`);
console.log(`Hash: ${hash}`);
```

Run:
```bash
node generateHash.js hod123
```

---

## Testing Each Panel

### 🎯 Step 1: Test HOD Panel

1. **Login as HOD**
   - URL: `http://localhost:5173/`
   - Email: `hod@college.edu`
   - Password: `hod123`

2. **HOD Dashboard**
   - View statistics
   - Check charts
   - See event performance ranking

3. **Create Event**
   - Navigate to "Create Event"
   - Fill in:
     - Title: "Tech Fest 2024"
     - Short Description: "Annual technical festival"
     - Description: "Full description here"
     - Start Date: Future date
     - End Date: After start date
     - Venue: "Main Auditorium"
     - Coordinator: Select coordinator from dropdown
     - Banner: Upload image (optional)
   - Click "Create Event"

4. **Manage Events**
   - View all events
   - Publish/Unpublish events
   - Edit events (only upcoming)
   - Delete/Restore events

---

### 🎯 Step 2: Test Coordinator Panel

1. **Login as Coordinator**
   - Email: `coordinator@college.edu`
   - Password: `coordinator123`

2. **Coordinator Dashboard**
   - View competition statistics
   - Check registration charts

3. **My Events**
   - View events assigned to you
   - Click on an event to manage competitions

4. **Create Competition**
   - Navigate to an event
   - Click "Create Competition"
   - Fill in:
     - Name: "Coding Challenge"
     - Type: Individual or Team
     - Venue: "Lab 101"
     - Registration Deadline: Future date
     - Start Time: After deadline
     - End Time: After start time
     - Max Participants: 50 (optional)
   - Click "Create Competition"

5. **Assign Teachers**
   - Go to competition details
   - Click "Assign Teachers"
   - Select teacher and role (INCHARGE/JUDGE)
   - Click "Assign"

6. **View Registrations**
   - Go to competition details
   - Click "View Registrations"
   - See all registered participants

---

### 🎯 Step 3: Test Teacher Panel

1. **Login as Teacher**
   - Email: `teacher@college.edu`
   - Password: `teacher123`

2. **Teacher Dashboard**
   - View assigned competitions
   - Check statistics

3. **Take Attendance**
   - Go to "Attendance"
   - Select a competition
   - Click "Generate QR for Attendance"
   - Display QR code to students

4. **View Attendance**
   - Click "View Attendance"
   - See list of present students

5. **Declare Results**
   - Go to "Results"
   - Select completed competition
   - Choose winners (1st, 2nd, 3rd place)
   - Click "Declare Results"

6. **Generate Certificates**
   - Go to "Certificates"
   - Select competition
   - Click "Generate Certificates"

---

### 🎯 Step 4: Test Student Panel

1. **Login as Student**
   - Roll Number: `STU001`
   - Password: `STU001` (must change on first login)

2. **Change Password** (First Login)
   - Enter new password
   - Confirm password
   - Click "Change Password"

3. **Student Dashboard**
   - View registration statistics
   - Check charts

4. **Browse Events**
   - Go to "Events"
   - View published events
   - Click on event to see competitions

5. **Register for Competition**
   - Select a competition
   - For Individual: Click "Register Individually"
   - For Team:
     - Create team or join existing team
     - Submit team for registration

6. **My Registrations**
   - View all registrations
   - See QR codes for attendance
   - Cancel registrations if needed

7. **View Certificates**
   - Go to "Certificates"
   - Download certificates (if generated)

---

## 🔧 Common Issues & Solutions

### Issue 1: MongoDB Connection Error
**Solution:** 
- Check MongoDB is running
- Verify MONGODB_URI in .env
- Check firewall settings

### Issue 2: CORS Error
**Solution:**
- Ensure backend CORS is configured for `http://localhost:5173`
- Check credentials: true in axios config

### Issue 3: Authentication Error
**Solution:**
- Clear browser cookies
- Check JWT secrets in .env
- Verify user exists in database

### Issue 4: Password Hash Error
**Solution:**
- Use the generateHash.js script
- Ensure bcrypt is installed
- Check password length (min 6 characters)

---

## 📝 Sample Data for Quick Testing

### Quick Insert Script (MongoDB Shell)

```javascript
// Connect to database
use event-management

// 1. Create Department
db.departments.insertOne({
  name: "Computer Science",
  shortName: "CS",
  description: "CS Department",
  location: "Building A",
  createdAt: new Date(),
  updatedAt: new Date()
})

// Get department ID
var deptId = db.departments.findOne({shortName: "CS"})._id

// 2. Create HOD (password: hod123)
db.users.insertOne({
  userId: "hod-001",
  fullName: "Dr. John Smith",
  email: "hod@college.edu",
  password: "$2b$10$rQ8K8K8K8K8K8K8K8K8uK8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K",
  role: "HOD",
  departmentId: deptId,
  isActive: true,
  isFirstLogin: false,
  createdAt: new Date(),
  updatedAt: new Date()
})

// Update department with HOD
var hodId = db.users.findOne({email: "hod@college.edu"})._id
db.departments.updateOne(
  {shortName: "CS"},
  {$set: {hod: hodId}}
)

// 3. Create Coordinator (password: coordinator123)
db.users.insertOne({
  userId: "coord-001",
  fullName: "Ms. Jane Doe",
  email: "coordinator@college.edu",
  password: "$2b$10$cO8K8K8K8K8K8K8K8K8uK8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K",
  role: "COORDINATOR",
  departmentId: deptId,
  isActive: true,
  isFirstLogin: false,
  createdAt: new Date(),
  updatedAt: new Date()
})

// 4. Create Teacher (password: teacher123)
db.users.insertOne({
  userId: "teacher-001",
  fullName: "Prof. Robert Johnson",
  email: "teacher@college.edu",
  password: "$2b$10$tE8K8K8K8K8K8K8K8K8uK8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K",
  role: "TEACHER",
  departmentId: deptId,
  isActive: true,
  isFirstLogin: false,
  createdAt: new Date(),
  updatedAt: new Date()
})

// 5. Create Student (password: STU001 - same as rollNumber)
db.users.insertOne({
  userId: "stu-001",
  fullName: "Alice Williams",
  rollNumber: "STU001",
  password: "$2b$10$sT8K8K8K8K8K8K8K8uK8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K",
  role: "STUDENT",
  departmentId: deptId,
  course: "B.Tech",
  year: 3,
  section: "A",
  isActive: true,
  isFirstLogin: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

**⚠️ Note:** The password hashes above are examples. Generate your own using the `generateHash.js` script!

---

## ✅ Verification Checklist

- [ ] MongoDB is running
- [ ] Backend server starts without errors
- [ ] Frontend server starts without errors
- [ ] Department created in database
- [ ] HOD user created and linked to department
- [ ] Coordinator user created
- [ ] Teacher user created
- [ ] Student user created
- [ ] Can login as HOD
- [ ] Can login as Coordinator
- [ ] Can login as Teacher
- [ ] Can login as Student

---

## 🎉 You're All Set!

Now you can test the complete flow:
1. HOD creates events
2. Coordinator creates competitions
3. Teacher manages attendance and results
4. Students register and view certificates

Happy Testing! 🚀

