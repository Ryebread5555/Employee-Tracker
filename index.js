// TODO import and require mysql12 and inquirer
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

// connect to database
const db = mysql.createConnection (
    {
        host: 'localhost',
        user: 'root',
        password: 'RpetThecodder0760',
        database: 'employee_db'
    },
);

db.connect(err => {
    if (err) throw err;
    console.log(`Connected to employee_db database.`)
   promptUser(); 
});

const promptUser = () => {
    console.log("+------------------------+")
    console.log("|                        |")
    console.log("|    Employee Manager    |")
    console.log("|                        |")
    console.log("+------------------------+")
    inquirer.prompt ([
        {
            type: 'list',
            message: 'What would you like to do? (Use arrow keys)',
            name: 'choices',
            choices: [
                'View All Employees',
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

        switch (choices) {
            case 'View All Employees':
                showEmployees();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Update Employee Role':
                updateEmployeeRole();
                break;
            case 'Update Employee Manager':
                updateEmployeeManager();
                break;
            case 'View Employees By Department':
                showEmployeesByDepartment();
                break;
            case 'View All Roles':
                showRoles();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'View All Departments':
                showDepartments();
                break;
            case 'Add Department':
                addDepartment();
                break;
            case 'Delete A Department':
                deleteDepartment();
                break;
            case 'Delete A Role':
                deleteRole();
                break;
            case 'Delete A Employee':
                deleteEmployee();
                break;
            case 'View Total Department Salaries':
                showTotalSalaries();
                break;
            case 'Quit':
                console.log('Goodbye!');
                db.end();
                break;
            default:
                console.log('Invalid choice. Please try again.');
                promptUser();
        }
    });
};

// TODO create function for showEmployees
const showEmployees = () => {
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
    db.promise().query(sql)
        .then(([rows, fields]) => {
            console.table(rows);
            promptUser();
        })
        .catch(err => {
            console.log(err);
            promptUser();
        });
};
// TODO create function for addEmployee
const addEmployee = () => {
    inquirer
      .prompt([
        {
          type: "input",
          message: "Enter employee's first name.",
          name: "firstName",
        },
        {
          type: "input",
          message: "Enter employee's last name.",
          name: "lastName",
        },
      ])
      .then((answer) => {
        const params = [answer.firstName, answer.lastName];
        const roleSql = `SELECT role.id, role.title FROM role`;
  
        db
          .promise()
          .query(roleSql)
          .then(([data]) => {
            const roles = data.map(({ id, title }) => ({ name: title, value: id }));
  
            inquirer
              .prompt([
                {
                  type: "list",
                  message: "Choose the employee's role.",
                  name: "role",
                  choices: roles,
                },
              ])
              .then((roleChoice) => {
                const role = roleChoice.role;
                params.push(role);
  
                const managerSql = `SELECT * FROM employee`;
  
                db
                  .promise()
                  .query(managerSql)
                  .then(([data]) => {
                    const managers = data.map(({ id, first_name, last_name }) => ({
                      name: first_name + " " + last_name,
                      value: id,
                    }));
  
                    inquirer
                      .prompt([
                        {
                          type: "list",
                          message: "Who is the manager for the employee?",
                          name: "manager",
                          choices: managers,
                        },
                      ])
                      .then((managerChoice) => {
                        const manager = managerChoice.manager;
                        params.push(manager);
  
                        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
  
                        db.query(sql, params, (err, result) => {
                          if (err) throw err;
                          console.log("Employee added successfully!");
  
                          showEmployees();
                        });
                      });
                  });
              });
          })
          .catch((err) => console.error(err));
      });
  };
  

// TODO create function for updateEmployee
const updateEmployeeRole = async () => {
    try {
      const [employeeRows] = await db.promise().query('SELECT * FROM employee');
  
      const employees = employeeRows.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));
  
      const employeeChoice = await inquirer.prompt([
        {
          type: 'list',
          message: "Choose the employee to update their role.",
          name: 'name',
          choices: employees,
        },
      ]);
  
      const employeeId = employeeChoice.name;
  
      const [roleRows] = await db.promise().query('SELECT * FROM role');
  
      const roles = roleRows.map(({ id, title }) => ({ name: title, value: id }));
  
      const roleChoice = await inquirer.prompt([
        {
          type: 'list',
          message: "Select the employee's new role.",
          name: 'role',
          choices: roles,
        },
      ]);
  
      const roleId = roleChoice.role;
  
      const [updateResult] = await db.promise().query('UPDATE employee SET role_id = ? WHERE id = ?', [roleId, employeeId]);
  
      console.log("The employee's role has been updated!");
  
      showEmployees();
    } catch (err) {
      console.log(err);
    }
  };
// TODO create function for updateManager
const updateEmployeeManager = async () => {
    try {
      const [employeeRows] = await db.promise().query('SELECT * FROM employee');
      const employees = employeeRows.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));
  
      const employeeChoice = await inquirer.prompt([
        {
          type: 'list',
          message: 'Choose the employee to update their manager:',
          name: 'name',
          choices: employees,
        },
      ]);
      
      const employeeId = employeeChoice.name;
      const [managerRows] = await db.promise().query('SELECT * FROM employee WHERE id != ?', [employeeId]);
      const managers = managerRows.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));
  
      const managerChoice = await inquirer.prompt([
        {
          type: 'list',
          message: 'Select the employee\'s new manager:',
          name: 'manager',
          choices: managers,
        },
      ]);
  
      const managerId = managerChoice.manager;
      const [updateResult] = await db.promise().query('UPDATE employee SET manager_id = ? WHERE id = ?', [managerId, employeeId]);
  
      console.log("The employee's manager has been updated!");
  
      showEmployees();
    } catch (err) {
      console.log(err);
    }
  };
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
