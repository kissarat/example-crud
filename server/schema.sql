create user company identified with mysql_native_password by 'company';
create database company charset 'utf8';
grant all privileges on company.* to company;
use company;
