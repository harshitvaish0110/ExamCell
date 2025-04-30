-- Users Table for OTP verification
CREATE TABLE IF NOT EXISTS users (
    email_id VARCHAR(255) PRIMARY KEY,
    otp VARCHAR(10),
    otp_created_at TIMESTAMP
); 