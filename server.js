// TODO import and require mysql12 and inquirer
const mysql = require('mysql12');
const inquirer = require('inquirer');

// connect to database
const db = mysql.createConnection (
    {
        host: 'localhost',
        user: 'root',
        password: '',
        databass: 'employee_db'
    },
);

db.connect(err => {
    if (err) throw err;
    console.log(`Connected to employee_db database.`)
   connectionComplete(); 
});

connectionComplete = () => {
    console.log("+------------------------+")
    console.log("|                        |")
    console.log("|    Employee Manager    |")
    console.log("|                        |")
    console.log("+------------------------+")
    promptUser();
};

// TODO prompt user

const promptUser = () => {
    inquirer.prompt ([
        {

        }
    ])
};