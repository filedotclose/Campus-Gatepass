# 🛡️ Campus GatePass Pro

A high-end, digital tracking system for student movements between hostels and campus facilities (like the Library). This system replaces manual paper slips with a secure, real-time digital state machine, ensuring institutional security and student accountability.

![Architecture](https://img.shields.io/badge/Architecture-Next.js%2015-black?style=for-the-badge&logo=next.js)
![Database](https://img.shields.io/badge/Database-MongoDB-green?style=for-the-badge&logo=mongodb)
![Design](https://img.shields.io/badge/Design-Tailwind%20CSS-blue?style=for-the-badge&logo=tailwind-css)

## 🚀 Features

- **Role-Based Access Control**: Specialized dashboards for Students, Wardens, and Librarians.
- **State Machine Integration**: Pass statuses transitions seamlessly from `PENDING` → `APPROVED` → `OUT` → `IN_LIBRARY` → `RETURNED`.
- **Transit Lifecycle Tracking**: Automatic calculation of travel durations between checkpoints.
- **Premium UI/UX**: Modern glassmorphism design with a floating navigation system and mesh background patterns.
- **Secure Authentication**: Custom JWT-based auth with `httpOnly` cookie rotation and middleware protection.

## 🛠️ Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose)
- **Auth**: Custom JWT Implementation
- **Styling**: Tailwind CSS (v4)

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/campus-gatepass.git
   cd campus-gatepass
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_long_random_secret
   REFRESH_SECRET=your_long_random_refresh_secret
   ```

4. **Seed the database**:
   Initialize test accounts for all roles:
   ```bash
   npm run seed
   ```

5. **Start Dev Server**:
   ```bash
   npm run dev
   ```

## 🧪 Movement Verification Flow

1. **Student**: Requests a digital pass via the dashboard.
2. **Warden**: Reviews and grants approval from the control center.
3. **Transit**: Warden marks the hostel exit; travel timer starts.
4. **Library**: Librarian verifies identity and marks entry.
5. **Return**: Librarian marks library exit; Warden marks final hostel re-entry to close the pass.

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---
Built with ❤️ for Campus Security.
