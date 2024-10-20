You must create a database named my_database and containing name, lastname and email information.
You can follow these steps

CREATE DATABASE IF NOT EXISTS my_database;


USE my_database;


CREATE TABLE IF NOT EXISTS members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE
);


INSERT INTO members (name, lastname, email)
VALUES 
    ('Blair', 'Waldorf', 'blair.waldorf@gossipgirl.com'),
    ('Serena', 'van der Woodsen', 'serena.vdw@gossipgirl.com'),
    ('Chuck', 'Bass', 'chuck.bass@gossipgirl.com'),
    ('Nate', 'Archibald', 'nate.archibald@gossipgirl.com'),
    ('Dan', 'Humphrey', 'dan.humphrey@gossipgirl.com'),
    ('Jenny', 'Humphrey', 'jenny.humphrey@gossipgirl.com'),
    ('Lily', 'van der Woodsen', 'lily.vdw@gossipgirl.com'),
    ('Rufus', 'Humphrey', 'rufus.humphrey@gossipgirl.com'),
    ('Georgina', 'Sparks', 'georgina.sparks@gossipgirl.com');
