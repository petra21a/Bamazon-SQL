DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;
USE bamazon_db;

CREATE TABLE products(
  item_id INTEGER(10) AUTO_INCREMENT NOT NULL PRIMARY KEY,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(50),
  price DECIMAL(10,2) UNSIGNED NOT NULL,
  stock_quantity INTEGER(100)
);

INSERT INTO products (product_name,department_name, price,stock_quantity)
VALUES 
("yellow sofa","furniture", 200.50, 10),
("red chair","furniture", 100.25, 2),
("birch bookshelf","furniture", 120.99, 50),
("large dog bed","pet supplies", 30.99, 200),
("scratching post","pet supplies", 12.99,46),
("organic dog food","pet supplies", 22.50, 200),
("emerald ring","jewelry", 500.00, 8),
("gold necklace","jewelry", 80.99, 20),
("silver bracelet","jewelry", 40.99, 100),
("basket weaving kit","hobby", 12.99, 1000),
("home chemistry set","hobby", 32.99, 5),
("woopie cushion","hobby", 5.99, 1);

