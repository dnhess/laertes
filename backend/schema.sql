CREATE TABLE users (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	first_name VARCHAR(255) NOT NULL,
	last_name VARCHAR(255) NOT NULL,
	username VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
	bio TEXT, 
	avatar TEXT
);

CREATE TABLE user_meta (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	user_id int NOT NULL,
	`key` VARCHAR(255) NOT NULL,
	`value` TEXT NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	UNIQUE KEY `user_meta_user_key` (`key`, `user_id`)
);