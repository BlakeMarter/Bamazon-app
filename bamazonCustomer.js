var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table");

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
  // This executes a query to mySQL and results in a table of entire DB.
  var query = "SELECT id, product_name, department_name, price, stock_quantity FROM products";
  connection.query(query, function (err, results) {
    if (err) throw err;
    console.log("\n========================================BAMAZON ITEMS=========================================\n");
    console.table(results);
    console.log("==============================================================================================\n");
    purchase();
  });
};

function purchase() {
  connection.query("SELECT * FROM auctions", function(err, results) {
    if (err) throw err;
    
  inquirer.prompt([
    {
      name: "productID",
      type: "input",
      message: "What is the ID of the product you'd like to buy?",
      validate: function (value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      }
    },
    {
      name: "productAmt",
      type: "input",
      message: "How many of this product would you like to purchase?",
      validate: function (value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      }
    }
  ])
    .then(function (answer) {
      var ansID = answer.productID;
      var ansAmt = answer.productAmt;
      console.log(ansID + ansAmt);

      var query = "SELECT id, product_name, stock_quantity FROM products WHERE ?";
      connection.query(query, { id: ansID }, function (err, res) {
        if (err) throw err;
        console.log("\n======================================================\n");
        console.table(res);
        console.log("\n======================================================\n");

        if (parseInt(ansAmt) > res[0].stock_quantity) {
          console.log("Insufficient Quantity! Please select a smaller amount.");

        } else {
          console.log("Here you go! \n" + ansAmt + " " + res[0].product_name +
            " has been added to your cart.");
          var query = "UPDATE products SET ? WHERE ?";
          // var newAmnt = res[0].stock_quantity - ansAmt;
          // connection.query(query, { stock_quantity: newAmnt }, ansID, function (err, results) {
          connection.query(query, [{ stock_quantity = stock_quantity - ansAmt }, { id: ansID }], function (err) {
            if (err) throw err;
            console.log(results);
          });
        }

      })
    })
  });
}