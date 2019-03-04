# CRUD example
Warning: The app was tested on Google Chrome only
## Setup
Create MySQL username and database
```sql
create user company identified with mysql_native_password by 'company';
create database company charset 'utf8';
grant all privileges on company.* to company;
use company;
```
Create tables in appropriate database
```sql
\. server/schema.sql
```
Install project dependencies
```bash
npm install
```
Build UI
```bash
npm run build-client
```
Start a server
```bash
node server --port=8080
```
If you need different MySQL username, password or database you can change it in config.json file
