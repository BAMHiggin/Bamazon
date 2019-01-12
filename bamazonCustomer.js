require('dotenv').config();
const MySQL = require("mysql");
const inquirer = require("inquirer");
//installed npm packages

const cTable = require("console.table");
// creates an easy-to-read table of contents in console log

const pass = process.env.DB_PASSWORD;

const connection = MySQL.createConnection({
    host: "localhost",
    port: 3306, 
    // use process.env.PORT || 3000 ?
    user: "root",
    password: pass,
    database: "bamazonDB",
});

connection.connect(function(err) {
    if (err) throw err;


  });


