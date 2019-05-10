drop database if exists bamazon_db;
create database bamazon_db;

use bamazon_db;

create table products (
  id int not null auto_increment,
  product_name varchar(100) not null,
  department_name varchar(30) null,
  price decimal(10,2) not null,
  stock_quantity int(11) not null,
  primary key (id)
);

use bamazon_db;

insert into products (product_name, department_name, price, stock_quantity)
values ("Echo Dot Smart Speaker", "Electronics", 29.99, 12);

insert into products (product_name, department_name, price, stock_quantity)
values ("Amazon Fire TV Stick", "Electronics", 49.99, 20);

insert into products (product_name, department_name, price, stock_quantity)
values ("Monopoly: Game of Thrones Edition", "Toys and Games", 23.49, 9);

insert into products (product_name, department_name, price, stock_quantity)
values ("Cards Against Humanity", "Toys and Games", 25.00, 18);

insert into products (product_name, department_name, price, stock_quantity)
values ("Mens Under Armour T-shirt", "Clothing", 18.75, 30);

insert into products (product_name, department_name, price, stock_quantity)
values ("Womens Under Armour T-shirt", "Clothing", 19.45, 23);

insert into products (product_name, department_name, price, stock_quantity)
values ("Lord of the Rings Triligy (hardcover) book set ", "Books", 37.58, 11);

 insert into products (product_name, department_name, price, stock_quantity)
values ("Lord of the Rings Triligy (hardcover) book set ", "Books", 37.58, 11);

insert into products (product_name, department_name, price, stock_quantity)
values ("Game of Thrones (A Song of Ice and Fire) book set", "Books", 29.97, 5);

insert into products (product_name, department_name, price, stock_quantity)
values ("Microfiber Cleaning Cloth (24-pack)", "Automotive", 11.27, 14);

select * from products;