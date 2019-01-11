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

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ()