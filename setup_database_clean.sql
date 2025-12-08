-- Complete Database Setup for Rating Platform
-- Run this entire file in MySQL Workbench

-- Step 1: Drop and recreate database
DROP DATABASE IF EXISTS rating_platform;
CREATE DATABASE rating_platform;
USE rating_platform;

-- Step 2: Create users table
CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  address VARCHAR(400),
  role ENUM('admin', 'user', 'store_owner') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE INDEX email_UNIQUE (email ASC)
);

-- Step 3: Create stores table
CREATE TABLE stores (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(255) NOT NULL,
  address VARCHAR(400),
  owner_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX fk_stores_users_idx (owner_id ASC),
  CONSTRAINT fk_stores_users
    FOREIGN KEY (owner_id)
    REFERENCES users (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

-- Step 4: Create ratings table
CREATE TABLE ratings (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  store_id INT NOT NULL,
  rating INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE INDEX user_store_unique (user_id ASC, store_id ASC),
  INDEX fk_ratings_users_idx (user_id ASC),
  INDEX fk_ratings_stores_idx (store_id ASC),
  CONSTRAINT fk_ratings_users
    FOREIGN KEY (user_id)
    REFERENCES users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_ratings_stores
    FOREIGN KEY (store_id)
    REFERENCES stores (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT rating_range CHECK (rating >= 1 AND rating <= 5)
);

-- Step 5: Insert Admin Users (Password: Admin@123)
INSERT INTO users (name, email, password_hash, address, role) VALUES
('System Administrator One', 'admin@system.com', '$2b$10$9gRWFamyciJ1OyeYe0aGvelrmVMhZK43fOE8G1eDeeZy.Yvf2HdOG', '123 Admin Street, Administrative District, City, State 12345', 'admin'),
('Chief System Manager Two', 'admin2@system.com', '$2b$10$9gRWFamyciJ1OyeYe0aGvelrmVMhZK43fOE8G1eDeeZy.Yvf2HdOG', '456 Manager Avenue, Business District, City, State 12346', 'admin');

-- Step 6: Insert Normal Users (Password: Admin@123)
INSERT INTO users (name, email, password_hash, address, role) VALUES
('John Michael Anderson', 'john.anderson@email.com', '$2b$10$9gRWFamyciJ1OyeYe0aGvelrmVMhZK43fOE8G1eDeeZy.Yvf2HdOG', '789 Residential Lane, Suburb Area, City, State 12347', 'user'),
('Sarah Elizabeth Thompson', 'sarah.thompson@email.com', '$2b$10$9gRWFamyciJ1OyeYe0aGvelrmVMhZK43fOE8G1eDeeZy.Yvf2HdOG', '321 Oak Street, Downtown, City, State 12348', 'user'),
('Michael Robert Johnson', 'michael.johnson@email.com', '$2b$10$9gRWFamyciJ1OyeYe0aGvelrmVMhZK43fOE8G1eDeeZy.Yvf2HdOG', '654 Pine Avenue, Westside, City, State 12349', 'user'),
('Emily Catherine Williams', 'emily.williams@email.com', '$2b$10$9gRWFamyciJ1OyeYe0aGvelrmVMhZK43fOE8G1eDeeZy.Yvf2HdOG', '987 Maple Drive, Eastside, City, State 12350', 'user'),
('David Christopher Brown', 'david.brown@email.com', '$2b$10$9gRWFamyciJ1OyeYe0aGvelrmVMhZK43fOE8G1eDeeZy.Yvf2HdOG', '147 Elm Boulevard, Northside, City, State 12351', 'user'),
('Jennifer Marie Davis', 'jennifer.davis@email.com', '$2b$10$9gRWFamyciJ1OyeYe0aGvelrmVMhZK43fOE8G1eDeeZy.Yvf2HdOG', '258 Cedar Court, Southside, City, State 12352', 'user'),
('Robert James Martinez', 'robert.martinez@email.com', '$2b$10$9gRWFamyciJ1OyeYe0aGvelrmVMhZK43fOE8G1eDeeZy.Yvf2HdOG', '369 Birch Street, Central District, City, State 12353', 'user'),
('Lisa Ann Garcia Rodriguez', 'lisa.garcia@email.com', '$2b$10$9gRWFamyciJ1OyeYe0aGvelrmVMhZK43fOE8G1eDeeZy.Yvf2HdOG', '741 Willow Way, Garden District, City, State 12354', 'user');

-- Step 7: Insert Store Owners (Password: Admin@123)
INSERT INTO users (name, email, password_hash, address, role) VALUES
('Premium Electronics Store Owner', 'electronics@store.com', '$2b$10$9gRWFamyciJ1OyeYe0aGvelrmVMhZK43fOE8G1eDeeZy.Yvf2HdOG', '100 Commerce Plaza, Shopping District, City, State 12355', 'store_owner'),
('Gourmet Food Market Owner', 'foodmarket@store.com', '$2b$10$9gRWFamyciJ1OyeYe0aGvelrmVMhZK43fOE8G1eDeeZy.Yvf2HdOG', '200 Market Square, Food District, City, State 12356', 'store_owner'),
('Fashion Boutique Store Owner', 'fashion@store.com', '$2b$10$9gRWFamyciJ1OyeYe0aGvelrmVMhZK43fOE8G1eDeeZy.Yvf2HdOG', '300 Fashion Avenue, Style District, City, State 12357', 'store_owner'),
('Home Furniture Gallery Owner', 'furniture@store.com', '$2b$10$9gRWFamyciJ1OyeYe0aGvelrmVMhZK43fOE8G1eDeeZy.Yvf2HdOG', '400 Interior Boulevard, Home District, City, State 12358', 'store_owner'),
('Sports Equipment Pro Shop Owner', 'sports@store.com', '$2b$10$9gRWFamyciJ1OyeYe0aGvelrmVMhZK43fOE8G1eDeeZy.Yvf2HdOG', '500 Athletic Way, Sports Complex, City, State 12359', 'store_owner'),
('Books And More Bookstore Owner', 'bookstore@store.com', '$2b$10$9gRWFamyciJ1OyeYe0aGvelrmVMhZK43fOE8G1eDeeZy.Yvf2HdOG', '600 Literary Lane, Education District, City, State 12360', 'store_owner');

-- Step 8: Insert Stores
INSERT INTO stores (name, email, address, owner_id) VALUES
('Premium Electronics Superstore', 'contact@electronicsstore.com', '100 Commerce Plaza, Shopping District, City, State 12355', 11),
('Gourmet Food Market Place', 'info@foodmarket.com', '200 Market Square, Food District, City, State 12356', 12),
('Fashion Boutique Collections', 'hello@fashionboutique.com', '300 Fashion Avenue, Style District, City, State 12357', 13),
('Home Furniture Gallery Showroom', 'sales@furnituregallery.com', '400 Interior Boulevard, Home District, City, State 12358', 14),
('Sports Equipment Pro Shop', 'team@sportsshop.com', '500 Athletic Way, Sports Complex, City, State 12359', 15),
('Books And More Bookstore', 'readers@bookstore.com', '600 Literary Lane, Education District, City, State 12360', 16);

-- Step 9: Insert Ratings
INSERT INTO ratings (user_id, store_id, rating) VALUES
(3, 1, 5), (4, 1, 4), (5, 1, 5), (6, 1, 4), (7, 1, 3),
(3, 2, 4), (4, 2, 5), (5, 2, 5), (8, 2, 4), (9, 2, 5),
(4, 3, 5), (6, 3, 5), (10, 3, 4), (3, 3, 4),
(5, 4, 3), (7, 4, 4), (8, 4, 4), (9, 4, 5),
(3, 5, 5), (5, 5, 4), (7, 5, 5), (9, 5, 5), (10, 5, 4),
(4, 6, 5), (6, 6, 5), (8, 6, 4), (10, 6, 5);

-- Step 10: Verify Setup
SELECT 'Setup Complete!' as Status;
SELECT COUNT(*) as Total_Users FROM users;
SELECT COUNT(*) as Total_Stores FROM stores;
SELECT COUNT(*) as Total_Ratings FROM ratings;
SELECT 'All passwords are: Admin@123' as Important_Note;
