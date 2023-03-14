const db = require('./index');
const bcrypt = require('bcrypt');

const email = 'falkokammel@gmx.de';
const username = 'Falko';
const isUser = true;
const isAdmin = true;
const plainTextPassword = 'pudding';

bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(plainTextPassword, salt, (err, digestedPassword) => {
    // the digested password is what we want to save in the database
    const sql = `INSERT INTO users (email, username, password_digest, isUser, isAdmin) VALUES ('${email}', '${username}', '${digestedPassword}', '${isUser}', '${isAdmin}');`;
    db.query(sql, (err, dbRes) => {
      console.log(err);
    });
  });
});
