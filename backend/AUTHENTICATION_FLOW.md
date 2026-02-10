# Authentication Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        REGISTRATION FLOW                                 │
└─────────────────────────────────────────────────────────────────────────┘

User                    Frontend                Backend              Database
  │                        │                        │                    │
  │  1. Fill form          │                        │                    │
  ├───────────────────────>│                        │                    │
  │                        │                        │                    │
  │                        │ 2. POST /auth/register │                    │
  │                        ├───────────────────────>│                    │
  │                        │    {email, password}   │                    │
  │                        │                        │                    │
  │                        │                        │ 3. Check email     │
  │                        │                        ├───────────────────>│
  │                        │                        │<───────────────────┤
  │                        │                        │                    │
  │                        │                        │ 4. Hash password   │
  │                        │                        │ (bcrypt)           │
  │                        │                        │                    │
  │                        │                        │ 5. Create user     │
  │                        │                        ├───────────────────>│
  │                        │                        │<───────────────────┤
  │                        │                        │                    │
  │                        │                        │ 6. Generate tokens │
  │                        │                        │ (access + refresh) │
  │                        │                        │                    │
  │                        │                        │ 7. Store refresh   │
  │                        │                        ├───────────────────>│
  │                        │                        │                    │
  │                        │ 8. Return tokens       │                    │
  │                        │<───────────────────────┤                    │
  │  9. Store tokens       │                        │                    │
  │<───────────────────────┤                        │                    │

┌─────────────────────────────────────────────────────────────────────────┐
│                           LOGIN FLOW                                     │
└─────────────────────────────────────────────────────────────────────────┘

User                    Frontend                Backend              Database
  │                        │                        │                    │
  │  1. Enter credentials  │                        │                    │
  ├───────────────────────>│                        │                    │
  │                        │                        │                    │
  │                        │ 2. POST /auth/login    │                    │
  │                        ├───────────────────────>│                    │
  │                        │  {email, password}     │                    │
  │                        │                        │                    │
  │                        │                        │ 3. Find user       │
  │                        │                        ├───────────────────>│
  │                        │                        │<───────────────────┤
  │                        │                        │ {hashed_password}  │
  │                        │                        │                    │
  │                        │                        │ 4. Verify password │
  │                        │                        │ (bcrypt compare)   │
  │                        │                        │                    │
  │                        │                        │ 5. Generate tokens │
  │                        │                        │                    │
  │                        │                        │ 6. Store refresh   │
  │                        │                        ├───────────────────>│
  │                        │                        │                    │
  │                        │ 7. Return tokens       │                    │
  │                        │<───────────────────────┤                    │
  │  8. Store tokens       │                        │                    │
  │<───────────────────────┤                        │                    │

┌─────────────────────────────────────────────────────────────────────────┐
│                     AUTHENTICATED REQUEST FLOW                           │
└─────────────────────────────────────────────────────────────────────────┘

User                    Frontend                Backend              Database
  │                        │                        │                    │
  │  1. Request data       │                        │                    │
  ├───────────────────────>│                        │                    │
  │                        │                        │                    │
  │                        │ 2. GET /dieta/         │                    │
  │                        ├───────────────────────>│                    │
  │                        │ Authorization: Bearer  │                    │
  │                        │    <access_token>      │                    │
  │                        │                        │                    │
  │                        │                        │ 3. Decode token    │
  │                        │                        │ (validate JWT)     │
  │                        │                        │                    │
  │                        │                        │ 4. Get user        │
  │                        │                        ├───────────────────>│
  │                        │                        │<───────────────────┤
  │                        │                        │                    │
  │                        │                        │ 5. Get user's data │
  │                        │                        ├───────────────────>│
  │                        │                        │<───────────────────┤
  │                        │                        │                    │
  │                        │ 6. Return data         │                    │
  │                        │<───────────────────────┤                    │
  │  7. Display data       │                        │                    │
  │<───────────────────────┤                        │                    │

┌─────────────────────────────────────────────────────────────────────────┐
│                        TOKEN REFRESH FLOW                                │
└─────────────────────────────────────────────────────────────────────────┘

User                    Frontend                Backend              Database
  │                        │                        │                    │
  │  1. Access token       │                        │                    │
  │     expires (401)      │                        │                    │
  │<───────────────────────┤                        │                    │
  │                        │                        │                    │
  │                        │ 2. POST /auth/refresh  │                    │
  │                        ├───────────────────────>│                    │
  │                        │  {refresh_token}       │                    │
  │                        │                        │                    │
  │                        │                        │ 3. Validate token  │
  │                        │                        │                    │
  │                        │                        │ 4. Check DB        │
  │                        │                        ├───────────────────>│
  │                        │                        │<───────────────────┤
  │                        │                        │                    │
  │                        │                        │ 5. Generate new    │
  │                        │                        │    access token    │
  │                        │                        │                    │
  │                        │ 6. Return new token    │                    │
  │                        │<───────────────────────┤                    │
  │  7. Store new token    │                        │                    │
  │<───────────────────────┤                        │                    │
  │                        │                        │                    │
  │  8. Retry request      │                        │                    │
  ├───────────────────────>│                        │                    │
```

## Token Lifecycle

```
Access Token (15 minutes):
┌────────────────────────────────────────────────────────┐
│ Created at login/register → Valid for 15 min → Expires │
└────────────────────────────────────────────────────────┘
         │                           │
         │ Use for API requests      │ Use refresh to get new one
         ▼                           ▼

Refresh Token (7 days):
┌────────────────────────────────────────────────────────┐
│ Created at login/register → Valid for 7 days → Expires │
└────────────────────────────────────────────────────────┘
         │                           │
         │ Use to refresh access     │ User must login again
         ▼                           ▼
```

## Security Layers

```
┌─────────────────────────────────────────────────────┐
│ Layer 1: HTTPS (Production)                         │
│   └─> Encrypted communication                       │
└─────────────────────────────────────────────────────┘
                    ▼
┌─────────────────────────────────────────────────────┐
│ Layer 2: Password Hashing (bcrypt)                  │
│   └─> Passwords never stored in plain text          │
└─────────────────────────────────────────────────────┘
                    ▼
┌─────────────────────────────────────────────────────┐
│ Layer 3: JWT Signature (HS256)                      │
│   └─> Tokens signed with secret key                 │
└─────────────────────────────────────────────────────┘
                    ▼
┌─────────────────────────────────────────────────────┐
│ Layer 4: Token Expiration                           │
│   └─> Short-lived access tokens (15 min)            │
└─────────────────────────────────────────────────────┘
                    ▼
┌─────────────────────────────────────────────────────┐
│ Layer 5: Token Type Validation                      │
│   └─> Access vs Refresh token verification          │
└─────────────────────────────────────────────────────┘
                    ▼
┌─────────────────────────────────────────────────────┐
│ Layer 6: Database Token Storage                     │
│   └─> Refresh tokens can be invalidated             │
└─────────────────────────────────────────────────────┘
```
