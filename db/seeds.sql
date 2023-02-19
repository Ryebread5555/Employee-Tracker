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
VALUES ('Link', 'Hyrule', 2, null),
       ('Zelda', 'Hyrule', 1, 1),
       ('Zavala', 'Vanguard', 5, 7),
       ('Cayde', 'Six', 4, null),
       ('Donkey', 'Kong', 7, 5),
       ('Ash', 'Ketchum', 8, null),
       ('Mario', 'Super', 3, null),
       ('Bowser', 'Koopa', 6, 3);