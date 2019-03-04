create table tblUsers (
    usrID int auto_increment primary key,
    usrName varchar(128) not null,
    usrPassword varchar(128) not null
) engine=INNODB;

create table tblToken (
    tknID char(96) not null primary key,
    tkn_usrID int not null,
    foreign key (tkn_usrID) references tblUsers(usrID)
        on update cascade
        on delete cascade
) engine=INNODB;

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
