# Project Name

This project is the solution to the Fender Digital Platform Engineering Challenge. It provides a simple RESTful API built with Node.js and Express for managing user accounts, including sign-up, sign-in, sign-out, and user profile operations..

## Requirements

* Docker Compose version **v2.26.1**
* Docker version **26.0.0**

## Installation

1. Verify that Docker and Docker Compose are installed with the specified versions:

   ```bash
   docker --version           # Should output Docker version 26.0.0
   docker compose version     # Should output Docker Compose version v2.26.1
   ```

2. Clone the repository:

   ```bash
   git clone https://github.com/littleJmer/fender/tree/main
   cd fender
   ```

## Running the API

To start the API using Docker Compose:

```bash
# Launch containers in detached mode
sh deploy.sh
```

This command will pull the necessary images and start the containers in the background.

The API will be accessible at `http://localhost:3000` (adjust the port if necessary).

## Stopping the API

To stop and remove the containers:

```bash
sh stop.sh
```

## API Endpoints

### POST /signup

Creates a new user account.

**Request**

```bash
curl --location --request POST 'http://localhost:3000/signup' \
     --header 'User-Agent: Apidog/1.0.0 (https://apidog.com)' \
     --header 'Content-Type: application/json' \
     --data-raw '{
         "username": "username",
         "password": "password"
     }'
```

**Response**

* **200 Created** on success with JSON body containing user details or error message.

### POST /signin

Authenticates an existing user and returns an access token.

**Request**

```bash
curl --location --request POST 'http://localhost:3000/signin' \
     --header 'Content-Type: application/json' \
     --data-raw '{
         "username": "username",
         "password": "password"
     }'
```

**Response**

* **200 OK** with JSON body:

  ```json
  {
    "data": {
      "access_token": "<token-value>"
    }
  }
  ```
* Sets an HTTP-only cookie `jid` for the refresh token.

### POST /signout

Revokes the current session’s refresh token and clears the authentication cookie.

**Request**

```bash
curl --location --request POST 'http://localhost:3000/signout' \
     --header 'Cookie: jid=<refresh-token>'
```

**Response**

* **200 OK** on success.

### GET /user

Retrieves the authenticated user’s profile.

**Request**

```bash
curl --location --request GET 'http://localhost:3000/user' \
     --header 'Authorization: Bearer <access-token>'
```

**Response**

* **200 OK** with JSON body containing user profile.

### PUT /user

Updates the authenticated user’s profile (firstName, lastName, email are the fields allowed), You only add in the body the fields you want to update.

**Request**

```bash
curl --location --request PUT 'http://localhost:3000/user' \
     --header 'Authorization: Bearer <access-token>' \
     --header 'Content-Type: application/json' \
     --data-raw '{
         "firstName": "Manuel",
         "lastName": "Escobedo",
         "email": "juanmanueler@gmail.com"
     }'
```

**Response**

* **200 OK** with updated user data.

### DELETE /user

Deletes the authenticated user’s account and associated session data.

**Request**

```bash
curl --location --request DELETE 'http://localhost:3000/user' \
     --header 'Authorization: Bearer <access-token>'
```

**Response**

* **200 OK** on successful deletion.