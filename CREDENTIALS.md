# Store Rating Platform - Login Credentials

All users have the same password: **Admin@123**

## Admin Users
- **Email:** admin@system.com
- **Email:** admin2@system.com

## Normal Users
1. john.anderson@email.com
2. sarah.thompson@email.com
3. michael.johnson@email.com
4. emily.williams@email.com
5. david.brown@email.com
6. jennifer.davis@email.com
7. robert.martinez@email.com
8. lisa.garcia@email.com

## Store Owners
1. electronics@store.com - Premium Electronics Superstore
2. foodmarket@store.com - Gourmet Food Market Place
3. fashion@store.com - Fashion Boutique Collections
4. furniture@store.com - Home Furniture Gallery Showroom
5. sports@store.com - Sports Equipment Pro Shop
6. bookstore@store.com - Books And More Bookstore

## Setup Instructions

1. Run the database migration:
   ```bash
   mysql -u root -p rating_platform < fix_validations.sql
   ```

2. Start the backend:
   ```bash
   cd backend
   npm start
   ```

3. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

## Features Implemented

### Admin
- Dashboard with statistics
- Create users and stores
- User management with filtering and sorting
- Store management with filtering and sorting
- View user details (includes store rating for owners)

### Normal Users
- Sign up and login
- View and search stores
- Submit and modify ratings
- Change password

### Store Owners
- View dashboard with average rating
- See list of users who rated their store
- Change password
