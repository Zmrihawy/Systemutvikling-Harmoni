DROP TABLE IF EXISTS `crew`;
DROP TABLE IF EXISTS `ticket`;
DROP TABLE IF EXISTS `rider`;
DROP TABLE IF EXISTS `performance`;
DROP TABLE IF EXISTS `event`;
DROP TABLE IF EXISTS `password`;
DROP TABLE IF EXISTS `user`;


CREATE TABLE `user` (
  user_id int(11) NOT NULL AUTO_INCREMENT,
  username varchar(50) NOT NULL UNIQUE,
  salt BINARY(8) NOT NULL,
  email varchar(100) NOT NULL UNIQUE,
  phone varchar(30) NOT NULL,
  first_name varchar(300) DEFAULT NULL,
  surname varchar(300) NOT NULL,
  picture longblob DEFAULT NULL,
  artist tinyint(1) NOT NULL,
  PRIMARY KEY (user_id)
);

CREATE TABLE password (
  password_id int(11) NOT NULL AUTO_INCREMENT,
  password_hex BINARY(64) NOT NULL,
  user_id int(11) NOT NULL,
  autogen int(1), -- 0 => brukergenerert 1 => autogenerert
  PRIMARY KEY (password_id),
  FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE
);

CREATE TABLE `event` (
  event_id int(11) NOT NULL AUTO_INCREMENT,
  name varchar(100) NOT NULL,
  host_id int(11) NOT NULL,
  active tinyint(1) NOT NULL DEFAULT '1',
  location varchar(200) DEFAULT NULL,
  longitude decimal(18,15) DEFAULT NULL,
  latitude decimal(18,15) DEFAULT NULL,
  description varchar(150) DEFAULT NULL,
  start_time datetime NOT NULL,
  end_time datetime NOT NULL,
  picture longblob,
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
  performance_id int(11) NOT NULL AUTO_INCREMENT,
  user_id int(11),
  event_id int(11) NOT NULL,
  start_time datetime,
  end_time datetime,
  name varchar(100),
  contract longblob,
  PRIMARY KEY (performance_id),
  FOREIGN KEY (event_id) REFERENCES event(event_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES user(user_id)
);

CREATE TABLE rider (
  performance_id int(11) NOT NULL,
  name varchar(500) NOT NULL,
  amount int(11) NOT NULL,
  confirmed tinyint(1) NOT NULL,
  PRIMARY KEY (performance_id, name),
  FOREIGN KEY (performance_id) REFERENCES performance(performance_id) ON DELETE CASCADE
);

CREATE TABLE crew(
  crew_id int(11) AUTO_INCREMENT NOT NULL,
  profession varchar(500) NOT NULL,
  name varchar(500) NOT NULL,
  contact_info varchar(500),
  event_id int(11) NOT NULL,
  PRIMARY KEY (crew_id),
  FOREIGN KEY (event_id) REFERENCES event(event_id) ON DELETE CASCADE
);

INSERT INTO user (username, salt, email, phone, first_name, surname, picture, artist)
VALUES("testbruker", UNHEX("62ca87a099fa85a1"), "testemail", "999999", "test", "bruker", "bildelink", 0);
INSERT INTO password (password_id , password_hex, user_id, autogen) VALUES(DEFAULT, UNHEX("2955d5f4a8980763b5a1ec72c69b983a5772697e6504879711d8bcc2119cbf881d137f4190976c1af4503e2614649190c3a8e04a78f560d3e6f592240a7f3660"), 1, 0);

INSERT INTO user (username, salt, email, phone, first_name, surname, picture, artist)
VALUES("thomasbjerke", UNHEX("ff2b807e70549309"), "thomas@email.com", "90592427", "thomas", "bjerke", "thomasbildelink", 0);
INSERT INTO password (password_id , password_hex, user_id, autogen) VALUES(DEFAULT, UNHEX("28ae51d656ead70e127d63f5bc16c2b7ef381f95f8d0184dea2eb9d37f9a93b169f0efd3a5ecb2502784f82ce00c2df984a4b189d4fc586f8ba03b0cb03f84ed"), 2,0);

INSERT INTO user (username, salt, email, phone, first_name, surname, picture, artist)
VALUES("kåreandersen", UNHEX("517d958ff38f270a"), "kåre@email.com", "11111111", "kåre", "andersen", "kårebildelink", 1);
INSERT INTO password (password_id , password_hex, user_id, autogen) VALUES(DEFAULT, UNHEX("949c083c8eeceaca63ac5da7db9b129fef1d757b0100f16d8013009f3601cdd775ca02c23f78dc428fe44e5846d64fbcb290bfca452ffb1340d53a103e240b40"), 3 ,0);

INSERT INTO user (username, salt, email, phone, first_name, surname, picture, artist)
VALUES("torstein", UNHEX("f3734ea50ad945e9"), "tormail", "5555555", "tor", "stein", "torbildelink", 1);
INSERT INTO password (password_id , password_hex, user_id, autogen) VALUES(DEFAULT, UNHEX("83176d4c3b58a50f9c024e9ef57ec3b01398a591f3ad3b5243aa25e311a2eaab6c78208f5ffa8421eff6d3db96c3f6b79ca4cc1fa4f3c02e44d1824ebe8d11e1"), 4, 0);

INSERT INTO event (name, host_id, active, location, longitude, latitude,  description, start_time, end_time)
VALUES("testEvent", 4, 1, "Trondheim", 63.4156747,10.4061419,"Festival", "2020-12-05 13:45:00", "2020-12-05 14:00:00");

INSERT INTO event (name, host_id, active, location, longitude, latitude , description, start_time, end_time)
VALUES("party", 1, 1, "Oslo", 59.9543936,10.7668334,"Fest", "2020-12-05 22:30:00", "2020-12-06 14:00:00");

INSERT INTO event (name, host_id, active, location, longitude, latitude,description, start_time, end_time)
VALUES("konsert", 2, 0, "Tromsø", 69.6565335,18.9613271,"Konsert", "2020-05-05 20:45:00", "2020-05-05 22:00:00");

INSERT INTO event (name, host_id, active, location, longitude, latitude, description, start_time, end_time)
VALUES("kino", 3, 1, "Trondheim", 63.427057,10.3903364,"Festival", "2021-12-05 13:45:00", "2021-12-05 14:00:00");

INSERT INTO ticket(name, event_id, price, amount, description)
VALUES("TestBillett", 2, 125.0, 2, "testbeskrivelse");

INSERT INTO ticket(name, event_id, price, amount, description)
VALUES("TestBillett2", 2, 145.0, 20, "testbeskrivelse2");

INSERT INTO ticket(name, event_id, price, amount, description)
VALUES("billett", 1, 200.0, 1, "beskrivelse");

INSERT INTO ticket(name, event_id, price, amount, description)
VALUES("gullbillett", 4, 10000.0, 10, "gullbeskrivelse");

INSERT INTO performance (user_id, event_id, start_time, end_time, contract)
VALUES (1, 2, "2021-12-05 13:45:00", "2021-12-05 14:00:00", "Dette er kontrakt 1");

INSERT INTO performance (user_id, event_id, start_time, end_time, contract)
VALUES (3, 2, "2021-12-05 14:05:00", "2021-12-05 14:30:00", "Dette er kontrakt 2");

INSERT INTO performance (user_id, event_id, start_time, end_time, contract)
VALUES (2, 1, "2020-10-03 20:15:00", "2020-10-03 21:00:00", "Dette er kontrakt 3");

INSERT INTO performance (user_id, event_id, start_time, end_time, contract)
VALUES (4, 3, "2021-12-05 18:45:00", "2021-12-05 19:00:00", "Dette er kontrakt 4");

INSERT INTO rider
VALUES (1, "trenger cola", 2, 0);

INSERT INTO rider
VALUES (2, "trenger fanta", 1, 0);

INSERT INTO rider
VALUES (3, "trenger sprite", 4, 1);

INSERT INTO rider
VALUES (4, "trenger godteri", 2, 1);

INSERT INTO crew (profession, name, contact_info, event_id)
VALUES ("lydmann", "kurt", "kurt@kurt.no", 1);

INSERT INTO crew (profession, name, contact_info, event_id)
VALUES ("lysmann", "kalle", "kalle@kurt.no", 1);

INSERT INTO crew (profession, name, contact_info, event_id)
VALUES ("scenearbeider", "kristian gulaker", "kristian@kurt.no", 1);

INSERT INTO crew (profession, name, contact_info, event_id)
VALUES ("lydmann", "Paul", "paul@kurt.no", 1);


