CREATE DATABASE IF NOT EXISTS rating_platform;

USE rating_platform;

CREATE TABLE IF NOT EXISTS `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(30) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `address` VARCHAR(400),
  `role` ENUM('admin', 'user', 'store_owner') NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE
);

CREATE TABLE IF NOT EXISTS `stores` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(60) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `address` VARCHAR(400),
  `owner_id` INT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_stores_users_idx` (`owner_id` ASC) VISIBLE,
  CONSTRAINT `fk_stores_users`
    FOREIGN KEY (`owner_id`)
    REFERENCES `users` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS `ratings` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `store_id` INT NOT NULL,
  `rating` INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `user_store_unique` (`user_id` ASC, `store_id` ASC) VISIBLE,
  INDEX `fk_ratings_users_idx` (`user_id` ASC) VISIBLE,
  INDEX `fk_ratings_stores_idx` (`store_id` ASC) VISIBLE,
  CONSTRAINT `fk_ratings_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_ratings_stores`
    FOREIGN KEY (`store_id`)
    REFERENCES `stores` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- Basic validation checks from documentation
ALTER TABLE `users` 
ADD CONSTRAINT `name_length_check` 
CHECK (CHAR_LENGTH(`name`) >= 10 AND CHAR_LENGTH(`name`) <= 30);

ALTER TABLE `users`
ADD CONSTRAINT `address_length_check`
CHECK (CHAR_LENGTH(`address`) <= 400);
