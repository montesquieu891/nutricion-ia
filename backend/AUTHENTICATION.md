# JWT Authentication System

## Overview

The Nutricion IA application now includes a complete JWT (JSON Web Token) authentication system for secure user access.

## Features

- ✅ **User Registration** with email and password
- ✅ **User Login** with JWT token generation
- ✅ **Token Refresh** for maintaining sessions
- ✅ **User Logout** with token invalidation
- ✅ **Protected Endpoints** requiring authentication
- ✅ **Password Hashing** with bcrypt
- ✅ **Token Expiration** (15 minutes for access, 7 days for refresh)

## API Endpoints

### Authentication Endpoints

#### 1. Register User
**POST** `/api/v1/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "SecurePass123!",
  "password_confirm": "SecurePass123!",
  "objetivo_calorias": 2000
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 900
}
```

#### 2. Login
**POST** `/api/v1/auth/login`

Login with existing credentials.

**Request Body:**
```json
{
  "email": "juan@example.com",
  "password": "SecurePass123!"
}
```

**Response:** Same as registration

#### 3. Refresh Token
**POST** `/api/v1/auth/refresh`

Get a new access token using a refresh token.

**Request Body:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 900
}
```

#### 4. Logout
**POST** `/api/v1/auth/logout`

Invalidate refresh token.

**Request Body:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "message": "Successfully logged out"
}
```

## Protected Endpoints

All dieta and recetas endpoints now require authentication. Include the access token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Protected Endpoints List:
- `GET /api/v1/dieta/` - List user's diets
- `POST /api/v1/dieta/` - Create new diet
- `GET /api/v1/dieta/{id}` - Get specific diet
- `PUT /api/v1/dieta/{id}` - Update diet
- `DELETE /api/v1/dieta/{id}` - Delete diet
- `POST /api/v1/dieta/generar` - Generate diet with AI
- `GET /api/v1/recetas/` - List user's recipes
- `POST /api/v1/recetas/` - Create new recipe
- `GET /api/v1/recetas/{id}` - Get specific recipe
- `PUT /api/v1/recetas/{id}` - Update recipe
- `DELETE /api/v1/recetas/{id}` - Delete recipe
- `POST /api/v1/recetas/generar` - Generate recipe with AI

## Security Features

### Password Security
- Passwords are hashed using **bcrypt** with automatic salting
- Minimum password length: 8 characters
- Passwords are never stored in plain text

### Token Security
- JWT tokens signed with HS256 algorithm
- Access tokens expire after **15 minutes**
- Refresh tokens expire after **7 days**
- Refresh tokens stored in database for invalidation
- Token type validation (access vs refresh)

### Request Security
- Bearer token authentication
- Token validation on every protected request
- User ID extraction from token
- Automatic user association with resources

## Configuration

### Environment Variables

Add these variables to your `.env` file:

```env
# JWT Authentication
JWT_SECRET_KEY=your-secret-key-here-change-in-production-use-strong-random-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7
```

**Important:** Change `JWT_SECRET_KEY` in production to a strong, random secret key.

## Database Changes

### New Fields
- `users.hashed_password` - Stores bcrypt-hashed passwords

### New Table: refresh_tokens
- `id` - Primary key
- `user_id` - Foreign key to users
- `token` - Unique refresh token
- `expires_at` - Token expiration datetime
- `created_at` - Token creation datetime

## Usage Examples

### JavaScript/TypeScript (Frontend)

```typescript
// Register
const response = await fetch('/api/v1/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nombre: 'Juan Pérez',
    email: 'juan@example.com',
    password: 'SecurePass123!',
    password_confirm: 'SecurePass123!',
    objetivo_calorias: 2000
  })
});
const { access_token, refresh_token } = await response.json();

// Store tokens (localStorage or secure storage)
localStorage.setItem('access_token', access_token);
localStorage.setItem('refresh_token', refresh_token);

// Make authenticated request
const dietasResponse = await fetch('/api/v1/dieta/', {
  headers: {
    'Authorization': `Bearer ${access_token}`
  }
});
```

### Python

```python
import requests

# Register
response = requests.post('http://localhost:8000/api/v1/auth/register', json={
    'nombre': 'Juan Pérez',
    'email': 'juan@example.com',
    'password': 'SecurePass123!',
    'password_confirm': 'SecurePass123!',
    'objetivo_calorias': 2000
})
tokens = response.json()
access_token = tokens['access_token']

# Make authenticated request
headers = {'Authorization': f'Bearer {access_token}'}
dietas = requests.get('http://localhost:8000/api/v1/dieta/', headers=headers)
```

## Migration

To apply the database changes:

```bash
cd backend
alembic upgrade head
```

This will:
1. Add `hashed_password` field to users table
2. Create `refresh_tokens` table

## Testing

The authentication system has been tested for:
- ✅ Password hashing and verification
- ✅ JWT token creation and decoding
- ✅ Token expiration handling
- ✅ Schema validation
- ✅ Integration with protected endpoints
- ✅ Security vulnerabilities (CodeQL scan passed)

## Troubleshooting

### 401 Unauthorized
- Check that you're including the Authorization header
- Verify the token hasn't expired
- Ensure you're using an access token (not refresh token) for API requests

### Token Expired
- Use the refresh token endpoint to get a new access token
- If refresh token is also expired, user needs to login again

### Invalid Credentials
- Verify email and password are correct
- Check that user account exists

## Next Steps

Recommended improvements for production:
1. Add rate limiting on authentication endpoints
2. Implement password reset functionality
3. Add email verification on registration
4. Enable HTTPS in production
5. Add account lockout after failed login attempts
6. Implement OAuth2 for social login (optional)
