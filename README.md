# Transactly - Money Transfer Application

Transactly is a full-stack money transfer application that allows users to create accounts, log in, and transfer money between accounts securely.

## Features

- User Authentication (Signup/Login)
- Secure Dashboard
- Money Transfer between accounts
- Real-time balance updates
- Protected Routes
- Modern UI/UX

## Tech Stack

### Frontend
- React
- TypeScript
- React Router DOM
- Axios
- CSS

### Backend
- Node.js
- Express
- TypeScript
- MongoDB
- JWT Authentication
- Mongoose

## Project Structure

```
transactly/
├── Frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Signup.tsx
│   │   │   └── SendMoney.tsx
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
└── Backend/
    ├── src/
    │   ├── routes/
    │   │   ├── auth.ts
    │   │   └── account.ts
    │   ├── middleware/
    │   │   └── user.ts
    │   ├── db/
    │   │   └── index.ts
    │   └── index.ts
    └── package.json
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd transactly
```

2. Install Frontend Dependencies
```bash
cd Frontend
npm install
```

3. Install Backend Dependencies
```bash
cd ../Backend
npm install
```

### Running the Application

1. Start the Backend Server
```bash
cd Backend
npm run dev
```
The server will start on http://localhost:3000

2. Start the Frontend Development Server
```bash
cd Frontend
npm run dev
```
The application will be available at http://localhost:5173

## API Endpoints

### Authentication
- `POST /auth/signup` - Create a new account
- `POST /auth/login` - Login to existing account
- `PUT /auth/update` - Update user profile
- `GET /auth/getUser` - Get user profile

### Account Management
- `GET /account/balance` - Get account balance
- `POST /account/transfer` - Transfer money between accounts

## Security Features

- JWT-based authentication
- Protected routes
- Secure password handling
- CORS enabled
- Input validation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Your Name - your.email@example.com
Project Link: [https://github.com/yourusername/transactly](https://github.com/yourusername/transactly) 