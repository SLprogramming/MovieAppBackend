# MovieApp Backend

A comprehensive Node.js and Express.js backend API for the MovieApp platform, providing user authentication, movie content management, premium subscriptions, payment processing, and real-time notifications.

## Features

- **User Authentication & Authorization**: JWT-based authentication with role-based access control (user, admin, superAdmin)
- **Movie Content Management**: Integration with TMDB API for movie data, search, genres, and recommendations
- **Premium Subscriptions**: Plan management with expiration tracking and premium features
- **Payment Processing**: Support for multiple payment types and bank account management
- **Purchase Requests**: Admin approval system for premium purchases with image uploads
- **Real-time Notifications**: Socket.io integration for real-time updates
- **Media Uploads**: Cloudinary integration for image uploads
- **Email Notifications**: SMTP-based email system for activation and password reset
- **Session Management**: Multi-device session handling with Redis support
- **User Lists**: Bookmarks, favorites, and recent watch history

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Uploads**: Multer + Cloudinary
- **Email**: Nodemailer with EJS templates
- **Real-time**: Socket.io
- **Caching**: Redis (configured but commented in code)
- **Validation**: Custom validation with regex patterns
- **Security**: bcryptjs for password hashing, CORS configuration

## Prerequisites

- Node.js (v16 or higher)
- MongoDB database
- Redis (optional, for session caching)
- Cloudinary account (for media uploads)
- SMTP service (for email notifications)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MovieAppBackend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env` file and configure all required variables (see Environment Variables section)

4. **Start the server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

The server will start on the configured port (default: 8000).

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=8000
NODE_ENV=development
LOCAL_IP_ADDRESS=192.168.110.108
CLIENT_URL=https://movie-app-website-mu.vercel.app

# Database
DB_URL="mongodb+srv://username:password@cluster.mongodb.net/MovieApp?retryWrites=true&w=majority"

# JWT Tokens
ACCESS_TOKEN=your_access_token_secret
ACCESS_TOKEN_EXPIRE=1
REFRESH_TOKEN=your_refresh_token_secret
REFRESH_TOKEN_EXPIRE=1
ACTIVATION_SECRET=your_activation_secret
RESET_PASSWORD_SECRET=your_reset_password_secret

# Cloudinary (Media Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SERVICE=gmail
SMTP_MAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

## API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /auth/register` - User registration
- `POST /auth/activate-user` - Account activation
- `POST /auth/login` - User login
- `POST /auth/social-auth` - Social authentication
- `GET /auth/refreshtoken` - Refresh access token
- `GET /auth/logout` - User logout
- `GET /auth/info` - Get user information
- `PUT /auth/update-info` - Update user profile
- `PUT /auth/update-password` - Change password
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password/:token` - Reset password

### User Management (`/api/user`)
- `PUT /user/add-bookmarks-favorate` - Add to bookmarks/favorites
- `PUT /user/remove-bookmarks-favorate` - Remove from bookmarks/favorites
- `POST /user/remove/session` - Remove user session
- `GET /user/get-premium-user` - Get premium users (admin only)
- `GET /user/get-all` - Get all users (admin only)
- `PUT /user/promote/:id` - Promote user to admin (superAdmin only)
- `PUT /auth/extend-premium` - Extend premium subscription (admin only)

### Movie Content (`/api/content`)
- `GET /content/get-all/:page` - Get trending movies/TV shows
- `GET /content/search/:page` - Search movies by keyword
- `GET /content/genre-filter/:page` - Filter by genre
- `GET /content/get-genres` - Get available genres
- `GET /content/get-detail/:id` - Get movie/TV show details
- `GET /content/get-trailers/:id` - Get trailers
- `GET /content/get-cast/:id` - Get cast information
- `GET /content/get-similar/:id` - Get similar content
- `GET /content/get/favorite` - Get user's favorites
- `GET /content/get/bookmark` - Get user's bookmarks
- `GET /content/get/recent` - Get user's recent watch history

### Premium Plans (`/api/plan`)
- `GET /get-all` - Get all premium plans
- `GET /get/:id` - Get plan by ID
- `POST /create` - Create new plan
- `PUT /update/:id` - Update plan
- `DELETE /delete/:id` - Delete plan

### Purchase Requests (`/api/purchase`)
- `GET /get-all` - Get all purchase requests
- `GET /get/:id` - Get request by ID
- `GET /getByUser/:id` - Get requests by user ID
- `POST /create` - Create purchase request (with image upload)
- `PUT /update/:id` - Update request status
- `DELETE /delete/:id` - Delete request

### Payment Types (`/api/payment`)
- `GET /get-all` - Get all payment types
- `GET /get/:id` - Get payment type by ID
- `POST /create` - Create payment type (admin only)
- `PUT /update/:id` - Update payment type (admin only)
- `DELETE /delete/:id` - Delete payment type (admin only)
- `POST /activate/:id` - Toggle payment type status (admin only)

### Bank Accounts (`/api/bankAccount`)
- `GET /get-all` - Get all bank accounts
- `GET /getByPayment/:id` - Get accounts by payment type
- `GET /get/:id` - Get account by ID
- `POST /create` - Create bank account
- `PUT /update/:id` - Update bank account
- `DELETE /delete/:id` - Delete bank account
- `PUT /activate/:id` - Toggle account status

## Project Structure

```
MovieAppBackend/
├── .env                    # Environment variables
├── .gitignore             # Git ignore rules
├── app.js                 # Express app configuration
├── server.js              # Server bootstrap
├── package.json           # Dependencies and scripts
├── config/                # Configuration files
│   ├── cloudinary.js      # Cloudinary setup
│   ├── db.js             # Database connection
│   ├── multer.js         # File upload configuration
│   ├── redis.js          # Redis configuration
│   └── filePath.js       # File path utilities
├── controllers/           # Route controllers
│   ├── user.controller.js
│   ├── movie.controller.js
│   ├── premiumPlan.controller.js
│   ├── paymentType.controller.js
│   ├── bankAccount.controller.js
│   └── purchaseRequest.controller.js
├── middleware/            # Custom middleware
│   ├── auth.js           # Authentication middleware
│   ├── catchAsyncError.js # Error handling wrapper
│   └── error.js          # Global error handler
├── models/                # MongoDB models
│   ├── user.model.js
│   ├── premiumPlan.model.js
│   ├── paymentType.model.js
│   ├── bankAccount.model.js
│   └── purchaseRequest.model.js
├── routes/                # API routes
│   ├── user.route.js
│   ├── movie.route.js
│   ├── plan.route.js
│   ├── paymentType.route.js
│   ├── bankAccount.route.js
│   └── purchaseRequest.route.js
├── services/              # External service integrations
│   ├── tmdb.service.js    # TMDB API integration
│   └── user.service.js    # User-related services
├── mails/                 # Email templates
│   ├── activation-mail.ejs
│   └── reset-password.ejs
├── staticData/            # Static data files
│   └── commonPassword.js  # Common password list
└── utils/                 # Utility functions
    ├── jwt.js            # JWT token utilities
    ├── sendMail.js       # Email sending utility
    ├── socket.js         # Socket.io configuration
    └── ErrorHandler.js   # Custom error handler
```

## Usage

### Authentication Flow
1. User registers with email and password
2. System sends activation email
3. User activates account via email link
4. User can login and receive JWT tokens
5. Protected routes require valid access tokens

### Premium Subscription Flow
1. Admin creates premium plans
2. User selects plan and submits purchase request with payment proof
3. Admin reviews and approves/rejects request
4. Upon approval, user's premium status is activated/extended

### Movie Content Access
- Basic users can browse and search content
- Premium users get access to additional features
- Users can bookmark, favorite, and track recently watched content

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code patterns and structure
- Use `catchAsyncError` wrapper for async route handlers
- Implement proper error handling and validation
- Add appropriate middleware for authentication and authorization
- Update documentation for new features
- Write tests for new functionality

## License

This project is licensed under the ISC License.

## Support

For support or questions, please contact the development team or create an issue in the repository.
