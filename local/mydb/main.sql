create table if not exists SleepLog (
    id int auto_increment primary key,
    name VARCHAR(255) not null,
    gender VARCHAR(10) not null,
    duration float not null,
    dayDate DATE
);

insert into SleepLog(name, gender, duration, dayDate) values ('John', 'Male', 8, '2021-04-21');
insert into SleepLog(name, gender, duration, dayDate) values ('Ben', 'Male', 7, '2021-04-22');
insert into SleepLog(name, gender, duration, dayDate) values ('Ben', 'Male', 6, '2021-04-23');
insert into SleepLog(name, gender, duration, dayDate) values ('Ben', 'Male', 6, '2021-04-24');
insert into SleepLog(name, gender, duration, dayDate) values ('Ben', 'Male', 7, '2021-04-25');
insert into SleepLog(name, gender, duration, dayDate) values ('Ben', 'Male', 8, '2021-04-26');
insert into SleepLog(name, gender, duration, dayDate) values ('Ben', 'Male', 9, '2021-04-27');
insert into SleepLog(name, gender, duration, dayDate) values ('Ben', 'Male', 20, '2021-04-28');
insert into SleepLog(name, gender, duration, dayDate) values ('Ben', 'Male', 10, '2021-04-29');
insert into SleepLog(name, gender, duration, dayDate) values ('Ben', 'Male', 4, '2021-04-30');
insert into SleepLog(name, gender, duration, dayDate) values ('Ben', 'Male', 5, '2021-05-01');
insert into SleepLog(name, gender, duration, dayDate) values ('Ben', 'Male', 6, '2021-05-02');
insert into SleepLog(name, gender, duration, dayDate) values ('Ben', 'Male', 9, '2021-05-03');
insert into SleepLog(name, gender, duration, dayDate) values ('Joe', 'Male', 14, '2021-05-04');
insert into SleepLog(name, gender, duration, dayDate) values ('Joe', 'Male', 4, '2021-05-05');
insert into SleepLog(name, gender, duration, dayDate) values ('Joe', 'Male', 10, '2021-05-06');
insert into SleepLog(name, gender, duration, dayDate) values ('Joe', 'Male', 2, '2021-05-07');
insert into SleepLog(name, gender, duration, dayDate) values ('Joe', 'Male', 4, '2021-05-08');
insert into SleepLog(name, gender, duration, dayDate) values ('Joe', 'Male', 8, '2021-05-09');
insert into SleepLog(name, gender, duration, dayDate) values ('Paul', 'Male', 9, '2021-05-10');
insert into SleepLog(name, gender, duration, dayDate) values ('Paul', 'Male', 10, '2021-05-11');
insert into SleepLog(name, gender, duration, dayDate) values ('Paul', 'Male', 2, '2021-05-12');
insert into SleepLog(name, gender, duration, dayDate) values ('Paul', 'Male', 6, '2021-05-13');
insert into SleepLog(name, gender, duration, dayDate) values ('Paul', 'Male', 9, '2021-05-14');
insert into SleepLog(name, gender, duration, dayDate) values ('Paul', 'Male', 1, '2021-05-15');