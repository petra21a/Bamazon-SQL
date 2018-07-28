//require MySQL
const mysql = require('mysql');

//require Inquirer
const inquirer = require('inquirer');

//require dotenv
require("dotenv").config();

//require cli table

const Table = require('cli-table');


//MySQL connection
const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,

  // Your port; if not 3306 (default in documentation)
  port: process.env.MYSQL_PORT,

  // Your username
  user: process.env.MYSQL_USER,

  // Your password
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB
});

connection.connect(function (error) {
  if (error) throw error;
  console.log("connected as id " + connection.threadId);
  listInventory();

});

function listInventory() {
  console.log("Welcome! We have the following in stock today:...\n");
  connection.query("SELECT * FROM products", function (error, results) {
    if (error) throw error;
    // Log results of SELECT statement into a table 
    const inventoryTable = new Table({
      head: ['item_id', 'product_name', 'price ($)'],
      colWidths: [10, 40, 20]
    })
    for (const n of results) {
      inventoryTable.push([n.item_id, n.product_name, n.price])

    }
    //displays inventory table in the CLI
    console.log(inventoryTable.toString());
    //connection.end();
    chooseProduct();
  });

}

// Create a "Prompt" with a series of questions.
function chooseProduct() {
  inquirer
    .prompt([
      // Here we create a basic text prompt.
      {
        type: "input",
        message: "What would you like to purchase? Enter ID number:",
        name: "selectedID"
      },
      {
        type: "input",
        message: 'How many would you like to purchase? Enter quantity:',
        name: "selectedQuantity"
      },
      {
        type: "confirm",
        message: "Are you sure:",
        name: "confirm",
        default: true
      }])
    .then(function (inquirerResponse) {
      // 
      if (inquirerResponse.confirm) {
        checkInventory(inquirerResponse.selectedID, inquirerResponse.selectedQuantity)

      } else {
        keepShopping();
      }

    });
};


function checkInventory(product, quantity) {
  connection.query("SELECT * FROM products WHERE ?",
    {
      "item_id": product
    },
    function (error, result) {
      if (error) throw error;
      if (result[0].stock_quantity >= quantity && result[0].stock_quantity !== 0) {
        completePurchase(product, quantity, result[0].stock_quantity, result[0].product_name, result[0].price)
      } else {
        console.log(`It looks like there are not enough ${result[0].product_name}s in stock to complete your order. ${result[0].stock_quantity} currently in stock.`)
        keepShopping();
      }
    });

}


function completePurchase(product, quantity, inventory, name, cost) {
  connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: inventory - quantity
      },
      {
        item_id: product
      }
    ],
    function (error) {
      if (error) throw error;
      console.log(`Thank you for your purchase! Total cost: $${cost * quantity} (${name} x ${quantity})`)
      keepShopping();
    })
};

function keepShopping() {
  inquirer
    .prompt([
      // Here we create a basic text prompt.
      {
        type: "confirm",
        message: "Would you like to continue shopping?",
        name: "confirm",
        default: true
      }
    ])
    .then(function (inquirerResponse) {
      if (inquirerResponse.confirm === false) {
        console.log(`We appreciate your business!`)
        return connection.end();
      }
      listInventory();
    });
}

