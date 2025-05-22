# Project Name

A brief description of your API.

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
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```

## Running the API

To start the API using Docker Compose:

```bash
# Launch containers in detached mode
docker compose up -d
```

This command will pull the necessary images and start the containers in the background. To view the API logs:

```bash
docker compose logs -f api
```

The API will be accessible at `http://localhost:3000` (adjust the port if necessary).

## Stopping the API

To stop and remove the containers:

```bash
docker compose down
```
