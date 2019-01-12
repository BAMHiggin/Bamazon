DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products (
    id INTEGER(10) AUTO_INCREMENT NOT NULL,

    product_name VARCHAR(50) NOT NULL,

    department_name VARCHAR(50) NOT NULL, 

    price INTEGER(15) NOT NULL,

    stock_quantity NOT NULL,

    PRIMARY KEY (id)
);

-- Rows of data
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Mighty Putty", "Repair", 20, 100), 
("Pair of Socks", "Clothing", 5, 300), 
("Hammer", "Repair", 30, 50), 
("Instant Pot", "Kitchen", 100, 25), 
("Hoodie", "Clothing", 40, 100), 
("Hat", "Clothing", 20, 20),
("Scarf", "Clothing", 25, 30),
("Screwdiver", "Repair", 10, 10),
("Mixing Bowl", "Kitchen", 15, 100),
("Frying Pan", "Kitchen", 40, 30);




