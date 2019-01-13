require('dotenv').config();
const MySQL = require("mysql");
const inquirer = require("inquirer");
//installed npm packages

const cTable = require("console.table");
// creates an easy-to-read table of contents in console log

const pass = process.env.DB_PASSWORD;
//hides sql password in env file under gitignore


const connection = MySQL.createConnection({
    host: "localhost",
    port: 3306,
    // use process.env.PORT || 3000 ?
    user: "root",
    password: pass,
    database: "bamazonDB",
});

connection.connect(function (err) {
    if (err) throw err;
    start();
    //executes start function, beginning on inventory screen
});


function start() {
    console.log("Welcome to the Bamazon store! Please take a look at our offerings.");
    connection.query(
        "SELECT id, product_name as name, price FROM products WHERE stock_quantity > 0;", function (err, results) {
            //'where stock_quantity > 0' ensures that depleted items don't show up when program runs again
            if (err) throw err;
            console.table(results);
            //console table adds organized grid a e s t h e t i c

            inquirer
                .prompt([
                    //prompts for available actions when ordering
                    {
                        name: "productSelect",
                        type: "input",
                        validate: function(input) {
                            //function determines validity of user inputted id number entered by checking if it still exists in database
                            let isValid = false;
                            for (var i = 0; i < results.length ; i++) {
                                if (results[i].id == input) {
                                    isValid = true;
                                } 
                            }
                            return isValid;
                        }
                        ,
                        message: "Please enter the id number of the product you'd like to buy:"
                    }
                    ,
                    {
                        name: "quantitySelect",
                        type: "input",
                        message: "How many units of this product would you like to buy"
                        //node inputs to be console logged when purchase fails/completes
                    }
                ])
                .then(function (answer) {
                    connection.query(
                        `SELECT product_name as name, stock_quantity, price FROM products WHERE id = ${answer["productSelect"]}`, function (err, res) {
                            if (err) throw err;
                            let prodName = res[0].name; //these variables define relevant values that are logged when the user completes a purchase
                            let prodChosenQuantity = answer["quantitySelect"];
                            let prodStockQuantity = res[0].stock_quantity;
                            let prodPrice = res[0].price;
                            let prodCost = (prodPrice * prodChosenQuantity);
                            let prodId = answer["productSelect"];

                            stockCheck(prodChosenQuantity, prodStockQuantity, prodName, prodCost, prodId); //prodName, prodCost,prodId must be passed here since stockCheck lives outside of current function
                        });

                    function stockCheck(prodChosenQuantity, prodStockQuantity, prodName, prodCost, prodId) {
                        if (prodChosenQuantity > prodStockQuantity) { // returns a failed purchase since quantity is lacking
                            console.log("I'm sorry, we have an insufficient stock quantity. Check back soon!");

                        } else if (prodChosenQuantity <= prodStockQuantity) {
                            updateStock(prodChosenQuantity, prodStockQuantity, prodId);
                            console.log(`You've ordered ${prodChosenQuantity} units of ${prodName}, for a total of $${prodCost}. Thank you for your purchase!`);
                        }
                        console.log("Redirecting to main order page..."); //redirects both successful and unsuccessful orders back to main order page upon completion because capitalism
                        setTimeout(start, 3000); //waits three seconds to give your wallet a break
                    }
                    function updateStock(prodChosenQuantity, prodStockQuantity, prodId) {
                        console.log("Your products are in stock!");
                        var updatesql = "UPDATE products SET stock_quantity = " + (prodStockQuantity - prodChosenQuantity) + " WHERE id = " + prodId +";"; 
                        connection.query(
                            updatesql //queries the database to remove purchased stock
                        );
                    }


                });

        }

    );
};







