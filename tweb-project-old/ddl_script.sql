DROP TABLE users, friends, series, libraries, similars;

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

CREATE TABLE series(
    title varchar(50) primary key,
    description varchar(500)
);

CREATE TABLE libraries(
    username varchar(20) references users(username),
    title varchar(20) references series(title),
    primary key (username, title)
);

CREATE TABLE similars(
    username varchar(20) references users(username),
    book varchar(20) references series(title),
    similarbook varchar(20) references series(title),
    primary key (username, book, similarbook)
);

CREATE TABLE reviews(
    username varchar(20) references users(username),
    book varchar(20) references series(title),
    commentTitle varchar(30),
    commentText varchar(500),
    primary key (username, book)
);
