# User Manual for the Frontend Web Application - UTMachGym

## Table of Contents
1. [Installation](#installation)
2. [Authentication](#authentication)
3. [User Roles](#user-roles)
    - [Admin](#admin)
    - [Trainer](#trainer)
    - [Member](#member)

## Installation

### Prerequisites
- Node.js (v14 or later)
- npm (Node package manager)

### Steps to Install
1. Clone the repository:
   ```bash
   git clone https://github.com/Thonyan12/gym-backend.git
   cd gym-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the application:
   ```bash
   npm start
   ```
4. Open your browser and navigate to `http://localhost:3000`.

## Authentication

### Login Process
1. Go to the login page by navigating to `/login`.
2. Enter your credentials:
   - Username or Email
   - Password
3. Click on the **Login** button to access the dashboard.

### Password Recovery
1. Click on **Forgot Password?** link on the login page.
2. Enter your email address and submit the form.
3. Follow the instructions in the email to reset your password.

## User Roles

### Admin
- **Access Level:** Full access to all features.
- **Functions:**
  - Manage users (add, edit, delete).
  - View analytics.
  - Configure application settings.

### Trainer
- **Access Level:** Limited access focused on training management.
- **Functions:**
  - Create and manage training sessions.
  - Track member progress.
  - Communicate with members.

### Member
- **Access Level:** Basic access to training sessions and personal data.
- **Functions:**
  - View available training sessions.
  - Enroll in sessions.
  - Update personal information.

## Conclusion
This manual serves as a comprehensive guide for navigating the UTMachGym frontend web application. For further assistance, please contact support.