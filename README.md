
# MovieApp Backend

A Node.js + Express backend powering the MovieApp frontend. Responsibilities include user authentication, media uploads (Cloudinary), email notifications, and payment/purchase management.

## Quick Start

1. Install deps
```sh
npm install

Create environment variables (see .env)
Run (development)

node [server.js](http://_vscodecontentref_/0)
# or `npm start` / `npm run dev` if configured

Environment
See .env. Key variables used in this workspace:

ACCESS_TOKEN, ACCESS_TOKEN_EXPIRE
REFRESH_TOKEN, REFRESH_TOKEN_EXPIRE
ACTIVATION_SECRET, RESET_PASSWORD_SECRET
DB_URL
CLOUDINARY_* (Cloudinary credentials)
SMTP_HOST, SMTP_MAIL, SMTP_PASSWORD, SMTP_PORT, SMTP_SERVICE
PORT, NODE_ENV, CLIENT_URL
Project Structure
app.js — Express app setup
server.js — Server bootstrap
config/
cloudinary.js
db.js
filePath.js
multer.js
redis.js
controllers/
user.controller.js
movie.controller.js
paymentType.controller.js
premiumPlan.controller.js
bankAccount.controller.js
purchaseRequest.contrller.js
middleware/
auth.js — auth middleware (auth)
catchAsyncError.js — (catchAsyncError)
error.js — global error handler (error)
models/
bankAccount.model.js
paymentType.model.js
premiumPlan.model.js
...other models in models/
mails/
activation-mail.ejs
reset-password.ejs
utils/
jwt.js — cookie/token utilities:
sendToken
accessTokenOptions
refreshTokenOptions
Authentication & Tokens
Tokens and cookie options are defined in utils/jwt.js. Use sendToken in controllers to set access_token and refresh_token cookies.
Dev vs production cookie settings are present — in production ensure secure: true and sameSite: 'none'.
Redis session persistence is referenced/commented in utils/jwt.js; configuration lives in config/redis.js.
Uploads & Email
Media uploads use Cloudinary configured in config/cloudinary.js.
Email templates live in mails/ and SMTP is configured via the .env variables.
API & Controllers
Controllers live in controllers/. Routes (mounting) occur in app.js — follow the patterns used by existing controllers and wrap async handlers with catchAsyncError.

Tests & CI
No tests detected. Recommended:

Add unit/integration tests under tests/
Add test script to package.json
Deployment Notes
Set NODE_ENV=production and update cookie secure/sameSite values.
Keep secrets in a secure store (env vars / secret manager).
Verify Cloudinary, SMTP, and DB credentials for production.
Contributing
Follow existing coding patterns.
Use catchAsyncError to wrap async route handlers.
Update documentation and add tests for new features.
If you want, I can:

Add a polished README.md commit with this content.
Generate endpoint documentation for each controller (I will read the route mounting in app.js and controllers in controllers/).