create table car
(
    id integer not null
        constraint car_pk
            primary key autoincrement,
    manufacturer text not null,
    model text not null,
    color text not null,
    year integer not null
);