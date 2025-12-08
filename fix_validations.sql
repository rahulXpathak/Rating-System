-- Fix validation script to update database schema to match requirements
-- Run this to update your existing database

USE rating_platform;

-- Drop old constraints
ALTER TABLE `users` DROP CONSTRAINT IF EXISTS `name_length_check`;
ALTER TABLE `users` DROP CONSTRAINT IF EXISTS `address_length_check`;

-- Modify columns to support new length requirements
ALTER TABLE `users` MODIFY `name` VARCHAR(60) NOT NULL;
ALTER TABLE `stores` MODIFY `name` VARCHAR(60) NOT NULL;

-- Add new constraints with updated validation (20-60 characters for name)
ALTER TABLE `users` 
ADD CONSTRAINT `name_length_check` 
CHECK (CHAR_LENGTH(`name`) >= 20 AND CHAR_LENGTH(`name`) <= 60);

ALTER TABLE `users`
ADD CONSTRAINT `address_length_check`
CHECK (CHAR_LENGTH(`address`) <= 400);

ALTER TABLE `stores`
ADD CONSTRAINT `store_name_length_check`
CHECK (CHAR_LENGTH(`name`) >= 20 AND CHAR_LENGTH(`name`) <= 60);

ALTER TABLE `stores`
ADD CONSTRAINT `store_address_length_check`
CHECK (CHAR_LENGTH(`address`) <= 400);

-- Clear existing data (optional - comment out if you want to keep existing data)
DELETE FROM ratings;
DELETE FROM stores;
DELETE FROM users;

-- Insert dummy admin users (Password: Admin@123)
INSERT INTO users (name, email, password_hash, address, role) VALUES
('System Administrator One', 'admin@system.com', '$2b$10$9gRWFamyciJ1OyeYe0aGvelrmVMhZK43fOE8G1eDeeZy.Yvf2HdOG', '123 Admin Street, Administrative District, City, State 12345', 'admin'),
('Chief System Manager Two', 'admin2@system.com', '$2b$10$9gRWFamyciJ1OyeYe0aGvelrmVMhZK43fOE8G1eDeeZy.Yvf2HdOG', '456 Manager Avenue, Business District, City, State 12346', 'admin');

-- Insert dummy normal users (Password: Admin@123)
INSERT INTO users (name, email, password_hash, address, role) VALUES
('John Michael Anderson', 'john.anderson@email.com', '$2b$10$9gRWFamyciJ1OyeYe0aGvelrmVMhZK43fOE8G1eDeeZy.Yvf2HdOG', '789 Residential Lane, Suburb Area, City, State 12347', 'user'),
('Sarah Elizabeth Thompson', 'sarah.thompson@email.com', '$2b$10$9gRWFamyciJ1OyeYe0aGvelrmVMhZK43fOE8G1eDeeZy.Yvf2HdOG', '321 Oak Street, Downtown, City, State 12348', 'user'),
('Michael Robert Johnson', 'michael.johnson@email.com', '$2b$10$9gRWFamyciJ1OyeYe0aGvelrmVMhZK43fOE8G1eDeeZy.Yvf2HdOG', '654 Pine Avenue, Westside, City, State 12349', 'user'),
('Emily Catherine Williams', 'emily.williams@email.com', '$2b$10$9gRWFamyciJ1OyeYe0aGvelrmVMhZK43fOE8G1eDeeZy.Yvf2HdOG', '987 Maple Drive, Eastside, City, State 12350', 'user'),
('David Christopher Brown', 'david.brown@email.com', '$2b$10$9gRWFamyciJ1OyeYe0aGvelrmVMhZK43fOE8G1eDeeZy.Yvf2HdOG', '147 Elm Boulevard, Northside, City, State 12351', 'user'),
('Jennifer Marie Davis', 'jennifer.davis@email.com', '$2b$10$9gRWFamyciJ1OyeYe0aGvelrmVMhZK43fOE8G1eDeeZy.Yvf2HdOG', '258 Cedar Court, Southside, City, State 12352', 'user'),
('Robert James Martinez', 'robert.martinez@email.com', '$2b$10$9gRWFamyciJ1OyeYe0aGvelrmVMhZK43fOE8G1eDeeZy.Yvf2HdOG', '369 Birch Street, Central District, City, State 12353', 'user'),
('Lisa Ann Garcia Rodriguez', 'lisa.garcia@email.com', '$2b$10$9gRWFamyciJ1OyeYe0aGvelrmVMhZK43fOE8G1eDeeZy.Yvf2HdOG', '741 Willow Way, Garden District, City, State 12354', 'user');

-- Insert dummy store owners (Password: Admin@123)
INSERT INTO users (name, email, password_hash, address, role) VALUES
('Premium Electronics Store Owner', 'electronics@store.com', '$2b$10$9gRWFamyciJ1OyeYe0aGvelrmVMhZK43fOE8G1eDeeZy.Yvf2HdOG', '100 Commerce Plaza, Shopping District, City, State 12355', 'store_owner'),
('Gourmet Food Market Owner', 'foodmarket@store.com', '$2b$10$9gRWFamyciJ1OyeYe0aGvelrmVMhZK43fOE8G1eDeeZy.Yvf2HdOG', '200 Market Square, Food District, City, State 12356', 'store_owner'),
('Fashion Boutique Store Owner', 'fashion@store.com', '$2b$10$9gRWFamyciJ1OyeYe0aGvelrmVMhZK43fOE8G1eDeeZy.Yvf2HdOG', '300 Fashion Avenue, Style District, City, State 12357', 'store_owner'),
('Home Furniture Gallery Owner', 'furniture@store.com', '$2b$10$9gRWFamyciJ1OyeYe0aGvelrmVMhZK43fOE8G1eDeeZy.Yvf2HdOG', '400 Interior Boulevard, Home District, City, State 12358', 'store_owner'),
('Sports Equipment Pro Shop Owner', 'sports@store.com', '$2b$10$9gRWFamyciJ1OyeYe0aGvelrmVMhZK43fOE8G1eDeeZy.Yvf2HdOG', '500 Athletic Way, Sports Complex, City, State 12359', 'store_owner'),
('Books And More Bookstore Owner', 'bookstore@store.com', '$2b$10$9gRWFamyciJ1OyeYe0aGvelrmVMhZK43fOE8G1eDeeZy.Yvf2HdOG', '600 Literary Lane, Education District, City, State 12360', 'store_owner');

-- Insert stores (linking to store owners)
INSERT INTO stores (name, email, address, owner_id) VALUES
('Premium Electronics Superstore', 'contact@electronicsstore.com', '100 Commerce Plaza, Shopping District, City, State 12355', 11),
('Gourmet Food Market Place', 'info@foodmarket.com', '200 Market Square, Food District, City, State 12356', 12),
('Fashion Boutique Collections', 'hello@fashionboutique.com', '300 Fashion Avenue, Style District, City, State 12357', 13),
('Home Furniture Gallery Showroom', 'sales@furnituregallery.com', '400 Interior Boulevard, Home District, City, State 12358', 14),
('Sports Equipment Pro Shop', 'team@sportsshop.com', '500 Athletic Way, Sports Complex, City, State 12359', 15),
('Books And More Bookstore', 'readers@bookstore.com', '600 Literary Lane, Education District, City, State 12360', 16);

-- Insert ratings from normal users to stores
-- Electronics store ratings
INSERT INTO ratings (user_id, store_id, rating) VALUES
(3, 1, 5),  -- John rated Electronics 5 stars
(4, 1, 4),  -- Sarah rated Electronics 4 stars
(5, 1, 5),  -- Michael rated Electronics 5 stars
(6, 1, 4),  -- Emily rated Electronics 4 stars
(7, 1, 3),  -- David rated Electronics 3 stars

-- Food Market ratings
(3, 2, 4),  -- John rated Food Market 4 stars
(4, 2, 5),  -- Sarah rated Food Market 5 stars
(5, 2, 5),  -- Michael rated Food Market 5 stars
(8, 2, 4),  -- Jennifer rated Food Market 4 stars
(9, 2, 5),  -- Robert rated Food Market 5 stars

-- Fashion Boutique ratings
(4, 3, 5),  -- Sarah rated Fashion 5 stars
(6, 3, 5),  -- Emily rated Fashion 5 stars
(10, 3, 4), -- Lisa rated Fashion 4 stars
(3, 3, 4),  -- John rated Fashion 4 stars

-- Furniture Gallery ratings
(5, 4, 3),  -- Michael rated Furniture 3 stars
(7, 4, 4),  -- David rated Furniture 4 stars
(8, 4, 4),  -- Jennifer rated Furniture 4 stars
(9, 4, 5),  -- Robert rated Furniture 5 stars

-- Sports Shop ratings
(3, 5, 5),  -- John rated Sports 5 stars
(5, 5, 4),  -- Michael rated Sports 4 stars
(7, 5, 5),  -- David rated Sports 5 stars
(9, 5, 5),  -- Robert rated Sports 5 stars
(10, 5, 4), -- Lisa rated Sports 4 stars

-- Bookstore ratings
(4, 6, 5),  -- Sarah rated Bookstore 5 stars
(6, 6, 5),  -- Emily rated Bookstore 5 stars
(8, 6, 4),  -- Jennifer rated Bookstore 4 stars
(10, 6, 5); -- Lisa rated Bookstore 5 stars

-- Verify the data
SELECT 'Users Summary' as Info;
SELECT role, COUNT(*) as count FROM users GROUP BY role;

SELECT 'Stores Summary' as Info;
SELECT COUNT(*) as total_stores FROM stores;

SELECT 'Ratings Summary' as Info;
SELECT COUNT(*) as total_ratings FROM ratings;

SELECT 'Average Ratings Per Store' as Info;
SELECT s.name, ROUND(AVG(r.rating), 2) as avg_rating, COUNT(r.id) as rating_count
FROM stores s
LEFT JOIN ratings r ON s.id = r.store_id
GROUP BY s.id
ORDER BY avg_rating DESC;
