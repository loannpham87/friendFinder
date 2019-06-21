var express = require("express");
var path = require("path");
var app = express();
var port = process.env.PORT || 3000;

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw (err);
    showTable();
});

function showTable() {
    connection.query("SELECT * FROM products", function (err, res) {
        console.log("----------------------------------------------------------------------------------------\n\n\n")
        console.table(res);
        if (err) throw (err);
        customerPurchase();
    });
}

function customerPurchase() {
    inquirer
        .prompt({
            name: "purchase",
            type: "list",
            message: "What is the item ID of the product would you like to purchase?",
            choices: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
        })
        .then(function (answer) {

            var choiceId = parseInt(answer.purchase);
            var query = "SELECT * FROM products WHERE ?"
            connection.query(query, { item_id: choiceId }, function (err, res) {
                purchaseQuantity(choiceId, res[0].price, res[0].stock_quantity);
            })
        });
}

function purchaseQuantity(itemId, price, stockQuantity) {
    inquirer
        .prompt([
            {
                name: "quantity",
                type: "number",
                message: "How much of this product would you like to purchase?",
            }
        ])
        .then(function (answer) {
            var quantity = parseInt(answer.quantity);

            if (quantity < stockQuantity) {
                completePurchase(itemId, price, stockQuantity, quantity);
            }
            else {
                console.log(chalk.red("The amount you requested is not in stock."));
            }
        })
}

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "home.html"));
   });

function completePurchase(itemId, price, stockQuantity, quantity) {
    console.log(chalk.green("Your total is: $" + (price * quantity)));
    var updateStock = stockQuantity - quantity;
    var query = "UPDATE products SET ? WHERE ?"
    connection.query(query, [{ stock_quantity: updateStock }, { item_id: itemId }], function (err, res) {
        if (err) throw (err);
        connection.end();
    });
}