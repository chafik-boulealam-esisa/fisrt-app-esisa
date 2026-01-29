# ESISA Student Management System

A comprehensive, modern student management system built with Next.js 14, featuring a beautiful UI, role-based access control, and real-time statistics.

![Next.js](https://img.shields.io/badge/Next.js-14.1-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-5.10-2D3748?style=flat-square&logo=prisma)

## 🚀 Features

### Authentication & Security
- 🔐 Secure authentication with NextAuth.js
- 🔑 JWT-based session management
- 👥 Role-based access control (Admin/User)
- 🛡️ Password hashing with bcrypt (12 rounds)
- 📝 Security audit logging

### Student Management
- 📋 Complete CRUD operations
- 🔍 Advanced search and filtering
- 📊 Real-time statistics and analytics
- 📈 GPA tracking and distribution
- 🎓 Multiple departments and programs

### User Interface
- 🎨 Modern, responsive design with Tailwind CSS
- 📱 Mobile-friendly sidebar navigation
- 🔔 Toast notifications for actions
- 📄 Pagination with smart page display
- ⚡ Fast page loads with Next.js App Router

### Admin Features
- 👤 User management (create, edit, delete)
- 🔒 Account activation/deactivation
- 📊 Student statistics dashboard
- 📈 Department-wise analytics

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js 4.24
- **Styling**: Tailwind CSS 3.4
- **Form Handling**: React Hook Form + Zod
- **Icons**: Lucide React
- **Notifications**: Sonner

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/chafik-boulealam-esisa/fisrt-app-esisa.git
   cd fisrt-app-esisa
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your settings:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   ```

4. **Initialize the database**
   ```bash
   npm run db:push
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@esisa.ac.ma | Admin@123 |
| User | user@esisa.ac.ma | User@123 |
| Professor | professor@esisa.ac.ma | Prof@123 |

## 📁 Project Structure

```
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/               # Authentication endpoints
│   │   ├── students/           # Student CRUD endpoints
│   │   └── users/              # User management endpoints
│   ├── dashboard/              # Dashboard page
│   ├── login/                  # Login page
│   ├── register/               # Registration page
│   ├── profile/                # User profile page
│   ├── students/               # Student pages
│   │   ├── [id]/               # Student detail & edit
│   │   └── new/                # Create student
│   └── users/                  # User management (admin)
├── components/
│   ├── ui/                     # Reusable UI components
│   ├── layout.tsx              # Main layout with sidebar
│   └── providers.tsx           # Context providers
├── lib/
│   ├── auth.ts                 # NextAuth configuration
│   ├── prisma.ts               # Prisma client singleton
│   ├── utils.ts                # Utility functions
│   └── validations.ts          # Zod schemas
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.js                 # Database seeding
└── types/
    └── next-auth.d.ts          # NextAuth type extensions
```

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:reset` | Reset and reseed database |

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository on [Vercel](https://vercel.com)
3. Add environment variables:
   - `NEXTAUTH_URL`: Your deployment URL
   - `NEXTAUTH_SECRET`: A secure random string
4. Deploy!

**Note**: For production, consider using a cloud database like:
- [Turso](https://turso.tech/) (SQLite)
- [PlanetScale](https://planetscale.com/) (MySQL)
- [Neon](https://neon.tech/) (PostgreSQL)

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/[...nextauth]` - NextAuth.js endpoints

### Students
- `GET /api/students` - List students (with pagination/search)
- `POST /api/students` - Create student
- `GET /api/students/[id]` - Get student details
- `PUT /api/students/[id]` - Update student
- `DELETE /api/students/[id]` - Delete student (admin only)
- `GET /api/students/statistics` - Get statistics

### Users (Admin only)
- `GET /api/users` - List users
- `POST /api/users` - Create user
- `GET /api/users/[id]` - Get user details
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Chafik Boulealam**
- GitHub: [@chafik-boulealam-esisa](https://github.com/chafik-boulealam-esisa)
- Institution: ESISA (École Supérieure d'Ingénierie en Sciences Appliquées)

---

Made with ❤️ for ESISA
