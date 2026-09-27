CREATE TABLE `board_profile` (
	`id` integer PRIMARY KEY NOT NULL,
	`linkedin_url` text DEFAULT '' NOT NULL,
	`avatar_url` text DEFAULT '' NOT NULL,
	`updated_at` integer NOT NULL
);
