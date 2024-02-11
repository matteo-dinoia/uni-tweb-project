DROP TABLE users, friends, series, libraries, similars;

CREATE TABLE users(
    username varchar(20) primary key,
    password varchar(64) NOT NULL,
    issuperuser bool NOT NULL
);

CREATE TABLE friends(
    username varchar(20) references users(username) on delete cascade ,
    friend varchar(20) references users(username) on delete cascade ,
    primary key (username, friend)
);

CREATE TABLE series(
    title varchar(50) primary key,
    description varchar(1500),
    imagelink varchar(500)
);

CREATE TABLE libraries(
    username varchar(20) references users(username) on delete cascade ,
    title varchar(20) references series(title) on delete cascade ,
    primary key (username, title)
);

CREATE TABLE similars(
    username varchar(20) references users(username) on delete cascade,
    book varchar(20) references series(title) on delete cascade,
    similarbook varchar(20) references series(title),
    primary key (username, book, similarbook)
);

CREATE TABLE reviews(
    username varchar(20) references users(username) on delete cascade,
    book varchar(20) references series(title) on delete cascade,
    commentTitle varchar(30),
    commentText varchar(500),
    primary key (username, book)
);
