// TODO import and require mysql12 and inquirer
const mysql = require('mysql12');
const inquirer = require('inquirer');
const cTable = require('console.table');

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
            message: 'What would you like to do? (Use arrow keys)',
            name: 'choices',
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

// TODO create function for showEmployees
showEmployees = () => {
    const sql = `SELECT employee.id,
                        employee.first_name,
                        employee.last_name,
                        role.title,
                        department.name AS department,
                        role.salary,
                        CONCAT (manager.first_name, " ", manager.last_name) AS manager
                    FROM employee
                        LEFT JOIN role ON Employee.role_id = role.id
                        LEFT JOIN department on role.department_id = department.id
                        LEFT JOIN employee manager ON employee.manager_id = manager.id`;
    connection.promise().query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
};
// TODO create function for addEmployee
addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            message: "Enter employee's first name.",
            name: 'firstName',
        },
        {
            type: 'input',
            message: "Enter employee's last name.",
            name: 'lastName',
        }
    ])
    .then(answer => {
        const params = [answer.firstName, answer.lastName]
        const roleSql = `SELECT role.id, role.title FROM role`;

        connection.promise().query(roleSql, (err, data) => {
            if (err) throw err;

            const roles = data.map(({id, title}) => ({name: title, value: id}));

            inquirer.prompt([
                {
                    type: 'list',
                    message: "Choose the employee's role.",
                    name: 'role',
                    choices: roles
                }
            ])
            .then(roleChoice => {
                const role = roleChoice.role;
                params.push(role);

                const managerSQL = `SELECT * FROM employee`;

                

                connection.promise().query(managerSql, (err, data) => {
                    if (err) throw err;
                
                const managers = data.map(({idss, first_name, last_name}) => ({name: first_name + " "+ last_name, value: id}));    
                
                inquirer.prompt([
                    {
                        type: 'list',
                        message: "Who is the manager for the employee?",
                        name: 'manager',
                        choices: managers,
                    }
                ])
                .then(managerChoice => {
                    const manger = managerChoice.manager;
                    params.push(manager);

                    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;

                    connection.query(sql, params, (err, result) => {
                        if (err) throw err;
                        console.log("Employee added succesfully!")

                        showEmployees();
                    });
                });
                });
            });
        });
    });
};

// TODO create function for updateEmployee
updateEmployee = () => {
    const employeeSql = `SELECT * FROM employee`;

    connection.promise().query(employeeSQL, (err, data) => {
        if (err) throw err;

        const employees = data.map (({id, first_name, last_name}) => ({name: first_name + " " + last_name, value: id }));

    inquirer.prompt([
        {
            type: 'list',
            message: "Choose they employee to update their role.",
            name: 'name',
            choices: employees
        }
    ])
        .then(employeeChoice => {
        const employee = employeeChoice.name;
        const params = [];
        params.push(employee);

            const roleSql = `SELECT * FROM role`;

            connection.promise().query(roleSql, (err, data) => {
                if (err) throw err;

                const roles = data.map(({id, title}) => ({name: title, value: id}));

        inquirer.prompt([
            {
                type: 'list',
                message: "Select employee's new role.",
                name: 'role',
                choices: roles
            }
        ])
        .then(roleChoice => {
            const role = roleChoice.role;
            params.push(role);

            let employee = params[0]
            params[0] = role
            params[1] = employee

            const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;

            connection.query(sql, params, (err, result) => {
                if (err) throw err;
                
                console.log("The role for the employee has been updated!");

                showEmployees();
            });
        });
            });

    });
    });
};

// TODO create function for updateManager

// TODO create function for employeeDepartment

// TODO create function for showRoles

// TODO create function for addRole

// TODO create function for showDepartments

// TODO create function for addDepartments

// TODO create function for deleteDepartment

// TODO create function for deleteRole

// TODO create function for deleteEmployee

// TODO create function for showSalaries

// TODO create function for quiting prompt
