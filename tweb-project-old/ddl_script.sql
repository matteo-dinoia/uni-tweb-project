DROP TABLE users, friends;

CREATE TABLE users(
    username varchar(20) primary key,
    password varchar(64) NOT NULL,
    issuperuser bool NOT NULL
);

CREATE TABLE friends(
    username varchar(20) references users(username),
    friend varchar(20) references users(username),
    primary key (username, friend)
);

