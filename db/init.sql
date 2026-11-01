-- One database per service, each owned by that service alone.
-- The tables are created by TypeORM from the entities when the services start.
CREATE DATABASE IF NOT EXISTS dexa_employee;
CREATE DATABASE IF NOT EXISTS dexa_attendance;
