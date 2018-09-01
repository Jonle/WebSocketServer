USE websocket;

DROP TABLE IF EXISTS user; 

CREATE TABLE user(
id int(3) auto_increment not null primary key, 
name char(10) not null,
password char(32) not null
);
