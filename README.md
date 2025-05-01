# IIITL Exam Cell Management System

A comprehensive web application for managing student certificates and exam-related processes at IIIT Lucknow.

## Features

### Authentication System
- Secure login using IIITL email (@iiitl.ac.in)
- OTP-based authentication
- Role-based access control (Admin/Student)

### Bonafide Certificate Management
- Generate bonafide certificates with unique identifiers
- Digital signature verification
- Certificate approval workflow
- Download certificates in PDF format
- Track certificate status and history
- Automatic certificate expiration after 30 days

### Certificate Features
- Unique certificate number format: BON/YEAR/8DIGITHEX
- College logo and official letterhead
- Digital signature for verification
- Student details including:
  - Name
  - Enrollment Number
  - Course
  - Semester
  - Purpose of certificate
  - Issue date
  - Expiry date

## Tech Stack

### Backend
- Java 21
- Spring Boot 3.2.3
- Spring Security
- Spring Data JPA
- MySQL Database
- iText PDF for certificate generation
- JWT for authentication
- Spring Mail for OTP delivery

### Frontend
- React 19
- Vite
- Tailwind CSS
- Radix UI Components
- React Router
- TypeScript

## Project Structure

### Backend
```
Backend/
├── src/
│   ├── main/java/com/login/
│   │   ├── config/         # Configuration classes
│   │   ├── controllers/    # REST API endpoints
│   │   ├── dto/           # Data Transfer Objects
│   │   ├── entity/        # Database entities
│   │   ├── repository/    # JPA repositories
│   │   ├── service/       # Business logic
│   │   ├── utils/         # Utility classes
│   │   └── scheduler/     # Scheduled tasks
│   └── assets/
│       ├── pdf/           # Generated PDFs
│       └── logo.png       # College logo
```

### Frontend
```
Frontend/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/            # Page components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   └── assets/           # Static assets
```

## API Endpoints

### Authentication
- `POST /api/request-otp` - Request OTP for login
- `POST /api/login` - Authenticate with email and OTP

### Bonafide Certificates
- `POST /api/bonafide/generate` - Generate new certificate
- `GET /api/bonafide/download/{uid}` - Download certificate
- `POST /api/bonafide/approve/{uid}` - Approve certificate (Admin only)
- `GET /api/bonafide/uid/{rollNo}` - Get certificates by roll number

## Setup Instructions

### Prerequisites
- Java 21
- Node.js
- MySQL
- Maven

### Backend Setup
1. Clone the repository
2. Configure MySQL database in `application.properties`
3. Build the project:
   ```bash
   cd Backend
   mvn clean install
   ```
4. Run the application:
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

## Security Features
- JWT-based authentication
- Role-based access control
- Secure password handling
- OTP-based login
- Digital signature verification
- Automatic certificate expiration

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details. 