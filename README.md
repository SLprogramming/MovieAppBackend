# LMS Backend

This is the backend for the Learning Management System (LMS) application. It is built using Node.js, Express, MongoDB, and Redis.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [License](#license)

## Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/TaingLinnMaung/lms_backend.git
    cd lms-backend
    ```

2. Install the dependencies:

    ```sh
    npm install
    ```

3. Create a  file in the root directory and add your environment variables. You can use the  file as a reference.

## Configuration

The application requires the following environment variables to be set:

- : The port on which the server will run.
- : The local IP address of the server.
- `ORIGIN`: The allowed origins for CORS.
- : The MongoDB connection URL.
- : The Redis connection URL.
- : The secret key for activation tokens.
- : The secret key for refresh tokens.
- : The secret key for access tokens.
- : The expiration time for access tokens.
- : The expiration time for refresh tokens.
- : The SMTP host for sending emails.
- : The SMTP port for sending emails.
- : The SMTP service for sending emails.
- : The SMTP email address for sending emails.
- : The SMTP password for sending emails.

## Usage

1. Start the server:

    ```sh
    npm run dev
    ```

2. The server will be running on `http://<LOCAL_IP_ADDRESS>:<PORT>`.

## API Endpoints

### Auth

- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/activate-user`: Activate a user account.
- `POST /api/auth/login`: Login a user.
- `POST /api/auth/social-auth`: Social authentication.
- `GET /api/auth/refreshtoken`: Refresh access token.
- `GET /api/auth/logout`: Logout a user.
- `GET /api/auth/info`: Get user info (requires authentication).
- `PUT /api/auth/update-info`: Update user info (requires authentication).
- `PUT /api/auth/update-password`: Update user password (requires authentication).

### User

- `GET /api/test`: Test the API.

## License

This project is licensed under the MIT License.
