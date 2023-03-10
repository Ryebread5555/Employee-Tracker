-- inset into and values --
INSERT INTO department (name)
VALUES ('Engineering'),
       ('Finance'),
       ('Legal'),
       ('Sales');

INSERT INTO role (title, salary, department_id)
VALUES ('Sales Lead', 100000, 4),
       ('Salesperson', 80000, 4),
       ('Lead Engineer', 150000, 1),
       ('Software Engineer', 120000, 1),
       ('Account Manager', 160000, 2),
       ('Accountant', 125000, 2),
       ('Legal Team Lead', 250000, 3),
       ('Lawyer', 190000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Link', 'Hyrule', 1, NULL),
       ('Zelda', 'Hyrule', 2, 1),
       ('Zavala', 'Vanguard', 7, NULL),
       ('Cayde', 'Six', 8, 3),
       ('Donkey', 'Kong', 5, NULL),
       ('Diddy', 'Kong', 6, 5),
       ('Mario', 'Super', 3, Null),
       ('Luigi', 'Super', 4, 7);