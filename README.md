# LessTaxi Task Manager

## Project Overview

LessTaxi Task Manager is a full-stack web application designed to help teams and individuals efficiently manage, track, and assign tasks. It provides a beautiful and mobile-responsive dashboard to monitor tasks across different statuses, along with an administrative view to oversee system-wide users and their respective assignments.

## Technology Stack

The project is built using modern, robust web technologies:

- **Frontend:** [Next.js](https://nextjs.org/) (React Framework), Tailwind CSS (for styling and responsiveness)
- **Backend:** [Node.js](https://nodejs.org/) and [Express.js](https://expressjs.com/) (REST API)
- **Database:** [MongoDB](https://www.mongodb.com/) (NoSQL database for flexible data modeling)

## Application Screenshots

- **Login Page:**
  ![Login Screenshot](./screenshots/login.png)
- **Register Page:**
  ![Register Screenshot](./screenshots/register.png)
- **Dashboard View:**
  ![Dashboard Screenshot](./screenshots/dashboard.png)

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` files. 

### Backend Environment Variables (`backend/.env`)

Create a `.env` file in the root of the `backend` directory and configure the following variables (make sure to replace the placeholder values with your actual configuration):

```env
# The port on which the backend server will run
PORT=5000

# Your MongoDB connection string
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.ugpprvh.mongodb.net/<dbname>?appName=Cluster0

# Secret key for signing JSON Web Tokens (JWT)
JWT_SECRET=your_jwt_secret_key
```

*(Note: Depending on your frontend configuration, you might also need an `.env.local` file in the `frontend` folder containing your API URL, such as `NEXT_PUBLIC_API_URL=http://localhost:5000/api`)*

## Setup Instructions

Follow the steps below to run the application locally.

### 1. Backend Setup

1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Create the `.env` file and add the required environment variables as shown above.
4. Start the backend development server:
   ```bash
   npm run dev
   # or
   npm start
   ```
   The backend server should now be running on `http://localhost:5000`.

### 2. Frontend Setup

1. Open a new terminal window/tab and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The frontend application should now be accessible at `http://localhost:3000`.

## Deployment Information

- **Backend:** Can be deployed to services like Render, Heroku, or DigitalOcean. Ensure you set the environment variables in your hosting provider's dashboard.
- **Frontend:** Optimized for deployment on [Vercel](https://vercel.com/) or Netlify. Configure the build command (`npm run build`) and output directory according to Next.js standards.
- **Database:** Uses MongoDB Atlas for a scalable cloud database solution. Make sure to whitelist your production backend's IP address in MongoDB Atlas settings.
