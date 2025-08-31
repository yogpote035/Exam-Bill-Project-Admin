# 🏫 Staff Remuneration Admin Portal

<div align="center">

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)
![React](https://img.shields.io/badge/React-18.x-blue.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-5+-green.svg)

**A comprehensive admin dashboard for managing staff remuneration, teacher profiles, and billing systems for educational institutions.**

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [API](#-api-endpoints) • [Contributing](#-contributing)

</div>

---

## ✨ Features

### 🔐 **Authentication & Security**

- **🛡️ Role-based access control** (Admin/Teacher)
- **🔒 Secure login/logout** system with JWT
- **🔑 Password strength** validation
- **🎯 Session management**

### 👥 **User Management**

- **📋 Admin profile** management
- **👩‍🏫 Teacher account** management
- **📦 Bulk operations** support
- **📊 User status** tracking

### 💰 **Bill Management**

- **📄 Create and manage** remuneration bills
- **💳 Track payment** status
- **📈 Generate financial** reports
- **📤 Export billing** data

### 📊 **Dashboard & Analytics**

- **📈 System statistics** overview
- **💹 Revenue tracking**
- **🎯 Teacher performance** metrics
- **💼 Financial summaries**

### 🔍 **Search & Filter**

- **🚀 Advanced search** functionality
- **🏢 Department-based** filtering
- **⚡ Real-time search** results
- **📄 Pagination** support

---

## 🛠️ Technology Stack

<table>
<tr>
<td>

### 🎨 **Frontend**

- **React** 18.x - UI Framework
- **Redux Toolkit** - State Management
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Axios** - HTTP Client

</td>
<td>

### ⚙️ **Backend**

- **Node.js** - Runtime Environment
- **Express.js** - Web Framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password Hashing

</td>
</tr>
</table>

---

## 📦 Installation

### Prerequisites

Make sure you have the following installed:

- **Node.js** (v16 or higher) 📗
- **MongoDB** (v5 or higher) 🍃
- **npm** or **yarn** 📦

### 🚀 Quick Start

1. **📥 Clone the repository**

   ```bash
   git clone https://github.com/your-username/staff-remuneration-admin.git
   cd staff-remuneration-admin
   ```

2. **📚 Install dependencies**

   ```bash
   # Install backend dependencies
   npm install

   # Install frontend dependencies
   cd client
   npm install
   cd ..
   ```

3. **⚙️ Environment Configuration**

   Create a `.env` file in the root directory:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/staff-remuneration
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

4. **🚀 Start the application**

   ```bash
   # Start backend server
   npm start

   # Start frontend (in new terminal)
   cd client
   npm run dev
   ```

5. **🌐 Access the application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

---

## 📁 Project Structure

```
staff-remuneration-admin/
├── 🎨 client/                 # React frontend
│   ├── 📁 public/
│   ├── 📁 src/
│   │   ├── 🧩 components/     # Reusable components
│   │   ├── 📄 pages/         # Page components
│   │   ├── 🗃️ AllStateStore/ # Redux store and slices
│   │   └── 🔧 utils/         # Utility functions
│   └── 📦 package.json
├── 🎛️ controllers/           # Route controllers
├── 📊 models/               # MongoDB models
├── 🛣️ routes/               # API routes
├── 🔒 middleware/           # Custom middleware
├── ⚙️ config/              # Configuration files
└── 🖥️ server.js            # Main server file
```

---

## 🎯 Usage

### 🔑 **Admin Login**

1. Navigate to the login page
2. Use default admin credentials:
   ```
   📧 Email: admin@example.com
   🔒 Password: Admin@1234
   ```

### 👩‍🏫 **Managing Teachers**

- **📋 View Teachers**: Navigate to Teachers section
- **➕ Add Teacher**: Click "Add New Teacher"
- **✏️ Edit Teacher**: Select teacher and update details
- **🗑️ Remove Teacher**: Use delete action

### 💳 **Bill Management**

- **📄 Create Bill**: Select teacher and fill bill details
- **👀 View Bills**: Filter by status, date, or teacher
- **🔄 Update Status**: Mark bills as paid/pending
- **📊 Generate Reports**: Export billing data

---

## 🔌 API Endpoints

### 🔐 **Authentication**

```http
POST /api/auth/login      # 🔑 User login
POST /api/auth/logout     # 🚪 User logout
POST /api/auth/register   # 📝 Admin registration
```

### 👥 **Users**

```http
GET    /api/users         # 📋 Get all users
GET    /api/users/:id     # 👤 Get user by ID
PUT    /api/users/:id     # ✏️ Update user
DELETE /api/users/:id     # 🗑️ Delete user
```

### 👩‍🏫 **Teachers**

```http
GET    /api/teachers      # 📋 Get all teachers
POST   /api/teachers      # ➕ Create teacher
PUT    /api/teachers/:id  # ✏️ Update teacher
DELETE /api/teachers/:id  # 🗑️ Delete teacher
```

### 💰 **Bills**

```http
GET /api/bills                # 📋 Get all bills
POST /api/bills               # 📄 Create bill
PUT /api/bills/:id            # ✏️ Update bill
GET /api/bills/teacher/:id    # 👩‍🏫 Get bills by teacher
```

---

## 🚀 Deployment

### 🏗️ **Production Build**

```bash
# Build frontend
cd client
npm run build

# Start production server
npm start
```

### 🌍 **Environment Variables for Production**

```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
PORT=5000
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **🍴 Fork** the project
2. **🌿 Create** your feature branch
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **💾 Commit** your changes
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **📤 Push** to the branch
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **🔄 Open** a Pull Request

---

## 📋 Default Credentials

| Role  | Email               | Password     |
| ----- | ------------------- | ------------ |
| Admin | `admin@example.com` | `Admin@1234` |

> ⚠️ **Security Note**: Please change default credentials in production environment

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support

Need help? We're here for you!

- 📧 **Email**: [support@staff-remuneration.com](mailto:support@staff-remuneration.com)
- 🐛 **Issues**: [Create an issue](https://github.com/your-username/staff-remuneration-admin/issues)
- 📖 **Documentation**: Check our [Wiki](https://github.com/your-username/staff-remuneration-admin/wiki)

---

## 🔄 Version History

| Version    | Date       | Changes                               |
| ---------- | ---------- | ------------------------------------- |
| **v1.0.0** | 2024-01-30 | 🎉 Initial release with core features |
|            |            | • Basic CRUD operations               |
|            |            | • Authentication system               |
|            |            | • Bill management                     |

---

## 🙏 Acknowledgments

Special thanks to:

- **⚛️ React Team** - For the amazing framework
- **🍃 MongoDB** - For robust database solutions
- **🎨 Tailwind CSS** - For utility-first CSS framework
- **👥 All Contributors** - For testing and feedback

---

<div align="center">

**⭐ If this project helped you, please give it a star! ⭐**

Made with ❤️ for educational institutions

</div>

## 👨‍💻 Developer Info

- **👨‍💻 Name:** Yogesh Pote
- **🎓 Education:** B.Sc. Computer Science (Final Year, 2026)
- **💻 Tech Stack:** MERN, Java, DSA, C++, PHP, MySQL, T-SQL, OOPs
- **📫 Email:** [yogpote035@gmail.com](mailto:yogpote035@gmail.com)
- **📱 Contact:** +91 8999390368
- **🌐 Portfolio:** [https://yogpote035.github.io/Portfolio-Website/](https://yogpote035.github.io/Portfolio-Website/)
- **📂 GitHub:** [@yogpote035](https://github.com/yogpote035)
