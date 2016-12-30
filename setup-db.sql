create database oneconcern;
create user 'oneconcern'@'localhost' identified by 'oneconcern';
grant all privileges on oneconcern . * to 'oneconcern'@'localhost';
flush privileges;
