# Full-Stack Rating Platform

This project is a multi-role platform for rating stores, built with a React frontend, a Node.js/Express backend, and a MySQL database.

## Final Setup and Running the Application

The application code has been generated, but the dependencies have not been installed. Please follow these steps to run the project.

### 1. Database Setup

1.  **Start your MySQL server.**
2.  Connect to your MySQL instance using a client like MySQL Workbench, DBeaver, or the command line.
3.  Execute the contents of the `migration.sql` file located in the root of this project. This will create the `rating_platform` database and all the necessary tables (`users`, `stores`, `ratings`).

### 2. Backend Setup

1.  **Navigate to the `backend` directory:**
    ```bash
    cd backend
    ```
2.  **Update your credentials:** Open the `.env` file and replace the placeholder values with your actual MySQL database credentials and a secure `JWT_SECRET`.
    ```
    DB_HOST=localhost
    DB_USER=your_mysql_user
    DB_PASSWORD=your_mysql_password
    DB_NAME=rating_platform
    JWT_SECRET=a_very_long_and_secure_random_string
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Start the backend server:**
    ```bash
    npm start
    ```
    The backend API will be running on `http://localhost:3001`.

### 3. Frontend Setup

1.  **Open a new terminal.**
2.  **Navigate to the `frontend` directory:**
    ```bash
    cd frontend
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Start the frontend development server:**
    ```bash
    npm run dev
    ```
    The frontend application will be available at `http://localhost:3000`.

### 4. How to Use the Application

-   Visit `http://localhost:3000` in your browser.
-   **Sign up** for a new "Normal User" account.
-   **Login** with your new account to browse and rate stores.
-   To use the **Admin** or **Store Owner** features, you must first create users with these roles. You can do this by:
    1.  Temporarily changing the `role` in the `register` endpoint in `backend/routes/auth.js` to `'admin'`.
    2.  Or, more robustly, logging into your database and manually updating a user's role:
        ```sql
        USE rating_platform;
        UPDATE users SET role = 'admin' WHERE email = 'your_email@example.com';
        ```
    3.  Once you have an admin account, you can log in and use the "User Management" page to create other admins or store owners.

The application is now fully set up and ready to be used.
