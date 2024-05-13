select * from user;
delete from sqlite.user where email = 'larryscheib@yahoo.com';

CREATE TABLE IF NOT EXISTS sqlite.user (id INTEGER PRIMARY KEY NOT NULL, email VARCHAR(16) NOT NULL UNIQUE, phoneNumber VARCHAR(16) not null, firstName VARCHAR(16), lastName VARCHAR(16));

insert into sqlite.user (email, firstName, lastName, phoneNumber)
 values ('larryscheib@yahoo.com','larry','scheib','4809805438') 
ON CONFLICT (email) DO UPDATE SET phoneNumber = '4809805437', firstName = 'larry', lastName = 'scheib' 
WHERE email = 'larryscheib@yahoo.com';
    
 drop TABLE sqlite.user;