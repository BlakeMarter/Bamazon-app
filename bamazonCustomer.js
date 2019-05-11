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

// This executes a query to mySQL and results in a table of entire DB.
function showTable() {
  var query = "SELECT * FROM products";
  connection.query(query, function (err, results) {
    if (err) throw err;
    console.log("\n========================================BAMAZON ITEMS=========================================\n");
    console.table(results);
    console.log("==============================================================================================\n");
  });
}

function start() {
  // This executes a query to mySQL and results in a table of entire DB.
  var query = "SELECT * FROM products";
  connection.query(query, function (err, results) {
    if (err) throw err;
    // console.log(results.length);

    console.log("\n========================================BAMAZON ITEMS=========================================\n");
    console.table(results);
    console.log("==============================================================================================\n");
    purchase();
  });
};

function purchase() {
  connection.query("SELECT * FROM products", function (err, results) {
    if (err) throw err;

    var resArr = [];
    for (let i = 0; i < results.length; i++) {
      resArr.push(results[i].id)

    }
    inquirer.prompt([
      {
        name: "productID",
        type: "input",
        message: "What is the ID of the product you'd like to buy?",
        validate: function (value) {

          if (isNaN(value) === false && (value > results.length) === false)  {
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
        var remainingInv = Math.floor(results[Math.floor(ansID - 1)].stock_quantity - ansAmt);
        // console.log("ansID: " + ansID);
        // console.log("ansAmt: " + ansAmt);
        // console.log("results[ansID].stock_quantity: " + results[Math.floor(ansID - 1)].stock_quantity);
        // console.log("RemainingInv: " + remainingInv);

        var query = "SELECT id, product_name, price, stock_quantity FROM products WHERE ?";
        connection.query(query, { id: ansID }, function (err, res) {


          if (err) throw err;
          console.log("\n======================================================");
          console.table(res);
          console.log("======================================================\n");
          
          if (parseInt(ansAmt) > res[0].stock_quantity) {
            console.log("Insufficient Quantity! Please select a smaller amount.");
            purchase();

          } else {
            console.log("\n**************************************************\n" +
              "\nHere you go! \n" + "\n" + ansAmt + " " + res[0].product_name +
              " has been added to your cart.\n" +
              "\nYour total is $" + res[0].price * ansAmt + ". Now pay up!\n" +
              "\n**************************************************\n");
            var query = connection.query(
              "UPDATE products SET ? WHERE ?",
              [
                {
                  stock_quantity: remainingInv
                },
                {
                  id: ansID
                }
              ],
              function (err, res) {
                if (err) throw err;
                // console.log(res.affectedRows + " products updated!\n");
                // Call deleteProduct AFTER the UPDATE completes

              }
            )
            // console.log("query.sql" + query.sql);

          }
          // showTable();
          connection.end();
        })
      })
  });
}
