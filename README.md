📘 Database Setup Guide

Before running the application, you must create a MySQL database named my_database and a table named members.
This table stores each character’s name, last name, and email.

Follow the steps below to set up your database.

🛠️ 1. Create the Database
CREATE DATABASE IF NOT EXISTS my_database;

📂 2. Select the Database
USE my_database;

🧱 3. Create the members Table

Make sure the table includes id, name, last_name, and email fields.

CREATE TABLE IF NOT EXISTS members (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100) NOT NULL,
last_name VARCHAR(100) NOT NULL,
email VARCHAR(100) NOT NULL UNIQUE
);

👯 4. Insert Initial Gossip Girl Members

You can populate the database with the main characters using this SQL:

INSERT INTO members (name, last_name, email) VALUES
('Blair', 'Waldorf', 'blair.waldorf@gossipgirl.com'),
('Serena', 'van der Woodsen', 'serena.vdw@gossipgirl.com'),
('Chuck', 'Bass', 'chuck.bass@gossipgirl.com'),
('Nate', 'Archibald', 'nate.archibald@gossipgirl.com'),
('Dan', 'Humphrey', 'dan.humphrey@gossipgirl.com'),
('Jenny', 'Humphrey', 'jenny.humphrey@gossipgirl.com'),
('Lily', 'van der Woodsen', 'lily.vdw@gossipgirl.com'),
('Rufus', 'Humphrey', 'rufus.humphrey@gossipgirl.com'),
('Vanessa', 'Abrams', 'vanessabrams@gossipgirl.com');

Your table will now look like this:

[
{ "id": 1, "name": "Blair", "last_name": "Waldorf", "email": "blair.waldorf@gossipgirl.com" },
{ "id": 2, "name": "Serena", "last_name": "van der Woodsen", "email": "serena.vdw@gossipgirl.com" },
{ "id": 3, "name": "Chuck", "last_name": "Bass", "email": "chuck.bass@gossipgirl.com" },
{ "id": 4, "name": "Nate", "last_name": "Archibald", "email": "nate.archibald@gossipgirl.com" },
{ "id": 5, "name": "Dan", "last_name": "Humphrey", "email": "dan.humphrey@gossipgirl.com" },
{ "id": 6, "name": "Jenny", "last_name": "Humphrey", "email": "jenny.humphrey@gossipgirl.com" },
{ "id": 7, "name": "Lily", "last_name": "van der Woodsen", "email": "lily.vdw@gossipgirl.com" },
{ "id": 8, "name": "Rufus", "last_name": "Humphrey", "email": "rufus.humphrey@gossipgirl.com" },
{ "id": 9, "name": "Vanessa", "last_name": "Abrams", "email": "vanessabrams@gossipgirl.com" }
]

➕ How to Add a New Member (Example: Georgina Sparks)

After your API server is running, you can add new members using a POST request.

Endpoint
POST http://localhost:3000/members

JSON Body
{
"name": "Georgina",
"last_name": "Sparks",
"email": "georgina.sparks@gossipgirl.com"
}

Expected Response
{
"message": "Member added",
"id": 10
}

⭐ The new member will then appear as:

{
"id": 10,
"name": "Georgina",
"last_name": "Sparks",
"email": "georgina.sparks@gossipgirl.com"
}

🔄 ID Reordering Note

The API automatically reorders all IDs after a deletion to ensure they remain sequential (1, 2, 3, ...).
This keeps the list clean and prevents gaps.

💋 You know you love strong documentation… XOXO – Gossip API Girl
