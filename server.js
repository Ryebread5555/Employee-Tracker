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
            type: 'list',
            name: 'choices',
            message: 'What would you like to do? (Use arrow keys)',
            choices: [
                'View All Employess',
                'Add Employee',
                'Update Employee Role',
                'Update Employee Manager',
                'View Employees By Department',
                'View All Roles',
                'Add Role',
                'View All Departments',
                'Add Department',
                'Delete A Department',
                'Delete A Role',
                'Delete A Employee',
                'View Total Department Salaries',
                'Quit',
                new inquirer.Separator(),
                '(Move up and down to reveal more choices)'
            ]
        }
    ])
    .then((answers) => {
        const {choices} = answers;

        if (choices === "View All Employees") {
            showEmployees();
        };

        if (choices === "Add Employee") {
            addEmployee();
        };

        if (choices === "Update Employee Role") {
            updateEmployee();
        };

        if (choices === "Update Employee Manager") {
            updateManager();
        };

        if (choices === "View Employees By Department") {
            employeeDepartment();
        };

        if (choices === "View All Roles") {
            showRoles();
        };

        if (choices === "Add Role") {
            addRole();
        };

        if (choices === "View All Departments") {
            showDepartments();
        };

        if (choices === "Add Department") {
            addDepartments();
        };

        if (choices === "Delete A Department") {
            deleteDepartment();
        };

        if (choices === "Delete A Role") {
            deleteRole();
        };

        if (choices === "Delete A Employee") {
            deleteEmployee();
        };

        if (choices === "View Total Department Salaries") {
            showSalaries();
        };

        if (choices === "Quit") {
            connection.end();
        };
    });
};

