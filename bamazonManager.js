var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table");
var colors = require("colors");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Magicalpotato684",
  database: "bamazon_db"
});

connection.connect(function (err) {
  if (err) throw err;
  start();
});


function start() {
  inquirer.prompt([
    {
      name: "manager",
      type: "list",
      message: "Welcome Mr. Manager! What would you like to do?",
      choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Leave"]
    },
  ]).then(function (answer) {
    console.log(answer.manager);

    switch (answer.manager) {
      case "View Products for Sale":
        showTable();
        break;

      case "View Low Inventory":
        lowInventory();
        break;

      case "Add to Inventory":
        addInventory();
        break;

      case "Add New Product":
        newProduct();
        break;

      default:
        connection.end();

        break;
    }
  });

};
// This executes at the end of the connection and shows an updated database.
function showTable() {
  var query = "SELECT id, product_name, price, stock_quantity FROM products";
  connection.query(query, function (err, results) {
    if (err) throw err;
    console.log("\n=================================BAMAZON ITEMS====================================\n".blue);
    console.table(results);
    console.log("===================================================================================\n".blue);
    start();
  });
};


function lowInventory() {
  var query = "SELECT id, product_name, stock_quantity FROM products";
  connection.query(query, function (err, results) {
    if (err) throw err;
    var lowProd;
    var lowProductsArr = [];
    // var notLowProd = console.log("There are no items with low stock quantities.");
    for (i = 0; i < results.length; i++) {
      if (results[i].stock_quantity <= 5) {
        lowProductsArr.push(results[i]);
        lowProd = console.log("\n=================================Low Inventory====================================\n".red) + 
        console.table(lowProductsArr) +
        console.log("\n==================================================================================\n".red);
      
      } 
      
      else {
        return notLowProd;
      }
        
      
    };
    // console.log("\n=================================Low Inventory====================================\n".red);
    // console.table(lowProductsArr);
    // console.log("\n==================================================================================\n".red);
    
    // console.log("There are no items with low stock quantity.");
    start();
  });
};