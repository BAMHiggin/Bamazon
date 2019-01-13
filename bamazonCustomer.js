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
            if (err) throw err;
            console.table(results);

            inquirer
                .prompt([
                    {
                        name: "productSelect",
                        type: "input",
                        validate: function(input) {
                            var isValid = false;
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
                    }
                ])
                .then(function (answer) {
                    connection.query(
                        `SELECT product_name as name, stock_quantity, price FROM products WHERE id = ${answer["productSelect"]}`, function (err, res) {
                            if (err) throw err;
                            var prodName = res[0].name;
                            var prodChosenQuantity = answer["quantitySelect"];
                            var prodStockQuantity = res[0].stock_quantity;
                            var prodPrice = res[0].price;
                            var prodCost = (prodPrice * prodChosenQuantity);
                            var prodId = answer["productSelect"];
                            // console.log(prodName);
                            // console.log("$" + prodPrice);
                            // console.log(prodStockQuantity + " units");
                            // console.log(prodChosenQuantity + " units");
                            // console.log("$" + prodCost);
                            stockCheck(prodChosenQuantity, prodStockQuantity, prodName, prodCost, prodId);
                        });

                    function stockCheck(prodChosenQuantity, prodStockQuantity, prodName, prodCost, prodId) {
                        if (prodChosenQuantity > prodStockQuantity) {
                            console.log("I'm sorry, we have an insufficient stock quantity. Check back soon!");

                            //start();
                        } else if (prodChosenQuantity <= prodStockQuantity) {
                            updateStock(prodChosenQuantity, prodStockQuantity, prodId);
                            console.log(`You've ordered ${prodChosenQuantity} units of ${prodName}, for a total of $${prodCost}. Thank you for your purchase!`);
                        }
                        console.log("Redirecting to main order page...");
                        setTimeout(start, 3000);
                    }
                    function updateStock(prodChosenQuantity, prodStockQuantity, prodId) {
                        console.log("Your products are in stock!");
                        var updatesql = "UPDATE products SET stock_quantity = " + (prodStockQuantity - prodChosenQuantity) + " WHERE id = " + prodId +";";
                        connection.query(
                            updatesql
                        );
                    }


                });

        }

    );
};

// var choiceArray = [];
// for (var i = 0; i < results.length; i++) {
//     choiceArray.push(results[i].name);
// }
// return choiceArray;


// async function getProductNameById(id) {
//     connection.query(
//         `SELECT product_name as name FROM products WHERE id = ${id}`, function (err, res) {
//             if (err) throw err;
//             var prodName = res[0].name;
//         }

//     );



// }







// function(input) {
//     var isValid = false;               

//     for (var i = 0; i < results.length; i++){
//         if (results[i].id == input){
//             isValid = true;
//         }
        
//     }
//     return isValid;
// }