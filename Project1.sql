USE bcrosser;

DROP TABLE IF EXISTS TVViewer;
Drop TABLE IF EXISTS MovieViewer;
DROP TABLE IF EXISTS Friends;
DROP TABLE IF EXISTS Profile;

Create TABLE Profile(UserID int PRIMARY KEY AUTO_INCREMENT, 
					 FirstName varchar(50) NOT NULL, 
                     LastName varchar(50) NOT NULL, 
                     Email varchar(50) UNIQUE NOT NULL);
                     
INSERT INTO Profile(FirstName, LastName, Email) VALUES ('Brian', 'Crosser', 'rando@ran.com'),
													   ('George', 'Frank', 'George@ran.com'),
                                                       ('Tami', 'Duffy', 'Duffy@sandy.com'),
                                                       ('Carly', 'Clear', 'CClear@null.org'),
                                                       ('Timothy', 'Tucker', 'Tim@ran.edu');
												
                                                
											
DROP TABLE IF EXISTS TV;

Create TABLE TV(ShowID int PRIMARY KEY AUTO_INCREMENT, 
				ShowName varchar(50) UNIQUE NOT NULL, 
                Seasons int, 
                Rating varchar(10),
                Genre varchar(30),
                AirTime varchar(30));
                     
INSERT INTO TV(ShowName, Seasons, Rating, Genre, AirTime) VALUES ('Arrow', 3, 'MA', 'Action', 'Winter'),
																('Justified', 6, 'MA', 'Drama', 'Winter'),
                                                                ('Bones', 10, 'MA', 'Drama', 'Fall'),
                                                                ('Marco Pollo', 1, 'MA', 'Drama', 'Summer'),
																('Archer', 5, 'MA', 'Comedy', 'Winter');
                                                                
                                                                
                                                                
DROP TABLE IF EXISTS Movie;

Create TABLE Movie(MovieID int PRIMARY KEY AUTO_INCREMENT, 
				MovieName varchar(50) NOT NULL, 
                YearReleased year NOT NULL, 
                Rating varchar(10),
                Genre varchar(30),
                UNIQUE(MovieName, YearReleased));
                     
INSERT INTO Movie(MovieName, YearReleased, Rating, Genre) VALUES ('Batman', 2013, 'PG-13', 'Action'),
																 ('Super Troopers', 2001, 'PG-13', 'Comedy'),
                                                                 ('V for Vendeta', 2006, 'PG-13', 'Drama'),
																 ('How to Train your Dragon', 2013, 'PG', 'Action'),
																 ('RED', 2005, 'R', 'Action-Comedy');
                                                                 
                                                                 

CREATE TABLE Friends(UserID int NOT NULL REFERENCES Profile(UserID) ON DELETE CASCADE ON UPDATE CASCADE, 
					 FriendID int NOT NULL REFERENCES Profile(UserID) ON DELETE CASCADE ON UPDATE CASCADE);
                     
INSERT INTO Friends VALUES (1, 2),
						   (2, 1),
                           (1, 3),
                           (3, 1),
                           (1, 4),
                           (4, 1),
                           (3, 4),
                           (4, 3),
                           (2, 5),
                           (5, 2);
                           
                           


CREATE TABLE TVViewer(ViewerID int NOT NULL REFERENCES Profile(UserID) ON DELETE CASCADE ON UPDATE CASCADE,
					  TVShowID int NOT NULL REFERENCES TVShow(ShowID) ON DELETE CASCADE ON UPDATE CASCADE);
                      
INSERT INTO TVViewer VALUES (1, 1),
							(1, 2),
							(1, 3),
                            (1, 4),
							(1, 5),
							(2, 2),
							(2, 4),
                            (3, 1),
                            (3, 3),
                            (3, 5),
							(4, 5);
                            
                           

CREATE TABLE MovieViewer(ViewerID int NOT NULL REFERENCES Profile(UserID) ON DELETE CASCADE ON UPDATE CASCADE,
					  MovieID int NOT NULL REFERENCES Movie(MovieID) ON DELETE CASCADE ON UPDATE CASCADE);
                      
INSERT INTO MovieViewer VALUES (1, 1),
							   (1, 2),
   							   (1, 3),
                               (1, 4),
							   (1, 5),
							   (2, 2),
							   (2, 4),
                               (3, 1),
                               (3, 3),
                               (3, 5),
							   (4, 5);

                          

                          
                          
SELECT * FROM Profile;
SELECT * FROM TV;
SELECT * FROM Movie;
SELECT * FROM Friends;
SELECT f.UserID, p.FirstName, p.LastName, f.FriendID, p2.FirstName, p2.LastName FROM Friends f
JOIN Profile p ON f.UserID = p.UserID
JOIN Profile p2 ON f.FriendID = p2.UserID;

SELECT * FROM TVViewer;
SELECT * FROM MovieViewer;

