// TODO import and require mysql12 and inquirer
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

// connect to database
const db = mysql.createConnection (
    {
        host: 'localhost',
        user: 'root',
        password: '',
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
            message: 'What would you like to do?',
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
const showEmployeesByDepartment = async () => {
    console.log('Here are the employees and their departments.');
    const sql = `
      SELECT employee.first_name,
             employee.last_name,
             department.name AS department
      FROM employee
      LEFT JOIN role ON Employee.role_id = role.id
      LEFT JOIN department ON role.department_id = department.id
    `;
    try {
      const [rows] = await db.promise().query(sql);
      console.table(rows);
      promptUser();
    } catch (err) {
      console.log(err);
    }
  }; 
// TODO create function for showRoles
const showRoles = async () => {
    console.log('Here are all of the current roles.');
  
    const sql = `SELECT role.id, role.title, department.name AS department
                 FROM role
                 INNER JOIN department ON role.department_id = department.id`;
  
    try {
      const [rows] = await db.promise().query(sql);
      console.table(rows);
      promptUser();
    } catch (err) {
      console.log(err);
    }
  };
// TODO create function for addRole
const addRole = async () => {
    try {
      const departments = await db.promise().query('SELECT id, name FROM department');
      const deptChoices = departments[0].map(({ id, name }) => ({ name: name, value: id }));
  
      const answers = await inquirer.prompt([
        {
          type: 'input',
          message: "Create a new role.",
          name: 'role',
          validate: addRole => {
            if (addRole) {
              return true;
            } else {
              console.log('Please enter a role!');
              return false;
            }
          }
        },
        {
          type: 'input',
          message: "What is the salary for this role?",
          name: 'salary',
          validate: addSalary => {
            if (!isNaN(addSalary)) {
              return true;
            } else {
              console.log("Please enter a valid salary for this role!")
              return false;
            }
          }          
        },
        {
          type: 'list',
          message: "Select the department this role belongs to.",
          name: 'dept',
          choices: deptChoices
        }
      ]);
  
      const params = [answers.role, answers.salary, answers.dept];
  
      const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
      await db.promise().query(sql, params);
  
      console.log(`${answers.role} has been added to roles!`);
      promptUser();
    } catch (err) {
      console.log(err);
    }
  };
// TODO create function for showDepartments
const showDepartments = async () => {
    console.log('Here are all of the departments.');
  
    const sql = 'SELECT * FROM department';
  
    try {
      const [rows] = await db.promise().query(sql);
      console.table(rows);
      promptUser();
    } catch (err) {
      console.log(err);
    }
  };
// TODO create function for addDepartments
const addDepartment = async () => {
    try {
      const answer = await inquirer.prompt([
        {
          type: 'input',
          message: "Create a new department.",
          name: 'department',
          validate: addDepartment => {
            if (addDepartment) {
              return true;
            } else {
              console.log('Please enter a department name!');
              return false;
            }
          }
        }
      ]);
  
      const params = [answer.department];
  
      const sql = `INSERT INTO department (name) VALUES (?)`;
      await db.promise().query(sql, params);
  
      console.log(`${answer.department} has been added to departments!`);
      promptUser();
    } catch (err) {
      console.log(err);
    }
  };
// TODO create function for deleteDepartment
const deleteDepartment = async () => {
    try {
      const deptSql = `SELECT * FROM department`;
      const [departments] = await db.promise().query(deptSql);
  
      const deptChoices = departments.map(({ name, id }) => ({ name: name, value: id }));
  
      const { dept, confirm } = await inquirer.prompt([
        {
          type: 'list',
          message: 'Select the department you want to delete.',
          name: 'dept',
          choices: deptChoices
        },
        {
          type: 'confirm',
          message: 'Are you sure you want to delete this department?',
          name: 'confirm',
          default: false
        }
      ]);
  
      if (dept && confirm) {
        const sql = `DELETE FROM department WHERE id = ?`;
        await db.promise().query(sql, dept);
        console.log('Successfully deleted!');
        showDepartments();
      } else {
        console.log('Department not deleted.');
        showDepartments();
      }
  
    } catch (err) {
      console.log(err);
    }
  };
// TODO create function for deleteRole
const deleteRole = async () => {
    try {
      const rolesSql = `SELECT * FROM role`;
      const [roles] = await db.promise().query(rolesSql);
  
      const roleChoices = roles.map(({ title, id }) => ({ name: title, value: id }));
  
      const { role, confirm } = await inquirer.prompt([
        {
          type: 'list',
          message: 'Select the role you want to delete.',
          name: 'role',
          choices: roleChoices,
        },
        {
          type: 'confirm',
          message: 'Are you sure you want to delete this role?',
          name: 'confirm',
          default: false,
        },
      ]);
  
      if (role && confirm) {
        const sql = `DELETE FROM role WHERE id = ?`;
        await db.promise().query(sql, role);
        console.log('Successfully deleted!');
        showRoles();
      } else {
        console.log('Role not deleted.');
        showRoles();
      }
    } catch (err) {
      console.log(err);
    }
  };
// TODO create function for deleteEmployee
const deleteEmployee = async () => {
    try {
      const employeesSql = `SELECT * FROM employee`;
      const [employees] = await db.promise().query(employeesSql);
  
      const employeeChoices = employees.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));
  
      const { employeeId, confirm } = await inquirer.prompt([
        {
          type: 'list',
          message: 'Select the employee you want to delete.',
          name: 'employeeId',
          choices: employeeChoices,
        },
        {
          type: 'confirm',
          message: 'Are you sure you want to delete this employee?',
          name: 'confirm',
          default: false,
        },
      ]);
  
      if (employeeId && confirm) {
        const sql = `DELETE FROM employee WHERE id = ?`;
        await db.promise().query(sql, employeeId);
        console.log('Successfully deleted!');
        showEmployees();
      } else {
        console.log('Employee not deleted.');
        showEmployees();
      }
  
    } catch (err) {
      console.log(err);
    }
  };
// TODO create function for showSalaries
const showTotalSalaries = async () => {
    console.log('This is the total budget by department');
  
    const sql = `SELECT department_id AS id,
                        department.name AS department,
                        SUM(salary) AS budget
                 FROM role
                 JOIN department ON role.department_id = department.id GROUP BY department_id`;
  
    try {
      const [rows] = await db.promise().query(sql);
      console.table(rows);
      promptUser();
    } catch (err) {
      console.log(err);
    }
  };
  

