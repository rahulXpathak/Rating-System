-- Add status column to users table
ALTER TABLE users ADD COLUMN status ENUM('active', 'blocked') DEFAULT 'active' AFTER role;

-- Temporarily disable safe update mode
SET SQL_SAFE_UPDATES = 0;

-- Set existing users to active status
UPDATE users SET status = 'active';

-- Re-enable safe update mode
SET SQL_SAFE_UPDATES = 1;
