# 🎯 HACKCRYPT - APPLICATION ARCHITECTURE

## High-Level Component Tree

```
App.js (State Manager)
│
├─── index.js (Entry Point)
│    └─── BrowserRouter (Ready for routing)
│
├─── Dashboard (Landing Page)
│    ├─→ StudentAuth
│    └─→ TeacherAuth
│
├─── Authentication Layer
│    ├─── StudentAuth (setView → student-dash)
│    │    └─── Supabase Auth
│    │
│    └─── TeacherAuth (setView → teacher-dash)
│         └─── Supabase Auth
│
├─── Student Path
│    ├─── StudentDashboard (Home.js)
│    │    ├─── Attendance Stats
│    │    ├─── Subject-wise Tracking
│    │    └─── setView("radar")
│    │
│    ├─── Radar (Verification Page)
│    │    ├─── Fingerprint Verification (Button)
│    │    ├─── Face Verification (Button)
│    │    └─── ID Verification (Button)
│    │
│    ├─── ScanQR (QR Scanning)
│    │    ├─── Webcam Feed
│    │    └─── setView("radar") after scan
│    │
│    ├─── RegisterFace (Face Registration)
│    │    ├─── Face Capture
│    │    └─── Store in Supabase (profiles table)
│    │
│    └─── FaceAttendance (Face-based Attendance)
│         ├─── Face Detection
│         ├─── Match with Database
│         └─── Mark Attendance
│
├─── Teacher Path
│    ├─── TeacherDashboard
│    │    ├─── Quick Actions
│    │    └─── setView("teacher-radar")
│    │
│    ├─── Teacherradar (Class Selection)
│    │    ├─── FYIT Button
│    │    ├─── SYIT Button
│    │    └─── TYIT Button
│    │         └─ All setView("attendance") with selectedClass
│    │
│    └─── Attendance (Attendance Marking)
│         ├─── 60 Student Grid
│         ├─── Radar Animation
│         ├─── Manual Toggle (Present/Absent)
│         ├─── Radar Submit
│         └─── Success Popup → setView("teacher-dash")
│
└─── Database Layer (Supabase)
     ├─── auth (User authentication)
     ├─── profiles (Face data for recognition)
     ├─── attendance (Attendance records)
     └─── subjects (Subject information)
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                          HACKCRYPT APP                           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     STATE MANAGEMENT (App.js)                    │
│  - view (current page)                                           │
│  - user (logged-in user)                                         │
│  - selectedClass (for attendance)                                │
│  - idVerified (QR verification status)                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                ▼             ▼             ▼
         ┌──────────┐  ┌──────────┐  ┌──────────┐
         │StudentAuth│  │TeacherAuth│  │Dashboard │
         └──────────┘  └──────────┘  └──────────┘
              │             │
         ┌────▼────┐   ┌────▼──────┐
         │Supabase │   │Supabase   │
         │Auth     │   │Auth       │
         └────┬────┘   └────┬──────┘
              │             │
         ┌────▼─────────────▼────┐
         │setView("student-dash")│  OR  │setView("teacher-dash")│
         └────┬─────────────────┘
              │
    ┌─────────┴──────────┬─────────────────┐
    ▼                    ▼                 ▼
┌────────────┐    ┌──────────┐    ┌──────────────┐
│StudentDash │    │Radar     │    │FaceAttendance│
│(Home.js)   │    │Page      │    │              │
└────────────┘    └──────────┘    └──────────────┘
    │                   │                │
    │ - Attendance      │ - Verification │ - Face Match
    │ - Stats          │ - Navigation   │ - Attendance Mark
    │ - Profile        │ - QR Scan      │ - Supabase Insert
    │ - Logout         │ - Face Reg     │
    │                  │                │
    └──────────────────┴────────────────┘
                      │
              ┌───────┴────────┐
              ▼                ▼
         ┌──────────┐     ┌──────────┐
         │Supabase  │     │Supabase  │
         │Database  │     │Database  │
         │Tables    │     │Tables    │
         └──────────┘     └──────────┘
         - profiles       - attendance
         - face_data      - subjects
```

---

## Navigation State Transitions

```
                    ┌─────────────┐
                    │  DASHBOARD  │
                    └──────┬──────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
            ▼              ▼              ▼
      ┌──────────┐   ┌──────────┐   
      │Student   │   │Teacher   │   
      │Auth      │   │Auth      │   
      └─────┬────┘   └────┬─────┘
            │             │
            ▼             ▼
       ┌─────────┐  ┌─────────────┐
       │STUDENT  │  │TEACHER      │
       │DASHBOARD│  │DASHBOARD    │
       └────┬────┘  └──────┬──────┘
            │              │
            │              ▼
            │        ┌─────────────┐
            │        │TEACHERRADAR │
            │        │(Class Sel.) │
            │        └──────┬──────┘
            │               │
            │               ▼
            │        ┌──────────────┐
            │        │ATTENDANCE    │
            │        │(Grid,Radar,  │
            │        │Toggle)       │
            │        └──────┬───────┘
            │               │
            ▼               ▼
       ┌────────┐    ┌─────────────┐
       │RADAR   │    │Teacher Dash │
       │(Verif.)│    │             │
       └────┬───┘    └─────────────┘
            │
        ┌───┼───┐
        │   │   │
        ▼   ▼   ▼
    ┌──┐┌──┐┌──┐
    │FP││FB││ID│
    └──┘└──┘└──┘
     │ Fingerprint
     │ FaceReg
     │ FaceAtt
     │ ScanQR
     │
     └─ Back to Radar
```

---

## Props Flow Diagram

```
App.js (Root)
│
├─ setView (function) ────→ ALL COMPONENTS
│  └─ Used for navigation between views
│
├─ user (object) ──────────→ Radar, StudentDashboard
│  └─ Contains user metadata and role
│
├─ selectedClass (string) ──→ Attendance
│  └─ Class name for attendance tracking
│
├─ idVerified (boolean) ─────→ Radar
│  └─ QR verification status
│
└─ setSelectedClass (fn) ────→ Teacherradar
   └─ Sets selected class for attendance
```

---

## Feature Integration Points

### Face Recognition Integration
```
RegisterFace
    ↓
  face-api.js (TinyFaceDetector)
    ↓
  Face Descriptor Extraction
    ↓
  Supabase profiles table (face_data)
    ↓
FaceAttendance
    ↓
  Compare Live Face with Stored
    ↓
  If Match → Mark Attendance
    ↓
  Supabase attendance table
```

### QR Code Integration
```
ScanQR
    ↓
  react-webcam (camera access)
    ↓
  jsQR (QR detection)
    ↓
  Extract QR Code Data
    ↓
  Call onVerified()
    ↓
  Navigate to Radar
```

### Authentication Integration
```
StudentAuth / TeacherAuth
    ↓
  Supabase Auth (Sign Up / Sign In)
    ↓
  Create/Verify User
    ↓
  Set user metadata (role: 'student' or 'teacher')
    ↓
  Navigate to appropriate dashboard
```

---

## Error Handling Flow

```
Try Action
    │
    ├─── Success? ──→ Update UI ──→ Navigate if needed
    │
    └─── Error? ──→ Catch Exception ──→ Display Alert/Message
         │
         └─── Log Error ──→ Continue/Retry
```

---

## Performance Considerations

1. **Face Detection Models**: Loaded once on component mount
2. **Webcam Streams**: Properly cleaned up on unmount
3. **Supabase Queries**: Called on demand with error handling
4. **State Updates**: Batched for optimal re-renders

---

## Security Notes

⚠️ Current Implementation:
- Supabase keys exposed in code
- JWT tokens in browser memory
- Face data stored as JSON strings

🔐 Production Recommendations:
- Move Supabase keys to environment variables
- Implement refresh token rotation
- Encrypt face data in database
- Add server-side authentication
- Implement rate limiting

---

Version: 1.0
Date: January 17, 2026
Status: ✅ COMPLETE
