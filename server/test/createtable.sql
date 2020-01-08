DROP TABLE IF EXISTS ticket;
DROP TABLE IF EXISTS rider;
DROP TABLE IF EXISTS performance;
DROP TABLE IF EXISTS `event`;
DROP TABLE IF EXISTS `user`;


CREATE TABLE `user` (
  user_id int(11) NOT NULL,
  username varchar(50) NOT NULL,
  password varchar(100) NOT NULL,
  salt varchar(300) NOT NULL,
  mail varchar(100) NOT NULL,
  phone varchar(30) NOT NULL,
  first_name varchar(300) DEFAULT NULL,
  surname varchar(300) NOT NULL,
  picture varchar(400) DEFAULT NULL,
  PRIMARY KEY (user_id)
);

CREATE TABLE `event` (
  event_id int(11) NOT NULL,
  name varchar(100) NOT NULL,
  host_id int(11) NOT NULL,
  active tinyint(1) NOT NULL DEFAULT '1',
  location varchar(200) DEFAULT NULL,
  start_time datetime NOT NULL,
  end_time datetime NOT NULL,
  PRIMARY KEY (event_id),
  FOREIGN KEY (host_id) REFERENCES user(user_id)
);

CREATE TABLE ticket (
  name varchar(100) NOT NULL,
  event_id int(11) NOT NULL,
  price DOUBLE NOT NULL,
  amount FLOAT(6, 2),
  description varchar(300) NOT NULL,
  PRIMARY KEY (name, event_id),
  FOREIGN KEY (event_id) REFERENCES event(event_id) ON DELETE CASCADE
);

CREATE TABLE performance (
  performance_id int(11) NOT NULL,
  user_id int(11) NOT NULL,
  event_id int(11) NOT NULL,
  start_time datetime NOT NULL,
  end_time datetime NOT NULL,
  contract varchar(300) NOT NULL,
  PRIMARY KEY (performance_id),
  FOREIGN KEY (event_id) REFERENCES event(event_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES user(user_id)
);

CREATE TABLE rider (
  performance_id int(11) NOT NULL,
  name varchar(500) NOT NULL,
  amount int(11) NOT NULL,
  PRIMARY KEY (performance_id, name),
  FOREIGN KEY (performance_id) REFERENCES performance(performance_id) ON DELETE CASCADE
);