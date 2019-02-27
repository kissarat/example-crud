create user company identified with mysql_native_password by 'company';
create database company charset 'utf8';
grant all privileges on company.* to company;
use company;

create table tblDepartments (
    dpID int auto_increment primary key,
    dpName tinytext not null
) engine=INNODB;

create table tblEmployees (
    empID int auto_increment primary key,
    empName tinytext not null,
    empActive boolean not null default true,
    emp_dpID int not null,
    foreign key (emp_dpID) references tblDepartments(dpID)
        on update cascade
        on delete cascade
) engine=INNODB;
