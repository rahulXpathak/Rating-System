-- Direct SQL to create admin account
-- Password: Admin@12345

USE rating_platform;

-- Insert admin account with pre-hashed password
INSERT INTO users (name, email, password_hash, role, address) 
VALUES (
    'System Administrator',
    'admin@ratingplatform.com',
    '$2b$10$YourHashWillGoHere',
    'admin',
    'Admin Office'
);

-- Note: The password_hash above is a placeholder
-- You need to either:
-- 1. Sign up normally first, then run: UPDATE users SET role = 'admin' WHERE email = 'admin@ratingplatform.com';
-- OR
-- 2. Generate the hash and replace $2b$10$YourHashWillGoHere with the actual hash

-- To check if admin exists:
SELECT id, name, email, role FROM users WHERE role = 'admin';
