# BlinkFind - MongoDB Authentication System

Complete MongoDB-integrated authentication system for BlinkFind with JWT tokens, account locking, and role-based access control.

## Project Structure

```
blinkfind/
├── backend/
│   ├── models/
│   │   └── User.js                 # MongoDB User schema
│   ├── controllers/
│   │   └── authController.js       # Authentication logic
│   ├── middleware/
│   │   └── auth.js                 # JWT verification middleware
│   ├── routes/
│   │   └── auth.js                 # Auth API routes
│   ├── scripts/
│   │   └── seedUsers.js            # Database seed script
│   ├── server.js                   # Express server
│   ├── .env                        # Environment variables
│   ├── .gitignore                  # Git ignore rules
│   └── package.json                # Dependencies
├── frontend/
│   ├── login.html                  # Login page
│   ├── login.js                    # Login logic (client-side)
│   ├── auth.js                     # Token verification & protected routes
│   ├── home.html                   # Admin home page
│   ├── home_guest.html             # Guest home page
│   └── styles.css                  # Styling
└── README.md
```

## Features

✅ **MongoDB Integration** - All user data stored securely in MongoDB
✅ **JWT Authentication** - Secure token-based authentication
✅ **Password Hashing** - Bcrypt hashing with 10 salt rounds
✅ **Account Locking** - Auto-lock after 3 failed login attempts (1 hour)
✅ **Role-Based Access** - Admin and Guest roles with different permissions
✅ **Token Verification** - Automatic token verification on protected pages
✅ **Remember Me** - Optional persistent login
✅ **Session Management** - Track last login timestamps
✅ **CORS Enabled** - Cross-origin requests support
✅ **Error Handling** - Comprehensive error messages

## Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)
- npm

## Installation

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Edit `backend/.env`:

```env
PORT=4000
JWT_SECRET=your_super_secret_key_blinkfind_2026
MONGODB_URI=mongodb://localhost:27017/blinkfind
NODE_ENV=development
```

**For MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blinkfind?retryWrites=true&w=majority
```

### 3. Start MongoDB

**Local MongoDB:**
```bash
mongod
```

**MongoDB Atlas:** Use your connection string in `.env`

### 4. Seed Default Users

```bash
npm run seed
```

Default Users:
- **Admin:** username `admin` / password `school123`
- **Guest:** username `guest` / password `guest`

### 5. Start Backend Server

```bash
npm start
```

Server runs on: `http://localhost:4000`

### 6. Update Frontend API Base (if needed)

In `frontend/login.html` and other HTML files:

```html
<script>
  window.API_BASE = "http://localhost:4000";
</script>
```

## API Endpoints

### Authentication Endpoints

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "school123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "username": "admin",
  "role": "admin",
  "redirectUrl": "./home.html"
}
```

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "password123",
  "role": "user"
}
```

#### Get Current User (Protected)
```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### Logout (Protected)
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

## Security Features

### Password Security
- Bcrypt hashing with 10 salt rounds
- Passwords never returned in API responses
- Minimum 6 characters required

### Account Protection
- **Failed Login Tracking:** Increments on wrong password
- **Account Locking:** Locked after 3 failed attempts
- **Auto-Unlock:** Locks for 1 hour, then unlocks automatically
- **Active Status:** Admins can deactivate accounts

### Token Security
- JWT tokens expire in 24 hours
- Tokens verified on every protected request
- Stored in localStorage on client-side
- Sent as `Bearer <token>` in Authorization header

### Data Validation
- Email validation using regex
- Username uniqueness enforced
- Email uniqueness enforced
- Input sanitization on backend

## Development

### Start Dev Server with Auto-Reload

```bash
npm run dev
```

Requires `nodemon` (included in devDependencies)

### Testing Endpoints

Using cURL:

```bash
# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"school123"}'

# Get current user (replace TOKEN)
curl -X GET http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

Using Postman:
1. Create POST request to `http://localhost:4000/api/auth/login`
2. Set body to JSON with username and password
3. Copy token from response
4. Set Authorization header to `Bearer <token>` for protected routes

## File Descriptions

### Backend Files

**models/User.js**
- MongoDB schema with validation
- Password hashing pre-hook
- Methods for password comparison and account locking
- Login attempt tracking

**controllers/authController.js**
- Login logic with account protection
- Registration with duplicate checking
- Current user retrieval
- Logout handler

**middleware/auth.js**
- JWT token verification
- Role-based authorization
- Token extraction and validation

**routes/auth.js**
- Route definitions for all auth endpoints
- Middleware application

**scripts/seedUsers.js**
- One-time database seeding
- Creates admin and guest users
- Automatically hashes passwords

**server.js**
- Express app initialization
- MongoDB connection
- Route registration
- Server startup

### Frontend Files

**login.html**
- Login form UI
- Error message display
- Remember me checkbox
- Forgot password link

**login.js**
- Form submission handling
- API communication
- Token storage
- Login attempt tracking
- Auto-fill username

**auth.js**
- Token verification on page load
- Protected route access control
- Logout function
- Auto-adding auth headers to fetch requests
- Role and username retrieval

**home.html & home_guest.html**
- Protected pages (auto-redirects to login if not authenticated)
- Display user info and role
- Logout button

## Deployment Checklist

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Update `MONGODB_URI` to production database
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS
- [ ] Add rate limiting
- [ ] Set up CORS with specific allowed origins
- [ ] Configure database backups
- [ ] Add monitoring and logging
- [ ] Set up SSL certificates
- [ ] Use environment variables for all secrets

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- For Atlas: verify IP whitelist and credentials

### JWT Token Errors
- Token expired: User needs to re-login
- Invalid token: Check JWT_SECRET matches
- Missing token: Ensure auth header is set

### CORS Errors
- Check frontend and backend are on correct ports
- Verify `window.API_BASE` is correct
- CORS is enabled in server.js

### Account Locked
- Wait 1 hour for automatic unlock
- Or reset via MongoDB directly
- Or modify lockUntil field in database

## Future Enhancements

- [ ] Refresh token implementation
- [ ] Email verification on registration
- [ ] Password reset via email
- [ ] Social login (Google, GitHub)
- [ ] Two-factor authentication
- [ ] User profile management
- [ ] Admin dashboard
- [ ] User management interface
- [ ] Activity logging
- [ ] Audit trails

## License

© 2026 PA FBLA All rights reserved.

Built by Rutviij Casula
