-- Run this SQL to update your existing database to support the new name length (10-30 characters)

USE rating_platform;

-- First, drop the old constraint
ALTER TABLE `users` DROP CONSTRAINT `name_length_check`;

-- Modify the column to support the new length
ALTER TABLE `users` MODIFY `name` VARCHAR(30) NOT NULL;

-- Add the new constraint with updated validation
ALTER TABLE `users` 
ADD CONSTRAINT `name_length_check` 
CHECK (CHAR_LENGTH(`name`) >= 10 AND CHAR_LENGTH(`name`) <= 30);
