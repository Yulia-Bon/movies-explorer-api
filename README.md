# Movies Explorer API

This repository contains the backend for the Movies Explorer project. It provides the necessary API to connect with the frontend and manage user data, movie information, and authentication.

The frontend for this project can be found at https://yulia-bon.github.io/.

## 🚀 Getting Started Locally

To run this server locally on your machine, follow the instructions below.

### Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (version 14 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (or you can use a cloud solution like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

### Installing the dependencies

Clone the repository:
```bash
git clone https://github.com/Yulia-Bon/movies-explorer-api.git
```
Navigate to the project directory:
```bash
cd movies-explorer-api
```
Install the necessary dependencies:
```bash
npm install
```
Setting up the environment
Make sure to create a .env file in the root of your project with the following environment variables:
```
MONGO_URL=mongodb://localhost:27017/movies-explorer-db
PORT=3000
JWT_SECRET=your-secret-key
```
MONGO_URL is the connection URL for MongoDB (replace with your own if you're using MongoDB Atlas or another service).
PORT is the port on which the server will run (default: 3000).
JWT_SECRET is a secret key for generating JWT tokens.
Running the server
To start the server locally, use the following command:
```
npm run start
```
Your backend will be available at http://localhost:3000.

Frontend
The frontend for this project can be found at https://yulia-bon.github.io/. It connects to the backend via API requests to the locally running server.

🛠️ Available Scripts
In the project directory, you can run:

```npm run start```: Starts the backend server.
```npm run dev```: Runs the server in development mode with live reloading.
Deployment
Currently, this API is designed to run locally. If you'd like to deploy it to a cloud server, you'll need to ensure that the environment variables are properly configured.

For cloud deployments, you can use services like Heroku or Render for easy setup, although I did not find them particularly convenient.

🔑 Authentication
The API uses JWT (JSON Web Tokens) for user authentication. Ensure that the JWT_SECRET environment variable is set up correctly to generate and verify tokens.