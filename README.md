# IIITL Exam Cell Management System

A comprehensive web application for managing student certificates, user authentication, and exam-related processes at IIIT Lucknow.

---

## System Overview

This system streamlines the process of certificate generation, approval, and delivery for students and administrators. It features:
- Secure authentication (OTP, JWT, role-based)
- Automated PDF certificate generation with digital signatures
- Admin dashboard for managing users, requests, and logs
- Real-time notifications via and web push (Firebase)
- Password change request workflow
- Full activity logging and audit trail

---

## Features

### Authentication System
- Secure login using IIITL email (`@iiitl.ac.in`)
- OTP-based authentication (email & WhatsApp)
- JWT-based session management
- Role-based access control (Admin/Student)

### Bonafide Certificate Management
- Generate bonafide certificates with unique identifiers
- Digital signature verification (SHA-256)
- Certificate approval/signing workflow (admin only)
- Download certificates in PDF format
- Send certificates via email and WhatsApp
- Track certificate status and history
- Automatic certificate expiration after 30 days

### Certificate Features
- Unique certificate number format: `BON/YEAR/8DIGITHEX`
- College logo and official letterhead
- Digital signature for verification
- Student details: Name, Enrollment Number, Course, Semester, Purpose, Issue date, Expiry date

### Admin Dashboard
- View/manage all certificate and password requests
- Approve/reject/sign certificates
- Download student and request data as CSV
- View system logs and activity history
- Manage users (add/delete)
- Real-time dashboard statistics, including:
  - **Total Students** (registered in the system)
  - **Total Certificates** (bonafide certificates generated)
  - **Pending Certificate Requests** (awaiting admin signature/approval)
  - **Password Change Requests** (active requests)
  - **Other Key Metrics** (recent activity, logs, and system health)

### Notifications
- OTP delivery via email and WhatsApp
- Real-time web push notifications (Firebase)
- Email/WhatsApp delivery of signed certificates

### Password Change Requests
- Students can request password changes
- Admins can approve/reject requests
- Full audit trail for password changes

### Logging & Audit
- All major actions are logged (certificate generation, signing, login, etc.)
- Admins can view logs in a timeline/history view

---

## Tech Stack

### Backend
- Java 21
- Spring Boot 3.2.3
- Spring Security
- Spring Data JPA
- MySQL Database
- iText PDF for certificate generation
- JWT for authentication
- Spring Mail for OTP/email delivery
- WhatsApp Business API for notifications
- Firebase Admin SDK for web push notifications

### Frontend
- React 19
- Vite
- Tailwind CSS
- Radix UI Components
- React Router
- TypeScript (with some JS)
- Firebase for notifications

---

## Project Structure

### Backend
```
Backend/
├── src/
│   ├── main/java/com/login/
│   │   ├── config/         # Spring & security configuration
│   │   ├── controllers/    # REST API endpoints (auth, admin, student, bonafide, etc.)
│   │   ├── dto/            # Data Transfer Objects
│   │   ├── entity/         # JPA entities (Admin, Student, Certificate, Log, etc.)
│   │   ├── models/         # JWT, OTP, and utility models
│   │   ├── repositories/   # JPA repositories
│   │   ├── scheduler/      # Scheduled tasks (e.g., certificate cleanup)
│   │   ├── services/       # Business logic (auth, bonafide, email, WhatsApp, etc.)
│   │   ├── utils/          # PDF generation, helpers
│   │   └── login/          # Web config (CORS)
│   └── resources/
│       ├── application.properties.sample
│       └── schema.sql
│   └── assets/
│       └── logo.png
```

### Frontend
```
Frontend/
├── src/
│   ├── components/         # Reusable UI components (tables, dashboard, notifications, etc.)
│   ├── pages/              # Page-level components (login, dashboard, admin, etc.)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── config/             # Firebase and other config
│   └── assets/             # Static assets (images, icons)
```

---

## API Endpoints (Sample)

### Authentication
- `POST /api/request-otp` — Request OTP for login (email & WhatsApp)
- `POST /api/login` — Authenticate with email and OTP
- `POST /api/validate-token` — Validate JWT token

### Admin
- `POST /api/admin/request-otp` — Request OTP for admin login
- `POST /api/admin/login` — Admin login with OTP and password
- `GET /api/admin/{email}` — Get admin details
- `GET /api/admin/dashboard-stats` — Dashboard statistics
- `GET /api/admin/students/csv` — Download students as CSV
- `DELETE /api/admin/students/{rollNumber}` — Delete student

### Students
- `POST /api/students` — Create student
- `PUT /api/students` — Update student
- `GET /api/students/{email}` — Get student by email

### Bonafide Certificates
- `POST /api/bonafide/generate` — Generate new certificate
- `GET /api/bonafide/download/{uid}` — Download certificate PDF
- `POST /api/bonafide/sign` — Sign/approve certificate (admin only)
- `GET /api/bonafide/uid/{rollNo}` — Get certificates by roll number
- `GET /api/bonafide/all` — Get all certificates (admin)
- `POST /api/bonafide/send-email/{uid}` — Email certificate
- `POST /api/bonafide/send-whatsapp/{uid}` — WhatsApp certificate

### Password Requests
- `POST /api/password-requests/create` — Create password change request
- `POST /api/password-requests/accept` — Approve password change (admin)
- `POST /api/password-requests/delete` — Delete password request
- `GET /api/password-requests` — List all password requests
- `GET /api/password-requests/export-csv` — Export requests as CSV

### Logs
- `GET /api/logs` — Get all system logs

---

## Notification System
- **Email**: OTPs, welcome messages, and certificates
- **WhatsApp**: OTPs and certificates (via WhatsApp Business API)
- **Web Push**: Real-time notifications (Firebase Cloud Messaging)

---

## Security Features
- JWT-based authentication
- Role-based access control (admin/student)
- Secure password and OTP handling
- Digital signature on certificates
- Automatic certificate expiration and cleanup
- CORS and CSRF protection (configurable)

---

## Setup Instructions

### Prerequisites
- Java 21
- Node.js (v18+ recommended)
- MySQL
- Maven

### Backend Setup
1. Clone the repository
2. Configure MySQL database in `application.properties`
3. Add your Firebase service account JSON to the classpath
4. Build the project:
   ```bash
   cd Backend
   mvn clean install
   ```
5. Run the application:
   ```bash
   mvn spring-boot:run
   ```

### Frontend Setup
1. Install dependencies:
   ```bash
   cd Frontend
   npm install
   ```
2. Start development server:
   ```bash
   npm run dev
   ```

---

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

## License
This project is licensed under the MIT License - see the LICENSE file for details.