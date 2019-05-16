// ===========================================================================================================
var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table");
var colors = require("colors");

var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",


  password: "examplePassword", //<====== Add your password to mySQL here
  database: "bamazon_db"
});

connection.connect(function (err) {
  if (err) throw err;
  start();
});
// ===========================================================================================================

function start() {

  inquirer.prompt([
    {
      name: "manager",
      type: "list",
      message: "\nWhat would you like to do, Mr. Manager?",
      choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Leave"]
    },
  ]).then(function (answer) {

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
// ===========================================================================================================

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
// ===========================================================================================================

function lowInventory() {

  var query = "SELECT * FROM products WHERE stock_quantity <= 5";
  connection.query(query, function (err, results) {
    if (err) throw err;
    console.log("results " + results);

    if (typeof results[0] === 'undefined') {
      console.log("\n============================No Low Inventory Items================================\n".green);
      console.log("There is no items with low stock quantity");
      console.log("\n==================================================================================\n".green);
    } else {

      console.log("\n=================================Low Inventory====================================\n".red);
      console.table(results);
      console.log("\n==================================================================================\n".red);
    }
    start();
  });
};
// ===========================================================================================================

function addInventory() {

  var query = "SELECT id, product_name, price, stock_quantity FROM products";
  connection.query(query, function (err, results) {
    if (err) throw err;
    console.log("\n=================================BAMAZON ITEMS====================================\n".green);
    console.table(results);
    console.log("===================================================================================\n".green);

    inquirer.prompt([
      {
        name: "prodID",
        type: "input",
        message: "What is the ID of the product you'd like to add to?",
        validate: function (value) {
          if (isNaN(value) === false && (value > results.length) === false) {
            return true;
          }
          return false;
        }
      },
      {
        name: "prodAmt",
        type: "input",
        message: "How many of this product would you like to add?",
        validate: function (value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
      .then(function (answer) {
        var ansID = answer.prodID;
        var ansAmt = parseInt(answer.prodAmt);
        var addingInv = Math.floor(results[Math.floor(ansID - 1)].stock_quantity + ansAmt);

        var query = connection.query(
          "UPDATE products SET ? WHERE ?",
          [
            {
              stock_quantity: addingInv
            },
            {
              id: ansID
            }
          ],
          function (err, res) {
            if (err) throw err;
            console.log("\n" + res.affectedRows + " product has been updated!" +
              "\nYou have added " + ansAmt + " units to " + results[ansID].product_name + "\n");

            inquirer.prompt([
              {
                name: "again",
                type: "confirm",
                message: "Would you like to make another purchase?"
              }
            ]).then(answers => {
              if (answers.again === true) {
                addInventory();
              } else {
                start();
              }
            })
          })
      })
  });
};
// ===========================================================================================================

function newProduct() {

  inquirer.prompt([
    {
      name: "prodName",
      type: "input",
      message: "\nWhat is the name of the product you'd like to add? (Required):",
    },
    {
      name: "depName",
      type: "input",
      message: "What is the department that this item is listed under? (Required):",
    },
    {
      name: "prodPrice",
      type: "input",
      message: "What is the price of this item? (Required):",
      validate: function (value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      }
    },
    {
      name: "prodStock",
      type: "input",
      message: "How many of this item would you like add? (Required):",
      validate: function (value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      }
    }
  ]).then(function (answer) {
    var query = connection.query(
      "INSERT INTO products SET ?",
      {
        product_name: answer.prodName,
        department_name: answer.depName,
        price: parseFloat(answer.prodPrice),
        stock_quantity: parseInt(answer.prodStock)
      },
      function (err, res) {
        if (err) throw err;
        console.log("\n" + res.affectedRows + " product(s) has been added!" +
          "\nYou have added " + answer.prodName + " to the inventory.\n");

        inquirer.prompt([
          {
            name: "again",
            type: "confirm",
            message: "Would you like to make another purchase?"
          }
        ]).then(answers => {
          if (answers.again === true) {
            newProduct();
          } else {
            start();
          }
        })
      }
    );
  })
}
// ===========================================================================================================